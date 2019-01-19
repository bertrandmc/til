// A semi-group is a type with a concat method, it comes from abstract algebra.
// With semi-groups it doesn't matter the order which we will concat (how we group the operations)
// the result will always be the same. For example:
// ['a'].concat('b').concat('c') === ['a'].concat('b'.concat('c'))

// Let's create a Sum semi-group, this group will allow us to calculate sums like 1+1+1+(1+1)


const Sum = value => ({
    value,
    concat: otherSum => Sum(value + otherSum.value), // other will be another Sum type
    inspect: () => `Sum(${value})`, // inspect is invoked by NodeJS when console.log
    toString: () => `Sum(${value})` // toString is invoked by the browser when console.log
})

const result = Sum(1).concat(Sum(1).concat(Sum(3))) // Sum(5)

// Let's define a semi-group named All to perform the following conjunction 
// true && false === false  All(true).concat(All(false))
// true && true === true   All(true).concat(All(true))

const All = value => ({
    value,
    concat: otherAll => All(value && otherAll.value), 
    inspect: () => `All(${value})`, 
    toString: () => `All(${value})`
})

const all1 = All(true).concat(All(false)); // All(false)
const all2 = All(true).concat(All(true));  // All(true)

// Let's define semi-group called First that will always keep the first value (rather odd, just to illustrate)

const First = value => ({
    value,
    concat: _ => First(value), 
    inspect: () => `First(${value})`, 
    toString: () => `First(${value})`
})

const first = First(10).concat(First(5)).concat(First(3)); // First(10)


// Now a practical example
// Let's say our user has two accounts and we want to combine them
// const acct1 = { name: 'Nico', isPaid: true, points: 10, friends: ['Franklin'] }
// const acct2 = { name: 'Nico', isPaid: false, points: 2, friends: ['Gatsby'] }

// Let's create a Map type to allow us to concat an object

const Map = object => ({
    object,
    concat: otherMap => Map(
        Object.keys(object)
            .map(key => {
                return {[key]: object[key].concat(otherMap.object[key])}
            })
            .reduce((acc, value) => {
                return ({
                    ...acc,
                    ...value
                })
            })
    ),
    inspect: () => object,
})

const acct1 = Map({ name: First('Nico'), isPaid: All(true), points: Sum(10), friends: ['Franklin'] })
const acct2 = Map({ name: First('Nico'), isPaid: All(false), points: Sum(2), friends: ['Gatsby'] })

const res = acct1.concat(acct2); // { name: First(Nico), isPaid: All(false), points: Sum(12), friends: [ 'Franklin', 'Gatsby' ] }







module.exports = {
    First,
}