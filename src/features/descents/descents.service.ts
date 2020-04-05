import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Descent, DescentFilter, Page } from '~/__generated__/graphql';
import { DescentRaw, SectionRaw } from '~/__generated__/sql';
import { ForbiddenError, UserInputError } from 'apollo-server';
import { ValueExpressionType, sql } from 'slonik';

import { Context } from '~/apollo/context';
import { DescentFieldsMap } from './fields-map';
import { GraphQLResolveInfo } from 'graphql';
import { SectionFieldsMap } from '../sections/fields-map';
import clamp from 'lodash/clamp';
import { db } from '~/db';
import graphqlFields from 'graphql-fields';
import jwt from 'jsonwebtoken';
import set from 'lodash/set';

interface DescentJointRow extends DescentRaw {
  section: SectionRaw;
}

class DescentsService extends DataSource<Context> {
  private _context!: Context;

  initialize(config: DataSourceConfig<Context>) {
    this._context = config.context;
  }

  private buildSelection(info: GraphQLResolveInfo) {
    const tree = graphqlFields(info);
    const selection: ValueExpressionType[] = [
      DescentFieldsMap.getSqlSelection(tree, {
        table: 'descents',
        aliasPrefix: 'descent',
      }),
    ];
    if (tree.section) {
      const sectionSelection = SectionFieldsMap.getSqlSelection(tree, {
        path: 'section',
        table: 'sections',
        aliasPrefix: 'section',
      });
      selection.push(sectionSelection);
    }
    return sql.join(selection, sql`, `);
  }

  private collapseJoin(row: any): any {
    return Object.entries(row).reduce((acc, [key, val]) => {
      const [prefix, ...rest] = key.split('_');
      const tableKey = rest.join('_');
      if (prefix === 'descent') {
        set(acc, tableKey, val);
      } else {
        set(acc, `${prefix}.${tableKey}`, val);
      }
      return acc;
    }, {});
  }

  public async getOne(
    info: GraphQLResolveInfo,
    id?: string | null,
    shareToken?: string | null,
  ): Promise<Partial<Descent> | null> {
    let identifier = id;
    let fromShareToken = false;
    if (!id && shareToken) {
      const decoded: any = jwt.verify(shareToken, process.env.JWT_SECRET);
      if (!decoded.descent) {
        throw new ForbiddenError('share token does not contain descent id');
      }
      fromShareToken = true;
      identifier = decoded.descent;
    }
    if (!identifier) {
      throw new UserInputError(
        'either descent id or share token must be provided',
      );
    }
    const selection = this.buildSelection(info);
    const row: DescentRaw | null = await db().maybeOne(sql`
      SELECT ${selection}, descents.user_id as descent_user_id
      FROM descents
      LEFT OUTER JOIN sections on descents.section_id = sections.id
      WHERE descents.id = ${identifier}
    `);

    if (!row) {
      return null;
    }

    const result: DescentJointRow = this.collapseJoin(row);

    if (
      !result.public &&
      !(
        result.user_id === this._context.uid ||
        (this._context.uid && fromShareToken)
      )
    ) {
      throw new ForbiddenError('forbidden');
    }

    return {
      ...result,
      level: {
        unit: result.level_unit,
        value: result.level_value,
      },
    };
  }

  public async getMany(
    info: GraphQLResolveInfo,
    filter?: DescentFilter,
    page?: Page,
  ) {
    const after = page?.after;
    const limit = clamp(page?.limit || 20, 1, 100);

    const selection = this.buildSelection(info);

    const wheres = [];

    if (after) {
      wheres.push(
        sql`(descents.create_at, descents.ord_id) < (${after.value}, ${after.ordId})`,
      );
    }
    if (filter?.difficulty) {
      if (filter.difficulty.length !== 2) {
        throw new UserInputError('difficulty filter must contain two values');
      }
      wheres.push(sql`sections.difficulty >= ${filter.difficulty[0]}`);
      wheres.push(sql`sections.difficulty <= ${filter.difficulty[1]}`);
    }
    if (filter?.startDate) {
      wheres.push(sql`descents.started_at >= ${filter.startDate}`);
    }
    if (filter?.endDate) {
      wheres.push(sql`descents.started_at <= ${filter.endDate}`);
    }
    if (filter?.sectionID) {
      wheres.push(
        sql`(descents.section_id = ${filter.sectionID} OR sections.parent_id = ${filter.sectionID}) `,
      );
    }
    if (filter?.upstreamSectionID) {
      wheres.push(sql`sections.upstream_id = ${filter.upstreamSectionID}`);
    }
    if (filter?.userID) {
      wheres.push(sql`descents.user_id = ${filter.userID}`);
    }

    const whereClause = wheres.length
      ? sql`WHERE ${sql.join(wheres, sql` AND `)}`
      : '';

    const result = await db().query(sql`
      SELECT ${selection}
      FROM descents
      {whereClause}
      ORDER BY started_at DESC, ord_id DESC
      LIMIT ${limit}
    `);

    return result;
  }
}

export type TDescentsService = DescentsService;

export default DescentsService;
