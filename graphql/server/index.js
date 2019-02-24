const express = require('express')
const graphqlHTTP = require('express-graphql')
const rootSchema = require('./data/rootSchema')

const PORT = process.env.PORT || 3000
const server = express()

server.use('*', (req, res, next) => {
    console.log(req.params)
    next()
})
server.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: rootSchema,
}))

server.listen(PORT, () => {
    console.log(`Server is Listening on PORT ${PORT}`)
})