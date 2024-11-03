import { GraphQLList, GraphQLType } from 'graphql/index.js';

export const list = <T extends GraphQLType>(type: T): GraphQLList<T> =>
  new GraphQLList(type);
