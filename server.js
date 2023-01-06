const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { neoSchema } = require('./schema/schema')
//const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server");


//This route will be used as an endpoint to interact with Graphql, 
//All queries will go through this route. 
// const schema = neoSchema.getSchema();

async function main() {
    const schema = await neoSchema.getSchema();
    const server = new ApolloServer({
        schema,
        context: ({ req }) => ({ req }),
    });
    console.log("Online");
    await server.listen(4001);

    
}

main()