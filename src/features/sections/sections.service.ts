import { AuthenticationError, UserInputError } from 'apollo-server';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Page, SectionsFilter } from '~/__generated__/graphql';
import { ValueExpressionType, sql } from 'slonik';

import { Context } from '~/apollo/context';
import { GraphQLResolveInfo } from 'graphql';
import { SectionFieldsMap } from './fields-map';
import { SectionRaw } from '~/__generated__/sql';
import clamp from 'lodash/clamp';
import collapseJoinResult from '~/utils/collapseJoinResult';
import { db } from '~/db';
import graphqlFields from 'graphql-fields';
import { itemsToConnection } from '~/apollo/connections';

class SectionsService extends DataSource<Context> {
  private _context!: Context;

  initialize(config: DataSourceConfig<Context>) {
    this._context = config.context;
  }

  private buildSelection(tree: any) {
    const selection: ValueExpressionType[] = [
      SectionFieldsMap.getSqlSelection(tree, {
        table: 'sections',
        aliasPrefix: 'section',
        requiredColumns: ['user_id', 'ord_id'],
      }),
    ];
    return sql.join(selection, sql`, `);
  }

  public async getOne(
    info: GraphQLResolveInfo,
    id: string,
  ): Promise<Partial<SectionRaw> | null> {
    if (!this._context.uid) {
      throw new AuthenticationError('sections are private');
    }

    const tree = graphqlFields(info);
    const selection = this.buildSelection(tree);

    const row: Partial<SectionRaw> | null = await db().maybeOne(sql`
      SELECT ${selection}
      FROM sections
      WHERE sections.id = ${id}
    `);

    const result = collapseJoinResult(row, 'section');
    if (result?.user_id !== this._context.uid) {
      throw new AuthenticationError('sections are private');
    }
    return result;
  }

  public async getMany(
    info: GraphQLResolveInfo,
    filter?: SectionsFilter | null,
    page?: Page | null,
  ) {
    if (!this._context.uid) {
      throw new AuthenticationError('sections are private');
    }

    const tree = graphqlFields(info);
    const after = page?.after;
    const limit = clamp(page?.limit || 20, 1, 100);

    const selection = this.buildSelection(tree.edges.node);

    const wheres = [sql`(sections.user_id = ${this._context.uid})`];
    if (after) {
      wheres.push(sql`sections.ord_id < ${after.ordId}`);
    }

    if (filter?.difficulty) {
      if (filter.difficulty.length !== 2) {
        throw new UserInputError('difficulty filter must contain two values');
      }
      wheres.push(sql`sections.difficulty >= ${2 * filter.difficulty[0]}`);
      wheres.push(sql`sections.difficulty <= ${2 * filter.difficulty[1]}`);
    }
    if (filter?.name) {
      const likeName = `%${filter.name}%`;
      wheres.push(
        sql`(sections.region || ' ' || sections.river || ' ' || sections.section) ILIKE ${likeName}`,
      );
    }

    const { rows } = await db().query(sql`
      SELECT
        ${selection},
        (sections.region || ' ' || sections.river || ' ' || sections.section) AS section_fullname,
        count(*) OVER() total_count
      FROM sections
      WHERE ${sql.join(wheres, sql` AND `)}
      ORDER BY sections.ord_id DESC, section_fullname ASC
      LIMIT ${limit}
    `);
    const total: number = (rows?.[0]?.total_count as any) || 0;

    return itemsToConnection(
      rows.map((r) => collapseJoinResult(r, 'section')),
      total,
      'fullname',
    );
  }
}

export type TSectionsService = SectionsService;

export default SectionsService;
