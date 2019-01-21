// Example 1
const add = (x, y) => x + y
const increment = x => add(x, 1)

const curriedAdd = x => y => x + y
const curriendIncrement = curriedAdd(1)

console.log(curriendIncrement(1)) // 2

// Example 2

// const moduleCalc = (dvd, dvr) => dvd % dvr
// const isOdd = nbr => moduleCalc(nbr, 2) // 1 true, 0 false

// curried
const moduleCalc = dvr => dvd => dvd % dvr
const isOdd = moduleCalc(2)

console.log(isOdd(1)) // 1
console.log(isOdd(2)) // 0

const filter = pred => xs  => xs.filter(pred)
const getAllOdds = filter(isOdd)

console.log(getAllOdds([1,2,3])) // [1,3]

// Example 3
const replace = regex => repl => str => str.replace(regex, repl)
const censor = replace(/[aeiou]/ig)('*')

console.log(censor('hello world'))  // h*ll* w*rld

const map = f => xs => xs.map(f)
const censorAll = map(censor)

console.log(censorAll(['hello', 'world'])) // [ 'h*ll*', 'w*rld' ]