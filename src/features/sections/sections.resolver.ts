import Mutation from './mutations';
import Query from './queries';
import fields from './fields';

export default {
  Mutation,
  Query,
  ...fields,
};
