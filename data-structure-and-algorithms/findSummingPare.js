// Assuming you are given a sorted list of integers
// find the pair that which sum would be equal to given value

const listOK = [4, 2, 3, 4, 1]
const listNotOK = [1, 3, 6, 9]

// O(n)
function findSummingPair(numbersList, sum) {
    // make sure numbersList is sorted otherwise solution won't work
    const sortedList = numbersList.sort((a, b) =>  a - b)

    const first = sortedList[0]
    const last = sortedList[sortedList.length - 1]
    const firstPlusLast = first + last

    if (firstPlusLast > sum) {
        return findSummingPair(
            sortedList.slice(0, -1), // from first item until penult
            sum
        )
    }

    if (firstPlusLast < sum) {
        return findSummingPair(
            sortedList.slice(1), // from second item
            sum
        )
    }

    if (first && last) {
        return [first, last]
    }

    return []
}

console.log(findSummingPair(listOK, 8))
console.log(findSummingPair(listNotOK, 8))

// O(logn)
function findSummingPairUnsorted(numbersList, sum) {
    const ref = new Set()

    for (let number of numbersList) {
        if (ref.has(number)) {
            return [sum - number, number]
        }

        ref.add(sum - number)
    }

    return []
}

console.log(findSummingPairUnsorted(listOK, 8))
console.log(findSummingPairUnsorted(listOK, 7))
console.log(findSummingPairUnsorted(listNotOK, 8))
