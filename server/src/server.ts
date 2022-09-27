import * as dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import http from 'http';

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Apollo Async
async function startApolloServer() {
  const app = express();

  app.use(express.json({ limit: '5mb' }));
  app.use(
    cors({
      origin: process.env.ORIGIN_URL,
      credentials: true,
    })
  );
  app.use(compression());

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    context: ({ req, res }) => ({ req, res }),
    validationRules: [depthLimit(7)],
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  // Mount Apollo Middleware
  server.applyMiddleware({ app });

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

  // PORT Setup
  httpServer.listen(process.env.PORT, function () {
    console.log(`REST Server running on http://localhost:${process.env.PORT}`);
    console.log(
      `GQL Server running on http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  });
}

startApolloServer();
