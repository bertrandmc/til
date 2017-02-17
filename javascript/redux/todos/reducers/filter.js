import * as actionTypes from '../actionsTypes/filter';

// filter reducer
export const filter = (state='ALL', action) => {
  switch(action.type) {
    case actionTypes.FILTER_SET:
      return action.payload;
    default:
      return state;
  }
}
