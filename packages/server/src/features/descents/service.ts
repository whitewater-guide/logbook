import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { DescentRaw, SectionRaw } from 'packages/server/src/__generated__/sql';
import { ForbiddenError, UserInputError } from 'apollo-server';
import { IdentifierSqlTokenType, ValueExpressionType, sql } from 'slonik';
import {
  LogbookDescent,
  LogbookDescentInput,
  LogbookDescentsFilter,
  Page,
} from 'packages/server/src/__generated__/graphql';

import { Context } from 'packages/server/src/apollo/context';
import { GraphQLResolveInfo } from 'graphql';
import { LogbookDescentFieldsMap } from './fields-map';
import { LogbookSectionFieldsMap } from '../sections/fields-map';
import clamp from 'lodash/clamp';
import collapseJoinResults from 'packages/server/src/utils/collapseJoinResult';
import { db } from 'packages/server/src/db';
import graphqlFields from 'graphql-fields';
import { itemsToConnection } from 'packages/server/src/apollo/connections';
import jwt from 'jsonwebtoken';

interface ShareToken {
  descent: string;
  section: string;
}

interface DescentJointRow extends DescentRaw {
  section: SectionRaw;
}

class DescentsService extends DataSource<Context> {
  private _context!: Context;

  initialize(config: DataSourceConfig<Context>) {
    this._context = config.context;
  }

  private buildSelection(
    tree: any,
    table = 'logbook_descents',
    sectionsTable = 'logbook_sections',
  ) {
    const selection: ValueExpressionType[] = [
      LogbookDescentFieldsMap.getSqlSelection(tree, {
        table,
        aliasPrefix: 'descent',
        requiredColumns: ['user_id', 'ord_id', 'created_at'],
      }),
    ];
    if (tree.section) {
      const sectionSelection = LogbookSectionFieldsMap.getSqlSelection(tree, {
        path: 'section',
        table: sectionsTable,
        aliasPrefix: 'section',
        requiredColumns: ['user_id', 'ord_id'],
      });
      selection.push(sectionSelection);
    }
    return sql.join(selection, sql`, `);
  }

  private buildUpsertCTE(
    input: LogbookDescentInput,
    sectionId: IdentifierSqlTokenType,
    parentId?: string,
  ) {
    const upsert = sql`
      WITH RECURSIVE parent_descents( id, parent_id ) AS (
        SELECT id, parent_id
        FROM logbook_descents
        WHERE id = ${parentId || null}

        UNION ALL

        -- get all parent_descents
        SELECT d.id, d.parent_id
        FROM parent_descents p
        JOIN logbook_descents d
        ON p.parent_id = d.id
      ) INSERT INTO logbook_descents (
          id,
          parent_id,
          user_id,
          section_id,
          comment,
          started_at,
          duration,
          level_value,
          level_unit,
          public,
          upstream_data
        ) SELECT
          COALESCE (${input.id || null}, uuid_generate_v4()),
          (SELECT parent_descents.id FROM parent_descents WHERE parent_descents.parent_id IS NULL ) as parent_id,
          ${this._context.uid!},
          ${sectionId},
          ${input.comment || null},
          ${input.startedAt.toISOString()},
          ${input.duration || null},
          ${input.level?.value || null},
          ${input.level?.unit || null},
          ${input.public || false},
          ${JSON.stringify(input.upstreamData || null)}
        FROM upserted_section
        ON CONFLICT (id) DO UPDATE SET
          -- parent_id cannot be updated
          parent_id = EXCLUDED.parent_id,
          user_id = EXCLUDED.user_id,
          section_id = EXCLUDED.section_id,
          comment = EXCLUDED.comment,
          started_at = EXCLUDED.started_at,
          duration = EXCLUDED.duration,
          level_value = EXCLUDED.level_value,
          level_unit = EXCLUDED.level_unit,
          public = EXCLUDED.public,
          upstream_data = EXCLUDED.upstream_data
        RETURNING *
    `;
    return upsert;
  }

  public async getShareToken(id: string) {
    const row = await db().one(
      sql`SELECT user_id, section_id FROM logbook_descents WHERE id = ${id}`,
    );
    if (row.user_id !== this._context.uid) {
      throw new ForbiddenError('forbidden');
    }
    const token: ShareToken = {
      descent: id,
      section: row.section_id as any,
    };
    return jwt.sign(token, process.env.JWT_SECRET, { noTimestamp: true });
  }

