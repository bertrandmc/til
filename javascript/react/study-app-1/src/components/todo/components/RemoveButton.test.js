import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {RemoveButton} from './RemoveButton';

describe('TodoItem', () => {

  let mockedProps;
  let mockedEvent;

  beforeEach(() => {
    mockedProps = {
      todo: {id: 123, title: 'Test', isComplete: false},
      handleRemoveTodo: jest.fn(),
    }

    mockedEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    };
  });

  jest.useFakeTimers();

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<RemoveButton {...mockedProps} />, div);
  });

  it('should invoke event.stopPropagation when handleRemove', () => {
    const component = TestUtils.renderIntoDocument(<RemoveButton {...mockedProps} />);
    component.handleRemove(mockedEvent)
    expect(mockedEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should set isActive with timer id number when handleRemove', () => {
    const component = TestUtils.renderIntoDocument(<RemoveButton {...mockedProps} />);
    component.handleRemove(mockedEvent)
    expect(component.state.isActive).toBeGreaterThan(0);
  });

  it('should unset isActive after 300ms handleRemove', () => {
    const component = TestUtils.renderIntoDocument(<RemoveButton {...mockedProps} />);

    component.handleRemove(mockedEvent)
    expect(component.state.isActive).toBeGreaterThan(0);

    jest.runAllTimers();
    expect(component.state.isActive).toBe(false);
  });

  it('should invoke handleRemoveTodo when isActive is set and handleRemove in invoked for second time', () => {
    const component = TestUtils.renderIntoDocument(<RemoveButton {...mockedProps} />);

    component.handleRemove(mockedEvent)
    expect(component.state.isActive).toBeGreaterThan(0);

    component.handleRemove(mockedEvent);
    expect(mockedProps.handleRemoveTodo).toHaveBeenCalledWith(component.props.todo);
  });

});
