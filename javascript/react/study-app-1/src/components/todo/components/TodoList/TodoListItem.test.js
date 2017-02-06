import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {TodoListItem} from './TodoListItem';

describe('TodoListItem', () => {

  let mockedProps;
  let mockedEvent;

  beforeEach(() => {
    mockedProps = {
      todo: {id: 123, title: 'Test', isComplete: false},
      handleSaveTodo: jest.fn(),
      handleSelectTodo: jest.fn(),
    }

    mockedEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    };
  });

  jest.useFakeTimers();

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoListItem {...mockedProps} />, div);
  });

  it('should invoke event.stopPropagation and props.handleSelectTodo when handleClick', () => {
    const component = TestUtils.renderIntoDocument(<TodoListItem {...mockedProps} />);

    component.handleClick(mockedEvent);

    expect(mockedEvent.stopPropagation).toHaveBeenCalled();
    expect(mockedProps.handleSelectTodo).toHaveBeenCalledWith(mockedProps.todo);
  });

  it('should invoke event.stopPropagation and props.handleSelectTodo when element is clicked', () => {
    const component = shallow(<TodoListItem {...mockedProps} />);

    component.find('li').simulate('click', mockedEvent);

    expect(mockedEvent.stopPropagation).toHaveBeenCalled();
    expect(mockedProps.handleSelectTodo).toHaveBeenCalledWith(mockedProps.todo);
  });

  it('should invoke component.toggleStatus status button is clicked', () => {
    const component = mount(<TodoListItem {...mockedProps} />);

    component.find('.status-button').simulate('click', mockedEvent);

    expect(mockedEvent.stopPropagation).toHaveBeenCalled();
    expect(mockedProps.handleSaveTodo).toHaveBeenCalledWith({...mockedProps.todo, isComplete: true});
  });

  it('should add class todo-list-item__complete when todo.isComplete', () => {
    const component = mount(<TodoListItem {...mockedProps} />);

    expect(component.find('li.todo-list-item__complete').length).toEqual(0);

    mockedProps.todo.isComplete = true;
    component.update();

    expect(component.find('li.todo-list-item__complete').length).toEqual(1);
  });
});
