import React, {Component} from 'react';
import classNames from 'classnames';

import {StatusButton} from '../';

export class TodoListItem extends Component {
  toggleStatus = () => {
    const {todo} = this.props;
    const updatedTodo = {...todo, isComplete: !todo.isComplete};
    this.props.handleSaveTodo(updatedTodo);
  }

  handleClick = (event) => {
    event.stopPropagation();
    this.props.handleSelectTodo(this.props.todo);
  }

  render() {
    const { todo } = this.props;

    return (
      <li className={classNames('todo-list-item', {'todo-list-item__complete': todo.isComplete})}
          onClick={this.handleClick}>

        <StatusButton
          status={todo.isComplete}
          handleToggle={this.toggleStatus}/>

        <div className="todo-list-item-label">{todo.title}</div>

      </li>
    )
  }
}


TodoListItem.propTypes = {
  todo: React.PropTypes.object.isRequired,
  handleSaveTodo: React.PropTypes.func.isRequired,
  handleSelectTodo: React.PropTypes.func.isRequired
};
