import React from 'react';
import classNames from 'classnames';

import {StatusButton} from './components';

export const TodoItem = (props) => {
  const { todo, handleUpdate, handleRemove } = props;
  const handleToggle = status => handleUpdate({...todo, isComplete: status})
  const deleteTodo = event => handleRemove(todo);

  return (
    <li className={classNames('todo-item', {'todo-item__complete': todo.isComplete})}>
      <a href="#"
        className="todo-item--remove"
        onClick={deleteTodo}>&#10007;</a>

      <StatusButton
        status={todo.isComplete}
        handleToggle={handleToggle}
      />
      <span className="todo-item--label">{todo.name}</span>
    </li>
  )
};

TodoItem.propTypes = {
  todo: React.PropTypes.object.isRequired,
  handleUpdate: React.PropTypes.func.isRequired,
  handleRemove: React.PropTypes.func.isRequired
};
