import React, {Component} from 'react';
import uniqid from 'uniqid';

import './TodoForm.scss';

export class TodoForm extends Component {
  state = {title: ''}

  static propTypes = {
    handleNewTodo: React.PropTypes.func.isRequired
  }

  handleInputChange = (event) => {
    this.setState({title: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(!this.state.title) return;

    const newTodo = {
      id: uniqid(),
      title: this.state.title
    };

    this.setState({title: ''})
    this.props.handleNewTodo(newTodo);
  }

  render () {
    return (
      <div className="todo-form">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.title} onChange={this.handleInputChange} />
          <button onClick={this.handleSubmit}>+</button>
        </form>
      </div>
    )
  }
}
