const { gql } =require( 'apollo-server-express')
//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   
module.exports.RoleTypeDefs = gql`    
    type Query{
        can_role_access_function(role_id: String, func_id: String): Boolean
        @cypher(
            statement: """
            OPTIONAL MATCH (r:Role{role_id:$role_id}), (f:Function{func_id:$func_id}),path = shortestpath((r)-[*]->(f)) 
            return path IS NOT NULL
            """
        )

        show_role_function(role_id:String): [Function]
        @cypher(
            statement: """
            OPTIONAL MATCH (f:Function)<-[:CAN_DO]-(r:Role) WHERE (:Role{role_id:$role_id})-[*]->(r) return distinct f
            """
        )

       
    }
    

    type Function{
        func_id: String
        func_code: String
        func_name: String
        role_func: [Role!]! @relationship(type: "CAN_DO", direction: IN)
    }

    type Role{
        role_id: String
        role_code: String
        role_name: String
        under_role: [Role!]! @relationship(type: "UNDER", direction: OUT)
    }

    type Staff{
        staff_id: String
        staff_name: String
        role: [Role!]! @relationship(type: "ROLE", direction: OUT)
    }

    extend type Role
        @auth(
            rules: [
                { operations: [CREATE], bind: { user: { id: "$jwt.sub" } } }
                { operations: [UPDATE], allow: { id: "$jwt.sub" } , bind: { id: "$jwt.sub" } } 
                { operations: [DELETE], allow: { id: "$jwt.sub" } }
            ]
        )
`;
 // map(phone,contract)
        // @cypher(
        //     match (c:Contract), (p:Phone) Where c.app_id= p.app_id Merge (c)-[:HAS_PHONE]->(p)
        // )