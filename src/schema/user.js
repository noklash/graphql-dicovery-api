const { buildSchema } = require("graphql");

const UsersGQLSchema = buildSchema(`
  type User {
    id: String!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    users: UsersInfoResponse!
    user(id: String!): User!
  }

  type UsersInfoResponse {
    success: Boolean!
    total: Int!
    users: [User!]!
  }

  type Mutation {
    regUser(username: String!, email: String!, password: String!): User!
    loginUser(email: String!, password: String!): User!
    updateUser(id: String!, username: String, email: String, password: String): User!
    deleteUser(id: String!): DeleteResponse!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
    id: String!
  }
`);

module.exports = UsersGQLSchema;
