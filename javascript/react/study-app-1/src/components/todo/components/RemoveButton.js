import React, {Component} from 'react';
import classNames from 'classnames';

import IconDelete from 'react-icons/lib/md/delete';

export class RemoveButton extends Component {
  state = {}

  handleRemove = (event) => {
    event.stopPropagation();

    if(this.state.isActive) {
      // second click confirms remove action
      clearTimeout(this.state.isActive);
      return this.props.handleRemoveTodo(this.props.todo);
    }

    // first click only activates button for 3 seconds
    const isActiveTimeoutId = setTimeout(() => {
      this.setState({isActive: false});
    }, 3000);

    this.setState({isActive: isActiveTimeoutId});
  }

  render() {
    return (
      <div onClick={this.handleRemove}
          className={classNames("todo-item-action-button", {"todo-item-action-button__active": this.state.isActive})} >
        <IconDelete />
      </div>
    )
  }
}

RemoveButton.propTypes = {
  todo: React.PropTypes.object.isRequired,
  handleRemoveTodo: React.PropTypes.func.isRequired
};
