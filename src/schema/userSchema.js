const { buildSchema } = require('graphql');

const UserGQLSchema = buildSchema(`
  type UserResponse {
    success: Boolean!
    total: Int!
    users: [User!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
    id: String!
  }

  type Query {
    users: UserResponse!
    user(id: String!): User!
  }

  type Mutation {
    regUser(username: String!, email: String!, password: String!): User!
    loginUser(email: String!, password: String!): AuthPayload!
    updateUser(id: String!, username: String, email: String, password: String): User!
    deleteUser(id: String!): DeleteResponse!
  }

  type Subscription {
    userAdded: User!
    userUpdated: User!
    userDeleted: DeleteResponse!
  }
`);

module.exports = UserGQLSchema;