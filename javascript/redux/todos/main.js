import React, {Component} from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import uniqid from 'uniqid';
console.log(uniqid);


// todos reducer
function todos(state = [], action) {
  switch(action.type) {
    case 'TODO_NEW':
      return [
        ...state,
        action.payload
      ]
    default:
      return state;
  }
}

// filter reducer
function filter(state='ALL', action) {
  return state
}

const reducers = combineReducers({todos, filter});
const store = createStore(reducers);

const TodoList = ({todos}) => {
  return (
    <div className="todo-list">
      {todos.map(todo => <div key={todo.id}>{todo.title}</div>)}
    </div>
  )
}

class TodoForm extends Component {
  state = {title: ''}
  static propTypes = {
    handleNewTodo: React.PropTypes.func.isRequired
  }

  handleInputChange = (event) => {
    this.setState({title: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.handleNewTodo({
      id: uniqid(),
      title: this.state.title
    });

    this.setState({title: ''})
  }

  render () {
    return (
      <div className="todo-form">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.title} onChange={this.handleInputChange} />
        </form>
      </div>
    )
  }
}

const handleNewTodo = (newTodo) => {
  store.dispatch({type: 'TODO_NEW', payload: newTodo});
}

const App = () => {
  return (
    <div>
      <h1>Todos</h1>
      <TodoForm handleNewTodo={handleNewTodo} />
      <TodoList todos={store.getState().todos} />
    </div>
  )
}

const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
};

store.subscribe(render);
render();
