import React, {Component} from 'react';
import update from 'react-addons-update';
import shortid from 'shortid';

import AddIcon from 'react-icons/lib/md/add-circle-outline';

import './TodoApp.css';

import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';


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
    const newTodo = {id: shortid.generate(), title: '', isEditing: true, isComplete: false};

    this.setState((prevState, props) => ({
      todos: [newTodo, ...prevState.todos]
    }));
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
    this.setState({todos: updatedTodos});
  }

  filterTodos(todos, route) {
    switch(route) {
      case '/active':
        return todos.filter(todo => !todo.isComplete);
      case '/complete':
        return todos.filter(todo => todo.isComplete);
      default:
        return todos;
    }
  }

  render() {
    const {
      todos
    } = this.state;

    const displayTodos = this.filterTodos(todos, this.context.route);

    return (
      <div className="todo-app">
        <header>
          <div className="todo-app-menu">
              <div className="todo-app-menu-action new-todo" onClick={this.createTodo}>
                <AddIcon />
              </div>
          </div>
          <TodoFilter />
        </header>

        <TodoList
          todos={displayTodos}
          handleSaveTodo={this.saveTodo}
          handleRemoveTodo={this.removeTodo} />
      </div>
    )
  }
}
