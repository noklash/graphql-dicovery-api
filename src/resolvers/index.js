const  UsersResolver = require("./user") ;
const  PostsResolver  = require("./post") ;
// const UploadResolver = require("./upload") ;


const resolvers = [UsersResolver, PostsResolver]
module.exports = resolvers