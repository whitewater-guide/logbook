import set from 'lodash/set';

const collapseJoinResults = (row: any, defaultPrefix: string): any => {
  if (!row) {
    return null;
  }
  return Object.entries(row).reduce((acc, [key, val]) => {
    const [prefix, ...rest] = key.split('_');
    const tableKey = rest.join('_');
    if (prefix === defaultPrefix) {
      set(acc, tableKey, val);
    } else {
      set(acc, `${prefix}.${tableKey}`, val);
    }
    return acc;
  }, {});
};

export default collapseJoinResults;
