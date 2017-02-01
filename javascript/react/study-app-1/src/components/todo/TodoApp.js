import React, {Component} from 'react';
import update from 'react-addons-update';

import './TodoApp.css';

import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

export class TodoApp extends Component {
  state = {
    todos: [
      {id: 1, name: "Learn", isComplete: false},
      {id: 2, name: "Build App", isComplete: true},
      {id: 3, name: "Ship it!", isComplete: false}
    ],
    newTodo: ''
  }

  handleNewTodoChange = (event) => {
    this.setState({
      newTodo: event.target.value
    });
  }

  saveNewTodo = (event) => {
    event.preventDefault();
    const { todos, newTodo } = this.state;
    const todoObject = {id: todos.length + 1, name: newTodo, isComplete: false};

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

  render() {
    const { todos, newTodo } = this.state;
    const handleSubmit = newTodo ? this.saveNewTodo : this.handleEmptyTodo;

    return (
      <div className="todo-app">
        <TodoForm
          newTodo={newTodo}
          handleSubmit={handleSubmit}
          handleChange={this.handleNewTodoChange} />
        <TodoList
          todos={todos}
          handleUpdate={this.updateTodo}
          handleRemove={this.removeTodo} />
      </div>
    )
  }
}
