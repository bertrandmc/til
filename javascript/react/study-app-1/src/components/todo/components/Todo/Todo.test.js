import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import moment from 'moment';

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
    component.handleInputChange('title', mockedEvent);
    expect(mockedEvent.preventDefault).toHaveBeenCalled();
    expect(component.handleSave).toHaveBeenCalledWith('title', mockedEvent.target.value);
  });

  it('should invoke handleSave when handleDueDate', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    const date = moment();

    component.handleSave = jest.fn();
    component.handleDueDate(date);

    expect(component.handleSave).toHaveBeenCalledWith('dueDate', date.format());
  });

  it('should update state when toggleDatePicker', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    const prevState = component.state;

    component.toggleDatePicker();

    expect(component.state.showDatePicker).toBe(!prevState.showDatePicker);
    expect(component.state.activateDatePicker).toBe(true);
  });

  it('should not mutate state when toggleDatePicker', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    const prevState = component.state;

    component.toggleDatePicker();

    expect(component.state).not.toBe(prevState);
  });


  it('should return correct string when getFriendlyDate', () => {
    const component = TestUtils.renderIntoDocument(<Todo {...mockedProps} />);
    let string;

    string = component.getFriendlyDate(moment());
    expect(string).toBe('Today');

    string = component.getFriendlyDate(moment().subtract(1, "day"));
    expect(string).toBe('Yesterday');

    string = component.getFriendlyDate(moment().add(6, "days"));
    expect(string).toBe(moment().add(6, "days").format('dddd Do'));

    string = component.getFriendlyDate(moment().subtract(6, "days"));
    expect(string).toBe(moment().subtract(6, "days").format('dddd Do'));

    string = component.getFriendlyDate(moment().add(15, "days"));
    expect(string).toBe(moment().add(15, "days").format('MMMM Do'));
  });

})
