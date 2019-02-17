// Simply put, a natural transformation, it's just a type conversion. 
// It's taking one functor to another. A natural transformation is actually a 
// function that takes a functor holding some `a` to another functor 
// holding that `a`. it's a structural change. F(a) -> G(a)
// Law: nt(x).map(f) == nt(x.map(f))


const { Box } = require('./1-IdentityFunctor')
const Either = require('./2-EitherType')
const { Right, Left, fromNullable } = Either
const Task = require('data.task')
const { List } = require('immutable-ext')

// We'll broaden our definition in a moment, but let's go ahead and implement one of these. 
// Let's say I have an either and I'd like to turn it into a Task. 
// We'll take our either here and we'll simply fold it out of the either and 
// into a rejected Task if it's a Left or a successful Task if it's a Right.

const eitherToTask = e => 
    e.fold(Task.rejected, Task.of)

eitherToTask(Right('Something'))
    .fork(e => console.error('err', e), r => console.log('result', r)) // result Something

eitherToTask(Left('Error'))
    .fork(e => console.error('err', e), r => console.log('result', r)) // err Error


// Now lets turn a Box into a either
const boxToEither = b => b.fold(Right)
const res = boxToEither(Box(100)) // Right(100)

// The law:
// nt(x).map(f) == nt(x.map(f))
// A natural transformation is a function (nt) 
// that when I transform x (some functor), when I map over that with f, 
// it must be equal to mapping f over our functor, and then naturally transforming it afterwards.



// Real World Use Cases
const words = List(['Hello', 'World'])   // List here is a natural transformation function transforming an array into a list
    .chain(word => List(word.split(''))) // same here

// Lets say we have a list of numbers, and we want to filter the large ones, 
// get the first one and duplicate its value
const first = xs => fromNullable(xs[0])
const largeNumbers = xs => xs.filter(x => x > 100)
const double = x => x * 2

const app = xs => first(largeNumbers(xs).map(double)) // here we are doubling all large numbers
const app2 = xs => first(largeNumbers(xs)).map(double) // here with natural transformation first, we double only one
// above you can see the law of natural transformation nt(x).map(f) == nt(x.map(f))
