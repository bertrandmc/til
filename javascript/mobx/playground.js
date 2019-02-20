const {observable, autorun, action, transaction, configure} = require('mobx')

const message = observable({
    author: {
        name: 'Bertrand'
    }
})

const author = message.author;

autorun(() => {
    console.log(message.author.name)
    console.log(author.name)
})

message.author.name = "Ada";
message.author = { name: "John" }; // won't work for console.log(author.name)

// ----

const message2 = observable({ title: "hello" })

autorun(() => {
    console.log(message2)
})

// Won't trigger a re-run autorun only observes message2, not deep observation
message2.title = "Hello world"

// ---

const weather = observable({
    temperature: 20,
    unit: 'C'
})

autorun(() => console.log(weather.temperature, weather.unit))
weather.temperature = 68 // logs 68 C
weather.unit = 'F' // logs 68 F

transaction(() => {
    weather.temperature = 21
    weather.unit = 'C' 
}) // logs 21 C once


// ---

configure({ enforceActions: 'always' })

const weather = observable({
    temperature: 20,
    unit: 'C'
})

// weather.unit = 'F' // ERROR

action(() => {
    weather.unit = 'F' // OK
})

// ---