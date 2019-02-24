/**
 * The combined schema out of types and resolvers (queries, mutations and subscriptions)
 */

const { mergeSchemas } = require('graphql-tools');
const merge = require('lodash/merge')
const films = require('./films')
const planets = require('./planets')

const rootSchema = mergeSchemas({
    schemas: [
        planets.schema,
        films.schema,
    ],
    resolvers: merge(
        {},
        planets.resolvers,
        films.resolvers,
    ),
})

module.exports = rootSchema