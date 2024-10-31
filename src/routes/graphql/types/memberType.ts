import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql/index.js';
import { MemberTypeId } from './memberTypeId.js';
import { nonNull } from './utils/nonNull.js';

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: nonNull(MemberTypeId),
    },

    discount: {
      type: nonNull(GraphQLFloat),
    },

    postsLimitPerMonth: {
      type: nonNull(GraphQLInt),
    },
  }),
});
