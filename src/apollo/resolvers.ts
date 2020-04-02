import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

import { resolve } from 'path';

const resolversArray = fileLoader(
  resolve(
    process.cwd(),
    process.env.NODE_ENV === 'test'
      ? 'src/**/*.resolver.ts*'
      : 'dist/**/*.resolver.js*',
  ),
);

export default mergeResolvers(resolversArray);
