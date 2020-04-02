import get from 'lodash/get';
import snakeCase from 'lodash/snakeCase';
import { sql } from 'slonik';
import uniq from 'lodash/uniq';

interface SqlSelectionOptions {
  prefix?: string;
  path?: string;
}

class FieldsMap<TGraphql, TSql> {
  private _map: Map<keyof TGraphql, keyof TSql | Array<keyof TSql>>;

  constructor(map: Array<[keyof TGraphql, keyof TSql | Array<keyof TSql>]>) {
    this._map = new Map(map);
  }

  public getSqlSelection(tree: any, options: SqlSelectionOptions = {}) {
    const { path, prefix } = options;
    const keys = Object.keys(path ? get(tree, path) : tree);

    const columns: string[] = uniq(
      keys
        .flatMap((k: any) => this._map.get(k))
        .filter((k) => !!k)
        .map((k: any) => snakeCase(k)),
    );
    return sql.join(
      columns.map((col) => sql.identifier(prefix ? [prefix, col] : [col])),
      sql`, `,
    );
  }
}

export default FieldsMap;
