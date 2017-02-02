import React from 'react';
import classNames from 'classnames';

import './StatusButton.css';

export const StatusButton = (props) => {
  return (
    <span className="status-button" onClick={() => props.handleToggle(!props.status)}>
      <svg height="100%" width="100%" version="1.1" viewBox="0 0 90.594 59.714" x="0px" y="0px" xmlSpace="preserve">
        <polyline fill="none" points="1.768,23.532 34.415,56.179 88.826,1.768" stroke="rgba(192,192,192,0.5)" strokeWidth="5"/>
      </svg>
      <svg className="status-button-check" height="100%" width="100%" version="1.1" viewBox="0 0 90.594 59.714" x="0px" y="0px" xmlSpace="preserve">
        <polyline className={classNames("status-button-checkmark", {"status-button-checkmark__is-complete": props.status})} fill="none" points="1.768,23.532 34.415,56.179 88.826,1.768"  strokeWidth="5"/>
      </svg>
    </span>
  )
}

StatusButton.propTypes = {
  status: React.PropTypes.bool,
  handleToggle: React.PropTypes.func.isRequired
};
