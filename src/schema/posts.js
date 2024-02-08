const { buildSchema } = require("graphql");

const PostsGQLSchema = buildSchema(`
    type Post {
        title: String!
        description: String!
        image: String!
    }

    type Query {  
        posts: PostsInfoResponse!
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
        deletePost(id: String!): deleteResponse!
    }

    type deleteResponse {
        success: Boolean!
        message: String!
        id: String!
    }
`);

module.exports = PostsGQLSchema;
