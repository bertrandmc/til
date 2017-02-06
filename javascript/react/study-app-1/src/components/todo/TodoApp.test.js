import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {TodoApp} from './TodoApp';

describe('TodoApp', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoApp />, div);
  });

  it('should create a new todo object and add it to todos state', () => {
    const component = TestUtils.renderIntoDocument(<TodoApp />);
    expect(component.state.todos.length).toEqual(0);
    component.createTodo();
    expect(component.state.todos.length).toEqual(1);
  });

  it('should not mutate todo list when creating new todo', () => {
    const component = TestUtils.renderIntoDocument(<TodoApp />);

    const oldTodos = [];
    const spy = jest.fn();
    const mockEvent = {preventDefault: spy};
    const expectedTodo = {id: 1, name: 'test', isComplete: false};

    component.setState({todos: oldTodos});
    component.createTodo();

    expect(component.state.todos).not.toBe(oldTodos);
  });

  it('should save todo changes', () => {
    const component = TestUtils.renderIntoDocument(<TodoApp />);
    const todo = {id: 123, title: '', isEditing: true, isComplete: false}
    const updatedTodo = {...todo, isComplete: true};

    component.setState({todos: [todo]});
    component.saveTodo(updatedTodo);

    expect(component.state.todos[0]).toEqual(updatedTodo);
  });

  it('should not mutate todo list and todo object when saving todo changes', () => {
    const component = TestUtils.renderIntoDocument(<TodoApp />);
    const todo = {id: 123, title: '', isEditing: true, isComplete: false}
    const updatedTodo = {...todo, isComplete: true};
    const previousTodoState = component.state.todos;

    component.setState({todos: [todo]});
    component.saveTodo(updatedTodo);

    expect(component.state.todos).not.toBe(previousTodoState);
    expect(component.state.todos[0]).not.toBe(todo);
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

  it('should invoke persistTodos with todos list when componentWillUpdate', () => {
    const component = TestUtils.renderIntoDocument(<TodoApp />);
    const nextProps = {};
    const nextState = {todos: [1,2,3]};

    component.state.todos = [];
    component.persistTodos = jest.fn();
    component.componentWillUpdate(nextProps, nextState);

    expect(component.persistTodos).toHaveBeenCalledWith(nextState.todos);
  });

  it('should invoke context.storage.saveItem with appropriate props when persistTodos is invoked', () => {
    const component = TestUtils.renderIntoDocument(<TodoApp />);
    const todos = [
      {id: 1, name: "Learn", isComplete: false},
      {id: 2, name: "Build App", isComplete: true},
      {id: 3, name: "Ship it!", isComplete: false}
    ];
    component.context.storage = {saveItem: jest.fn()};
    component.persistTodos(todos)

    expect(component.context.storage.saveItem).toHaveBeenCalledWith('todos', todos);
  });

});
