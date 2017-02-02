import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import TodoApp from './components/todo';
import DeviceWrapper from './components/device-wrapper';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h2>React Playground</h2>
        </div>

        <div className="app-wrapper">
          <DeviceWrapper type="mobile">
            <TodoApp />
          </DeviceWrapper>
        </div>

      </div>
    );
  }
}

export default App;
