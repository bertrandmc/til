'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var CREATE = 'CREATE';
var REMOVE = 'REMOVE';
var REPLACE = 'REPLACE';
var UPDATE = 'UPDATE';
var SET_PROP = 'SET_PROP';
var REMOVE_PROP = 'REMOVE_PROP';

// DIFF

var changed = function changed(node1, node2) {
  var type1 = typeof node1 === 'undefined' ? 'undefined' : _typeof(node1);
  var type2 = typeof node2 === 'undefined' ? 'undefined' : _typeof(node2);

  return type1 !== type2 || type1 === 'string' && node1 !== node2 || node1.type !== node2.type;
};

var diffChildren = function diffChildren(newNode, oldNode) {
  var patches = [];
  var patchesLength = Math.max(newNode.children.length, oldNode.children.length);

  for (var i = 0; i < patchesLength; i += 1) {
    patches[i] = diff(newNode.children[i], oldNode.children[i]);
  }

  return patches;
};

var diffProps = function diffProps(newNode, oldNode) {
  var patches = [];
  var props = Object.assign({}, newNode.props, oldNode.props);

  return Object.keys(props).map(function (propName) {
    var newValue = newNode.props[propName];
    var oldValue = oldNode.props[propName];

    if (!newValue) {
      return {
        type: REMOVE_PROP,
        propName: propName,
        value: oldValue
      };
    } else if (!oldValue || newValue !== oldValue) {
      return {
        type: SET_PROP,
        propName: propName,
        value: newValue
      };
    }
  });
};

var diff = function diff(newNode, oldNode) {
  if (!oldNode) {
    return { type: CREATE, newNode: newNode };
  }

  if (!newNode) {
    return { type: REMOVE };
  }

  if (changed(newNode, oldNode)) {
    return { type: REPLACE, newNode: newNode };
  }

  if (newNode.type) {
    return {
      type: UPDATE,
      children: diffChildren(newNode, oldNode),
      props: diffProps(newNode, oldNode)
    };
  }
};

var patchProps = function patchProps(elm, propsPatches) {
  console.log(propsPatches);
  propsPatches.forEach(function (patch) {
    var type = patch.type,
        propName = patch.propName,
        value = patch.value;


    if (type === SET_PROP) {
      setProp(elm, propName, value);
    }

    if (type === REMOVE_PROP) {
      removeProp(elm, propName);
    }
  });
};

var patch = function patch(parent, patches) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!patches) return;

  var elm = parent.childNodes[index];

  switch (patches.type) {
    case CREATE:
      {
        var newNode = patches.newNode;

        var newElm = createElement(newNode);
        return parent.appendChild(newElm);
      }
    case REPLACE:
      {
        var _newNode = patches.newNode;

        var _newElm = createElement(_newNode);
        return parent.replaceChild(_newElm, elm);
      }
    case REMOVE:
      return parent.removeChild(elm);
    case UPDATE:
      {
        var children = patches.children,
            props = patches.props;

        patchProps(elm, props);
        return children.forEach(function (childPatches, index) {
          return patch(elm, childPatches, index);
        });
      }
  }
};

// PATCH

var setProps = function setProps(elm, props) {
  Object.keys(props).forEach(function (key) {
    return setProp(elm, key, props[key]);
  });
};

var setProp = function setProp(elm, propName, value) {
  if (propName === 'className') {
    return elm.setAttribute('class', value);
  }

  elm.setAttribute(propName, value);
};

var removeProp = function removeProp(elm, propName) {
  if (propName === 'className') {
    return elm.removeAttribute('class');
  }

  elm.removeAttribute(propName);
};

var createElement = function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  var elm = document.createElement(node.type);

  node.children.forEach(function (child) {
    return elm.appendChild(createElement(child));
  });

  setProps(elm, node.props);

  return elm;
};

// render

var h = function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: props || {},
    children: flatten(children)
  };
};

var view = function view(count) {
  var range = [].concat(_toConsumableArray(Array(count).keys())).reverse();

  return h(
    'ul',
    null,
    range.map(function (n) {
      return h(
        'li',
        { className: 'item-' + n },
        String(n + 1)
      );
    })
  );
};

var tick = function tick(elm, count) {
  var patches = diff(view(count + 1), view(count)); // TODO: cache count instead of recalculating it
  // console.log(count, patches)
  patch(elm, patches);
  if (count > 20) return;
  setTimeout(function () {
    return tick(elm, count + 1);
  }, 500);
};

var render = function render(elm) {
  elm.appendChild(createElement(view(0)));
  tick(elm, 0);
};

// HELPERS

function flatten(arr) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
}
