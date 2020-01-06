# 项目用到的技术一览

## styled-components

先安装，npm install styled-components --save

再使用
```js
// style.js
import { createGlobalStyle } from'styled-components';

export const GlobalStyle = createGlobalStyle`
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
	a {
		text-decoration: none;
		color: #fff;
	}
`


// App.js 中添加这一句
import { GlobalStyle } from  './style';

// 直接在页面使用
import styled, {keyframes} from 'styled-components';
// 定义变量
const confirmFadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`;
const confirmZoom = keyframes`
  0%{
    transform: scale(0);
  }
  50%{
    transform: scale(1.1);
  }
  100%{
    transform: scale(1);
  }
`
const ConfirmWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: ${style["background-color-shadow"]};
  &.confirm-fade-enter-active{
    /*使用变量*/
    animation: ${confirmFadeIn} 0.3s;
    .confirm_content{
      animation: ${confirmZoom} 0.3s
    }
  }
`
```

## swiper 插件，用于开发推荐页的slider

npm install swiper --save


## better-scroll 滑动组件

```js
// 安装 better-scroll
npm install better-scroll@next --save

Scroll.propTypes = {
  direction: PropTypes.oneOf (['vertical', 'horizental']),// 滚动的方向
  click: true,// 是否支持点击
  refresh: PropTypes.bool,// 是否刷新
  onScroll: PropTypes.func,// 滑动触发的回调函数
  pullUp: PropTypes.func,// 上拉加载逻辑
  pullDown: PropTypes.func,// 下拉加载逻辑
  pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool,// 是否支持向上吸顶
  bounceBottom: PropTypes.bool// 是否支持向下吸底
};
```

## redux 层开发

以 Recommend 组件举例，在 Recommend 目录下，新建 store 文件夹，然后新建以下文件
```js
actionCreators.js// 放不同 action 的地方
constants.js      // 常量集合，存放不同 action 的 type 值
index.js          // 用来导出 reducer，action
reducer.js        // 存放 initialState 和 reducer 函数
```

1. 声明初始化 state，初始化 state 在 reducer 中进行
```js
//reducer.js
import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构

const defaultState = fromJS ({
  bannerList: [],
  recommendList: [],
});
```

2. 定义 constants
```js
//constants.js
export const CHANGE_BANNER = 'recommend/CHANGE_BANNER';
export const CHANGE_RECOMMEND_LIST = 'recommend/RECOMMEND_LIST';
```

3. 定义 reducer 函数
在 reducer.js 文件中加入以下处理逻辑，由于存放的是 immutable 数据结构，所以必须用 set 方法来设置新状态，同时取状态用 get 方法。
```js
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BANNER:
      return state.set ('bannerList', action.data);
    case actionTypes.CHANGE_RECOMMEND_LIST:
      return state.set ('recommendList', action.data);
    default:
      return state;
  }
}
```

4. 编写具体的 action
```js
//actionCreators.js
import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 将 JS 对象转换成 immutable 对象
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS (data)
});

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS (data)
});

export const getBannerList = () => {
  return (dispatch) => {
    getBannerRequest ().then (data => {
      dispatch (changeBannerList (data.banners));
    }).catch (() => {
      console.log ("轮播图数据传输错误");
    })
  }
};

export const getRecommendList = () => {
  return (dispatch) => {
    getRecommendListRequest ().then (data => {
      dispatch (changeRecommendList (data.result));
    }).catch (() => {
      console.log ("推荐歌单数据传输错误");
    });
  }
};
```

5. 将相关变量导出
```js
//index.js
import reducer from './reducer'
import * as actionCreators from './actionCreators'

export { reducer, actionCreators };
```

6. 组件连接 Redux
首先，需要将 recommend 下的 reducer 注册到全局 store，在 store/reducer.js 中，内容如下:
```js
import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index';

export default combineReducers ({
  recommend: recommendReducer,
});
```
注册完成！

