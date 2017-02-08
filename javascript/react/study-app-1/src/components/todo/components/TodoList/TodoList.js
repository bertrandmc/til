import React, {Component} from 'react';

import { TodoListItem } from './TodoListItem';
import { TodoListFilter } from './TodoListFilter';

import SortableList from '../SortableList/SortableList';

import './TodoList.css';

export class TodoList extends Component {
  state = {}

  filterTodos = (todos, filter) => {
    switch(filter) {
      case 'active':
        return todos.filter(todo => !todo.isComplete);
      case 'complete':
        return todos.filter(todo => todo.isComplete);
      default:
        return todos;
    }
  }

  handleFilter = (filter) => {
    this.setState({todosFilter: filter});
  }

  handleListSort = (items) => {
    const todos = items.map(item => item.props.todo);
    this.props.handleListSort(todos);
  }

  render() {
    const { todosFilter } = this.state;
    const { todos, handleSaveTodo, handleSelectTodo} = this.props;
    const filteredTodos = this.filterTodos(todos, todosFilter);

    const listItems = filteredTodos.map(todo =>
      <TodoListItem
        key={todo.id}
        todo={todo}
        handleSaveTodo={handleSaveTodo}
        handleSelectTodo={handleSelectTodo}/>
    )

    return (
      <div className="todo-list">
        <TodoListFilter  handleFilter={this.handleFilter} />
        <SortableList items={listItems} handleChange={this.handleListSort} />
      </div>
    )
  }
}

TodoList.propTypes = {
  todos: React.PropTypes.array.isRequired,
  handleSaveTodo: React.PropTypes.func.isRequired,
  handleSelectTodo: React.PropTypes.func.isRequired,
  handleListSort: React.PropTypes.func.isRequired,
};
