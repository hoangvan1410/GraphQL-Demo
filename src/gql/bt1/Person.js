const { gql } =require( 'apollo-server-express')
module.exports.PersonTypeDefs = gql`
    type Person{
        person_id: String
        name: String
        friend: [Person!]! @relationship (type:"HAS_FRIEND",direction:OUT)
        loves:[Person!]! @relationship (type:"LOVES",direction:OUT)
        car:[Car!]! @relationship(type:"OWN", direction:OUT)
    }

    type Query {
        can_bob_borrow_mike(name1:String, name2:String):Car
        @cypher(
            statement: """
            OPTIONAL MATCH (c:Car)<-[rel:OWN]-(p1:Person{name:$name1})-[rel2:HAS_FRIEND|LOVES]->(p2:Person{name:$name2}) 
            return c 
            """
        )
    }
`
