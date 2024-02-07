import { buildSchema } from "graphql";

export const PostsGQLSchema = buildSchema(`
    type Post {
      title: String!
      description: String!
      image: String!

    }

    type Query {
        posts: postsInfoResponse!
        post(id: String!): Post!
    }
    
    type PostsInfoResponse {
        success: Boolean!
        total: Int!
        posts: [Post!]!
    }

    type Mutation {
        addPost(title: String!, description: String!, image: String!): Post!
        updatePost(id: String!, title: String!, description: String!, image: String!): Post!
        deleteResponse(id: String!): deleteResponse!
    }

    type deleteResponse {
        success: Boolean!
        message: String!
        id: String!
    }
`)