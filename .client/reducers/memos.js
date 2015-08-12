import { SAVE_MEMO } from '../constants/ActionTypes';

const initialState = { memo: '' };

export default function memos(state = initialState, action) {

  switch (action.type) {
  case SAVE_MEMO:

    state.memo = action.memo;
    return state;
  default:
    return state;
  }
}
