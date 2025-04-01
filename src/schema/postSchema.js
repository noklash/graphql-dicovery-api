const { buildSchema } = require('graphql');

const PostsGQLSchema = buildSchema(`
  scalar Upload

  type File {
    url: String!
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

  type Query {
    posts: PostsInfoResponse!
    post(id: String!): Post!
  }

  type Mutation {
    addPost(title: String!, description: String!, image: String!, userId: String!): Post!
    updatePost(id: String!, title: String!, description: String!, image: String!): Post!
    deletePost(id: String!): DeleteResponse!
    uploadImage(file: Upload!): File!
  }
`);

module.exports = PostsGQLSchema;