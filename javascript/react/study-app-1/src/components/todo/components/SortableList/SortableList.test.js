import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import SortableList from './SortableList';

describe('SortableList', () => {

  let mockedProps;
  let mockedEvent;

  beforeEach(() => {
    mockedProps = {
      todos: [
        {id: 1, title: 'Test', isComplete: false},
        {id: 2, title: 'Test', isComplete: false},
        {id: 3, title: 'Test', isComplete: false},
        {id: 4, title: 'Test', isComplete: false},
      ],
      handleChange: jest.fn()
    }

    mockedProps.items = mockedProps.todos.map(todo =>
      <div>{todo.id}</div>
    );

    mockedEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    };
  });

  jest.useFakeTimers();

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SortableList {...mockedProps} />, div);
  });

  it('should handleChange', () => {
    const component = TestUtils.renderIntoDocument(<SortableList {...mockedProps} />);
    const newState = {draggingIndex: 1};

    component.handleChange(newState);

    expect(component.state.draggingIndex).toBe(1);
  })

  it('should not mutate state when handleChange', () => {
    const component = TestUtils.renderIntoDocument(<SortableList {...mockedProps} />);
    const newState = {draggingIndex: 1};
    const prevState = component.state;
    component.handleChange(newState);
    expect(component.state).not.toBe(prevState);
  });

  it('should invoke props.handleChange when draggingIndex is null', () => {
    const component = TestUtils.renderIntoDocument(<SortableList {...mockedProps} />);
    const items = [{id: 1}];
    const newState = {items: items, draggingIndex: null};

    component.handleChange(newState);

    expect(mockedProps.handleChange).toHaveBeenCalledWith(items)
  });


});
