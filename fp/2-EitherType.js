// Either represents a value of one of two possible types (a disjoint union.) 
// Instances of Either are either an instance of Left or Right.

// Right is used when there is value, so mapped functions will be invoked
// When folding it invokes the right provided function g
const Right = value => ({
    map: f => Right(f(value)),
    fold: (f, g) => g(value),
    inspect: () => `Right(${value})`
})

// Left is used when there is NO value, so mapped functions will NOT be invoked
// When folding it invokes the left provided function f
const Left = value => ({
    map: f => Left(value),
    fold: (f, g) => f(value),
    inspect: () => `Left(${value})`
})

const fromNullable = value => (
    value != null ? Right(value) : Left(null) // value != null also captures undefined
)

// code example

// imperative
function getUsername() {
    const user = getUser()
    if (user) {
        return user.name
    } else {
        return 'user not found'
    }
}

// functional
function getUsername() {
    fromNullable(getUser())
        .map(user => user.name)
        .fold(err => 'user not found', name => name)
}