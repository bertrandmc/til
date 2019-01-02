const assert = require('assert')
const { createQueue } = require('./queue_DS')

// A graph is a collection of items connected by edges. 
// Each item is called a node or vertex.

// A graph data structure consists of a finite (and possibly mutable) set of vertices or nodes or points, 
// together with a set of unordered pairs of these vertices for an undirected graph or a set of ordered pairs 
// for a directed graph. These pairs are known as edges, arcs, or lines for an undirected graph and as arrows, 
// directed edges, directed arcs, or directed lines for a directed graph. The vertices may be part of the 
// graph structure, or may be external entities represented by integer indices or references.
// A graph data structure may also associate to each edge some edge value, such as a symbolic label or a 
// numeric attribute (cost, capacity, length, etc.). 


// In order for two nodes to have symmetric edges they both must point to each other
// In an undirected graph we assume the symmetry of edges

function createNode(key) {
    const neighbors = []

    return {
        key,
        neighbors,
        addNeighbor(node) {
            neighbors.push(node)
        }
    }
}

function createGraph(directed = false) {
    const nodes = []
    const edges = []
    
    return {
        directed,
        nodes, 
        edges,
        addNode(key) {
            nodes.push(createNode(key))
        },
        getNode(key) {
            return nodes.find(node => node.key === key)
        }, 
        addEdge(node1Key, node2Key) {
            const node1 = this.getNode(node1Key)
            const node2 = this.getNode(node2Key)

            node1.addNeighbor(node2)
            edges.push(`${node1Key}-${node2Key}`)

            if (!this.directed) {
                node2.addNeighbor(node1)
            }
        }, 
        print() {
            return nodes.map(({ key, neighbors }) => {
                let result = key

                if (neighbors.length) {
                    result += ` => ${neighbors.map(neighbor => neighbor.key).join(' ')}`
                }

                return result
            }).join('\n')
        },
        breadthFirstSearch(startingNodeKey, visitFn) {
            // Breadth First Search Algorithm
            // It starts in a node and visits all neighbors before going deeper into the tree
            // It uses a queue data structure to keep track of which node to visit

            const firstNode = this.getNode(startingNodeKey)

            // create visited flag for all nodes
            const visited = nodes.reduce((acc, node) => ({
                ...acc,
                [node.key]: false,
            }), {})

            // queue used to keep track of nodes to be visited
            const queue = createQueue()
            queue.add(firstNode)

            while (!queue.isEmpty()) {
                const currentNode = queue.remove()

                if (!visited[currentNode.key]) {
                    visitFn(currentNode)
                    visited[currentNode.key] = true
                    
                    currentNode.neighbors.forEach(neighbor => {
                        if (!visited[neighbor.key]) {
                            queue.add(neighbor)
                        }
                    })
                }
            }
        },
        depthFirstSearch(startingNodeKey, visitFn) {
            const startingNode = this.getNode(startingNodeKey)

            // create visited flag for all nodes
            const visited = nodes.reduce((acc, node) => ({
                ...acc,
                [node.key]: false,
            }), {})

            function exploreNode(node) {
                if (visited[node.key]) {
                    return
                }

                visitFn(node)
                visited[node.key] = true

                node.neighbors.forEach(exploreNode)
            }

            exploreNode(startingNode)
        }
    }
}


// tests

(function testGraph() {
    // test addNode
    const graph = createGraph(true)
    graph.addNode('A')
    graph.addNode('B')
    graph.addNode('C')
    assert.deepEqual(graph.nodes.map(node => node.key), ['A', 'B', 'C'])

    // test getNode
    assert((() => {
        const node = graph.getNode('A')
        return node.key === 'A' && node.neighbors.length === 0
    })())

    assert((() => {
        const node = graph.getNode('B')
        return node.key === 'B' && node.neighbors.length === 0
    })())

    assert((() => {
        const node = graph.getNode('C')
        return node.key === 'C' && node.neighbors.length === 0
    })())

    // test add edges
    graph.addEdge('A', 'B')
    graph.addEdge('A', 'C')
    assert.deepEqual(graph.getNode('A').neighbors, [graph.getNode('B'), graph.getNode('C')])

    graph.addEdge('B', 'C')
    graph.addEdge('B', 'A')
    assert.deepEqual(graph.getNode('B').neighbors, [graph.getNode('C'), graph.getNode('A')])

    graph.addEdge('C', 'A')
    graph.addEdge('C', 'B')
    assert.deepEqual(graph.getNode('C').neighbors, [graph.getNode('A'), graph.getNode('B')])

    assert.deepEqual(graph.edges, [ 'A-B', 'A-C', 'B-C', 'B-A', 'C-A', 'C-B' ], 'All edges created')
})();


// test Breadth

(function testBreadthFirstSearch() {
    const graph = createGraph(true)
    const nodes = ['a', 'b', 'c', 'd', 'e', 'f']
    const edges = [
        ['a', 'b'],
        ['a', 'e'],
        ['a', 'f'],
        ['b', 'd'],
        ['b', 'e'],
        ['c', 'b'],
        ['d', 'c'],
        ['d', 'e']
    ]

    /**
     * A  -> B  -> C
     * |  \  |  \
     * F     E     D
     */

    nodes.forEach(node => graph.addNode(node))
    edges.forEach(nodes => graph.addEdge(...nodes))

    let result = ''
    graph.breadthFirstSearch('a', node => {
        result += `${node.key}`
    })

    // result prints first node a neighbors before moving to node b
    assert.equal(result, 'abefdc')
})();

// test Depth

(function testDepthFirstSearch() {
    const graph = createGraph(true)
    const nodes = ['a', 'b', 'c', 'd', 'e', 'f']
    const edges = [
        ['a', 'b'],
        ['a', 'e'],
        ['a', 'f'],
        ['b', 'd'],
        ['b', 'e'],
        ['c', 'b'],
        ['d', 'c'],
        ['d', 'e']
    ]

    nodes.forEach(node => graph.addNode(node))
    edges.forEach(nodes => graph.addEdge(...nodes))

    let result = ''
    graph.depthFirstSearch('a', node => {
        result += `${node.key}`
    })

    // result prints first node a neighbors before moving to node b
    assert.equal(result, 'abdcef')
})();