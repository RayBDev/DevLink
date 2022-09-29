import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import http from 'http';
import jwt from 'jsonwebtoken';

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('DB Connected');
  } catch (error) {
    console.log('DB Connection Error', error);
  }
};

// Execute database Connection
db();

// Apollo Async
async function startApolloServer() {
  const app = express();

  const corsOptions: CorsOptions = {
    origin: process.env.ORIGIN_URL,
    credentials: true,
  };

  app.use(express.json({ limit: '5mb' }));
  app.use(cors(corsOptions));
  app.use(compression());

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    context: ({ req, res }) => {
      // Look at the HTTP Headers for an auth cookie
      const { cookie } = req.headers;

      let user;
      if (cookie) {
        // Extract the JWT token from the cookie
        const token = cookie.split('token=')[1].split(';')[0];

        // Verify the JWT token and add the user details (or undefined) to the context
        user = jwt.verify(token, process.env.JWT_SECRET!);
      }
      return { req, res, user };
    },
    validationRules: [depthLimit(7)],
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  // Mount Apollo Middleware
  server.applyMiddleware({ app, cors: corsOptions });

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
