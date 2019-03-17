// Given an array of integers where each element points to the  
// index of the next element how would you detect if there is a cycle in this array?
// [2, 6, 4, 0, 3] => 0(2) => 2(4) => 4(3) => 3(0) => 0 => true
// [2, 4, 3, 1] => 0(2) => 2(3) => 3(1) => 1(4) => false

const hasCycle = [2, 6, 4, 0, 3]
const noCycle = [2, 1, 3, 1]

// O(n)
function findCycle(array, index = 0) {
    const length = array.length
    let slow = array[index]
    let fast = array[array[index]]
    let result = undefined
    
    while (result === undefined) {
        if (slow < 0 || fast < 0 || slow >= length || fast >= length) {
            result = false
        }

        if (slow === fast) {
            result = true
        }

        slow = array[slow]
        fast = array[array[fast]]
    }

    return result
}

console.log(findCycle([2, 6, 4, 0, 3])) // true
console.log(findCycle([2, 4, 3, 1])) // false
