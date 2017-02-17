import {createStore, combineReducers} from 'redux';
import { todos, filter } from '../reducers';

const reducers = combineReducers({todos, filter});
const store = createStore(reducers);

export default store;
