import ts from '@wessberg/rollup-plugin-ts';
import clear from 'rollup-plugin-clear';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
    {
      file: 'dist/esm/index.js',
      format: 'es',
    },
  ],
  plugins: [
    clear({
      targets: ['dist'],
    }),
    ts({
      transpiler: 'babel',
    }),
  ],
  external: ['yup', 'graphql-tag', '@whitewater-guide/validation'],
};
