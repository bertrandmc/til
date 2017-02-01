import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {TodoApp} from './TodoApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TodoApp />, div);
});

it('should handle new todo changes', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);

  const mockEvent = {
    preventDefault: jest.fn(),
    target: {value:'test'}
  };

  component.handleNewTodoChange(mockEvent);

  expect(component.state.newTodo).toEqual(mockEvent.target.value);
});

it('should invoke event.preventDefault when saveNewTodo', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);

  const spy = jest.fn();
  const mockEvent = {
    preventDefault: spy,
    target: {value:'test'}
  };

  component.saveNewTodo(mockEvent);

  expect(spy).toHaveBeenCalled();
});

it('should add new todo to todo list', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);

  const spy = jest.fn();
  const mockEvent = {preventDefault: spy};
  const expectedTodo = {id: 1, name: 'test', isComplete: false};

  component.setState({todos: [], newTodo: 'test'});
  component.saveNewTodo(mockEvent);

  expect(component.state.todos.length).toEqual(1);
  expect(component.state.todos[0]).toEqual(expectedTodo);
});

it('should not mutate todo list when adding a new todo', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);

  const oldTodos = [];
  const spy = jest.fn();
  const mockEvent = {preventDefault: spy};
  const expectedTodo = {id: 1, name: 'test', isComplete: false};

  component.setState({todos: oldTodos, newTodo: 'test'});
  component.saveNewTodo(mockEvent);

  expect(component.state.todos).not.toBe(oldTodos);
});

it('should not add a new todo when todo name is empty', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);

  const oldTodos = [];
  const spy = jest.fn();
  const mockEvent = {preventDefault: spy};
  const expectedTodo = {id: 1, name: 'test', isComplete: false};

  component.setState({todos: oldTodos, newTodo: ''});
  component.saveNewTodo(mockEvent);

  expect(component.state.todos.length).toEqual(1);
});

it('should invoke preventDefault when handling empty todo', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);
  const mockEvent = {preventDefault: jest.fn()};

  component.handleEmptyTodo(mockEvent);

  expect(mockEvent.preventDefault).toHaveBeenCalled();
});

it('should toggle the isComplete prop of a todo', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);
  const todos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];

  const expectedTodos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it fast!", isComplete: true}
  ];

  component.setState({todos: todos, newTodo: ''});
  component.updateTodo(expectedTodos[2]);

  expect(component.state.todos).toEqual(expectedTodos);
});

it('should remove a todo', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);
  const todos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];

  const expectedTodos = [
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];

  component.setState({todos: todos, newTodo: ''});
  component.removeTodo(todos[0]);

  expect(component.state.todos).toEqual(expectedTodos);
});

it('should not mutate todos array when removing a todo', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);
  const todos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];
  const expectedTodos = [
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];

  component.setState({todos: todos, newTodo: ''});
  component.removeTodo(todos[0]);

  expect(component.state.todos).not.toBe(expectedTodos);
});

it('shoull return complete todos', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);
  const todos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];
  const expectedTodos = [
    {id: 2, name: "Build App", isComplete: true}
  ];

  expect(component.filterTodos(todos, '/complete')).toEqual(expectedTodos);
});

it('shoull return non-complete todos', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);
  const todos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];
  const expectedTodos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 3, name: "Ship it!", isComplete: false}
  ];

  expect(component.filterTodos(todos, '/active')).toEqual(expectedTodos);
});

it('shoull return all todos', () => {
  const component = TestUtils.renderIntoDocument(<TodoApp />);
  const todos = [
    {id: 1, name: "Learn", isComplete: false},
    {id: 2, name: "Build App", isComplete: true},
    {id: 3, name: "Ship it!", isComplete: false}
  ];

  expect(component.filterTodos(todos, '/')).toEqual(todos);
});
