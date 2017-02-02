import React from 'react';

import { TodoItem } from './TodoItem';

export const TodoList = (props) => (
  <ul className="todo-list">
    {props.todos.map(todo =>
      <TodoItem
        key={todo.id}
        todo={todo}
        handleUpdate={props.handleUpdate}
        handleRemove={props.handleRemove} />
    )}
  </ul>
);

TodoList.propTypes = {
  todos: React.PropTypes.array.isRequired,
  handleUpdate: React.PropTypes.func.isRequired,
  handleRemove: React.PropTypes.func.isRequired
};
