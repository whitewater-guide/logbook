import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

import { CursorScalar } from './cursor';
import { resolve } from 'path';

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
