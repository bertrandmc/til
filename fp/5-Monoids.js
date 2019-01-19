// A Monoid is a semigroup with a special element in there that acts like a neutral identity.

// A semigroup does not have an neutral element to return so it's not a safe operation, 
// whereas with the monoids we could take as many as we possibly want, even none, 
// and still return us back something. It's a perfectly safe operation here that 
// we can reduce as many of them as we'd like.

// Lets try to turn our previous semi-groups into monoids

// sum needs to be able to work with many values and also none without affecting the result of:
// 1 + 0 = 1, 
// 0+ 1 + (2 + 3) = 6 
const Sum = value => ({
    value,
    concat: otherSum => Sum(value + otherSum.value), // other will be another Sum type
    inspect: () => `Sum(${value})`, // inspect is invoked by NodeJS when console.log
    toString: () => `Sum(${value})` // toString is invoked by the browser when console.log
})

Sum.empty = () => Sum(0) // => now that sum has the special neutral type it becomes a monoid
Sum(1).concat(Sum.empty()) // 1
Sum.empty().concat(Sum(2).concat(Sum(3))) // 6

// All
// in all if we pass true && empty it returns true (not affecting the result)
// and if we pass false && empty it returns false
// so in this case empty has to be the true value so it doesn't affect any result
const All = value => ({
    value,
    concat: otherAll => All(value && otherAll.value), 
    inspect: () => `All(${value})`, 
    toString: () => `All(${value})`
})

All.empty = () => All(true)

All(true).concat(All.empty()) // true
All(false).concat(All.empty()) // false


// can we turn First into a monoid? Nope, because if we use the empty value 
// in the first position it would discard the second value
// meaning "Hello" + "" === "Hello" while "" + "Hello" === ""
const First = value => ({
    value,
    concat: _ => First(value), 
    inspect: () => `First(${value})`, 
    toString: () => `First(${value})`
})


// More...


// The term Monoid comes from category theory. It describes a set of elements 
// which has 3 special properties when combined with a particular operation, often named concat:
//  1. The operation must combine two values of the set into a third value of the same set. 
//     If a and b are part of the set, then concat(a, b) must also be part of the set. 
//     In category theory, this is called a magma.
//  2. The operation must be associative: concat(x, concat(y, z)) must be the same as 
//     concat(concat(x, y), z) where x, y, and z are any value in the set. No matter how 
//     you group the operation, the result should be the same, as long as the order is respected.
//  3. The set must possess a neutral element in regard to the operation. If that 
//     neutral element is combined with any other value, it should not change it. 
//     concat(element, neutral) == concat(neutral, element) == element


// Example of monoids in JS:

// number addition: 
//      (1 + 2) + 3 == 1 + (2 + 3); // true
//      x + 0 = x

// string concatenation
//      const concat = (a, b) => a.concat(b)  This function operates on two strings and returns a string. So it's a magma.
//      It's also associative:
//          concat('hello', concat(' ', 'world')); // "hello world"
//          concat(concat('hello', ' '), 'world'); // "hello world"
//      And it has a neutral element, the empty string (''):
//          concat('hello', ''); // 'hello'
//          concat('', 'hello'); // 'hello'

// function composition
//      const compose = (func1, func2) => arg => func1(func2(arg));
//      Compose takes two functions as arguments, and returns a function. So it's a magma.
//      It's also associative: 
//          const add5 = a => a + 5;
//          const double = a => a * 2;
//          const resultIs = a => `result: ${a}`;
//          const doubleThenAdd5 = compose(add5, double);
//          The composition is associative.
//          The grouping does not matter as long as the order is preserved.
//              compose(compose(resultIs, add5), double)(3); // 'result: 11'
//              compose(resultIs, compose(add5, double))(3); // 'result: 11'
//       And the neutral element is the identity function v => v.
//              const neutral = v => v;
//              compose(add5, neutral)(3) // 8
//              compose(neutral, add5)(3) // 8


// What are monoids good for?

// 1. Reducing Function Arguments
const concat = (a, b) => a.concat(b);
const concatArray = arr => arr.reduce(concat, '');
const strings = ['hello', ' ', 'world'];
concatArray(strings); // 'hello world';

const compose = (f1, f2) => arg => f1(f2(arg));
const composeArray = arr => arr.reduce(compose, x => x);
const resultIs = a => `result: ${a}`;
const add5 = a => a + 5;
const double = a => a * 2;
const functions = [resultIs, add5, double];
const myOperation = composeArray(functions);
myOperation(2); // result: 9


// Splitting Computation In Chunks
const concat2 = (a, b) => a + b;
const bigArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
bigArray.reduce(concat2 , 0); // 55
const result1 = bigArray.slice(0, 5).reduce(concat2 , 0); // 15
const result2 = bigArray.slice(5).reduce(concat2, 0); // 40
concat2(result1, result2); // 55

// Async Composition
// Async Flow


module.exports = {
    Sum,
    All,
}