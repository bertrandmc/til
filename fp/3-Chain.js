// Chain is used to deal with nested Eithers types, avoiding the need for nested folding

const Right = value => ({
    chain: f => f(x),
    map: f => Right(f(value)),
    fold: (f, g) => g(value),
    inspect: () => `Right(${value})`
})

const Left = value => ({
    chain: f => Left(value),
    map: f => Left(value),
    fold: (f, g) => f(value),
    inspect: () => `Left(${value})`
})

const fromNullable = value => (
    value != null ? Right(value) : Left(null) 
)

const tryCatch = f => {
    try {
        return Right(f())
    } catch (e) {
        return Left(e)
    }
}


// example code

// imperative
const getPort = () => {
    try {
        const str = fs.readFileSync('config.json')
        const config = JSON.parse(str)
        return config.port
    } catch(e) {
        return 3000
    }
}

// functional 
const getPort = () => {
    tryCatch(fs.readFileSync('config.json'))
        .chain(str => tryCatch(() => JSON.parse(str)))
        .map(config => config.port)
        .fold(err => 3000, port => port)
}
