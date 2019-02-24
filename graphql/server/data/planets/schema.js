const { GraphQLSchema } = require('graphql')
const { planetsQueryType } = require('./queries')

const schema = new GraphQLSchema({
    query: planetsQueryType,
})

module.exports = schema