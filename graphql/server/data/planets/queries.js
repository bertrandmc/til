const { 
    GraphQLID, 
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
} = require('graphql')
const { PlanetType } = require('./types')

const planetsQueryType = new GraphQLObjectType({
    name: 'PlanetsRootQueryType',
    description: 'Planets root query type',
    fields: {
        planet: {
            type: PlanetType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Id of the planet'
                }
            },
        }, 
        planets: {
            type: new GraphQLList(PlanetType),
        }        
    }
})

module.exports = {
    planetsQueryType,
}