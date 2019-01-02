const assert = require('assert')

// Quick sort is a recursive sorting algorithm 
// We break the original array into smaller arrays and sort them
// quick sort uses the concept of a "pivot", where we pick one item 
// of the array (it can be anything, head, tail or somewhere in the array-- as long as it is consistent) 
// and then compare each item to that pivot. If less we push to left array, if more we push to right
// finally we merge left and right together


// *** This is an efficient algorithm and uses less memory than merge sort.
// O(n2) worst-case runtime and O(nlogn) average case runtime
// The average case performance for quicksort is faster than mergesort. 
// But this is only true when assuming constant time to access any piece of memory on demand.
// In RAM this assumption is generally not too bad (it is not always true because of caches, 
// but it is not too bad). However if your data structure is big enough to live on disk, 
// then quicksort gets killed by the fact that your average disk does something like 200 
// random seeks per second. But that same disk has no trouble reading or writing megabytes 
// per second of data sequentially. Which is exactly what mergesort does.


function quickSort(array) {
    if (array.length < 2) {
        return array
    }

    const pivotIndex = array.length - 1
    const pivot = array[pivotIndex]
    const left = []
    const right = []

    for (let i = 0; i < pivotIndex; i += 1) {
        const currentItem = array[i]

        currentItem < pivot
            ? left.push(currentItem)
            : right.push(currentItem)
    }

    return [
        ...quickSort(left), 
        pivot, 
        ...quickSort(right)
    ]
}

// tests

assert.deepEqual(quickSort([10,4,3,2,1]), [1,2,3,4,10])
assert.deepEqual(quickSort([1,2,3,4,10]), [1,2,3,4,10])

let i = 5000000
console.time("sort")
while(i--) {
    quickSort([10,4,3,2,1])
}
console.timeEnd("sort")