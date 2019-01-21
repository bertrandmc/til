const { List } = require('immutable-ext')

/**
 * 
 * An Applicative Functor gives us the ability to apply functors to each other.
 * it implements the .ap method
 * the laws are:
 * 
 * 1. F(x).map(f) === F(f).ap(F(x))   // F being a functor
 * 
 */

// Lets say we have a Box(x => x + 1) and we want to apply to Box(3) == =resulting Box(4)
const Box = value => ({
    ap: otherBox => otherBox.map(value),
    map: f => Box(f(value)),
    fold: f => f(value),
    inspect: () => `Box(${value})`
})

const res = Box(x => x + 1).ap(Box(3))
console.log(res) // Box(4)

// Second example

const incr = Box(x => y => x + y).ap(Box(1)) // this will give us a Box(y => 1 + y)
console.log(incr.ap(Box(5))) // Box(6)

const add = x => y => x + y
const incrBy2 = Box(add).ap(Box(2))
console.log(incrBy2.ap(Box(3))) // Box(5)


// So far we have worked with Box(x).map(f)... and map gives us one function f at a time




// First law
// F(x).map(f) === F(f).ap(F(x))   // F being a functor
// Lets define a lift applicative functor with two arguments
// const liftA2 = (f, fx, fy) => F(f).ap(fx).ap(fy)  // here we don't know what functor F is 
                                                     // but we know that F(x).map(f) === F(f).ap(F(x))
const liftA2 = (f, fx, fy) => fx.map(f).ap(fy)                                                     
console.log(liftA2(add, Box(2), Box(3))) // Box(5)  => this is the same as
console.log(Box(add).ap(Box(2)).ap(Box(3))) // Box(5)

// so the above liftA2 would allow us to apply multiple arguments to a function in a generic way 


// Real world example
// Lets say we have a list of merchandise and we want to create a list of them matching sizes and colors

const listMerch = ['t-shirt', 'sweater']
const listSizes = ['large', 'medium', 'small']
const listColors = ['black', 'white']

// the imperative ugly code would be
const resultImperative = []
for (merch of listMerch) {
    for (size of listSizes) {
        for (color of listColors) {
            resultImperative.push(`${merch}-${size}-${color}`) 
        }
    }
}

console.log(resultImperative) // [ 't-shirt-large-black',
                                // 't-shirt-large-white',
                                // 't-shirt-medium-black',
                                // 't-shirt-medium-white',
                                // 't-shirt-small-black',
                                // 't-shirt-small-white',
                                // 'sweater-large-black',
                                // 'sweater-large-white',
                                // 'sweater-medium-black',
                                // 'sweater-medium-white',
                                // 'sweater-small-black',
                                // 'sweater-small-white' ]

// BEAUTIFUL functional approach 
const resultFp = List.of(merch => size => color => `${merch}-${size}-${color}`)
    .ap(List(listMerch))
    .ap(List(listSizes))
    .ap(List(listColors))
    .toJS()

console.log(resultFp) // [ 't-shirt-large-black',
                        // 't-shirt-large-white',
                        // 't-shirt-medium-black',
                        // 't-shirt-medium-white',
                        // 't-shirt-small-black',
                        // 't-shirt-small-white',
                        // 'sweater-large-black',
                        // 'sweater-large-white',
                        // 'sweater-medium-black',
                        // 'sweater-medium-white',
                        // 'sweater-small-black',
                        // 'sweater-small-white' ]