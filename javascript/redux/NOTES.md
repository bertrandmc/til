### Principles

  1 - The whole state of the app is contained in a single object called the state or state tree.
  2 - The state tree is ready only and changes in the changes must be triggered via an action.
  3 - To describe state mutations you write a function that takes the previous state and the action being dispatched and returns the next state of the app, this function is called the reducer and it must be a pure function.


### Store
The store bindings together the 3 principles of redux:
  - It holds the currently application state. store.getState()
  - It allows you to dispatch actions. store.dispatch()
  - An when you create the store you specify the reducer responsible for state changes.  createStore(reducer)

The 3 most important methods available in the store:
  `store.getState()`:
    Retrieves actual state.

  `store.dispatch(action)`:
    Dispatches an action.

  `store.subscribe(callback)`:
    Allows you to register a callback that will be invoked anytime an action was dispached and some
    part of the state may have changed.


### Combine reducers
Redux combineReducers method expects an object with the following structure:
```
{
  [reducerKeyName]: reducerFunction
}
```

The combineReducers function returns another function that has a reducer signature (with state and action parameters).

Whenever an action dis dispatched, it will invoke all reducers passing the corresponding part of the state (state[key]) and the action itself, the returned value from the specific reducer will be assigned to the reducers respective key in the state.

So if the combine reducers is invoked with the following:
```
{
  todos: todosReducer,
  contacts: contactReducer
}
```

The state will be:
```
{
  todos: ...,
  contacts: ...
}
```

**Combine reducers is a pure function and won't mutate the state.**

A basic implementation of combineReducers would look like this:
```javascript
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  }
}
```
