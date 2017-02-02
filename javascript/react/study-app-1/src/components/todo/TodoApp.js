import React, {Component} from 'react';
import update from 'react-addons-update';
import shortid from 'shortid';

import './TodoApp.css';

import { TodoForm } from './TodoForm';
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

    this.state = Object.assign({
      newTodo: '',
      todos: persistedTodos
    });
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

  handleNewTodoChange = (event) => {
    this.setState({
      newTodo: event.target.value
    });
  }

  saveNewTodo = (event) => {
    event.preventDefault();
    const { todos, newTodo } = this.state;
    const todoObject = {id: shortid.generate(), name: newTodo, isComplete: false};

    this.setState({
      todos: [...todos, todoObject],
      newTodo: ''
    });
  }

  updateTodo = (updatedTodo) => {
    const { todos } = this.state;
    const updatedIndex = todos.findIndex(todo => todo.id === updatedTodo.id);
    this.setState({
      todos: update(todos, {[updatedIndex]: {$merge: updatedTodo}})
    });
  }

  removeTodo = (removedTodo) => {
    const { todos } = this.state;
    const updatedTodos = todos.filter(todo => todo.id !== removedTodo.id);
    this.setState({
      todos: updatedTodos
    });
  }

  handleEmptyTodo = (event) => {
    event.preventDefault();
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
    const { todos, newTodo } = this.state;
    const displayTodos = this.filterTodos(todos, this.context.route);
    const handleSubmit = newTodo ? this.saveNewTodo : this.handleEmptyTodo;



    return (
      <div className="todo-app">
        <TodoForm
          newTodo={newTodo}
          handleSubmit={handleSubmit}
          handleChange={this.handleNewTodoChange} />
        <TodoFilter />
        <TodoList
          todos={displayTodos}
          handleUpdate={this.updateTodo}
          handleRemove={this.removeTodo} />

      </div>
    )
  }
}
