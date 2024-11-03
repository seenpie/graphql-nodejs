import { GraphQLNonNull, GraphQLType } from 'graphql/index.js';

export const nonNull = <T extends GraphQLType>(type: T): GraphQLNonNull<T> =>
  new GraphQLNonNull(type);
