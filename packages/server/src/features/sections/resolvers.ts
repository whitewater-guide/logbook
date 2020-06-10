import fields from './fields';
import Mutation from './mutations';
import Query from './queries';

export default {
  Mutation,
  Query,
  ...fields,
};
