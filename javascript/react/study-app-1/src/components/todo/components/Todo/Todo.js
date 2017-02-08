import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import moment from 'moment';

import './todo.css';
import DatePicker from '../Inputs/DatePicker';
import IconCalendar from 'react-icons/lib/md/event';
import IconPencil from 'react-icons/lib/fa/pencil';
import ArrowLeft from 'react-icons/lib/md/keyboard-arrow-left';
import { ButtonRemove } from '../';



export class Todo extends Component {
  state = {
    showDatePicker: false
  }

  constructor(props) {
    super(props);

    this.debouncedHandleSaveTodo = debounce(props.handleSaveTodo, 300);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.todo && this.state.todo) {
      // back button called
      // allow 400ms for animation before removing it from state
      setTimeout(() => {
        this.setState({
          todo: nextProps.todo,
          activateDatePicker: false
        });
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

  handleInputChange = (propName, event) => {
    event.preventDefault();
    this.handleSave(propName, event.target.value);
  }

  handleDueDate = (date) => {
    this.handleSave('dueDate', date.format());
    this.toggleDatePicker();
  }

  toggleDatePicker = () => {
    this.setState((prevState) => ({
      showDatePicker: !prevState.showDatePicker,
      // When todo loads datePicker is not activated for better slide animation
      // when user clicks calendar for first time then it is activated and kept like that
      activateDatePicker: true
    }));
  }

  getFriendlyDate(date) {
    if(!date) return;
    return moment(date).calendar(null, {
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      lastWeek: 'dddd Do',
      nextWeek: 'dddd Do',
      sameElse: 'MMMM Do'
    });
  }

  render() {
    const { todo, showDatePicker, activateDatePicker } = this.state;

    return (
      <div className={classNames("todo", this.props.className)}>
        {todo &&
          <span>
            <div className="todo-header">
              <div className="todo-header-back-button" onClick={this.props.handleBackButton}><ArrowLeft /></div>
              <input type="text"
                className="todo-header-title-input"
                value={todo.title}
                onChange={event => this.handleInputChange('title', event)} />
            </div>

            <div className="todo-prop todo-prop-due-date" onClick={this.toggleDatePicker}>
              <IconCalendar className="todo-prop-icon" />
              <div>{this.getFriendlyDate(todo.dueDate)}</div>
            </div>

            <div className="todo-prop todo-prop-comment">
              <IconPencil className="todo-prop-icon" />
              <div>
                  <textarea rows="5"
                    value={todo.notes}
                    onChange={event => this.handleInputChange('notes', event)}></textarea>
              </div>
            </div>

            <div className="todo-actions">
              <ButtonRemove handleRemoveTodo={this.props.handleRemoveTodo} todo={todo} />
            </div>

            {activateDatePicker &&
              <DatePicker isVisible={showDatePicker} selectedDate={todo.dueDate} handleChange={this.handleDueDate} />
            }
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
