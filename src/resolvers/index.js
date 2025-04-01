const UsersResolver = require('./userResolver');
const PostsResolver = require('./postResolver');
const ChatResolver = require('./chatResolver');

const mergedResolvers = {
  Query: {
    ...UsersResolver.Query,
    ...PostsResolver.Query,
    ...ChatResolver.Query,
  },
  Mutation: {
    ...UsersResolver.Mutation,
    ...PostsResolver.Mutation,
    ...ChatResolver.Mutation,
  },
  Subscription: {
    ...UsersResolver.Subscription,
    ...ChatResolver.Subscription,
  },
};

module.exports = mergedResolvers;