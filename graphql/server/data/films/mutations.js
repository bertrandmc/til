const { 
    GraphQLObjectType,
    GraphQLNonNull,
 } = require('graphql')

const { FilmType, FilmInputType } = require('./types')
const { createFilm } = require('./mockedData')

const filmsMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Films root mutation type.',
    fields: {
        createFilm: {
            type: FilmType,
            args: {
                film: {
                    type: new GraphQLNonNull(FilmInputType),
                }           }, 
            resolve(_, args) {
                return createFilm(args.film)
            }
        }
    }
})

module.exports = {
    filmsMutationType
}
