const assert = require('assert')
const { createQueue } = require('./queue_DS')

function createPriorityQueue() {
    const lowPriorityQueue = createQueue()
    const hightPriorityQueue = createQueue()

    return {
        get length() {
            return hightPriorityQueue.length + lowPriorityQueue.length
        },
        add(elm, isHightPriority) {
            isHightPriority 
                ? hightPriorityQueue.add(elm)
                : lowPriorityQueue.add(elm)
        },
        remove() {
            if (hightPriorityQueue.isEmpty()) {
                return lowPriorityQueue.remove()
            }
            
            return hightPriorityQueue.remove()
        },
        peek() {
            if (hightPriorityQueue.isEmpty()) {
                return lowPriorityQueue.peek()
            }
            
            return hightPriorityQueue.peek()
        },
        isEmpty() {
            return hightPriorityQueue.isEmpty() && lowPriorityQueue.isEmpty()
        }
    }
}

module.exports = {
    createPriorityQueue,
}


// TESTS

const q = createPriorityQueue()
q.add(1)
assert.equal(q.peek(), 1, 'Added first item')
assert.equal(q.isEmpty(), false, 'Queue not empty')

q.add(2, true)
assert.equal(q.peek(), 2, 'Added priority item')
assert.equal(q.isEmpty(), false, 'Queue not empty')
assert.equal(q.length, 2, 'Queue has two items')

q.add(3)
assert.equal(q.peek(), 2, 'Item 2 still priority item')
assert.equal(q.length, 3, 'Queue has two items')
assert.equal(q.remove(), 2, 'Priority item 2 removed')
assert.equal(q.peek(), 1, 'Next is first item')
assert.equal(q.remove(), 1, 'First item removed')
assert.equal(q.remove(), 3, 'Last item removed')
assert.equal(q.isEmpty(), true, 'Queue is empty')