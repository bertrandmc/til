import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import {renderToStaticMarkup} from 'react-dom/server';
import TestUtils from 'react-addons-test-utils';

import {TodoList} from './TodoList';


describe('TodoList Component', () => {
  let mockedProps;
  let mockedEvent;
  const todos = [
    {id: "1", title: "TODO 1", isComplete: false},
    {id: "2", title: "TODO 2", isComplete: false},
    {id: "3", title: "TODO 3", isComplete: true},
  ];

  beforeEach(() => {
    mockedProps = {
      todos: [...todos],
      handleTodoToggle: jest.fn()
    };

    mockedEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    };
  })

  it('should render without crash', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoList {...mockedProps} />, div);
  });

  it('should render correct markup', () => {
    const resultMarkup = renderToStaticMarkup(<TodoList  {...mockedProps}/>);
    const expectedMarkup = `<div class="todo-list"><div class="todo-list-item">TODO 1</div><div class="todo-list-item">TODO 2</div><div class="todo-list-item is-complete">TODO 3</div></div>`;
    expect(resultMarkup).toEqual(expectedMarkup);
  });

  it('should render 3 todos items', () => {
    const component = shallow(<TodoList  {...mockedProps}/>);
    const todoItems = component.find('.todo-list-item');
    expect(todoItems.length).toEqual(3);
  });

  it('should invoke props.handleTodoToggle when todo item is clicked', () => {
    const component = mount(<TodoList  {...mockedProps}/>);
    const todoItems = component.find('.todo-list-item');

    todoItems.at(0).simulate('click');
    expect(mockedProps.handleTodoToggle).toHaveBeenCalledWith(mockedProps.todos[0]);

    todoItems.at(1).simulate('click');
    expect(mockedProps.handleTodoToggle).toHaveBeenCalledWith(mockedProps.todos[1]);

    todoItems.at(2).simulate('click');
    expect(mockedProps.handleTodoToggle).toHaveBeenCalledWith(mockedProps.todos[2]);
  });

  it('should apply is-complete class when todo.isComplete is true', () => {
    const component = mount(<TodoList  {...mockedProps}/>);
    const todoItems = component.find('.todo-list-item');

    expect(todoItems.at(0).hasClass('is-complete')).toEqual(false);
    expect(todoItems.at(1).hasClass('is-complete')).toEqual(false);
    expect(todoItems.at(2).hasClass('is-complete')).toEqual(true);
  });

  it('should appli todo.id as key value of each todo item', () => {
    const component = mount(<TodoList  {...mockedProps}/>);
    const todoItems = component.find('.todo-list-item');
    const {todos} = mockedProps;

    expect(todoItems.at(0).key()).toEqual(todos[0].id);
    expect(todoItems.at(1).key()).toEqual(todos[1].id);
    expect(todoItems.at(2).key()).toEqual(todos[2].id);
  });

});
