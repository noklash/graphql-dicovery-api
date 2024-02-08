const  UsersResolver = require("./user") ;
const  { PostsResolver } = require("./post") ;


const resolvers = [UsersResolver, PostsResolver]
module.exports = resolvers