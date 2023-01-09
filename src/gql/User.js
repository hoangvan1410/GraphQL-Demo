const { gql } =require( 'apollo-server-express')
const  Context  = require('./types')

const User = require("../database/schemas/User");
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

    type Mutation {
        signUp(email: String!, password: String!): String # JWT
        signIn(email: String!, password: String!): String # JWT
    }
`;

module.exports.UserResolvers = {
    Mutation: {
        signUp,
        signIn
    },
};

async function signUp(_root, args = { email: string, password: string }, context = new Context) {
    //const User = context.ogm.model("User");

    const [existing] = await User.find({
        where: { email: args.email },
        context: { ...context, adminOverride: true },
    });
    if (existing) {
        throw new Error("user with that email already exists");
    }

    const hash = await hashPassword(args.password);

    const [user] = (
        await User.create({
            input: [
                {
                    email: args.email,
                    password: hash,
                },
            ],
        })
    ).users;

    const jwt = await createJWT({ sub: user.id });

    return "jwt";
}

async function signIn(_root, args= { email: string, password: string }, context= new Context) {
    const User = context.ogm.model("User");

    const [existing] = await User.find({
        where: { email: args.email },
        context: { ...context, adminOverride: true },
    });
    if (!existing) {
        throw new Error("user not found");
    }

    const equal = await comparePassword(args.password, existing.password);
    if (!equal) {
        throw new Error("Unauthorized");
    }

    const jwt = await createJWT({ sub: existing.id });

    return jwt;
}
