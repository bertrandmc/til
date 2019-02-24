const { GraphQLSchema } = require('graphql')
const { filmsQueryType } = require('./queries')
const { filmsMutationType } = require('./mutations')

const schema = new GraphQLSchema({
    query: filmsQueryType,
    mutation: filmsMutationType,
})

module.exports = schema