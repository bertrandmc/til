import React from 'react';

export const TodoForm = (props) => (
  <form onSubmit={props.handleSubmit}>
    <input type="text" value={props.newTodo} onChange={props.handleChange}/>
  </form>
);

TodoForm.propTypes = {
  newTodo: React.PropTypes.string.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
};
