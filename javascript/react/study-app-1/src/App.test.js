import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('should handle new todo changes', () => {
  const component = TestUtils.renderIntoDocument(<App />);

  const mockEvent = {
    preventDefault: jest.fn(),
    target: {value:'test'}
  };

  component.handleNewTodoChange(mockEvent);

  expect(component.state.newTodo).toEqual(mockEvent.target.value);
});

it('should invoke event.preventDefault when saveNewTodo', () => {
  const component = TestUtils.renderIntoDocument(<App />);

  const spy = jest.fn();
  const mockEvent = {
    preventDefault: spy,
    target: {value:'test'}
  };

  component.saveNewTodo(mockEvent);

  expect(spy).toHaveBeenCalled();
});

it('should add new todo to todo list', () => {
  const component = TestUtils.renderIntoDocument(<App />);

  const spy = jest.fn();
  const mockEvent = {preventDefault: spy};
  const expectedTodo = {id: 1, name: 'test', isComplete: false};

  component.setState({todos: [], newTodo: 'test'});
  component.saveNewTodo(mockEvent);

  expect(component.state.todos.length).toEqual(1);
  expect(component.state.todos[0]).toEqual(expectedTodo);
});

it('should not mutate todo list when adding a new todo', () => {
  const component = TestUtils.renderIntoDocument(<App />);

  const oldTodos = [];
  const spy = jest.fn();
  const mockEvent = {preventDefault: spy};
  const expectedTodo = {id: 1, name: 'test', isComplete: false};

  component.setState({todos: oldTodos, newTodo: 'test'});
  component.saveNewTodo(mockEvent);

  expect(component.state.todos).not.toBe(oldTodos);
});

it('should not add a new todo when todo name is empty', () => {
  const component = TestUtils.renderIntoDocument(<App />);

  const oldTodos = [];
  const spy = jest.fn();
  const mockEvent = {preventDefault: spy};
  const expectedTodo = {id: 1, name: 'test', isComplete: false};

  component.setState({todos: oldTodos, newTodo: ''});
  component.saveNewTodo(mockEvent);

  expect(component.state.todos.length).toEqual(1);
});

it('should invoke preventDefault when handling empty todo', () => {
  const component = TestUtils.renderIntoDocument(<App />);
  const mockEvent = {preventDefault: jest.fn()};

  component.handleEmptyTodo(mockEvent);

  expect(mockEvent.preventDefault).toHaveBeenCalled();
});

it('should toggle the isComplete prop of a todo', () => {
  const component = TestUtils.renderIntoDocument(<App />);
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
