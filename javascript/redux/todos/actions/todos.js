import * as actionTypes from '../actionsTypes/todos';


export const addTodo = (newTodo) => ({type: actionTypes.TODO_ADD, payload: newTodo});
export const toggleTodo = (todo) => ({type: actionTypes.TODO_TOGGLE, payload: todo});
