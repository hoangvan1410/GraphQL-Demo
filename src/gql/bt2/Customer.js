const { gql } =require( 'apollo-server-express')
module.exports.CustomerTypeDefs = gql`
    type Customer {
		app_id: String
        name: String		
		customer_name: String
        phone: [Phone!]! @relationship (type:"HAS_PHONE",direction:OUT)
        address:[Address!]! @relationship (type:"HAS_ADDRESS",direction:OUT)
        ssn:[Ssn!]! @relationship(type:"HAS_SSN", direction:OUT)
	}

	type Phone {	
		phone: String
	}

	type Address {
		address: String
	}

	type Ssn { 
        ssn: String
	}

    type Query {
        find_same_ssn: [Customer]
        @cypher(
            statement: """
            MATCH (c:Customer)-[r2:HAS_SSN]->(s:Ssn),(c)-[r1:HAS_PHONE]->(p:Phone)
            WITH s,p,count(r2) as rel_ssn_count, count(r1) as rel_phone_count
            WHERE rel_ssn_count > 1 AND rel_phone_count > 1
            MATCH (s)<-[:HAS_SSN]-(c), (p)<-[:HAS_PHONE]-(c)
            RETURN c
            """
        )
    }    
`