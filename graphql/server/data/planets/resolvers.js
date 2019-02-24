const { getPlanets, getPlanetById } = require('./mockedData')
const { getFilmById } = require('../films/mockedData')

module.exports = {
    // Query fields resolvers
    Query: {
        planet(_, { id }) {
            return getPlanetById(id)
        }, 
        planets: getPlanets,
    },

    // Types fields resolvers
    Planet: {
        films({ films }) {
            const promises = films.map(getFilmById)
            return Promise.all(promises)
        }
    }
}