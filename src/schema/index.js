const { buildSchema } = require('graphql');

const mergedSchema = buildSchema(`
  # Shared Types
  type User {
    id: String!
    username: String!
    email: String!
    password: String!
    posts: [Post!]
  }

  type Post {
    id: String
    title: String!
    description: String!
    image: String!
    user: User!
  }

  type Chat {
    id: String!
    sender: User!
    recipient: User!
    content: String!
    createdAt: String!
  }

   type ChatMessage {
    id: String!
    content: String!
    sender: User!
    recipient: User!
    createdAt: String!
  }

  scalar Upload

  type File {
    url: String!
  }

  type UserResponse {
    success: Boolean!
    total: Int!
    users: [User!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PostsInfoResponse {
    success: Boolean!
    total: Int!
    posts: [Post!]!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
    id: String!
  }

  # Single Query Type
  type Query {
    users: UserResponse!
    user(id: String!): User!
    posts: PostsInfoResponse!
    post(id: String!): Post!
    chats(senderId: String!, recipientId: String!): [ChatMessage!]!
  }

  # Single Mutation Type
  type Mutation {
    regUser(username: String!, email: String!, password: String!): User!
    loginUser(email: String!, password: String!): AuthPayload!
    updateUser(id: String!, username: String, email: String, password: String): User!
    deleteUser(id: String!): DeleteResponse!
    addPost(title: String!, description: String!, image: String!, userId: String!): Post!
    updatePost(id: String!, title: String!, description: String!, image: String!): Post!
    deletePost(id: String!): DeleteResponse!
    uploadImage(file: Upload!): File!
    sendMessage(senderId: String!, recipientId: String!, content: String!): ChatMessage!
  }

  # Single Subscription Type
  type Subscription {
    userAdded: User!
    userUpdated: User!
    userDeleted: DeleteResponse!
    messageReceived(senderId: String!, recipientId: String!): ChatMessage!
  }



 

  

 

  
`);

module.exports = mergedSchema;

// This schema combines the user, post, and chat schemas into a single schema.
// It defines the shared types, queries, mutations, and subscriptions in one place.
//REMEMBER TO DELETE INDIVIDUAL SCHEMA FILES SINCE THEY ARE NOT USEFUL ANYMORE