现在在 Recommend/index.js 中，准备连接 Redux。组件代码更新如下:
```js
import React, { useEffect } from 'react';
import Slider from '../../components/slider/';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list/';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';

function Recommend (props){
  const { bannerList, recommendList } = props;

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  useEffect (() => {
    getBannerDataDispatch ();
    getRecommendListDataDispatch ();
    //eslint-disable-next-line
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS () : [];
  const recommendListJS = recommendList ? recommendList.toJS () :[];

  return (
    <Content>
      <Scroll>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
    </Content>
  );
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  // 不要在这里将数据 toJS
  // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
  bannerList: state.getIn (['recommend', 'bannerList']),
  recommendList: state.getIn (['recommend', 'recommendList']),
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch () {
      dispatch (actionTypes.getBannerList ());
    },
    getRecommendListDataDispatch () {
      dispatch (actionTypes.getRecommendList ());
    },
  }
};

// 将 ui 组件包装成容器组件
export default connect (mapStateToProps, mapDispatchToProps)(React.memo (Recommend));
```

如果以后要加入新状态，或者创建新的 reducer 模块，直接走这些步骤即可。

## 图片懒加载

```js
// 安装
npm install react-lazyload --save

// 使用
// components/list.js 引入
import LazyLoad from "react-lazyload";

// img 标签外部包裹一层 LazyLoad
<LazyLoad placeholder={<img width="100%" height="100%" src={require ('./music.png')} alt="music"/>}>
  <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music"/>
</LazyLoad>
```

上面做到了视口内的图片显示真实资源，视口外则显示占位图片，那么当我们滑动的时候，如何让下面相应的图片显示呢？其实也相当简单，在 Recommend/index.js 中:
```js
// 引入 forceCheck 方法
import { forceCheck } from 'react-lazyload';

// scroll 组件中应用这个方法
<Scroll className="list" onScroll={forceCheck}>
...
```
这样随着页面滑动，下面的图片会依次显示，没有任何问题。

## 用 hooks 写一个简单的 redux

在 Singers 目录下新建一个文件 data.js, 模拟一个简单的 redux 代码如下：
```js
import React, {createContext, useReducer} from 'react';
import { fromJS } from 'immutable';

//context
export const CategoryDataContext = createContext ({});

// 相当于之前的 constants
export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

//reducer 纯函数
const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY:
      return state.set ('category', action.data);
    case CHANGE_ALPHA:
      return state.set ('alpha', action.data);
    default:
      return state;
  }
};

//Provider 组件
export const Data = props => {
  //useReducer 的第二个参数中传入初始值
  const [data, dispatch] = useReducer (reducer, fromJS ({
    category: '',
    alpha: ''
  }));
  return (
    <CategoryDataContext.Provider value={{data, dispatch}}>
      {props.children}
    </CategoryDataContext.Provider>
  )
}
```

然后，在 App.js 中用 Data 这个 Provider 组件来包裹下面的子组件：
```js
// App.js
// 增加引入代码
import { Data } from './application/Singers/data';

function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <Data>
          { renderRoutes (routes) }
        </Data>
      </HashRouter>
    </Provider>
  )
}
```

然后在 Singers/index.js 来运用：
```js
// 首先需要引入 useContext
// 将之前的 useState 代码删除
const {data, dispatch} = useContext (CategoryDataContext);
// 拿到 category 和 alpha 的值
const {category, alpha} = data.toJS ();
```

而且 handleUpdatexxx 函数也要修改：
```js
//CHANGE_ALPHA 和 CHANGE_CATEGORY 变量需要从 data.js 中引入
let handleUpdateAlpha = (val) => {
  dispatch ({type: CHANGE_ALPHA, data: val});
  updateDispatch (category, val);
};

let handleUpdateCatetory = (val) => {
  dispatch ({type: CHANGE_CATEGORY, data: val});
  updateDispatch (val, alpha);
};
```
