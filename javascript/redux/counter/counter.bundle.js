'use strict';

// import expect from 'expect';
// import { createStore } from 'redux'
// import createStore from './createStore';
// A minimal reimplementation of redux createStore
var createStore = function createStore(reducer) {
  var state = void 0;
  var listeners = [];

  var getState = function getState() {
    return state;
  };
  var dispatch = function dispatch(action) {
    state = reducer(state, action);

    // notify all subscribers
    listeners.forEach(function (listener) {
      return listener();
    });
  };

  var subscribe = function subscribe(listener) {
    listeners.push(listener);

    // return unsubscribe function
    return function () {
      return listeners.filter(function (l) {
        return l !== listener;
      });
    };
  };

  // Immediatelly dispatch an empty action so initial state is set by reducer
  dispatch({});

  return { getState: getState, dispatch: dispatch, subscribe: subscribe };
};

// counter reducer
function counter() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var action = arguments[1];

  switch (action.type) {
    case 'INCREMENT':
      return ++state;
    case 'DECREMENT':
      return --state;
    default:
      return state;
  }
}

/*
  Store
  The store bindings together the 3 principles of redux:
  - It holds the currently application state. store.getState()
  - It allows you to dispatch actions. store.dispatch()
  - An when you create the store you specify the reducer responsible for
    state changes.  createStore(reducer)

    The 3 most important methods available in the store:
    store.getState():
      Retrieves actual state.

    store.dispatch(action):
      Dispatches an action.

    store.subscribe(callback):
      Allows you to register a callback that will be invoked anytime an action was dispached and some
      part of the state may have changed.

*/
const store = createStore(counter);

const Counter = function Counter(_ref) {
  var value = _ref.value,
      onIncrement = _ref.onIncrement,
      onDecrement = _ref.onDecrement;

  return dom(
    'h3',
    null,
    value
  );
};

const render = function render() {
  ReactDOM.render(dom(Counter, { value: store.getState() }), document.getElementById('root'));
};

store.subscribe(render);
render();

// TESTS

expect(counter(0, { type: 'INCREMENT' })).toEqual(1);

expect(counter(1, { type: 'INCREMENT' })).toEqual(2);

expect(counter(2, { type: 'DECREMENT' })).toEqual(1);

expect(counter(1, { type: 'DECREMENT' })).toEqual(0);

// When reducer receives an unknown action it must return the actual state
expect(counter(1, { type: 'UNKWON_ACTION' })).toEqual(1);

// When reducer reveives undefined as state value it must return the initial state
expect(counter(undefined, {})).toEqual(0);

console.log('Tests Passed!');
