import React, {Component} from 'react';
import { connect } from 'react-redux';

import './TodoApp.scss';

import { TodoList, TodoForm, TodoFilter } from '../components';


class TodoApp extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  }

  handleNewTodo = (newTodo) => {
    const {addTodo} = this.props;
    addTodo(newTodo);
  }

  handleTodoToggle = (todo) => {
    const {toggleTodo} = this.props;
    toggleTodo(todo);
  }

  handleFilterSelection = (filter) => {
    const {setFilter} = this.props;
    setFilter(filter);
  }

  filterTodos(todos, filter) {
    switch(filter) {
      case 'COMPLETE':
        return todos.filter(t => t.isComplete);
      case 'ACTIVE':
        return todos.filter(t => !t.isComplete);
      default:
        return todos;
    }
  }

  render() {
    const {todos, filter} = this.props;
    const filteredTodod = this.filterTodos(todos, filter);

    return (
      <div className="todo">
        <h1>Todos</h1>
        <TodoForm handleNewTodo={this.handleNewTodo} />
        <TodoFilter handleFilterSelection={this.handleFilterSelection} filter={filter} />
        <TodoList todos={filteredTodod} handleTodoToggle={this.handleTodoToggle} />
      </div>
    )
  }
};

const mapStateToProps = (state) => ({
  todos: state.todos,
  filter: state.filter
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const {todos, filter} = ownProps.actions;
  
  return {
    addTodo (newTodo) {
      dispatch(todos.addTodo(newTodo))
    },
    toggleTodo(todo) {
      dispatch(todos.toggleTodo(todo))
    },
    toggleTodo (todo) {
      dispatch(todos.toggleTodo(todo))
    },
    setFilter (newFilter) {
      dispatch(filter.setFilter(newFilter))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp);
