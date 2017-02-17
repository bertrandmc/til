import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import {renderToStaticMarkup} from 'react-dom/server';
import TestUtils from 'react-addons-test-utils';
import configureStore from 'redux-mock-store';

import TodoApp from './TodoApp';
import actions  from '../actions';
import {TodoList, TodoFilter, TodoForm} from '../components';


describe('TodoApp Container', () => {
  let mockedProps;
  let mockedEvent;

  const todos = [
    {id: "1", title: "TODO 1", isComplete: false},
    {id: "2", title: "TODO 2", isComplete: false},
    {id: "3", title: "TODO 3", isComplete: true},
  ];

  const initialState = {todos: [...todos], filter: 'ALL'};
  const mockStore = configureStore([]);

  beforeEach(() => {
    mockedProps = {
      store: mockStore(initialState),
      actions: actions
    };

    mockedEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    };
  })

  it('should render without crash', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoApp {...mockedProps} />, div);
  });

  it('should render correct markup', () => {
    const resultMarkup = renderToStaticMarkup(<TodoApp  {...mockedProps}/>);
    const expectedMarkup = `<div class="todo"><h1>Todos</h1><div class="todo-form"><form><input type="text" value=""/><button>+</button></form></div><div class="todo-filter"><div>Display: </div><div data-filter="ALL" class="todo-filter__active">All</div><div data-filter="ACTIVE" class="">Active</div><div data-filter="COMPLETE" class="">Complete</div></div><div class="todo-list"><div class="todo-list-item">TODO 1</div><div class="todo-list-item">TODO 2</div><div class="todo-list-item is-complete">TODO 3</div></div></div>`;
    expect(resultMarkup).toEqual(expectedMarkup);
  });

  it('should filter ACTIVE todos', () => {
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const filteredTodos = component.instance().filterTodos(todos, 'ACTIVE');

    expect(filteredTodos.length).toEqual(2);
    expect(filteredTodos).toEqual([todos[0], todos[1]]);
  });

  it('should filter ALL todos', () => {
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const filteredTodos = component.instance().filterTodos(todos, 'ALL');

    expect(filteredTodos.length).toEqual(3);
    expect(filteredTodos).toEqual(todos);
  });

  it('should filter COMPLETE todos', () => {
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const filteredTodos = component.instance().filterTodos(todos, 'COMPLETE');

    expect(filteredTodos.length).toEqual(1);
    expect(filteredTodos).toEqual([todos[2]]);
  });

  it('should pass filtered todos to child TodoList', () => {
    mockedProps.store = mockStore({...initialState, filter: 'COMPLETE'});
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const listTodos = component.find('TodoList').prop('todos');
    const expected = todos.filter(t => t.isComplete === true);

    expect(listTodos).toEqual(expected);
  });

  it('should pass instance.handleTodoToggle to child TodoList', () => {
    mockedProps.store = mockStore({...initialState, filter: 'COMPLETE'});
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const handleTodoToggle = component.find('TodoList').prop('handleTodoToggle');
    const expected = component.instance().handleTodoToggle;

    expect(handleTodoToggle).toEqual(expected);
  });

  it('should pass filter to child TodoFilter', () => {
    mockedProps.store = mockStore({...initialState, filter: 'COMPLETE'});
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const filterProp = component.find('TodoFilter').prop('filter');
    const expected = 'COMPLETE';

    expect(filterProp).toEqual(expected);
  });

  it('should pass instance.handleFilterSelection to child TodoFilter', () => {
    mockedProps.store = mockStore({...initialState, filter: 'COMPLETE'});
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const handleFilterSelection = component.find('TodoFilter').prop('handleFilterSelection');
    const expected = component.instance().handleFilterSelection;

    expect(handleFilterSelection).toEqual(expected);
  });

  it('should pass instance.handleNewTodo to child TodoForm', () => {
    mockedProps.store = mockStore({...initialState, filter: 'COMPLETE'});
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const handleNewTodo = component.find('TodoForm').prop('handleNewTodo');
    const expected = component.instance().handleNewTodo;

    expect(handleNewTodo).toEqual(expected);
  });


  it('should invoke dispatch TODO_ADD action when handleNewTodo', () => {
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const newTodo = {id: "4", title: "Test", isComplete: false};
    const {store} = mockedProps;

    component.instance().handleNewTodo(newTodo);

    const dispatchedActions = store.getActions();
    const expectedActions = [{type: 'TODO_ADD', payload: newTodo}];

    expect(dispatchedActions).toEqual(expectedActions);
  });

  it('should invoke dispatch TODO_TOGGLE action when handleTodoToggle', () => {
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const todo = {id: "4", title: "Test", isComplete: false};
    const {store} = mockedProps;

    component.instance().handleTodoToggle(todo);

    const dispatchedActions = store.getActions();
    const expectedActions = [{type: 'TODO_TOGGLE', payload: todo}];

    expect(dispatchedActions).toEqual(expectedActions);
  });

  it('should invoke dispatch FILTER_SET action when handleFilterSelection', () => {
    const component = shallow(<TodoApp  {...mockedProps}/>).shallow(); // we need to call shallow again because redux connect
    const {store} = mockedProps;
    component.instance().handleFilterSelection('COMPLETE');

    const dispatchedActions = store.getActions();
    const expectedActions = [{type: 'FILTER_SET', payload: 'COMPLETE'}];

    expect(dispatchedActions).toEqual(expectedActions);
  });


});
