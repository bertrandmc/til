import React from 'react';

import { TodoItem } from './TodoItem';


export const TodoList = (props) => (

  <ul className="todo-list">
    {props.todos.map(todo =>
      <TodoItem
        key={todo.id}
        todo={todo}
        handleSaveTodo={props.handleSaveTodo}
        handleRemoveTodo={props.handleRemoveTodo}
        toggleEditMode={props.toggleEditMode}/>
    )}
  </ul>
);

TodoList.propTypes = {
  todos: React.PropTypes.array.isRequired,
  handleSaveTodo: React.PropTypes.func.isRequired,
  handleRemoveTodo: React.PropTypes.func.isRequired,
  toggleEditMode: React.PropTypes.func.isRequired
};
