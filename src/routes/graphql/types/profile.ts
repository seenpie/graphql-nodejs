import { GraphQLBoolean, GraphQLObjectType } from 'graphql/index.js';
import { nonNull } from './utils/nonNull.js';
import { UUIDType } from './uuid.js';
import { GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { MemberType } from './memberType.js';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from './memberTypeId.js';

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: nonNull(UUIDType),
    },

    isMale: {
      type: nonNull(GraphQLBoolean),
    },

    yearOfBirth: {
      type: nonNull(GraphQLInt),
    },

    memberType: {
      type: nonNull(MemberType),
      resolve: (
        source: { memberTypeId: string },
        _args,
        { prisma }: { prisma: PrismaClient },
      ) => {
        return prisma.memberType.findUnique({
          where: {
            id: source.memberTypeId,
          },
        });
      },
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: {
      type: nonNull(GraphQLBoolean),
    },

    yearOfBirth: {
      type: nonNull(GraphQLInt),
    },

    userId: {
      type: nonNull(UUIDType),
    },

    memberTypeId: {
      type: nonNull(MemberTypeId),
    },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: {
      type: GraphQLBoolean,
    },

    yearOfBirth: {
      type: GraphQLInt,
    },

    memberType: {
      type: MemberTypeId,
    },
  }),
});
