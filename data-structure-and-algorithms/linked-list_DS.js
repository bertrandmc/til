const assert = require('assert')

function createNode(value) {
    return { value, next: null }
}

function createLinkedList() {
    return {
        head: null,
        tail: null,
        length: 0,
        push(value) {
            const node = createNode(value)

            if (this.head === null) {
                this.head = node
                this.tail = node
                this.length++
                return node
            }

            this.tail.next = node
            this.tail = node
            this.length++
            return node
        },
        get(index) {
            if (index < 0 || index >= list.length) {
                return null
            }

            if (index === 0) {
                return this.head.value
            }

            let current = this.head
            let i = 0

            while (i < index) {
                current = current.next
                i++
            }

            return current.value
        },
        pop() {
            if (this.isEmpty()) {
                return null
            }

            const node = this.tail

            if (this.head === this.tail) {
                this.head = null
                this.tail = null
                this.length--
                return node.value
            }

            let current = this.head
            let penultimate

            while (current) {
                if (current.next === this.tail) {
                    penultimate = current
                    break
                }

                current = current.next
            }

            penultimate.next = null
            this.tail = penultimate
            this.length--
            return node.value
        },
        delete(index) {
            if (index < 0 || index >= list.length) {
                return null
            }

            if (index === 0) {
                const deleted = this.head
                this.head = this.head.next
                this.length--
                return deleted.value
            }

            let current = this.head
            let previous
            let i = 0

            while (i < index) {
                previous = current
                current = current.next
                i++
            }

            previous.next = current.next

            if (previous.next === null) {
                this.tail = previous
            }

            this.length--
            return current.value
        },
        isEmpty() {
            return this.length === 0
        },
        print() {
            console.log('List', this.getValuesList().join(' ==> '))
        },
        getValuesList() {
            const values = []
            let current = this.head
            let i = 0
            
            while (i < this.length) {
                values.push(current.value)
                current = current.next
                i++
            }

            return values
        }
    }
}

function createTestList() {
    const list = createLinkedList()
    const values = ['a', 'b', 'c']
    values.forEach(v => list.push(v))
    return list
}

let list
// test push
list = createTestList()
assert.deepEqual(list.getValuesList(), ['a', 'b', 'c'])
assert.equal(list.length, 3)

// test get
list = createTestList()
assert.equal(list.get(0), 'a')
assert.equal(list.get(1), 'b')
assert.equal(list.get(2), 'c')
assert.equal(list.get(3), null)
assert.equal(list.get(-1), null)

// test pop
list = createTestList()
assert.equal(list.pop(), 'c')
assert.equal(list.length, 2)
assert.equal(list.pop(), 'b')
assert.equal(list.length, 1)
assert.equal(list.pop(), 'a')

// test delete
list = createTestList()
assert.equal(list.delete(1), 'b')
assert.deepEqual(list.getValuesList(1), ['a', 'c'])
assert.equal(list.length, 2)
assert.equal(list.delete(0), 'a')
assert.deepEqual(list.getValuesList(1), ['c'])
assert.equal(list.length, 1)
assert.equal(list.delete(0), 'c')
assert.equal(list.length, 0)

// test isEmpty
list = createTestList()
assert.equal(list.isEmpty(), false)
list.delete(0)
assert.equal(list.isEmpty(), false)
list.delete(0)
assert.equal(list.isEmpty(), false)
list.delete(0)
assert(list.isEmpty())
