const Task = require('data.task')

// Tasks are LazyBoxes, they only evaluate once fork is invoked.
// They can reject or resolve

const makeCake = () => (
    new Task((rej, res) => {
        console.log('Cake is Cooking')
        res('Chocolate Cake')
    })
)

const result = makeCake()
                .map(s => `${s} Served!`)
                .fork(
                    err => console.log('Error: ', err),
                    cake => console.log('Success: ', cake)
                )


// They can be used for asynchronous actions
const makeCakeAsync = (type) => (
    new Task((rej, res) => {
        console.log(`${type} is Cooking`)
        setTimeout(() =>  res(`${type} Cake`), 1000)  
    })
)

const addStrawberriesAsync = (cake) => (
    new Task((rej, res) => {
        console.log(`Adding Strawberries To ${cake}`)
        setTimeout(() =>  res(`${cake} with Strawberries`), 1000)  
    })
)

// Tasks and Promises are very similar in terms of construction, the difference is
// that once you have a Promise instance the action has already started, while a Task instance does 
// not run until someone calls .fork()


// We can chain tasks
const cakes = makeCakeAsync('Sponge')
                .map(sponge => {
                    console.log(`${sponge} is Ready`)
                    return sponge
                })
                .chain(cake => addStrawberriesAsync(cake))
                .fork(
                    err => console.log('Error: ', err),
                    success => console.log('Success: ', success)
                )

