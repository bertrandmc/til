import React from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';


// A minimal reimplementation of redux createStore
// import createStore from './createStore';
// import combineReducers from './combineReducers';
import {createStore, combineReducers} from 'redux';


// counter reducer
function counter(state = 0, action) {
  switch(action.type) {
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

const Counter = ({value, onIncrement, onDecrement}) => {
  return (
    <span>
      <h3>{value}</h3>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </span>
  );
};

const onIncrement = () => store.dispatch({type: 'INCREMENT'})
const onDecrement = () => store.dispatch({type: 'DECREMENT'})

const render = () => {
  ReactDOM.render(
    <Counter value={store.getState()}  onIncrement={onIncrement} onDecrement={onDecrement}/>,
    document.getElementById('root')
  )
};

store.subscribe(render);
render();


// TESTS

expect(
  counter(0, {type: 'INCREMENT'})
).toEqual(1);

expect(
  counter(1, {type: 'INCREMENT'})
).toEqual(2);

expect(
  counter(2, {type: 'DECREMENT'})
).toEqual(1);

expect(
  counter(1, {type: 'DECREMENT'})
).toEqual(0);

// When reducer receives an unknown action
// it must return the actual state
expect(
  counter(1, {type: 'UNKWON_ACTION'})
).toEqual(1);

// When reducer reveives undefined as state value
// it must return the initial state
expect(
  counter(undefined, {})
).toEqual(0);

console.log('Tests Passed!');
