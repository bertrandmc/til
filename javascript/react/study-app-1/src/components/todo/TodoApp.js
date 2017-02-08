import React, {Component} from 'react';
import classNames from 'classnames';
import update from 'react-addons-update';
import find from 'lodash/find';
import shortid from 'shortid';

import AddIcon from 'react-icons/lib/md/add-circle-outline';

import './TodoApp.css';

import { TodoList, Todo } from './components';

export class TodoApp extends Component {
  static contextTypes = {
    route: React.PropTypes.string,
    storage: React.PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    const {storage} = context;

    // For now I'll ignore if storage is not available in context where TodoApp is being used.
    const persistedTodos = (storage && storage.getItem('todos')) || [];

    this.state = {todos: persistedTodos};
  }

  componentWillUpdate = (nextProps, nextState) => {
    if(nextState.todos !== this.state.todos) {
      this.persistTodos(nextState.todos);
    }
  }

  persistTodos = (todos) => {
    const {storage} = this.context;
    storage && storage.saveItem('todos', todos);
  }

  createTodo = () => {
    const newTodo = {id: shortid.generate(), title: '', isComplete: false};

    this.setState((prevState, props) => ({
      todos: [newTodo, ...prevState.todos]
    }));
    this.selectTodo(newTodo);
  }

  saveTodo = (updatedTodo) => {
    const { todos } = this.state;
    const updatedIndex = todos.findIndex(todo => todo.id === updatedTodo.id);

    this.setState({
      todos: update(todos, {[updatedIndex]: {$merge: updatedTodo}})
    });
  }

  removeTodo = (removedTodo) => {
    const { todos } = this.state;
    const updatedTodos = todos.filter(todo => todo.id !== removedTodo.id);
    this.setState({todos: updatedTodos, selectedTodo: false});
  }

  selectTodo = (selectedTodo) => {
    this.setState({selectedTodo});
  }

  getSelectedTodo = () => {
    const {todos, selectedTodo} = this.state;

    if(selectedTodo) {
      return find(todos, {id: selectedTodo.id});
    }

    return false;
  }

  handleListSort = (todos) => {
    this.setState({todos});
  }

  render() {
    const {
      todos,
      selectedTodo
    } = this.state;

    return (
      <div className="todo-app">
        <header>
          <div className="todo-app-menu">
              <div className="todo-app-menu-action new-todo" onClick={this.createTodo}>
                <AddIcon />
              </div>
          </div>
        </header>

        <TodoList
          todos={todos}
          handleSaveTodo={this.saveTodo}
          handleSelectTodo={this.selectTodo}
          handleListSort={this.handleListSort}
          />

        <Todo
          todo={this.getSelectedTodo(selectedTodo)}
          className={classNames({"todo__animate-in": selectedTodo})}
          handleSaveTodo={this.saveTodo}
          handleBackButton={event => this.selectTodo(false)}
          handleRemoveTodo={this.removeTodo}
            />

      </div>
    )
  }
}
