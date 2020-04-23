import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Page, SectionInput, SectionsFilter } from '~/__generated__/graphql';
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

  private buildSelection(tree: any, table = 'sections') {
    const selection: ValueExpressionType[] = [
      SectionFieldsMap.getSqlSelection(tree, {
        table,
        aliasPrefix: 'section',
        requiredColumns: ['user_id', 'ord_id'],
      }),
    ];
    return sql.join(selection, sql`, `);
  }

  public buildUpsertCTE(input: SectionInput, parentId?: string) {
    const putIn = input.putIn
      ? sql`ST_MakePoint(${input.putIn.lng}, ${input.putIn.lat}, 0)`
      : sql`NULL`;
    const takeOut = input.takeOut
      ? sql`ST_MakePoint(${input.takeOut.lng}, ${input.takeOut.lat}, 0)`
      : sql`NULL`;
    const upsert = sql`
      INSERT INTO sections (
          id,
          parent_id,
          user_id,
          region,
          river,
          section,
          difficulty,
          put_in,
          take_out,
          upstream_id,
          upstream_data
        ) VALUES (
          COALESCE (${input.id || null}, uuid_generate_v4()),
          ${parentId || null},
          ${this._context.uid!},
          ${input.region},
          ${input.river},
          ${input.section},
          ${input.difficulty * 2},
          ${putIn},
          ${takeOut},
          ${input.upstreamId || null},
          ${JSON.stringify(input.upstreamData || null)}
        )
        ON CONFLICT (id) DO UPDATE SET
          -- parent_id cannot be updated
          user_id = EXCLUDED.user_id,
          region = EXCLUDED.region,
          river = EXCLUDED.river,
          section = EXCLUDED.section,
          difficulty = EXCLUDED.difficulty,
          put_in = EXCLUDED.put_in,
          take_out = EXCLUDED.take_out,
          upstream_id = EXCLUDED.upstream_id,
          upstream_data = EXCLUDED.upstream_data
        RETURNING *
    `;
    return upsert;
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
      wheres.push(
        sql`((sections.region || ' ' || sections.river || ' ' || sections.section), sections.ord_id) > (${after.value}, ${after.ordId})`,
      );
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
      ORDER BY section_fullname ASC, sections.ord_id DESC
      LIMIT ${limit}
    `);
    const total: number = (rows?.[0]?.total_count as any) || 0;

    return itemsToConnection(
      rows.map((r) => collapseJoinResult(r, 'section')),
      total,
      'fullname',
    );
  }

  public async deleteById(id: string) {
    const ownerId = await db().maybeOneFirst(
      sql`SELECT user_id FROM sections WHERE id = ${id}`,
    );
    if (ownerId !== this._context.uid) {
      throw new ForbiddenError('forbidden');
    }
    await db().query(sql`DELETE FROM sections WHERE id = ${id}`);
  }

  public async upsert(info: GraphQLResolveInfo, input: SectionInput) {
    const tree = graphqlFields(info);
    const selection = this.buildSelection(tree, 'upserted_section');
    const upsert = this.buildUpsertCTE(input);

    if (input.id) {
      const ownerId = await db().maybeOneFirst(
        sql`SELECT user_id FROM sections WHERE id = ${input.id}`,
      );
      if (ownerId !== this._context.uid) {
        throw new ForbiddenError('unauthorized');
      }
    }

    const row = await db().maybeOne(sql`
      WITH upserted_section AS (
        ${upsert}
      ) SELECT ${selection} FROM upserted_section
    `);

    const result = collapseJoinResult(row, 'section');
    return result;
  }
}

export type TSectionsService = SectionsService;

export default SectionsService;
