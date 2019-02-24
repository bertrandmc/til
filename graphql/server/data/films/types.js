const { 
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType,
} = require('graphql')

const FilmType = new GraphQLObjectType({
    name: 'Film',
    description: 'The film query type',
    fields: {
        id: {
            type: GraphQLID,
            description: 'The id of the video'
        },
        title: {
            type: GraphQLString,
            description: 'The title of the video',
        }, 
        opening_crawl: {
            type: GraphQLString,
            description: 'The opening crawl',
        }, 
        director: {
            type: GraphQLString,
            description: 'The director',
        }, 
        producer: {
            type: GraphQLString,
            description: 'The producer',
        }, 
        release_date: {
            type: GraphQLString,
            description: 'The release date',
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

const FilmInputType = new GraphQLInputObjectType({
    name: 'FilmInput',
    fields: {
        title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The title of the film.',
        },
        opening_crawl: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The opening crawl text',
        }, 
        director: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The director',
        }, 
        producer: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The producer',
        }, 
        release_date: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The release date (eg.: 1980-05-17)',
        }, 
    }
})

module.exports = {
    FilmType,
    FilmInputType
}