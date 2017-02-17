import update from 'react-addons-update';
import findIndex from 'lodash/findIndex';
import * as actionTypes from '../actionsTypes/todos';

function newTodo(state, action) {
  return [
    ...state,
    action.payload
  ]
}

function toggleTodo(state, action) {
  return state.map(todo => {
    if(todo.id === action.payload.id) {
      return update(todo, {isComplete: {$set: !todo.isComplete}})
    }

    return todo;
  })
}

// todos reducer
export const todos = (state = [], action) => {
  switch(action.type) {
    case actionTypes.TODO_ADD:
      return newTodo(state, action);
    case actionTypes.TODO_TOGGLE:
      return toggleTodo(state, action);

    default:
      return state;
  }
}