  public async getOne(
    info: GraphQLResolveInfo,
    id?: string | null,
    shareToken?: string | null,
  ): Promise<Partial<LogbookDescent> | null> {
    const tree = graphqlFields(info);
    let identifier = id;
    let fromShareToken = false;
    if (!id && shareToken) {
      const decoded: ShareToken = jwt.verify(
        shareToken,
        process.env.JWT_SECRET,
      ) as any;
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
    const selection = this.buildSelection(tree);

    const row: DescentRaw | null = await db().maybeOne(sql`
      SELECT ${selection}
      FROM logbook_descents
      LEFT OUTER JOIN logbook_sections on logbook_descents.section_id = logbook_sections.id
      WHERE logbook_descents.id = ${identifier}
    `);

    if (!row) {
      return null;
    }

    const result: DescentJointRow = collapseJoinResults(row, 'descent');

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
    filter?: LogbookDescentsFilter | null,
    page?: Page | null,
  ) {
    const tree = graphqlFields(info);
    const after = page?.after;
    const limit = clamp(page?.limit || 20, 1, 100);

    const selection = this.buildSelection(tree.edges.node);

    const wheres = [
      this._context.uid
        ? sql`(logbook_descents.public = TRUE OR logbook_descents.user_id = ${this._context.uid})`
        : sql`logbook_descents.public = TRUE`,
    ];

    if (after) {
      const afterval = new Date(Number(after.value)).toISOString();
      wheres.push(
        sql`(logbook_descents.started_at, logbook_descents.ord_id) < (${afterval}, ${after.ordId})`,
      );
    }
    if (filter?.difficulty) {
      if (filter.difficulty.length !== 2) {
        throw new UserInputError('difficulty filter must contain two values');
      }
      wheres.push(
        sql`logbook_sections.difficulty >= ${2 * filter.difficulty[0]}`,
      );
      wheres.push(
        sql`logbook_sections.difficulty <= ${2 * filter.difficulty[1]}`,
      );
    }
    if (filter?.startDate) {
      const startDate = filter.startDate.toISOString();
      wheres.push(sql`logbook_descents.started_at >= ${startDate}`);
    }
    if (filter?.endDate) {
      const endDate = filter.endDate.toISOString();
      wheres.push(sql`logbook_descents.started_at <= ${endDate}`);
    }
    if (filter?.sectionID) {
      wheres.push(
        sql`(logbook_descents.section_id = ${filter.sectionID} OR logbook_sections.parent_id = ${filter.sectionID}) `,
      );
    }
    if (filter?.upstreamSectionID) {
      wheres.push(
        sql`logbook_sections.upstream_id = ${filter.upstreamSectionID}`,
      );
    }
    if (filter?.sectionName) {
      const likeName = `%${filter.sectionName}%`;
      wheres.push(
        sql`(logbook_sections.region || ' ' || logbook_sections.river || ' ' || logbook_sections.section) ILIKE ${likeName}`,
      );
    }
    if (filter?.userID) {
      wheres.push(sql`logbook_descents.user_id = ${filter.userID}`);
    }

    const { rows } = await db().query(sql`
      SELECT ${selection}, count(*) OVER() total_count
      FROM logbook_descents
      LEFT OUTER JOIN logbook_sections on logbook_descents.section_id = logbook_sections.id
      WHERE ${sql.join(wheres, sql` AND `)}
      ORDER BY started_at DESC, logbook_descents.ord_id DESC
      LIMIT ${limit}
    `);
    const total: number = (rows?.[0]?.total_count as any) || 0;

    return itemsToConnection(
      rows.map((r) => collapseJoinResults(r, 'descent')),
      total,
      'started_at',
    );
  }

  public async deleteById(id: string) {
    const ownerId = await db().maybeOneFirst(
      sql`SELECT user_id FROM logbook_descents WHERE id = ${id}`,
    );
    if (ownerId !== this._context.uid) {
      throw new ForbiddenError('forbidden');
    }
    await db().query(sql`DELETE FROM logbook_descents WHERE id = ${id}`);
  }

  public async upsert(
    info: GraphQLResolveInfo,
    input: LogbookDescentInput,
    token?: string | null,
  ) {
    const tree = graphqlFields(info);
    const selection = this.buildSelection(
      tree,
      'upserted_descent',
      'upserted_section',
    );
    let shared: ShareToken | undefined;
    if (token) {
      shared = jwt.verify(token, process.env.JWT_SECRET) as any;
    }
    const upsertLogbookSection = this._context.dataSources?.sections.buildUpsertCTE(
      input.section,
      shared?.section,
    )!;
    const upsert = this.buildUpsertCTE(
      input,
      sql.identifier(['upserted_section', 'id']),
      shared?.descent,
    );

    if (input.id) {
      const ownerId = await db().maybeOneFirst(
        sql`SELECT user_id FROM logbook_descents WHERE id = ${input.id}`,
      );
      if (ownerId !== this._context.uid) {
        throw new ForbiddenError('unauthorized');
      }
    }

    const row = await db().maybeOne(sql`
      WITH upserted_section AS (
        ${upsertLogbookSection}
      ),
      upserted_descent AS (
        ${upsert}
      ) SELECT ${selection} FROM upserted_descent
      LEFT OUTER JOIN upserted_section on upserted_descent.section_id = upserted_section.id
    `);

    const result = collapseJoinResults(row, 'descent');
    return result;
  }
}

export type TDescentsService = DescentsService;

export default DescentsService;
