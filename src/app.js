require('dotenv').config();
const connectToDb = require('./db/connect');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mergedGQLSchema = require('./schema');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 8080;

const server = new ApolloServer({
    typeDefs: mergedGQLSchema,
    resolvers,
    introspection: true,
});

const uri = process.env.MONGODB_URI;

const start = async () => {
    try {
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        await connectToDb(uri);
        console.log('Connected to the database');

        const { url } = await startStandaloneServer(server, {
            listen: { port: PORT },
        });
        console.log(`Server ready at ${url}`);
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
