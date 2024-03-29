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

// Import Merged TypeDefs and Resolvers
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Set up MongoDB Database Connection via Mongoose
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

// Apollo GraqphQL Server Setup
async function startApolloServer() {
  const app = express();

  // Cors setup to include cookies via credentials flag
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
    introspection: process.env.NODE_ENV !== 'production', // Turn off schema fetching in production
    context: ({ req, res }) => {
      // Look at the HTTP Headers for an auth cookie
      const { cookie } = req.headers;

      // Check if JWT token cookie exists
      if (cookie && cookie?.search('token=') !== -1) {
        // Extract the JWT token from the cookie
        const token = cookie.split('token=')[1].split(';')[0];

        // Verify the JWT token and add the user ID (or undefined) to the context
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET!);
          return { req, res, user };
        } catch (err) {
          // If JWT token is invalid only return req, res
          return { req, res };
        }
      }
      // Only return req & res if auth cookie doesn't exist
      return { req, res };
    },
    validationRules: [depthLimit(7)], // Limit GraphQl query depth
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
