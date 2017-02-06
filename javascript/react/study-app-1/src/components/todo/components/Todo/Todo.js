import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import classNames from 'classnames';

import './todo.css';

import ArrowLeft from 'react-icons/lib/md/keyboard-arrow-left';
import {
  ButtonRemove
} from '../';


export class Todo extends Component {
  state = {}

  constructor(props) {
    super(props);

    this.debouncedHandleSaveTodo = debounce(props.handleSaveTodo, 300);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.todo && this.state.todo) {
      // back button called
      // allow 400ms for animation before removing it from state
      setTimeout(() => {
        this.setState({todo: nextProps.todo});
      }, 400);
    } else {
      // todo was selected and shoudl render immediatelly
      this.setState({todo: nextProps.todo});
    }
  }

  handleSave = (propName, value) => {
    this.setState((prevState) => {
      const updatedTodo = {...prevState.todo, [propName]: value};
      this.debouncedHandleSaveTodo(updatedTodo);
      return {todo: updatedTodo};
    });
  }

  handleTitleChange = (event) => {
    event.preventDefault();
    this.handleSave('title', event.target.value);
  }

  render() {
    const { todo } = this.state;

    return (
      <div className={classNames("todo", this.props.className)}>
        {todo &&
          <span>
            <div className="todo-header">
              <div className="todo-header-back-button" onClick={this.props.handleBackButton}><ArrowLeft /></div>
              <input type="text"
                className="todo-header-title-input"
                value={todo.title}
                onChange={this.handleTitleChange} />
            </div>

            <div className="todo-actions">
              <ButtonRemove handleRemoveTodo={this.props.handleRemoveTodo} todo={todo} />
              <ButtonRemove handleRemoveTodo={this.props.handleRemoveTodo} todo={todo} />
            </div>
          </span>
        }
      </div>
    )
  }
}


Todo.propTypes = {
  todo: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool
  ]),
  handleSaveTodo: React.PropTypes.func.isRequired,
  handleBackButton: React.PropTypes.func.isRequired,
  handleRemoveTodo: React.PropTypes.func.isRequired
};
