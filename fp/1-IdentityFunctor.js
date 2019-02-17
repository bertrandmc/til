/**
 * Identity Functors
 * 
 * Functors are functional representation of different Types which can be mapped over, 
 * allowing composability.
 * All functors are expected to exhibit certain kinds of functor-like properties and behaviors. 
 * They should reliably behave as things that can be mapped over. Calling fmap on a functor 
 * should just map a function over the functor, nothing more. This behavior is described 
 * in the functor laws. There are two of them that all instances of Functor should abide by.
 * 
 * 1. The first functor law states that if we map the id function over a functor, 
 * the functor that we get back should be the same as the original functor. fmap id = id
 * 
 * 2. The second law says that composing two functions and then mapping the resulting 
 * function over a functor should be the same as first mapping one function over the functor 
 * and then mapping the other one. 
 *      Box(' hello ')
 *          .map(s => s.trim())
 *          .map(s => s.toUpperCase()) 
 *          .fold(s => s)
 * 
 *      is the same as
 *      Box(' hello ')
 *          .map(s => s.trim().toUpperCase())
 *          .fold(s => s)
 */   


const Box = value => ({
    map: f => Box(f(value)),
    fold: f => f(value),
    inspect: () => `Box(${x})`
})

// code example

// Imperative code example
function getUser() {
    getUser().name.toUpperCase() // loads of problems here to discuss in future, first lets make it more readable
}

// functional code
function getUser() {
    Box(getUser())
        .map(user => user.name)
        .fold(name => name.toUpperCase())
}


module.exports = {
    Box,
}