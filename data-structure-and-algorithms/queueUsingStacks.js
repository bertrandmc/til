function stack() {
    const stack = []

    return {
        push(value) {
            stack.push(value) 
        },
        pop() {
            return stack.pop()   
        },
        peek() {
            return stack[stack.length - 1]
        },
        isEmpty() {
            return stack.length === 0
        },
        get length() {
            return stack.length
        }
    }
}

// O(n)
function queueTwoStacks() {
    const enqueueStack = stack()
    const dequeueStack = stack()

    const dequeue = () => {
        let queueLength = enqueueStack.length
        while(queueLength--) {
            dequeueStack.push(enqueueStack.pop())
        }
    }

    return {
        // O(1)
        add(value) {
            enqueueStack.push(value)
        },
        // 0(1) or O(n)
        remove() {
            if (dequeueStack.isEmpty()) {
                dequeue()
            }

            return dequeueStack.pop()
        },
        // 0(1) or O(n)
        peek() {
            if (dequeueStack.isEmpty()) {
                dequeue()
            }

            return dequeueStack.peek()
        },
        isEmpty() {
            return this.length === 0
        },
        get length() {
            return dequeueStack.length + enqueueStack.length
        }   
    }
}

function queueOneStack() {
    const queue = stack()

    // solution is is actually another stack (AKA call stack)
    // TODO: is there another way?
    const enqueue = (value) => {
        if (queue.isEmpty()) {
            queue.push(value)
        } else {
            const elm = queue.pop()
            enqueue(value)
            queue.push(elm)
        }
    }
    
    return {
        // O(1)
        add(value) {
            enqueue(value)
        },
        // O(n)
        remove() {
            return queue.pop()
        },
        // 0(1) or O(n)
        peek() {
            return queue.peek()
        },
        isEmpty() {
            return this.length === 0
        },
        get length() {
            return queue.length
        }   
    }
}


// const qTwoStack = queueTwoStacks()
// qTwoStack.add(1)
// qTwoStack.add(2)

// console.log('isEmpty', qTwoStack.isEmpty())
// console.log('next will be', qTwoStack.peek())
// console.log('next', qTwoStack.remove())
// console.log('next will be', qTwoStack.peek())
// console.log('next', qTwoStack.remove())
// console.log('isEmpty', qTwoStack.isEmpty())


const qOneStack = queueOneStack()
qOneStack.add(1)
qOneStack.add(2)

console.log('isEmpty', qOneStack.isEmpty())
console.log('next will be', qOneStack.peek())
console.log('next', qOneStack.remove())
console.log('next will be', qOneStack.peek())
console.log('next', qOneStack.remove())
console.log('isEmpty', qOneStack.isEmpty())