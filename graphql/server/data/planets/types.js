const { 
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
} = require('graphql')
const films = require('../films')

const PlanetType = new GraphQLObjectType({
    name: 'Planet',
    description: 'The Planet query type',
    fields: {
        id: {
            type: GraphQLID,
            description: 'The id of the planet'
        },
        name: {
            type: GraphQLString,
            description: 'The name of the planet',
        }, 
        rotation_period: {
            type: GraphQLString,
            description: 'The rotation period',
        }, 
        orbital_period: {
            type: GraphQLString,
            description: 'The orbital period',
        }, 
        diameter: {
            type: GraphQLString,
            description: 'The diameter',
        }, 
        climate: {
            type: GraphQLString,
            description: 'The climate',
        }, 
        gravity: {
            type: GraphQLString,
            description: 'The gravity',
        }, 
        terrain: {
            type: GraphQLString,
            description: 'The terrain',
        }, 
        surface_water: {
            type: GraphQLString,
            description: 'The surface water',
        }, 
        population: {
            type: GraphQLString,
            description: 'The population',
        }, 
        films: {
            type: new GraphQLList(films.types.FilmType),
        },
        created: {
            type: GraphQLString,
            description: 'Record creation date',
        }, 
        edited: {
            type: GraphQLString,
            description: 'Last edit date',
        },
    }
})

const PlanetInputType = new GraphQLInputObjectType({
    name: 'PlanetInput',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The name of the planet.',
        },
        rotation_period: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The rotation period',
        }, 
        orbital_period: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The orbital period',
        }, 
        diameter: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The diameter',
        }, 
        climate: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The climate',
        }, 
        gravity: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The gravity',
        }, 
        terrain: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The terrain',
        }, 
        surface_water: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The surface water',
        }, 
        population: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The population',
        }, 
    }
})

module.exports = {
    PlanetType,
    PlanetInputType
}