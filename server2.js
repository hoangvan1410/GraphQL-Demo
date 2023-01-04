const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
// const neoSchema = require('./schema/schema')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
mongoose.set('strictQuery',true)
mongoose.connect('mongodb+srv://admin:Admin1314@cluster0.psxk7h4.mongodb.net/graphql')

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


const typeDefs = `
    type Movie {
        title: String
        year: Int
        imdbRating: Float
        genres: [Genre!]! @relationship(type: "IN_GENRE", direction: OUT)
    }

    type Genre {
        name: String
        movies: [Movie!]! @relationship(type: "IN_GENRE", direction: IN)
    }
`;

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "letmein"));

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

async function main() {
    const schema = await neoSchema.getSchema();

    const server = new ApolloServer({
        schema,
        context: ({ req }) => ({ req }),
    });
    console.log("Online");
    await server.listen(4000);

    
}

main()
// app.use(cors({
//     origin: '*'
// }));
// //This route will be used as an endpoint to interact with Graphql, 
// //All queries will go through this route. 
// app.use('/graphql', graphqlHTTP({
//     //Directing express-graphql to use this schema to map out the graph 
//     schema,
//     //Directing express-graphql to use graphiql when goto '/graphql' address in the browser
//     //which provides an interface to make GraphQl queries
//     graphiql:true
// }));

// app.listen(3000, () => {
//     console.log('Listening on port 3000');
// }); 