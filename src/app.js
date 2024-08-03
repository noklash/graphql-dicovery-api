require('dotenv').config();
const app = require('express');
const connectToDb = require('./db/connect');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mergedGQLSchema = require('./schema');
const resolvers = require('./resolvers');
const { verifyToken} = require('./middleware/authenticateUser')

const PORT = process.env.PORT || 8080;

const context = ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const decoded = verifyToken(token.replace('Bearer ', ''));
        return { user: decoded };
      } catch (err) {
        console.warn('Invalid token:', err.message);
      }
    }
    return {};
  };

const server = new ApolloServer({
    typeDefs: mergedGQLSchema,
    resolvers,
    context,
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
        
        // server.applyMiddleware({ app });
        console.log(`Server ready at ${url}`);
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
// app.use(graphqlUploadExpress());


