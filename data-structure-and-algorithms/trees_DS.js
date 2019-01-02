const assert = require('assert')

// Trees are graphs without cycles
// A cycle is three or more nodes connected in a circuitous path 
// Graphs have neighbors and they are not hierarchical
// Trees have children and they are hierarchical 
// Each node can contain many children. Node children may have an edge between them, 
// and they may not be connected to any other parent node.


function createNode(key) {
    const children = []

    return {
        key,
        children,
        addChild(childKey) {
            const child = createNode(childKey)
            children.push(child)
            return child
        }
    }
}

function createTree(rootKey) {
    const root = createNode(rootKey)

    return {
        root,
        print() {
            let result = ''
            
            function traverse(node, visitFn, depth) {
                visitFn(node, depth)
                
                node.children.forEach(child => {
                    traverse(child, visitFn, depth + 1)
                })
            }

            function addKeyToResult(node, depth) {
                result += result.length === 0
                    ? node.key
                    : `\n${'  '.repeat(depth)}${node.key}`
            }

            traverse(root, addKeyToResult, 1)

            return result
        }
    }
}


// test Tree

(function testTree() {
    const dom = createTree('html')
    const head = dom.root.addChild('head')
    const body = dom.root.addChild('body')
    const title = head.addChild('title - Page title')
    const header = body.addChild('header')
    const main = body.addChild('body')
    const foot = body.addChild('footer')
    const h1 = header.addChild('h1 - Tree lesson')
    const p = main.addChild('p - building a tree')
    const copyright = foot.addChild('Copyright')

    assert.equal(dom.print(), `html
    head
      title - Page title
    body
      header
        h1 - Tree lesson
      body
        p - building a tree
      footer
        Copyright`
    )
})();