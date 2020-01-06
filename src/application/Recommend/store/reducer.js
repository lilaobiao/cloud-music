import * as actionTypes from './constants';
import { fromJS } from 'immutable';

// 每个模块创建自己的reducer
const defaultState = fromJS({
  bannerList: [],
  recommendList: [],
  enterLoading: true
})

// 由于存放的是 immutable 数据结构，
// 所以必须用 set 方法来设置新状态，同时取状态用 get 方法。
export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_BANNER:
      return state.set('bannerList', action.data);
    case actionTypes.CHANGE_RECOMMEND_LIST:
      return state.set('recommendList', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state;
  }
}
