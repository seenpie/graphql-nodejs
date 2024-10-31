import { GraphQLObjectType, GraphQLString } from 'graphql/index.js';
import { nonNull } from './utils/nonNull.js';
import { UUIDType } from './uuid.js';
import { GraphQLInputObjectType } from 'graphql';

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: nonNull(UUIDType),
    },

    title: {
      type: nonNull(GraphQLString),
    },

    content: {
      type: nonNull(GraphQLString),
    },
  }),
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: {
      type: nonNull(GraphQLString),
    },

    content: {
      type: nonNull(GraphQLString),
    },

    authorId: {
      type: nonNull(UUIDType),
    },
  }),
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: {
      type: GraphQLString,
    },

    content: {
      type: GraphQLString,
    },
  }),
});
