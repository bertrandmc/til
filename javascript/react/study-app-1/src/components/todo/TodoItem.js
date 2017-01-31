import React from 'react';

export const TodoItem = (props) => {
  const { todo, handleUpdate } = props;
  return (
    <li>
      <input
        type="checkbox"
        defaultChecked={todo.isComplete}
        onChange={event => handleUpdate({...todo, isComplete: event.target.checked})}
      />{todo.name}
    </li>
  )
};

TodoItem.propTypes = {
  todo: React.PropTypes.object.isRequired,
  handleUpdate: React.PropTypes.func.isRequired
};
