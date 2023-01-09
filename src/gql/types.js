const { Driver } =require("neo4j-driver") ;
const { OGM } =require("@neo4j/graphql-ogm");

const Context = {
    ogm: OGM,
    driver: Driver,
};

module.exports=Context