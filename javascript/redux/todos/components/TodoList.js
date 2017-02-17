import React from 'react';
import classNames from 'classnames';

import './TodoList.scss';

export const TodoList = ({todos, handleTodoToggle}) => {
  return (
    <div className="todo-list">
      {todos.map(todo =>
        <div key={todo.id}
          className={classNames('todo-list-item', {'is-complete': todo.isComplete})}
          onClick={() => handleTodoToggle(todo)}>
          {todo.title}
        </div>
      )}
    </div>
  )
}

TodoList.propTypes = {
  todos: React.PropTypes.array.isRequired,
  handleTodoToggle: React.PropTypes.func.isRequired
};
