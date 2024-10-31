import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { nonNull } from './utils/nonNull.js';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';
import { list } from './utils/list.js';
import { PrismaClient } from '@prisma/client';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: nonNull(UUIDType),
    },

    name: {
      type: nonNull(GraphQLString),
    },

    balance: {
      type: nonNull(GraphQLFloat),
    },

    profile: {
      type: Profile,
    },

    posts: {
      type: nonNull(list(nonNull(Post))),
    },

    userSubscribedTo: {
      type: nonNull(list(nonNull(User))),

      resolve: (source: { id: string }, _args, { prisma }: { prisma: PrismaClient }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: source.id,
              },
            },
          },
        });
      },
    },

    subscribedToUser: {
      type: nonNull(list(nonNull(User))),
      resolve: async (
        source: { id: string },
        _args,
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: source.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {
      type: nonNull(GraphQLString),
    },
    balance: {
      type: nonNull(GraphQLFloat),
    },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});
