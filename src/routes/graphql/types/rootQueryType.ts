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
import { createLoaders } from '../dataloaders.js';

export type GraphQLContext = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof createLoaders>;
};

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: nonNull(list(nonNull(MemberType))),
      resolve: async (_source, _args, { prisma, loaders }: GraphQLContext) => {
        const members = await prisma.memberType.findMany();

        members.forEach((member) => {
          loaders.memberTypeLoader.prime(member.id, member);
        });

        return members;
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: nonNull(MemberTypeId) },
      },
      resolve: async (_source, { id }: PrismaMemberType, context: GraphQLContext) => {
        return context.loaders.memberTypeLoader.load(id);
      },
    },

    users: {
      type: nonNull(list(nonNull(User))),
      resolve: async (_source, _args, { prisma, loaders }) => {
        const users = await prisma.user.findMany({
          include: {
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });

        users.forEach((user) => {
          loaders.userLoader.prime(user.id, user);
        });

        return users;
      },
    },

    user: {
      type: User as GraphQLOutputType,
      args: {
        id: { type: nonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, context: GraphQLContext) => {
        return context.loaders.userLoader.load(id);
      },
    },

    posts: {
      type: nonNull(list(nonNull(Post))),
      resolve: async (_source, _args, { prisma, loaders }) => {
        const posts = await prisma.post.findMany();

        posts.forEach((post) => loaders.postLoader.prime(post.id, [post]));

        return posts;
      },
    },

    post: {
      type: Post,
      args: {
        id: { type: nonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, context: GraphQLContext) => {
        return context.prisma.post.findUnique({
          where: {
            id,
          },
        });
      },
    },

    profiles: {
      type: nonNull(list(nonNull(Profile))),
      resolve: async (_source, _args, { prisma, loaders }) => {
        const profiles = await prisma.profile.findMany();

        profiles.forEach((profile) => {
          loaders.profileLoader.prime(profile.id, profile);
        });

        return profiles;
      },
    },

    profile: {
      type: Profile,
      args: {
        id: { type: nonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, context: GraphQLContext) => {
        return context.prisma.profile.findUnique({
          where: {
            id,
          },
        });
      },
    },
  }),
});
