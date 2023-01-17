const { gql } =require( 'apollo-server-express')
module.exports.CarTypeDefs = gql`
    type Car{
        car_id: String
        name: String
        car_color: [Color!]! @relationship (type:"HAS_COLOR",direction:OUT)
    }

    
`