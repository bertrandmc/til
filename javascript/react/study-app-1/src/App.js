import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import findIndex from 'lodash/findIndex';
import update from 'react-addons-update';

import {
  TodoForm,
  TodoList
} from './components/todo';

class App extends Component {
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

  handleEmptyTodo = (event) => {
    event.preventDefault();
  }

  updateTodo = (todo) => {
    const {todos} = this.state;
    const index = findIndex(todos, {id: todo.id});
    this.setState({
      todos: update(todos, {[index]: {$merge: todo}})
    });
  }

  render() {
    const { todos, newTodo } = this.state;
    const handleSubmit = newTodo ? this.saveNewTodo : this.handleEmptyTodo;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Tools</h2>
        </div>
        <div className="Todo-App">
          <TodoForm
            newTodo={newTodo}
            handleSubmit={handleSubmit}
            handleChange={this.handleNewTodoChange}
          />
        <TodoList todos={todos} handleUpdate={this.updateTodo}/>
        </div>
      </div>
    );
  }
}

export default App;
