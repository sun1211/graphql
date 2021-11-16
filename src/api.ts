import 'dotenv/config';
import cors from 'cors';
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from 'graphql-subscriptions';
import express from "express";
import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

(async function () {
    const app = express();
    const pubsub = new PubSub();

    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    // Routes
    app.get('/heathcheck', (req, res) => {
        res.status(200).send('heath check OK');
    });

    //Required logic for integrating with Express
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    // Same ApolloServer initialization as before, plus the drain plugin.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }: any) => ({ req, res, pubsub }),
        schema,
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        }],
    });
    const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );
    //// More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
        app,
    
        // By default, apollo-server hosts its GraphQL endpoint at the
        // server root. However, *other* Apollo Server packages host it at
        // /graphql. Optionally provide this to match apollo-server.
        path: '/',
        cors: false,
      });

    const PORT = Number(process.env.app_port) || 3030;
    // Modified server startup
    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    );
})();
