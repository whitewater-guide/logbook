import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import { resolve } from 'path';

import { CursorScalar } from './cursor';

const resolversArray = fileLoader(
  resolve(
    process.cwd(),
    process.env.NODE_ENV === 'test'
      ? 'src/features/**/resolvers.ts'
      : 'dist/features/**/resolvers.js',
  ),
);

const merged = mergeResolvers(resolversArray);

export default {
  ...merged,
  Cursor: CursorScalar,
};
