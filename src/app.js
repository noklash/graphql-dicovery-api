require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const connectToDb = require('./db/connect');
const mergedGQLSchema = require('./schema');
const resolvers = require('./resolvers');
const { verifyToken } = require('./middleware/authenticateUser');

const PORT = process.env.PORT || 8080;
const app = express();

// Configure CORS to allow credentials and specific origin
app.use(cors({
  origin: 'http://localhost:3000', // Explicitly allow client origin
  credentials: true, // Allow cookies/credentials
}));
app.use(express.json()); // Ensure JSON parsing is after CORS

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const pubsub = new PubSub();
console.log('PubSub initialized:', pubsub);
if (typeof pubsub.asyncIterator !== 'function') {
  console.error('PubSub missing asyncIterator at initialization!');
  process.exit(1);
}

const schema = makeExecutableSchema({
  typeDefs: mergedGQLSchema,
  resolvers,
});

const getContext = ({ req, connectionParams }) => {
  let token;
  if (req) token = req.headers.authorization || '';
  else if (connectionParams) token = connectionParams.authorization || '';
  console.log('Raw token:', token);
  if (token) {
    try {
      const cleanToken = token.replace('Bearer ', '');
      console.log('Cleaned token:', cleanToken);
      const decoded = verifyToken(cleanToken);
      console.log('Decoded token:', decoded);
      return { user: decoded, pubsub };
    } catch (err) {
      console.warn('Invalid token:', err.message);
      return { pubsub };
    }
  }
  console.log('No token provided');
  return { pubsub };
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
            await new Promise((resolve) => httpServer.close(resolve));
          },
        };
      },
    },
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await new Promise((resolve) => wsServer.close(resolve));
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

    const serverCleanup = useServer(
      {
        schema,
        context: async (ctx) => getContext({ connectionParams: ctx.connectionParams }),
        onConnect: async (ctx) => {
          console.log('WebSocket client connected');
          const context = await getContext({ connectionParams: ctx.connectionParams });
          console.log('WebSocket context:', context);
          if (!context.user) throw new Error('Authentication required');
          return context;
        },
        onSubscribe: (ctx, msg) => {
          console.log('Subscription request received:', msg);
        },
        onNext: (ctx, msg, args, result) => {
          console.log('Subscription data sent:', result);
        },
        onError: (ctx, msg, errors) => {
          console.error('WebSocket subscription error:', { msg, errors });
        },
        onComplete: (ctx, msg) => {
          console.log('Subscription completed:', msg);
        },
        onDisconnect: (ctx, code, reason) => {
          console.log(`WebSocket disconnected with code: ${code}, reason: ${reason}`);
        },
      },
      wsServer
    );

    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req }) => getContext({ req }),
    }));

    httpServer.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
      console.log(`WebSocket subscriptions at ws://localhost:${PORT}/graphql`);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down...');
      await serverCleanup.dispose();
      await server.stop();
      process.exit(0);
    });
    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down...');
      await serverCleanup.dispose();
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start();