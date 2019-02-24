const { getFilms, getFilmById } = require('./mockedData')

module.exports = {
    Query: {
        film(_, { id }) {
            return getFilmById(id)
        },
        films: getFilms
    }
}