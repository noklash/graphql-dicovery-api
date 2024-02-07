import { buildSchema } from "graphql";

export const usersGQLSchema = buildSchema(`
type User {
    id: String!
    username: String!
    email: String!
    password: String!
}

type Query {
    users: usersInfoResponse!
    user(id: String!): User!
}

type usersInfoResponse {
    success: Boolean!
    total: Int!
    users: [User!]!
}

type Mutation {
    regUser(username: String!, email: String!, pasword: String!): User!
    loginUser(email: String!, password: String!): User!
    updatedUser(id: String!, username: String, email: String, pasdsword: String): User!
    deleteUser(id: String!): deleteResponse
}

type deleteResponse {
    success: Boolean!
    message: String!
    id: String!
}
`)