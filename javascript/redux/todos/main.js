import React, {Component} from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';

import './main.scss';

import {TodoApp} from './containers';

import store from './config/store';
import actions  from './actions';

ReactDOM.render(
  <TodoApp store={store} actions={actions} />,
  document.getElementById('root')
);
