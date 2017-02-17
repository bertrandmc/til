
import * as filterActions from './filter';
import * as actionTypes from '../actionsTypes/filter';

describe('FilterActions', () => {

  it('should return correct FILTER_SET action object', () => {
    const actionObj = filterActions.setFilter('ALL');
    const expectReuslt = {
      type: actionTypes.FILTER_SET,
      payload: 'ALL'
    }

    expect(actionObj).toEqual(expectReuslt);
  });
})
