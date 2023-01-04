const graphql = require('graphql');
const neo4j = require("neo4j-driver");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const Book = require('../models/book');
const Author = require('../models/Author');
const User = require('../models/User')
const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   

const BookType = new Neo4jGraphQL({
    name: 'Book',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString }, 
        pages: { type: GraphQLInt },
        author: {
        type: AuthorType,
        resolve(parent, args) {
            return Author.findById(parent.authorID);
        }
    }
    })
});

const AuthorType = new Neo4jGraphQL({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        book:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({ authorID: parent.id });
            }
        }
    })
})

// const UserType = new Neo4jGraphQL({
//     name: 'User',
//     fields: () => ({
//         uuid: { type: GraphQLString },
//         mail: { type: GraphQLString },
//         userName: { type: GraphQLString },
//         // resolve(parent, args) {
//         //     return User.findById(parent.uuid);
//         // }
//     })
// })

// //RootQuery describe how users can use the graph and grab data.
// //E.g Root query to get all authors, get all books, get a particular 
// //book or get a particular author.
// const RootQuery = new Neo4jGraphQL({
//     name: 'RootQueryType',
//     fields: {
//         book: {
//             type: BookType,
//             //argument passed by the user while making the query
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 //Here we define how to get data from database source

//                 //this will return the book with id passed in argument 
//                 //by the user
//                 return Book.findById(args.id);
//             }
//         },
//         books:{
//             type: new GraphQLList(BookType),
//             resolve(parent, args) {
//                 return Book.find({});
//             }
//         },
//         author:{
//             type: AuthorType,
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 return Author.findById(args.id);
//             }
//         },
//         authors:{
//             type: new GraphQLList(AuthorType),
//             resolve(parent, args) {
//                 return Author.find({});
//             }
//         },
//         user:{
//             type:UserType,
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 //Here we define how to get data from database source

//                 //this will return the book with id passed in argument 
//                 //by the user
//                 return User.findById(args.id);
//             }
//         },
//         users:{
//             type: new GraphQLList(UserType),
//             resolve(parent, args) {
//                 return User.find({});
//             }
//         }
//     }
// });
 
// //Very similar to RootQuery helps user to add/update to the database.
// const Mutation = new Neo4jGraphQL({
//     name: 'Mutation',
//     fields: {
//         addAuthor: {
//             type: AuthorType,
//             args: {
//                 //GraphQLNonNull make these field required
//                 name: { type: new Neo4jGraphQL(GraphQLString) },
//                 age: { type: new Neo4jGraphQL(GraphQLInt) }
//             },
//             resolve(parent, args) {
//                 let author = new Author({
//                     name: args.name,
//                     age: args.age
//                 });
//                 return author.save();
//             }
//         },
//         addBook:{
//             type:BookType,
//             args:{
//                 name: { type: new Neo4jGraphQL(GraphQLString)},
//                 pages: { type: new Neo4jGraphQL(GraphQLInt)},
//                 authorID: { type: new Neo4jGraphQL(GraphQLID)}
//             },
//             resolve(parent,args){
//                 let book = new Book({
//                     name:args.name,
//                     pages:args.pages,
//                     authorID:args.authorID
//                 })
//                 return book.save()
//             }
//         },
//         addUser:{
//             type:UserType,
//             args:{
//                 uuid: { type: new Neo4jGraphQL(GraphQLString)},
//                 mail: { type: new Neo4jGraphQL(GraphQLString)},
//                 userName: { type: new Neo4jGraphQL(GraphQLString)}
//             },
//             resolve(parent,args){
//                 let user = new User({
//                     uuid:args.uuid,
//                     mail:args.mail,
//                     userName:args.userName
//                 })
//                 return user.save()
//             }
//         }
//     }
// });


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

module.exports.neoSchema = new Neo4jGraphQL({ typeDefs, driver });
//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
