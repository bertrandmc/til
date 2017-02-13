
/*
  Reimplementation of Redux combineReducers method

  The method expects an object with the following structure:
    {
      [reducerKeyName]: reducerFunction
    }


  The combineReducers function returns another function that has a reducer signature (with state and action parameters).

  Whenever an action dis dispatched, it will invoke all reducers passing the corresponding part of the state (state[key])
  and the action itself, the returned value from the specific reducer will be assigned to the reducers respective key in the state.


  So if the combine reducers is invoked with the following:

    {todos: todosReducer, contacts: contactReducer}

 The state will be:
  {
    todos: ...,
    contacts: ...
  }

  *** Combine reducers is a pure function and won't mutate the state.
*/


const combineReducers = (reducers) => {
  return (state = {}, action) => {
    Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  }
}
