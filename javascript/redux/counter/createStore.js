// A minimal reimplementation of redux createStore
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);

    // notify all subscribers
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    // return unsubscribe function
    return () => listeners.filter(l => l !== listener);
  };

  // Immediatelly dispatch an empty action so initial state is set by reducer
  dispatch({});

  return {getState, dispatch, subscribe};
};


export default createStore;
