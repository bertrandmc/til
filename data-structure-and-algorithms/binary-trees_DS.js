const assert = require('assert')

// Binary trees are trees whose nodes can only have two children
// Binary trees have three specific types of traversals: IN_ODER, PRE_ORDER, POST_ODER

const TRAVERSALS = {
    IN_ORDER: (node, visitFn) => {
        if (node !== null) {
            TRAVERSALS.IN_ORDER(node.left, visitFn)
            visitFn(node)
            TRAVERSALS.IN_ORDER(node.right, visitFn)
        }
    },
    PRE_ORDER: (node, visitFn) => {
        if (node !== null) {
            visitFn(node)
            TRAVERSALS.PRE_ORDER(node.left, visitFn)
            TRAVERSALS.PRE_ORDER(node.right, visitFn)
        }
    },
    POST_ORDER: (node, visitFn) => {
        if (node !== null) {
            TRAVERSALS.POST_ORDER(node.left, visitFn)
            TRAVERSALS.POST_ORDER(node.right, visitFn)
            visitFn(node)
        }
    },
}


function createBinaryNode(key) {
    return {
        key, 
        left: null, 
        right: null,
        addLeft(leftKey) {
            this.left = createBinaryNode(leftKey)
            return this.left
        },
        addRight(rightKey) {
            this.right = createBinaryNode(rightKey)
            return this.right
        }
    }
}


function createBinaryTree(rootKey) {
    const root = createBinaryNode(rootKey)

    return {
        root,
        print(traversalType = 'IN_ORDER') {
            let result = ''

            function visitNode(node) {
                result += result.length === 0
                    ? node.key
                    : ` => ${node.key}`
            }

            TRAVERSALS[traversalType](root, visitNode)

            return result
        }
    }
}


// test tree
(function testTree() {
    const tree = createBinaryTree('a')
    const b = tree.root.addLeft('b')
    const c = tree.root.addRight('c')
    const d = b.addLeft('d')
    const e = b.addRight('e')
    const f = c.addLeft('f')
    const g = c.addRight('g')
    const h = d.addLeft('h')
    const i = d.addRight('i')

    assert.equal(tree.print('IN_ORDER'), 'h => d => i => b => e => a => f => c => g')
    assert.equal(tree.print('PRE_ORDER'), 'a => b => d => h => i => e => c => f => g')
    assert.equal(tree.print('POST_ORDER'), 'h => i => d => e => b => f => g => c => a')
})();