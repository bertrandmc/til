const assert = require('assert')

// FIFO
function createQueue() {
    const queue = [];
    
    return {
        get length() {
            return queue.length
        },
        add(elm) {
            queue.push(elm)
        },
        remove() {
            return queue.shift()
        },
        peek() {
            return queue[0]
        },
        isEmpty() {
            return queue.length === 0
        }
    }
}

module.exports = {
    createQueue,
}

// TESTS

const q = createQueue()
q.add(1)
assert.equal(q.peek(), 1, 'Added first item')
assert.equal(q.isEmpty(), false, 'Queue not empty')

q.add(2)
assert.equal(q.length, 2, 'Queue length')
assert.equal(q.remove(), 1, 'First item removed')
assert.equal(q.peek(), 2, 'Next is second item')
assert.equal(q.remove(), 2, 'Second item removed')
assert.equal(q.isEmpty(), true, 'Queue is empty')
