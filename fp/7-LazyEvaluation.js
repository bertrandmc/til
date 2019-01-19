
const LazyBox = g => ({
    fold: f => f(g()),
    map: f => LazyBox(() => f(g())),
})

const result = LazyBox(() => ' Hello ')
                    .map(() => ' World ')
                    .map(s => {
                        console.log('From inside')
                        return s;
                    })
                    .map(s => s.trim())

// result won't evaluate until we call fold
console.log('From outside')
result.fold(s => s)

// logs
// From outside 
// From inside

/**
 * This gives us purity by virtue of laziness. Basically, nothing happens, 
 * so we don't have any impure side effects, until the very end, when we call fold. 
 * We're pushing it all the way down to the bottom. 
 * 
 * 
 * This is how a variety of types define map, where they have a function inside them 
 * instead of a concrete value, such as promises, observables, or streams, things like this.
 */
