import { gql } from "apollo-server-express";
// The language is fairly simple and looks a lot like TypeScript.
// Starting from the top, first we have a User entity, as indicated by the type keyword.
// Type is a GraphQL keyword that indicates that an object of a certain structure is being declared.
// As you can see, the User type has multiple fields.
// The id field is of type ID!.
// The ID type is a built-in type that indicates a unique value,
// basically a GUID of some kind.
// The exclamation mark indicates that the field cannot be null,
// whereas no exclamation mark would indicate that it can be null.
// Next, we see the username field and its type of String!,
// which of course means it is a non-nullable string type.
// Then, we have the description field, but it has a String type without an exclamation mark, so it is nullable.

// The Todos type has similar fields, 
//but notice the Query type.
// This shows that even queries are types in GraphQL.
// So, if you look at the two queries, getUser and getTodos,
// you can see why we created the User and Todos types,
// as they become the return values for our two Query methods.
// Also notice that the getTodos function returns an array of non-nullable Todos,
// which is indicated by the brackets.

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String
  }

  type Todo {
    id: ID!
    title: String!
    description: String
  }

  type Query {
    getUser(id: ID): User
    getTodos: [Todo!]
  }

  type Mutation {
    addTodo(title: String!, description: String): Todo
  }

  type Subscription {
    newTodo: Todo!
  }
`;

export default typeDefs;
