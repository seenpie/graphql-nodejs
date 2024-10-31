import { GraphQLObjectType, GraphQLOutputType } from 'graphql/index.js';
import { MemberType as PrismaMemberType, PrismaClient } from '@prisma/client';
import { MemberType } from './memberType.js';
import { nonNull } from './utils/nonNull.js';
import { MemberTypeId } from './memberTypeId.js';
import { User } from './user.js';
import { list } from './utils/list.js';
import { UUIDType } from './uuid.js';
import { Post } from './post.js';
import { Profile } from './profile.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: nonNull(list(nonNull(MemberType))),
      resolve: async (_source, _args, { prisma }: { prisma: PrismaClient }) => {
        return prisma.memberType.findMany();
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: nonNull(MemberTypeId) },
      },
      resolve: async (_source, { id }: PrismaMemberType, { prisma }) => {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },

    users: {
      type: nonNull(list(nonNull(User))),
      resolve: async (_source, _args, { prisma }) => {
        return prisma.user.findMany({
          include: {
            posts: true,
            profile: true,
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
      },
    },

    user: {
      type: User as GraphQLOutputType,
      args: {
        id: { type: nonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, { prisma }) => {
        return prisma.user.findUnique({
          where: { id },
          include: {
            posts: true,
            profile: true,
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
      },
    },

    posts: {
      type: nonNull(list(nonNull(Post))),
      resolve: async (_source, _args, { prisma }) => {
        return prisma.post.findMany();
      },
    },

    post: {
      type: Post,
      args: {
        id: { type: nonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, { prisma }) => {
        return prisma.post.findUnique({ where: { id } });
      },
    },

    profiles: {
      type: nonNull(list(nonNull(Profile))),
      resolve: async (_source, _args, { prisma }) => {
        return prisma.profile.findMany();
      },
    },

    profile: {
      type: Profile,
      args: {
        id: { type: nonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, { prisma }) => {
        return prisma.profile.findUnique({ where: { id } });
      },
    },
  }),
});
