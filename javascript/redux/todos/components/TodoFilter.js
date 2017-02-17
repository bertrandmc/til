import React from 'react';
import classNames from 'classnames';

import './TodoFilter.scss';

export const TodoFilter = ({filter = 'ALL', handleFilterSelection}) => {
    const handleClick = (event) => {
      event.stopPropagation();
      const {filter} = event.target.dataset;
      if(filter) handleFilterSelection(filter);
    };

    return (
      <div className="todo-filter" onClick={handleClick}>
        <div>Display: </div>
        <div data-filter="ALL" className={classNames({'todo-filter__active': filter === 'ALL'})}>All</div>
        <div data-filter="ACTIVE" className={classNames({'todo-filter__active': filter === 'ACTIVE'})}>Active</div>
        <div data-filter="COMPLETE" className={classNames({'todo-filter__active': filter === 'COMPLETE'})}>Complete</div>
      </div>
    )
};

TodoFilter.propTypes = {
  filter: React.PropTypes.string,
  handleFilterSelection: React.PropTypes.func.isRequired
};
