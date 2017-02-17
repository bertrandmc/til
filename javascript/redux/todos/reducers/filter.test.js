
import {filter as reducer} from './filter';
import * as actions from '../actions/filter';

describe('Filter Reducer', () => {

  it('should set filter state to ALL', () => {
    const action = actions.setFilter('ALL');
    const resultState = reducer('TEST', action);

    expect(resultState).toEqual('ALL');
  });

})
