import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {Todo} from './Todo';

describe('Todo', () => {

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
    ReactDOM.render(<Todo {...mockedProps} />, div);
  });

  it('defined a debouncedHandleSaveTodo method', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    expect(component.debouncedHandleSaveTodo).toBeDefined();
  });

  it('should invoke debouncedHandleSaveTodo when handleSave', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    component.setState({todo: mockedProps.todo});
    component.debouncedHandleSaveTodo = jest.fn();
    component.handleSave('title', 'Updated Title');
    expect(component.debouncedHandleSaveTodo).toHaveBeenCalledWith({...mockedProps.todo, title: 'Updated Title'});
  });

  it('should update todo state when handleSave', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    component.setState({todo: mockedProps.todo});
    component.debouncedHandleSaveTodo = jest.fn();
    component.handleSave('title', 'Updated Title');
    expect(component.state.todo).toEqual({...mockedProps.todo, title: 'Updated Title'});
  });

  it('should not mutate todo state when handleSave', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    component.setState({todo: mockedProps.todo});
    component.debouncedHandleSaveTodo = jest.fn();
    component.handleSave('title', 'Updated Title');
    expect(component.state.todo).not.toBe(mockedProps.todo);
  });

  it('should invoke handleSave when handleTitleChange', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    mockedEvent.target = {value: 'Test'};
    component.handleSave = jest.fn();
    component.handleTitleChange(mockedEvent);
    expect(mockedEvent.preventDefault).toHaveBeenCalled();
    expect(component.handleSave).toHaveBeenCalledWith('title', mockedEvent.target.value);
  });

})
