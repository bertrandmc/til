import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Router} from './router';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
