import React, {Component} from 'react';

import Button from './Button';
import IconDelete from 'react-icons/lib/md/delete';

export class ButtonRemove extends Component {
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
      <Button handleClick={this.handleRemove} isActive={!!this.state.isActive}>
        <IconDelete />
      </Button>
    )
  }
}

ButtonRemove.propTypes = {
  todo: React.PropTypes.object.isRequired,
  handleRemoveTodo: React.PropTypes.func.isRequired
};
