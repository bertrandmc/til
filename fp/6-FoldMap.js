const { Map, List } = require('immutable-ext')
const { Sum } = require('./5-Monoids')


// Lets see the following operation
const res = [Sum(1), Sum(2), Sum(3)]
    .reduce((acc, value) => acc.concat(value), Sum.empty()) // Sum(6)

// it would be the same as 
// const res2 = [Sum(1), Sum(2), Sum(3)].fold(Sum.empty()) 
// but because js arrays has no fold method implemented we use a helper
const res2 = List([Sum(1), Sum(2), Sum(3)]).fold(Sum.empty()) // Sum(6)
// The reason we pass empty to fold is that for cases when the list would be empty, 
// this way folds know what to do and won't blow up.
const res3 = Map({ bema: Sum(5), frisby: Sum(10) }).fold(Sum.empty()) // Sum(15)

// In a real case scenario we wouldn't have monoids all values in the list or object
/// so intead of [Sum(1), Sum(2), Sum(3)] we'd have [1, 2, 3]
// in that case we could
const res4 = List.of(1, 2, 3)
                .map(Sum) // -> we wrap all values in its respective monoid 
                .fold(Sum.empty())

// This is so common operation and so for that we have foldMap
const res5 = List.of(1, 2, 3)
                .foldMap(Sum, Sum.empty()) // Sum(6)
