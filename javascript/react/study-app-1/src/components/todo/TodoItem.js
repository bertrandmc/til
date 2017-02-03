import React, {Component} from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import {StatusButton, RemoveButton} from './components';

export class TodoItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      todo: props.todo,
      isEditing: !props.todo.title ? true : false
    };

    this.debouncedHandleSaveTodo = debounce(props.handleSaveTodo, 300);
  }

  componentWillReceiveProps(nextProps) {
    this.setState((prevState, props) => ({
      todo: nextProps.todo
    }));
  }

  handleSave = (propName, value) => {
    this.setState((prevState, props) => {
      const updatedTodo = {...prevState.todo, [propName]: value};
      this.debouncedHandleSaveTodo(updatedTodo);
      return {todo: updatedTodo};
    });
  }

  toggleEditMode = () => {
    this.setState((prevState, props) => {

      /**
        * if edit mode is being turned off we must delay
        * removing the edit action buttons to allow todo element to animate close
        **/
      if(prevState.isEditing) {
        setTimeout(() => {
          this.setState((prevState) => ({
            holdEditingTools: prevState.isEditing
          }));
        }, 1000);
      }

      return {
        isEditing: !prevState.isEditing,
        holdEditingTools: prevState.isEditing
      };
    });
  }

  render() {
    const { todo, holdEditingTools, isEditing } = this.state;

    return (
      <li className={classNames('todo-item', {'todo-item__complete': todo.isComplete, 'todo-item__editing': isEditing})}
          onClick={this.toggleEditMode}>

        <StatusButton
          status={todo.isComplete}
          handleToggle={status => this.handleSave('isComplete', status)}
        />

        {!isEditing && <div className="todo-item-label">{todo.title}</div>}
        { isEditing &&
          <input type="text"
              autoFocus={!todo.title}
              className="todo-item-label-input"
              onClick={event => event.stopPropagation()}
              onDoubleClick={this.toggleEditMode}
              onChange={event => this.handleSave('title', event.target.value)}
              value={todo.title}/>}

        {(isEditing || holdEditingTools) &&
          <div className="todo-item-actions">
            <RemoveButton  handleRemoveTodo={this.props.handleRemoveTodo} todo={todo} />
          </div>
        }
      </li>
    )
  }
}


TodoItem.propTypes = {
  todo: React.PropTypes.object.isRequired,
  handleSaveTodo: React.PropTypes.func.isRequired,
  handleRemoveTodo: React.PropTypes.func.isRequired,
};
