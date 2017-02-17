
import * as todoActions from './todos';
import * as actionTypes from '../actionsTypes/todos';

describe('TodoActions', () => {

  it('should return correct TODO_ADD action object', () => {
    const todo = {id: 1, title: test};
    const actionObj = todoActions.addTodo(todo);
    const expectReuslt = {
      type: actionTypes.TODO_ADD,
      payload: todo
    }
    expect(actionObj).toEqual(expectReuslt);
  });

  it('should return correct TODO_TOGGLE action object', () => {
    const todo = {id: 1, title: test};
    const actionObj = todoActions.toggleTodo(todo);
    const expectReuslt = {
      type: actionTypes.TODO_TOGGLE,
      payload: todo
    }
    expect(actionObj).toEqual(expectReuslt);
  });
})
