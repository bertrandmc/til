const { 
    GraphQLID, 
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
} = require('graphql')
const { FilmType } = require('./types')

const filmsQueryType = new GraphQLObjectType({
    name: 'FilmsRootQueryType',
    description: 'Films root query type',
    fields: {
        film: {
            type: FilmType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Id of the film'
                }
            },
        }, 
        films: {
            type: new GraphQLList(FilmType),
        }        
    }
})

module.exports = {
    filmsQueryType,
}