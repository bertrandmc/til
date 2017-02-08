import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {TodoList} from './TodoList';

describe('TodoList', () => {
  let mockedProps;

  beforeEach(() => {
    mockedProps = {
      todos: [
        {id: 1, name: "Learn", isComplete: false},
        {id: 2, name: "Build App", isComplete: true},
        {id: 3, name: "Ship it!", isComplete: false}
      ],
      handleSaveTodo: jest.fn(),
      handleSelectTodo: jest.fn(),
      handleListSort: jest.fn(),
    };
  })

  it('should filter and return complete todos', () => {
    const component = TestUtils.renderIntoDocument(<TodoList  {...mockedProps}/>);
    const todos = [
      {id: 1, name: "Learn", isComplete: false},
      {id: 2, name: "Build App", isComplete: true},
      {id: 3, name: "Ship it!", isComplete: false}
    ];
    const expectedTodos = [
      {id: 2, name: "Build App", isComplete: true}
    ];

    expect(component.filterTodos(todos, 'complete')).toEqual(expectedTodos);
  });

  it('should filter and return non-complete todos', () => {
    const component = TestUtils.renderIntoDocument(<TodoList {...mockedProps}/>);
    const todos = [
      {id: 1, name: "Learn", isComplete: false},
      {id: 2, name: "Build App", isComplete: true},
      {id: 3, name: "Ship it!", isComplete: false}
    ];
    const expectedTodos = [
      {id: 1, name: "Learn", isComplete: false},
      {id: 3, name: "Ship it!", isComplete: false}
    ];

    expect(component.filterTodos(todos, 'active')).toEqual(expectedTodos);
  });

  it('should filter and return all todos', () => {
    const component = TestUtils.renderIntoDocument(<TodoList {...mockedProps}/>);
    const todos = [
      {id: 1, name: "Learn", isComplete: false},
      {id: 2, name: "Build App", isComplete: true},
      {id: 3, name: "Ship it!", isComplete: false}
    ];

    expect(component.filterTodos(todos, 'all')).toEqual(todos);
  });

  it('should invoke props.handleListSort when handleListSort', () => {
    const component = TestUtils.renderIntoDocument(<TodoList {...mockedProps}/>);
    const items = mockedProps.todos.map(todo => ({
      props: { todo: todo}
    }));

    component.handleListSort(items);

    expect(mockedProps.handleListSort).toHaveBeenCalledWith(mockedProps.todos);
  });
});
