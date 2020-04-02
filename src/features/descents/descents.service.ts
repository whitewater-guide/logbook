import { ValueExpressionType, sql } from 'slonik';

import type { Context } from '~/apollo/context';
import { DataSource } from 'apollo-datasource';
import { Descent } from '~/__generated__/graphql';
import { DescentFieldsMap } from './fields-map';
import { DescentRaw } from '~/__generated__/sql';
import { GraphQLResolveInfo } from 'graphql';
import { SectionFieldsMap } from '../sections/fields-map';
import db from '~/db';
import graphqlFields from 'graphql-fields';

class DescentsService extends DataSource<Context> {
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
    if (!id) {
      return null;
    }
    const selection = this.buildSelection(info);
    const result: DescentRaw | null = await db.maybeOne(sql`
      SELECT ${selection}
      FROM descents
      WHERE descents.id = ${id}
    `);

    return result
      ? {
          ...result,
          level: {
            unit: result.level_unit,
            value: result.level_value,
          },
        }
      : null;
  }
}

export type TDescentsService = DescentsService;

export default DescentsService;
