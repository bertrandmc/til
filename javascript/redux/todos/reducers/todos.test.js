
import {todos as reducer} from './todos';
import * as actions from '../actions/todos';

describe('Todos Reducer', () => {

  it('should add todo to state', () => {
    const newTodo = {id: 1, title: 'test'};
    const action = actions.addTodo(newTodo);
    const resultState = reducer([], action);
    const expectedState = [newTodo];

    expect(resultState).toEqual(expectedState);
  });

  it('should add todo without mutating state', () => {
    const newTodo = {id: 1, title: 'test'};
    const state = [];

    const action = actions.addTodo(newTodo);
    const resultState = reducer(state, action);

    expect(resultState).not.toBe(state);
  });

  it('should toggle todo.isComplete', () => {
    const todo = {id: 1, title: 'test', isComplete: false};
    const state = [todo];
    const action = actions.toggleTodo(todo);
    const resultState = reducer(state, action);

    expect(resultState[0]).toEqual({...todo, isComplete: true});
  });

  it('should toggle todo.isComplete without mutating state', () => {
    const todo = {id: 1, title: 'test', isComplete: false};
    const state = [todo];
    const action = actions.toggleTodo(todo);
    const resultState = reducer(state, action);

    expect(resultState).not.toBe(state);
  });

  it('should toggle todo.isComplete without mutating todo object', () => {
    const todo = {id: 1, title: 'test', isComplete: false};
    const state = [todo];
    const action = actions.toggleTodo(todo);
    const resultState = reducer(state, action);

    expect(resultState[0]).not.toBe(todo);
  });
})
