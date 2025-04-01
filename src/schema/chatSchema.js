const { buildSchema } = require('graphql');

const ChatGQLSchema = buildSchema(`
  type Query {
    chats(senderId: String!, recipientId: String!): [Chat!]!
  }

  type Mutation {
    sendMessage(recipientId: String!, content: String!): Chat!
  }

  type Subscription {
    messageReceived(senderId: String!, recipientId: String!): Chat!
  }
`);

module.exports = ChatGQLSchema;