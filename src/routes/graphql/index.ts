import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { RootQueryType } from './types/rootQueryType.js';
import { Mutations } from './types/mutations.js';
import depthLimit from 'graphql-depth-limit';

const MAX_DEPTH = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: Mutations,
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const document = parse(query);
      const errors = validate(schema, document, [depthLimit(MAX_DEPTH)]);

      if (errors.length > 0) {
        return { errors, prisma };
      }

      return graphql({
        schema,
        source: query,
        contextValue: { prisma },
        variableValues: variables,
      });
    },
  });
};

export default plugin;
