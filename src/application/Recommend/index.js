import React, { useEffect } from 'react';
import Slider from '../../components/slider/';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list/';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';
import { forceCheck } from 'react-lazyload';
import { renderRoutes } from 'react-router-config';
import { EnterLoading } from './../Singers/style';
import Loading from '../../baseUI/loading-v2/index';

// Function Component 不存在生命周期，所以不要把 Class Component 的生命周期概念搬过来试图对号入座。
// Function Component 仅描述 UI 状态，React 会将其同步到 DOM，仅此而已。

// 这个地方最好可以用react-redux的hooks来实现，毕竟全面拥抱了hooks了。而且代码量也能减少不了，不污染props。
// 性能应该也更好一点。useSelector useDispatch
function Recommend(props){
  // 获取 props里的相关属性，而props对象的所有数据又是来自state
  const { bannerList, recommendList, songsCount, enterLoading } = props;

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  // 获取数据
  useEffect(() => {
    // 如果页面有数据，则不发请求
    //immutable 数据结构中长度属性 size
    if(!bannerList.size){
      getBannerDataDispatch();
    }
    if(!recommendList.size){
      getRecommendListDataDispatch();
    }
    // eslint-disable-next-line
  }, []);

  // 从immutableData 回到 JavaScript 对象 xxx.toJS()
  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() :[];

  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading? <EnterLoading><Loading></Loading></EnterLoading> : null}
      { renderRoutes(props.route.routes) }
    </Content>
  );
}

// 映射Redux全局的state到组件的props上
// state.getIn immutable的方法，用于获取
// 从state里面拿出该组件需要用到的相关数据
const mapStateToProps = (state) => ({
  bannerList: state.getIn(['recommend', 'bannerList']), // {recommend:{bannerList:2}} 得到2。访问深层次的key
  recommendList: state.getIn(['recommend', 'recommendList']),
  songsCount: state.getIn(['player', 'playList']).size,
  enterLoading: state.getIn(['recommend', 'enterLoading'])
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      // 页面获取数据，就是触发获取数据的 action，该 action 会拿到数据，放到 store 里面，至此，页面上便有了数据
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    }
  }
};

// 将ui组件包装成容器组件
// React-Redux提供一个connect方法使你可以从Redux store中读取数据（以及当store更新后，重新读取数据）
// connect方法接收两个参数，都是可选参数：
// mapStateToProps：每当store state发生变化时，就被调用。接收整个store state，并且返回一个该组件所需要的数据对象
// mapDispatchToProps：这个参数可以是一个函数或对象
// 如果是一个函数，一旦该组件被创建，就会被调用。接收dispatch作为一个参数，并且返回一个能够使用dispatch来分发actions的若干函数组成的对象
// 如果是一个action creators构成的对象，每一个action creator将会转化为一个prop function并会在调用时自动分发actions。


// 通常来说，在组件树中的 React 组件，只要有变化就会走一遍渲染流程。
// 但是通过 PureComponent 和 React.memo()，我们可以仅仅让某些组件进行渲染。但是 PureComponent 要依靠 class 才能使用
// 由于 React.memo() 是一个高阶组件，你可以使用它来包裹一个已有的 functional component：
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));
