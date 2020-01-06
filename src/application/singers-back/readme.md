该文件夹是 singers 文件夹的备份文件夹，里面包含了使用 hooks 实现 Redux 的代码示例，
详细请见 data.js

## 用 hooks 写一个简单的 redux 过程

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
