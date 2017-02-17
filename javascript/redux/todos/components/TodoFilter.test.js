import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import {renderToStaticMarkup} from 'react-dom/server';
import TestUtils from 'react-addons-test-utils';

import {TodoFilter} from './TodoFilter';


describe('TodoFilter Component', () => {
  let mockedProps;
  let mockedEvent;

  beforeEach(() => {
    mockedProps = {
      filter: 'ALL',
      handleFilterSelection: jest.fn()
    };

    mockedEvent = {
      stopPropagation: jest.fn(),
      target: {dataset: {filter: 'ALL'}}
    };
  })

  it('should render without crash', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoFilter {...mockedProps} />, div);
  });

  it('should render correct markup', () => {
    const resultMarkup = renderToStaticMarkup(<TodoFilter  {...mockedProps}/>);
    const expectedMarkup = `<div class="todo-filter"><div>Display: </div><div data-filter="ALL" class="todo-filter__active">All</div><div data-filter="ACTIVE" class="">Active</div><div data-filter="COMPLETE" class="">Complete</div></div>`;
    expect(resultMarkup).toEqual(expectedMarkup);
  });

  it('should default to ALL filter', () => {
    const component = shallow(<TodoFilter  {...mockedProps}/>);
    const activeFilter = component.find('.todo-filter__active');
    expect(activeFilter.text()).toEqual('All')
  });

  it('should set todo-filter__active in the ACTIVE filter', () => {
    mockedProps.filter = 'ACTIVE';
    const component = shallow(<TodoFilter  {...mockedProps}/>);
    const activeFilter = component.find('.todo-filter__active');
    expect(activeFilter.text()).toEqual('Active');
  });

  it('should set todo-filter__active in the COMPLETE filter', () => {
    mockedProps.filter = 'COMPLETE';
    const component = shallow(<TodoFilter  {...mockedProps}/>);
    const activeFilter = component.find('.todo-filter__active');
    expect(activeFilter.text()).toEqual('Complete');
  });

  it('should invoke props.handleFilterSelection when filter option is clicked', () => {
    const component = shallow(<TodoFilter  {...mockedProps}/>);
    component.simulate('click', mockedEvent);
    expect(mockedProps.handleFilterSelection).toHaveBeenCalledWith('ALL');
  });

  it('should invoke props.handleFilterSelection with appropriate argument when ALL filter is clicked', () => {
    const component = shallow(<TodoFilter  {...mockedProps}/>);
    mockedEvent.target.dataset.filter = 'ALL';
    component.simulate('click', mockedEvent);
    expect(mockedProps.handleFilterSelection).toHaveBeenCalledWith('ALL');
  });

  it('should invoke props.handleFilterSelection with appropriate argument when ACTIVE filter is clicked', () => {
    const component = shallow(<TodoFilter  {...mockedProps}/>);
    mockedEvent.target.dataset.filter = 'ACTIVE';
    component.simulate('click', mockedEvent);
    expect(mockedProps.handleFilterSelection).toHaveBeenCalledWith('ACTIVE');
  });

  it('should invoke props.handleFilterSelection with appropriate argument when COMPLETE filter is clicked', () => {
    const component = shallow(<TodoFilter  {...mockedProps}/>);
    mockedEvent.target.dataset.filter = 'COMPLETE';
    component.simulate('click', mockedEvent);
    expect(mockedProps.handleFilterSelection).toHaveBeenCalledWith('COMPLETE');
  });
});
