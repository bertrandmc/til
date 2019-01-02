const assert = require('assert')

function bubbleSort(array) {
    let sorted = true

    do {
        sorted = false
        array.forEach((actual, index) => {
            if (actual > array[index + 1]) {
                array[index] = array[index + 1]
                array[index + 1] = actual
                sorted = true
            }
        });
    } while (sorted)

    return array
}

// test

assert.deepEqual(bubbleSort([3, 2, 1]), [1, 2, 3])
assert.deepEqual(bubbleSort([10, 50, 0, 3, 2, 1]), [0, 1, 2, 3, 10, 50])