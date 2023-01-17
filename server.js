require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const { RoleTypeDefs } = require("./src/gql/Role");
const { UsertypeDefs, UserResolvers } = require("./src/gql/User");

const {PersonTypeDefs} = require ("./src/gql/bt1/Person.js");
const{CarTypeDefs} = require ("./src/gql/bt1/Car.js");
const {ColorTypeDefs} = require ("./src/gql/bt1/Color.js");
//const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server-express");
const neo4j = require("neo4j-driver");

const { OGM } = require("@neo4j/graphql-ogm");
const { NEO_USER, NEO_PASSWORD } = process.env;
const { expressjwt: jwt } = require("express-jwt");
const {Neo4jGraphQLAuthJWTPlugin} =require("@neo4j/graphql-plugin-auth");
const bodyParser = require('body-parser')
const { graphqlExpress } = require('apollo-server-express')

const typeDefs = [RoleTypeDefs, UsertypeDefs,PersonTypeDefs,CarTypeDefs,ColorTypeDefs];

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://admin:Admin1314@cluster0.psxk7h4.mongodb.net/graphql"
);

mongoose.connection.once("open", () => {
  console.log("conneted to database");
});

// create our express app
const app = express()

// auth middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false
})

// graphql endpoint
app.use(
  '/',
  bodyParser.json(),
  auth
)

const resolvers = {
  ...UserResolvers,
};
const driver = neo4j.driver(
  "bolt://127.0.0.1:7687",
  neo4j.auth.basic(NEO_USER, NEO_PASSWORD)
);

neoSchema = new Neo4jGraphQL({ 
    typeDefs, 
    resolvers,
    driver });
//This route will be used as an endpoint to interact with Graphql,
//All queries will go through this route.
// const schema = neoSchema.getSchema();
const ogm = new OGM({
  typeDefs,
  driver,
});
app.listen(4001)
async function main() {
  await ogm.init();
  const schema = await neoSchema.getSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  });
  console.log("Online");
  await server.start();
  server.applyMiddleware({ app });
}

main();
