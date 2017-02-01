import React from 'react';
import {Link} from '../../router';


export const TodoFilter = (props) => {
  return (
    <div className="todo-filter">
      <span>Filter: </span>
      <Link to="/">All</Link>
      <Link to="/active">Active</Link>
      <Link to="/complete">Complete</Link>
    </div>
  )
};
