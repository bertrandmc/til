import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import TestUtils from 'react-addons-test-utils';

import {Link} from './Link';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Link to="/" />, div);
});

it('should invoke event.preventDefault when handleClick is invoked', () => {
  const component = TestUtils.renderIntoDocument(<Link to="/" />);
  const eventMock = { preventDefault: jest.fn() };

  component.context.linkHandler = jest.fn();
  component.handleClick(eventMock);

  expect(eventMock.preventDefault).toHaveBeenCalled();
});

it('should invoke context.linkHandler when handleClick is invoked', () => {
  const component = TestUtils.renderIntoDocument(<Link to="/" />);
  const eventMock = { preventDefault: jest.fn() };
  component.context.linkHandler = jest.fn();

  component.handleClick(eventMock);

  expect(component.context.linkHandler).toHaveBeenCalledWith(component.props.to);
});

it('should invoke handleClick when link is clicked', () => {
  const component = mount(<Link to="/" />);
  component.instance().handleClick = jest.fn();
  component.update(); // update so click event binds to new mocked function

  component.simulate('click');

  expect(component.instance().handleClick).toHaveBeenCalled();
});
