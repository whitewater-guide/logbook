import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ForbiddenError, UserInputError } from 'apollo-server';
import { ValueExpressionType, sql } from 'slonik';

import { Context } from '~/apollo/context';
import { Descent } from '~/__generated__/graphql';
import { DescentFieldsMap } from './fields-map';
import { DescentRaw } from '~/__generated__/sql';
import { GraphQLResolveInfo } from 'graphql';
import { SectionFieldsMap } from '../sections/fields-map';
import { db } from '~/db';
import graphqlFields from 'graphql-fields';
import jwt from 'jsonwebtoken';

class DescentsService extends DataSource<Context> {
  private _context!: Context;

  initialize(config: DataSourceConfig<Context>) {
    this._context = config.context;
  }

  private buildSelection(info: GraphQLResolveInfo) {
    const tree = graphqlFields(info);
    const selection: ValueExpressionType[] = [
      DescentFieldsMap.getSqlSelection(tree, {}),
    ];
    if (tree.section) {
      const sectionSelection = SectionFieldsMap.getSqlSelection(tree, {
        path: 'section',
      });
      const sectionsSub = sql`
      (
        SELECT row_to_json(sec)
        FROM (
          SELECT ${sectionSelection}
          FROM sections
          WHERE sections.id = descents.section_id
        ) sec
      ) AS section
    `;
      selection.push(sectionsSub);
    }
    return sql.join(selection, sql`, `);
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
    const result: DescentRaw | null = await db().maybeOne(sql`
      SELECT ${selection}, user_id
      FROM descents
      WHERE descents.id = ${identifier}
    `);

    if (!result) {
      return null;
    }

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
}

export type TDescentsService = DescentsService;

export default DescentsService;
