//What are resolvers?
// Resolvers are the functions that get or edit the data from our datastore.
// This data is then matched with the GraphQL type definition.

import { v4 } from "uuid";
import { GqlContext } from "./GqlContext";
import { todos } from "./db";

import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();


interface User {
    id: string;
    username: string;
    email?: string;
}

interface Todo {
    id: string;
    title: string;
    description?: string;
}

const NEW_TODO = "NEW TODO";

const resolvers = {
    Query: {
        getUser: async (
            parent: any,
            args: {
                id: string;
            },
            ctx: GqlContext,
            info: any
        ): Promise<User> => {
            return {
                id: v4(),
                username: "dave",
            };
        },
        getTodos: async (
            parent: any,
            args: null,
            ctx: GqlContext,
            info: any
        ): Promise<Array<Todo>> => {
            return todos;
        },
    },
    Mutation: {
        addTodo: async (
            parent: any,
            args: {
                title: string;
                description: string;
            },
            info: any
        ): Promise<Todo> => {
            const newTodo = {
                id: v4(),
                title: args.title,
                description: args.description,
            };
            todos.push(newTodo);
            pubsub.publish(NEW_TODO, { newTodo });
            return todos[todos.length - 1];
        },
    },
    Subscription: {
        newTodo: {
            subscribe: (
                parent: any,
                args: null
            ) =>
                pubsub.asyncIterator([NEW_TODO])
        },

    },
};

export default resolvers;
