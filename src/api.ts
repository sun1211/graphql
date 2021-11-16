import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import { PubSub } from 'graphql-subscriptions';

const { ApolloServer } = require('apollo-server-express');
export const pubsub = new PubSub();


const app = express();

// Application-Level Middleware

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.get('/heathcheck', (req, res) => {
    res.status(200).send('heath check OK');
});

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs, resolvers,
        context: ({ req, res }: any) => ({ req, res, pubsub }),
      });
    await server.start();
    await server.applyMiddleware({ app, cors: false });


    // Start
    const appPort = Number(process.env.app_port) || 3030;

    app.listen(appPort, () => {
        console.log(`App listening on http://localhost/${appPort}`);
        console.log(`GraphQL server ready on http://localhost:${appPort}` + server.graphqlPath);
    });
}

startApolloServer();



