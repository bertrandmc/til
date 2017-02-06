import React from 'react';
import classNames from 'classnames';


const Button = (props) => {
  return (
    <div onClick={props.handleClick}
        className={classNames("todo-item-action-button", {"todo-item-action-button__active": props.isActive})} >
      {props.children}
    </div>
  )
}


Button.propTypes = {
  isActive: React.PropTypes.bool,
  handleClick: React.PropTypes.func.isRequired
};

export default Button;
