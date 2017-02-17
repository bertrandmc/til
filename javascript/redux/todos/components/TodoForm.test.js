import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import {renderToStaticMarkup} from 'react-dom/server';
import TestUtils from 'react-addons-test-utils';

import {TodoForm} from './TodoForm';


describe('TodoForm Component', () => {
  let mockedProps;
  let mockedEvent;

  beforeEach(() => {
    mockedProps = {
      handleNewTodo: jest.fn()
    };

    mockedEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
      target: {value: 'Test'}
    };
  })

  it('should render without crash', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoForm {...mockedProps} />, div);
  });

  it('should render correct markup', () => {
    const resultMarkup = renderToStaticMarkup(<TodoForm  {...mockedProps}/>);
    const expectedMarkup = `<div class="todo-form"><form><input type="text" value=""/><button>+</button></form></div>`;
    expect(resultMarkup).toEqual(expectedMarkup);
  });

  it('should invoke handleInputChange when input change occur', () => {
    const component = mount(<TodoForm  {...mockedProps}/>);
    const input = component.find('input');

    component.instance().handleInputChange = jest.fn();
    component.update();
    input.simulate('change');

    expect(component.instance().handleInputChange).toHaveBeenCalled();
  });

  it('should handleInputChange when input change occur', () => {
    const component = shallow(<TodoForm  {...mockedProps}/>);
    const input = component.find('input');

    input.simulate('change', mockedEvent);

    expect(component.state().title).toEqual(mockedEvent.target.value);
  });


  it('should invoke handleSubmit when submit form', () => {
    const component = mount(<TodoForm  {...mockedProps}/>);
    const form = component.find('form');

    component.instance().handleSubmit = jest.fn();
    component.update();
    form.simulate('submit');

    expect(component.instance().handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      type: 'submit'
    }));
  });

  it('should invoke props.handleNewTodo when handleSubmit', () => {
    const component = mount(<TodoForm  {...mockedProps}/>);

    component.setState({title: 'Test'});
    component.instance().handleSubmit(mockedEvent);

    expect(mockedProps.handleNewTodo).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.any(String),
      title: expect.any(String),
    }));
  });

  it('should clear state.title when handleSubmit', () => {
    const component = mount(<TodoForm  {...mockedProps}/>);

    component.setState({title: 'Test'});
    component.instance().handleSubmit(mockedEvent);

    expect(component.state().title).toEqual('');
  });

  it('should not invoke props.handleNewTodo when title is not set', () => {
    const component = mount(<TodoForm  {...mockedProps}/>);

    component.setState({title: ''});
    component.instance().handleSubmit(mockedEvent);

    expect(mockedProps.handleNewTodo).not.toHaveBeenCalled();
  });

});
