// You are given two overlapping rectangles on a plane. 
// For each rectangle, you are given its bottom-left and 
// top-right points. How would you find the area they overlap?

const reactA = [[2, 1], [5, 5]]
const reactB = [[3, 2], [5, 7]]

// won't overlap
const reactC = [[1, 1], [2, 2]]
const reactD = [[2, 2], [5, 5]]

function findOverlappingArea(reactA, reactB) {
    const [[aLeftPos, aBottomPos], [aRightPos, aTopPos]] = reactA
    const [[bLeftPos, bBottomPos], [bRightPos, bTopPos]] = reactB
    
    // calculateWidth
    const overlapLeftPos = Math.max(aLeftPos, bLeftPos)
    const overlapRightPos = Math.min(aRightPos, bRightPos)
    const overlapWidth = overlapRightPos - overlapLeftPos
 
    // calculateLength
    const overlapBottomPos = Math.max(aBottomPos, bBottomPos)
    const overlapTopPos = Math.min(aTopPos, bTopPos)
    const overlapLength = overlapTopPos - overlapBottomPos

    if (overlapWidth <= 0) {
        return false
    }

    return overlapWidth * overlapLength
}

console.log(findOverlappingArea(reactA, reactB)) // 6
console.log(findOverlappingArea(reactC, reactD)) // false
