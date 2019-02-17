// In this exercise we are going to get sets of artists and try to figure out the 
// commonalities between. In a normal object-oriented setting, you might start with a class 
// called Spotify. You would go ahead and try to make a class of Artist. We'll put methods 
// on Spotify to go get artists and so on, etc. 

// Here, we're going to do something a little bit different. We're going to build a 
// flow for our data to flow through. We are going to retrieve the data and then just 
// pass it through a series of functions.


// the idea is to allow this programm to be invoked from the command line with 
// two artists names as argument, example: node file blur radiohead

// The spotifyAPi
// "https://api.spotify.com/v1/search?1=${query}&type=artist" // artists: {items: []}
// "https://api.spotify.com/v1/artists/${id}/related-artists" // artists: []

const Task = require('data.task')
const Either = require('data.either')
const request = require('request')
const { List } = require('immutable-ext')
const { Pair, Sum } = require('./5-Monoids')

// https://developer.spotify.com/console/get-artist/?id=0OdUWJ0sBjDrqHygGUXeCF
const SPOTIFY_AUTH = 'Bearer BQDHf8zhbg4ZonDRm7UsT-Fpm6rh_xGYije7fBkD5qupbydZtW2nD_IuAv1X_UCFphN67c9fSvCu56QhEe2mOOHSf2tEfGiBfZcQchLlY5X4B8UNkDntFLlPN0vL6UBEHdM908NmRuBNakU'

// string => Task
const httpGet = url => {
    return new Task((rej, res) => {
        request({
            url,
            headers: {
                authorization: SPOTIFY_AUTH,
                token_type: 'Bearer'
            }
        }, (error, response, body) => {
            error ? rej(error) : res(body)
        })
    })
}

// process.argv will bring the arguments from index 2
// () => Task
const argv = new Task((rej, res) => res(process.argv))
const artistsNames = argv.map(args => args.slice(2))

// array => Either
const first = xs => {
    return Either.fromNullable(xs[0])
}

// Either => Task.rejected | Task
const eitherToTask = e => {
    return e.fold(Task.rejected, Task.of) // natural transformation
}

// string => Either
const parseJson = Either.try(JSON.parse)

// string => Task
const getJson = url => {
    return httpGet(url)
        .map(parseJson)
        .chain(eitherToTask)
}

// string => Task
const findArtist = name => {
    return getJson(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
        .map(result=> result.artists.items)
        .map(first) // we are only interest in the first form the list spotify returns
        .chain(eitherToTask) // after first, if we get here and first is null, we should reject the whole thing, otherwise we return a new Task
}

// string => Task
const findRelatedArtist = artistId => {
    return getJson(`https://api.spotify.com/v1/artists/${artistId}/related-artists`)
        .map(result => result.artists)
}

// string => Task
const related = name => {
    return findArtist(name)
        .map(artist => artist.id)
        .chain(findRelatedArtist)
        .map(artists => artists.map(artist => artist.name))
}

//  a semi-group to express an intersection between to arrays
const Intersection = xs => ({
    xs: [...new Set(xs)], // make sure unique values
    concat: ({xs: ys}) => {
        return Intersection(xs.filter(x => -1 !== ys.indexOf(x)))
    }
})

// List => array
const artistsIntersection = relatedLists => {
    return relatedLists
            .foldMap(x => Pair(Intersection(x), Sum(x.length)))
            .bimap(x => x.xs, y => y) // which is a bi-functor
            .toList() // natural transformation
}

// array => Task
const main = names => {
    return List(names)
        .traverse(Task.of, related)
        .map(artistsIntersection)
    
}

artistsNames
    .chain(main)
    .fork(console.error, console.log)
