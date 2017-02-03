import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {TodoItem} from './TodoItem';

describe('TodoItem', () => {

  let mockedProps;
  let mockedEvent;

  beforeEach(() => {
    mockedProps = {
      todo: {id: 123, title: 'Test', isComplete: false},
      handleSaveTodo: jest.fn(),
      handleRemoveTodo: jest.fn(),
    }

    mockedEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    };
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoItem {...mockedProps} />, div);
  });

  it('should update state with nextProps.todo when componentWillReceiveProps', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    const mockedTodo = {id: 1, title: 'Test', isComplete: false};

    component.componentWillReceiveProps({todo: mockedTodo});
    expect(component.state.todo).toEqual(mockedTodo);
  });

  it('should not mutate state when adding nextProps.todo when componentWillReceiveProps', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    const mockedTodo = {id: 1, title: 'Test', isComplete: false};
    const previousState = component.state;

    component.componentWillReceiveProps({todo: mockedTodo});
    jest.runAllTimers();
    expect(component.state.todo).not.toBe(previousState.todo);
  });

  it('should update state todo prop when handleSave', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    component.handleSave('isComplete', true);
    expect(component.state.todo).toEqual({...mockedProps.todo, isComplete: true});
  });

  it('should not mutate todo state when handleSave', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    const previousState = component.state;

    component.handleSave('isComplete', true);

    expect(component.state.todo).not.toBe(previousState.todo);
  });

  it('should have a debouncedHandleSaveTodo method defined', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    expect(component.debouncedHandleSaveTodo).toBeDefined();
  });

  it('should invoke debouncedHandleSaveTodo with correct parameters when handleSave', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);

    component.debouncedHandleSaveTodo = jest.fn();
    component.handleSave('isComplete', true);

    expect(component.debouncedHandleSaveTodo).toHaveBeenCalled();
    expect(component.debouncedHandleSaveTodo).toHaveBeenCalledWith(component.state.todo);
  });

  it('should invoke event.stopPropagation when handleRemove', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    component.handleRemove(mockedEvent)
    expect(mockedEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should set removeActive with timer id number when handleRemove', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    component.handleRemove(mockedEvent)
    expect(component.state.removeActive).toBeGreaterThan(0);
  });

  it('should unset removeActive after 300ms handleRemove', () => {
    jest.useFakeTimers();
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    component.handleRemove(mockedEvent)
    expect(component.state.removeActive).toBeGreaterThan(0);

    jest.runAllTimers();

    expect(component.state.removeActive).toBe(false);
  });

  it('should invoke handleRemoveTodo when removeActive is set and handleRemove in invoked for second time', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);

    component.handleRemove(mockedEvent)
    expect(component.state.removeActive).toBeGreaterThan(0);

    component.handleRemove(mockedEvent);
    expect(mockedProps.handleRemoveTodo).toHaveBeenCalledWith(component.state.todo);
  });


  it('should toggle edit mode to true when toggleEditMode', () => {
    // jest.useFakeTimers();
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    expect(component.state.isEditing).toBe(false);

    component.toggleEditMode();

    expect(component.state.isEditing).toBe(true);
  });

  it('should set holdEditingTools to true when toggling edit mode off', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    expect(component.state.isEditing).toBe(false);

    component.toggleEditMode();
    expect(component.state.isEditing).toBe(true);

    component.toggleEditMode();
    expect(component.state.isEditing).toBe(false);
    expect(component.state.holdEditingTools).toBe(true);
  });

  it('should set holdEditingTools to false sometime after toggling edit mode off', () => {
    const component = TestUtils.renderIntoDocument(<TodoItem {...mockedProps} />);
    expect(component.state.isEditing).toBe(false);

    component.toggleEditMode();
    expect(component.state.isEditing).toBe(true);

    component.toggleEditMode();
    expect(component.state.isEditing).toBe(false);
    expect(component.state.holdEditingTools).toBe(true);

    jest.runAllTimers();
    expect(component.state.holdEditingTools).toBe(false);
  });


});
