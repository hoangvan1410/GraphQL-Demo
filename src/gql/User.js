const { gql } =require( 'apollo-server-express')
const  Context  = require('./types')
const repository = require('../database/repository')
const UserSchema = require('../database/schemas/User');
const { comparePassword,createJWT, hashPassword }= require("../utils/index");
//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   
module.exports.UsertypeDefs = gql`
    type User {
        id: ID! @id
        email: String!
       
        password: String! @private
        createdAt: DateTime @timestamp(operations: [CREATE])
        updatedAt: DateTime @timestamp(operations: [UPDATE])
    }


    extend type User
    @auth(
        rules: [
            { operations: [CONNECT], isAuthenticated: true }
            { operations: [UPDATE], allow: { id: "$jwt.sub" }, bind: { id: "$jwt.sub" } }
            { operations: [DELETE], allow: { id: "$jwt.sub" } }
            {
                operations: [DISCONNECT]
                allow: {
                    OR: [
                        { id: "$jwt.sub" }
                    ]
                }
            }
        ]
    )

    type Mutation {
        signUp(email: String, password: String): String # JWT
        signIn(email: String!, password: String!): String # JWT
    }
`;

module.exports.UserResolvers = {
    Mutation: {
        signUp,
        signIn
    },
};

async function signUp(_root, args= { email: string, password: string }) {
    //const User = context.ogm.model("User");
    console.log("email",args.email)
    let getUser = await repository.getUser(args.email);
    console.log("getUser",getUser)
    if (getUser) {
        throw new Error("user with that email already exists");
    }

    const hash = await hashPassword(args.password);
    console.log("hash",hash)
    let user = new UserSchema({
        email: args.email,
        password : hash
    })
    console.log("createUser",user)
    await repository.createUser(user);

    const jwt = await createJWT({ sub: user.id });
    console.log("jwt",jwt);
    return jwt;
}

async function signIn(_root, args= { email: string, password: string }, context= new Context) {

    let getUser = await repository.getUser(args.email);
    console.log("getUser",getUser)
    if (!getUser) {
        throw new Error("user not found");
    }

    const equal = await comparePassword(args.password, getUser.password);
    console.log("equal",equal)
    if (!equal) {
        throw new Error("Unauthorized");
    }

    const jwt = await createJWT({ sub: getUser.id });

    return jwt;
}
