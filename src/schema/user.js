const { buildSchema } = require("graphql");

const UsersGQLSchema = buildSchema(`

  type Post {
    id: String
    title: String!
    description: String!
    image: String!
  }

  type User {
    id: String!
    username: String!
    email: String!
    password: String!
    posts: [Post!]
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
