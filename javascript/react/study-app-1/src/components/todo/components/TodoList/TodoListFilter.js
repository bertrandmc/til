import React from 'react';


export const TodoListFilter = (props) => {
  const handleFilter = (event) => {
    event.stopPropagation();
    event.preventDefault();
    props.handleFilter(event.target.dataset.filter);
  }

  return (
    <div className="todo-list-filter">
      <span>Filter: </span>
      <a href="#" data-filter="all" onClick={handleFilter}>All</a>
      <a href="#" data-filter="active" onClick={handleFilter}>Active</a>
      <a href="#" data-filter="complete" onClick={handleFilter}>Complete</a>
    </div>
  )
};

TodoListFilter.propTypes = {
  handleFilter: React.PropTypes.func.isRequired
};
