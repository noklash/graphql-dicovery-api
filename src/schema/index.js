const  {mergeTypeDefs} = require("@graphql-tools/merge") 

const   UsersGQLSchema  = require("./user") 
const  PostsGQLSchema  = require("./posts") 

const mergedGQLSchema = mergeTypeDefs([UsersGQLSchema, PostsGQLSchema])
module.exports = mergedGQLSchema