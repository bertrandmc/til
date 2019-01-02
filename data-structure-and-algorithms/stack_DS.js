const assert = require('assert')

// LIFO
function createStack() {
    const stack = []
    
    return {
        get length() {
            return stack.length
        },
        push(elm) {
            stack.push(elm)
        },
        pop() {
            return stack.pop()
        },
        peek() {
            return stack[stack.length - 1]
        },
        isEmpty() {
            return stack.length === 0
        }
    }
}


module.exports = {
    createStack,
}


// TESTS
const s = createStack()
s.push(1)
assert.equal(s.peek(), 1, 'Pushed first item')
assert.equal(s.isEmpty(), false, 'Stack not empty')

s.push(2)
assert.equal(s.peek(), 2, 'Added second item')
assert.equal(s.length, 2, 'Stack length')
assert.equal(s.pop(), 2, 'Next item removed')
assert.equal(s.peek(), 1, 'Next is first item')
assert.equal(s.pop(), 1, 'Second item removed')
assert.equal(s.isEmpty(), true, 'Stack is empty')