// We use Traverse to turn an array of Tasks into a Task of and array of results
// [Task] => Task([])

// For example, lets say we have a list of Tasks to read different files

const fs = require('fs')
const Task = require('data.task')
const futurize = require('futurize').futurize(Task) //  Turn callback-style functions or promises into futures 
const { List } = require('immutable-ext')

const resdFile = futurize(fs.readFile)
const files = ['box.js', 'config.json']

const tasks = files.map(fn => readFile(fn, 'utf-8')) // tasks is a list of Tasks 
                                                    // [ Task { fork: [Function], cleanup: [Function] },
                                                    //   Task { fork: [Function], cleanup: [Function] } ]

// How do we know when all of them are finished? How do we fork each one of these? 
// We can very well map fork each one and we want to know when we are all done. 
// Really, what we want is to take this array of tasks and turn it into a Task of an array of results.                                                    
// [Task] => Task([])

// Essentially, we want to turn these types inside out. Or leapfrog the types so that the 
// array is on the inside of the Task and the Task is on the outside of the array. 
// Whenever we wanted to commute two types like this, what we can do is instead of calling 
// map we call traverse.

// Now, this Task will be on the outside of the array. This array does not have a traverse 
// function so we have to use our 'immutable-ext' List here, which we have given a 
// traverse function to. You will find this function in any functional language you encounter, 
// such as Scala, F#, Haskell, or whatnot.

const files = List(['box.js', 'config.json'])
files.traverse(Task.of, fn => readFile(fn, 'utf-8')) // traverse arguments (Applicative f)
    .fork(console.error, console.log)


// *** traverse expects you to return an applicative functor (most types are applicative functors). 
// In this case Task is an applicative functor and so this all works out. 
// If we pass something that did not have that method which this relies on under the hood, 
// it would blow up on us. Most types are applicative functors.
