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
import { GraphQLContext } from './rootQueryType.js';

type TUserSubscribe = {
  subscriberId: string;
  authorId: string;
};

export type TUserSource = {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo: TUserSubscribe[];
  subscribedToUser: TUserSubscribe[];
};

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
      resolve: async (source: TUserSource, _args, context: GraphQLContext) => {
        return context.loaders.profileLoader.load(source.id);
      },
    },

    posts: {
      type: nonNull(list(nonNull(Post))),
      resolve: async (source: TUserSource, _args, context: GraphQLContext) => {
        return context.loaders.postLoader.load(source.id);
      },
    },

    userSubscribedTo: {
      type: nonNull(list(nonNull(User))),

      resolve: (source: TUserSource, _args, context: GraphQLContext) => {
        const authorIds = source.userSubscribedTo.map((user) => user.authorId);

        return context.loaders.userLoader.loadMany(authorIds);
      },
    },

    subscribedToUser: {
      type: nonNull(list(nonNull(User))),
      resolve: async (source: TUserSource, _args, context) => {
        const subsIds = source.subscribedToUser.map((user) => user.subscriberId);

        return context.loaders.userLoader.loadMany(subsIds);
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
