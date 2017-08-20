const CREATE = 'CREATE'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
const UPDATE = 'UPDATE'
const SET_PROP = 'SET_PROP'
const REMOVE_PROP = 'REMOVE_PROP'


// DIFF

const changed = (node1, node2) => {
  const type1 = typeof node1
  const type2 = typeof node2

  return type1 !== type2 ||
         type1 === 'string' && node1 !== node2 ||
         node1.type !== node2.type
}

const diffChildren = (newNode, oldNode) => {
  const patches = []
  const patchesLength = Math.max(
    newNode.children.length,
    oldNode.children.length,
  )

  for (let i = 0; i < patchesLength; i+=1) {
    patches[i] = diff(
      newNode.children[i],
      oldNode.children[i]
    )
  }

  return patches
}

const diffProps = (newNode, oldNode) => {
  const patches = []
  const props = Object.assign({}, newNode.props, oldNode.props)

  return Object.keys(props).map(propName => {
    const newValue = newNode.props[propName]
    const oldValue = oldNode.props[propName]

    if (!newValue) {
      return {
        type: REMOVE_PROP,
        propName,
        value: oldValue
      }

    } else if (!oldValue || newValue !== oldValue) {
      return {
        type: SET_PROP,
        propName,
        value: newValue
      }
    }
  })
}

const diff = (newNode, oldNode) => {
  if (!oldNode) {
    return { type: CREATE, newNode }
  }

  if (!newNode) {
    return { type: REMOVE }
  }

  if (changed(newNode, oldNode)) {
    return { type: REPLACE, newNode }
  }

  if (newNode.type) {
    return {
      type: UPDATE,
      children: diffChildren(newNode, oldNode),
      props: diffProps(newNode, oldNode),
    }
  }

}

const patchProps = (elm, propsPatches) => {
  propsPatches.forEach(patch => {
    const { type, propName, value } = patch

    if (type === SET_PROP) {
      return setProp(elm, propName, value)
    }

    if (type === REMOVE_PROP) {
      return removeProp(elm, propName)
    }
  })
}

const patch = (parent, patches, index = 0) => {
  if (!patches) return

  const elm = parent.childNodes[index]

  switch (patches.type) {
    case CREATE: {
      const { newNode } = patches
      const newElm = createElement(newNode)
      return parent.appendChild(newElm)
    }
    case REPLACE: {
      const { newNode } = patches
      const newElm = createElement(newNode)
      return parent.replaceChild(newElm, elm)
    }
    case REMOVE:
      return parent.removeChild(elm)
    case UPDATE: {
      const { children, props } = patches
      patchProps(elm, props)
      return children.forEach((childPatches, index) => (
        patch(elm, childPatches, index)
      ))
    }
  }
}

// PATCH

const setProps = (elm, props) => {
  Object.keys(props).forEach(key =>
    setProp(elm, key, props[key])
  )
}

const setProp = (elm, propName, value) => {
  if (propName === 'className') {
    return elm.setAttribute('class', value)
  }

  elm.setAttribute(propName, value)
}

const removeProp = (elm, propName) => {
  if (propName === 'className') {
    return elm.removeAttribute('class')
  }

  elm.removeAttribute(propName)
}

const createElement = (node) => {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }

  const elm = document.createElement(node.type)

  node.children.forEach(child =>
    elm.appendChild(createElement(child))
  )

  setProps(elm, node.props)

  return elm
}


// render

const h = (type, props, ...children) => {
  return {
    type,
    props: props || {},
    children: flatten(children)
  }
}

const view = (count) => {
  const range = [...Array(count).keys()].reverse()

  return (
    <ul>
      {range.map(n => <li className={`item-${n}`}>{String(n + 1)}</li>)}
    </ul>
  )
}

const tick = (elm, count) => {
  const patches = diff(view(count + 1), view(count)) // TODO: cache count instead of recalculating it
  patch(elm, patches)
  if (count > 20) return
  setTimeout(() => tick(elm, count + 1), 500)
}

const render = (elm) => {
  elm.appendChild(createElement(view(0)))
  tick(elm, 0)
}


// HELPERS

function flatten(arr) {
  return [].concat(...arr)
}
