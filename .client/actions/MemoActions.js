import * as types from '../constants/ActionTypes';

export function saveMemo(memo) {
  return {
    type: types.SAVE_MEMO,
    memo 
  };
}