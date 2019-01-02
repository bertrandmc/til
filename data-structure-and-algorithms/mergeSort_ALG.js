const assert = require('assert')

// Divides the given array into two halves (left and right)
// calls mergeSort on these sub arrays
// we then continue splitting the arrays until we get arrays of length < 2
// we then start joining the arrays together sorting them in the way up
// this is a efficient algorithms because we start sorting small arrays and 
// when we get to large arrays they are mostly sorted, this saves the need for long loops

// *** This is an efficient algorithm but uses more memory than quick sort.

function mergeSort(array) {
    if (array.length < 2) {
        return array
    }

    const middle = Math.floor(array.length / 2)
    const left = array.slice(0, middle)
    const right = array.slice(middle)

    return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
    const sorted = []

    while (left.length && right.length) {
        if (left[0] < right[0]) {
            sorted.push(left.shift())
        } else {
            sorted.push(right.shift())
        }
    }
    return  [...sorted, ...left, ...right]
}


// tests

assert.deepEqual(mergeSort([10,4,3,2,1]), [1,2,3,4,10])
assert.deepEqual(mergeSort([1,2,3,4,10]), [1,2,3,4,10])

let i = 5000000
console.time("sort")
while(i--) {
    mergeSort([10,4,3,2,1])
}
console.timeEnd("sort")