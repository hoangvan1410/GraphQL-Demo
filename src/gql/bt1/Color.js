const { gql } =require( 'apollo-server-express')
module.exports.ColorTypeDefs = gql`
    type Color{
        color_id: String
        color_name: String
    }
`