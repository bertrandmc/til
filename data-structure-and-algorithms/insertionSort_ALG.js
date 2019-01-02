const assert = require('assert')

// uses nested loop
function insertionSort(array) {
    for (let i = 1; i < array.length; i+= 1) {
        for (let j = 0; j < i; j += 1) {
            if (array[i] < array[j]) {
                const [item] = array.splice(i, 1)
                array.splice(j, 0, item)
            }
        }
    }

    return array
}


// tests

assert.deepEqual(insertionSort([10,4,3,2,1]), [1,2,3,4,10])