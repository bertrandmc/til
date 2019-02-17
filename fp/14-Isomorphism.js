const { Right, Left, fromNullable } = require('./2-EitherType')

// Isomorphism
// An isomorphism is a pair of functions, to and from, where if I call to on x followed by a from, 
// I should just get back my original x. It means I can convert and convert back to get my original x. 
// We can do the same thing with the y here. We can go from and to to get back our y.

// from(to(x)) === x
// to(from(y)) === y

// This is an interesting relationship. What it means is these functions prove our data type 
// holds the same information as another data type. I claim a String is isomorphic to an array 
// of characters (String ~ [Chars]). These two data types should hold the same information and be able to convert 
// there and back without losing anything.


// Let's go ahead and formalize this notion and make an example here. 
// We have an isomorphism that takes a to and a from. We'll just package them 
// up into a type here. There we are.

const Iso = (to, from) => ({
    to, 
    from
})


// How might we turn our string into a list of characters? 
// We'll make an isomorphism. Let's call this isomorphism chars. Here, we are with the isomorphism. 
// All we have to do is take a string and split it on everything. To get from our chars 
// back to a string, we could just join it on everything. There's an isomorphism for us.
const stringChars = Iso(s => s.split(''), c => c.join(''))
const res = stringChars.from(stringChars.to('hello world'))


// Why is this useful?
// Lets implement a truncate

const truncate = str => (
    stringChars.from(stringChars.to(str).slice(0, 3))
)

console.log(truncate('Functional')) // Fun

// stringChars isomorphism allowed us to easily change to a type we needed to be able to split
// and then we return to its initial type.

// Lets do another one
// I claim that an array holding one value is isomorphic to our type Either null or a
// [a] ~ Either null a

const eitherArray = Iso(
    e => e.fold(() => [], x => [x]), 
    xs => fromNullable(xs[0]),
)

console.log(eitherArray.to(eitherArray.from([]))) // []
console.log(eitherArray.to(eitherArray.from([1]))) // [1]

// Now lets implement a function to allow us to filter Eithers
const filterEither = (e, predicate) => (
    eitherArray.from(eitherArray.to(e).filter(predicate))
)

// And we use it to filter null values and safely apply toUpperCase to them
const eitherResult = filterEither(Right('Hello world'), x => x.match(/world/ig))
    .map(x => x.toUpperCase())

console.log(eitherResult) // Right(HELLO WORLD)
