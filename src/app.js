require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');
// const { useServer } = require('graphql-ws'); // Updated import
const connectToDb = require('./db/connect');
const mergedGQLSchema = require('./schema');
const resolvers = require('./resolvers');
const { verifyToken } = require('./middleware/authenticateUser');

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const getContext = ({ req, connectionParams }) => {
  let token;
  if (req) token = req.headers.authorization || '';
  else if (connectionParams) token = connectionParams.authorization || '';
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
  context: getContext,
  introspection: true,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await httpServer.close();
          },
        };
      },
    },
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServer.close();
          },
        };
      },
    },
  ],
});

const uri = process.env.MONGODB_URI;

const start = async () => {
  try {
    if (!uri) throw new Error('MONGODB_URI not defined');
    await connectToDb(uri);
    console.log('Connected to the database');
    await server.start();

    useServer(
      {
        schema: server.schema,
        context: (ctx) => getContext({ connectionParams: ctx.connectionParams }),
        onConnect: async (ctx) => {
          console.log('WebSocket client connected');
          const context = await getContext({ connectionParams: ctx.connectionParams });
          if (!context.user) throw new Error('Authentication required');
        },
        onDisconnect: () => console.log('WebSocket client disconnected'),
      },
      wsServer
    );

    app.use('/graphql', express.json(), expressMiddleware(server, {
      context: async ({ req }) => getContext({ req }),
    }));

    httpServer.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
      console.log(`WebSocket subscriptions at ws://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

start();