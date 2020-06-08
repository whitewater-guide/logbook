import get from 'lodash/get';
import snakeCase from 'lodash/snakeCase';
import uniq from 'lodash/uniq';
import { ListSqlTokenType, sql, ValueExpressionType } from 'slonik';

interface SqlSelectionOptions<TSql> {
  table?: string;
  aliasPrefix: string;
  path?: string;
  requiredColumns?: Array<Extract<keyof TSql, string>>;
}

type Column<TSql> =
  | Extract<keyof TSql, string>
  | { raw: ValueExpressionType; alias: string };
type MappedSql<TSql> = Column<TSql> | Array<Column<TSql>>;

class FieldsMap<TGraphql, TSql> {
  private _map: Map<Extract<keyof TGraphql, string>, MappedSql<TSql>>;

  constructor(map: Array<[Extract<keyof TGraphql, string>, MappedSql<TSql>]>) {
    this._map = new Map(map);
  }

  public getSqlSelection(
    tree: any,
    options: SqlSelectionOptions<TSql>,
  ): ListSqlTokenType {
    const { path, table, aliasPrefix, requiredColumns = [] } = options;
    const keys = Object.keys(path ? get(tree, path) : tree);

    const columns: Column<TSql>[] = uniq(
      keys
        .flatMap((k: any) => this._map.get(k))
        .filter((v) => !!v)
        .map((v) => (typeof v === 'string' ? snakeCase(v) : v))
        .concat(...(requiredColumns as any[])),
    ) as any;
    return sql.join(
      columns.map((col) => {
        if (typeof col !== 'string') {
          const aliasCol = sql.identifier([`${aliasPrefix}_${col.alias}`]);
          return sql.join([col.raw, aliasCol], sql` AS `);
        }
        const fullCol = sql.identifier(table ? [table, col] : [col]);
        const aliasCol = sql.identifier([`${aliasPrefix}_${col}`]);
        return sql`${fullCol} AS ${aliasCol}`;
      }),
      sql`, `,
    );
  }
}

export default FieldsMap;
