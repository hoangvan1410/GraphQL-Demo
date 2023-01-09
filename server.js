require('dotenv').config()
const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { RoleTypeDefs } = require('./src/gql/Role')
const { UsertypeDefs ,UserResolvers} = require('./src/gql/User')
//const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
const typeDefs=[RoleTypeDefs,UsertypeDefs];
const { OGM } =require("@neo4j/graphql-ogm");
const { NEO_USER, NEO_PASSWORD} = process.env
const resolvers = {
    ...UserResolvers,
};
const driver = neo4j.driver("bolt://127.0.0.1:7687", neo4j.auth.basic(NEO_USER, NEO_PASSWORD));

neoSchema = new Neo4jGraphQL({ typeDefs,resolvers, driver });
//This route will be used as an endpoint to interact with Graphql, 
//All queries will go through this route. 
// const schema = neoSchema.getSchema();
const ogm = new OGM({
    typeDefs,
    driver,
});

async function main() {
    await ogm.init();
    const schema = await neoSchema.getSchema();
    const server = new ApolloServer({
        schema,
        context: ({ req }) => ({ req }),
    });
    console.log("Online");
    await server.listen(4001);
}

main()