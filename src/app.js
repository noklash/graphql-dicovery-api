require('dotenv').config();
const  connectToDb  = require("./db/connect");
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const  mergedGQLSchema  = require("./schema");
const  resolvers  = require("./resolvers");

const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
    typeDefs: mergedGQLSchema,
    resolvers,
    introspection: true
});

const uri = process.env.MONGODB_URI


const start = async () => {
    try {
        await connectToDb(uri); 
        const { url } = await startStandaloneServer(server, {
            listen: { port: PORT }
        });
        
        console.log(`Server ready at ${url}`);
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

start();
