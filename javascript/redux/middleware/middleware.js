// Notes on How Redux Middlewares Works

/*
  The purpose of middlwares is to replace the single dispatch function with
  a chain of composable dispatch functions, which each can do something with an action.
*/

import { createStore } from 'redux';

/*
  Silly logging middleware
  A middleware function has a specific signature and is just a curried function.
  The first invocation expects the store as argument, this function returns another function
  which expects the next middleware that will be invoked or the original store.dispatch,
  it then returns another function that expects the action to be dispatched as argument.

  " currying is the technique of translating the evaluation of a function that takes multiple
  arguments (or a tuple of arguments) into evaluating a sequence of functions, each with a single argument"
*/

const loggerMiddleware = (store) => (next) => (action) => { //currying
  console.log(`Action Dispatched: ${action.type}`);
  next(action);
};

/*
  Implement promises support in actions dispatchers
*/
const promiseSupport = (store) => (next) => (action) => { // currying
  if(typeof action.then === 'function') {
    return action.then(next);
  }
  return next(action);
}

const wrapDispatchWithMiddlewares = (store, middlewares) => {
  // reverse to apply middlewares from left to right
  middlewares.slice().reverse().forEach(middleware =>
    store.dispatch = middleware(store)(store.dispatch)
  )
}

const configureStore = () => {
  const store = createStore({});
  const middlewares = [promiseSupport]; // add middleware

  if(process.env.NODE_ENV !== 'production') {
    middlewares.push(loggerMiddleware); // add middleware
  }

  wrapDispatchWithMiddlewares(store, middlewares);
  /*
    After wrapping dispatch we have the following chain of fuunctions that will be called:

    promiseSupport -> next ->
      loggerMiddleware -> next ->
        store.dispatch

    Inside promiseSupport the next() call points to loggerMiddleware, and inside it the next() call
    points to store.dispatch
    

  */

  return store;
}


export default configureStore;
