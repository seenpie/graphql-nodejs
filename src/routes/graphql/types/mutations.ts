import { GraphQLObjectType } from 'graphql/index.js';
import { ChangeUserInput, CreateUserInput, User } from './user.js';
import { nonNull } from './utils/nonNull.js';
import { PrismaClient } from '@prisma/client';
import { ChangeProfileInput, CreateProfileInput, Profile } from './profile.js';
import { ChangePostInput, CreatePostInput, Post } from './post.js';
import { UUIDType } from './uuid.js';
import { GraphQLString } from 'graphql';

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: nonNull(User),
      args: {
        dto: {
          type: nonNull(CreateUserInput),
        },
      },
      resolve: (
        _source,
        args: { dto: { name: string; balance: number } },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.user.create({
          data: args.dto,
        });
      },
    },

    createProfile: {
      type: nonNull(Profile),
      args: {
        dto: {
          type: nonNull(CreateProfileInput),
        },
      },
      resolve: (
        _source,
        args: {
          dto: {
            isMale: boolean;
            yearOfBirth: number;
            userId: string;
            memberTypeId: string;
          };
        },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.profile.create({
          data: args.dto,
        });
      },
    },

    createPost: {
      type: nonNull(Post),
      args: {
        dto: {
          type: nonNull(CreatePostInput),
        },
      },
      resolve: (
        _source,
        args: { dto: { title: string; content: string; authorId: string } },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.post.create({
          data: args.dto,
        });
      },
    },

    changePost: {
      type: nonNull(Post),
      args: {
        dto: {
          type: nonNull(ChangePostInput),
        },
        id: {
          type: nonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        args: { id: string; dto: NonNullable<unknown> },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    changeProfile: {
      type: nonNull(Profile),
      args: {
        id: {
          type: nonNull(UUIDType),
        },
        dto: {
          type: nonNull(ChangeProfileInput),
        },
      },
      resolve: async (
        _source,
        args: {
          id: string;
          dto: NonNullable<unknown>;
        },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    changeUser: {
      type: nonNull(User),
      args: {
        id: {
          type: nonNull(UUIDType),
        },
        dto: {
          type: nonNull(ChangeUserInput),
        },
      },
      resolve: async (
        _source,
        args: { id: string; dto: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    deleteUser: {
      type: nonNull(GraphQLString),
      args: {
        id: {
          type: nonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        args: { id: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        await prisma.user.delete({
          where: { id: args.id },
        });
        return 'user deleted successfully';
      },
    },

    deletePost: {
      type: nonNull(GraphQLString),
      args: {
        id: {
          type: nonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        args: { id: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        await prisma.post.delete({
          where: { id: args.id },
        });
        return 'post deleted successfully';
      },
    },

    deleteProfile: {
      type: nonNull(GraphQLString),
      args: {
        id: {
          type: nonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        args: { id: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        await prisma.profile.delete({
          where: { id: args.id },
        });
        return 'profile deleted successfully.';
      },
    },

    subscribeTo: {
      type: nonNull(GraphQLString),
      args: {
        userId: {
          type: nonNull(UUIDType),
        },
        authorId: {
          type: nonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        args: { authorId: string; userId: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            authorId: args.authorId,
            subscriberId: args.userId,
          },
        });
        return `${args.userId} subscribed on ${args.authorId}`;
      },
    },

    unsubscribeFrom: {
      type: nonNull(GraphQLString),
      args: {
        userId: {
          type: nonNull(UUIDType),
        },
        authorId: {
          type: nonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        args: { authorId: string; userId: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return `${args.userId} unsubscribed from ${args.authorId}`;
      },
    },
  }),
});
