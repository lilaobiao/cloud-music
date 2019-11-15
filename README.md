# react hooks+redux+immutable.js仿网易云音乐打造精美webApp

打开方式:
1. 先将项目 clone 到本地
```shell
$ git clone ...
```

以下命令没有科学上网的朋友，建议使用 cnpm
```shell
$ cd cloud-music
$ npm install

// 下载子模块，这里面主要是api
$ git submodule update --init --recursive
$ cd NeteaseCloudMusicApi
$ npm install
$ cd ../  (注意: 一定要返回到上一层)
```

2. 运行，根目录下执行命令
```shell
$ npm run start
```

当然，你也可以分别启动api服务，在NeteaseCloudMusicApi目录下
```shell
$ npm run start
```
和客户端服务，在根目录下
```shell
$ npm run start:react
```

现在就在本地的3000端口访问了。如果要打包到线上，执行`npm run build`即可。


项目介绍:

本项目来自 github 开源项目本人在学习 react 时，参考本项目学了很多知识点。[项目原地址](https://github.com/sanyuan0704/react-cloud-music)

![](https://user-gold-cdn.xitu.io/2019/8/11/16c80048984d1af3?w=1423&h=1092&f=png&s=407282)

我当时克隆该项目的时间是 2019-11-7。

个人修改过的地方：

1. 删除了个人认为多出来的一层 div 包装 BlankLayout，见 src/routes/index.js 注释掉部分

2. 修改了 Home-Layout.js 多出来的一层 div，将最外层的 <div></div> 改成了 <></>

3. 加了一些注释，因为自己刚学 react, 很多地方看不懂，所以网上查资料加上了注释，方便自己理解


个人认为项目不太友好的地方（只是个人观点）：

1. 所有的页面使用了 fixed 来将内容固定在页面的固定地方，比如首页，除了顶部的固定内容，其他内容也是通过 fixed 定位的：
```cs
  position: fixed;
  top: 90px;
  left: 0;
  bottom: 60px;
  width: 100%;
```
如果是我个人做的话，我会把 id 为"root" 的 div 的高度设置成100vh，然后设置一个 padding-top 值，用于留给顶部的 tab，剩下的高度全部给大容器即可。

2. 项目用了阿里的图标库，但使用的方式不是加样式名，而是把图表内容写在标签体内，个人感觉不友好，以搜索图标为例
```html
<span
  className="iconfont search"
  onClick={() => props.history.push("/search")}
>
  &#xe62b;
</span>
```

个人更建议下面的用法，一眼就能根据样式名看出图标的大概意思，标签体也没内容(而且是用户看不到的无关内容)，十分干净
```html
<span
  className="iconfont search icon-search"
  onClick={() => props.history.push("/search")}
></span>
```


### 功能介绍

#### 1、推荐部分

首页推荐:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f735b83a0d15?w=372&h=668&f=gif&s=2856467)

推荐歌单详情:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f75ca0469552?w=372&h=668&f=gif&s=1862466)

空中切入切出效果，另外还有随着滑动会产生和标题跑马灯效果。
在歌单中歌曲数量过多的情况下，做了分页处理，随着滚动不断进行上拉加载，防止大量DOM加载导致的页面卡顿。

#### 2、歌手部分
歌手列表:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f793e8a1524b?w=372&h=668&f=gif&s=1224668)

这里做了异步加载的处理，上拉到底进行新数据的获取，下拉则进行数据的重新加载。

歌手详情:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f7ea74fffa11?w=372&h=668&f=gif&s=2435912)


#### 3、排行榜

榜单页:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f811ec0f7375?w=372&h=668&f=gif&s=2334445)

榜单详情:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f82639a1dc34?w=372&h=668&f=gif&s=2162917)

#### 4、播放器

播放器内核:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f8a5687ebb93?w=372&h=668&f=gif&s=3339773)

播放列表:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f98711c43ae3?w=372&h=667&f=gif&s=2223620)

会有移动端app一样的反弹效果。

#### 5、搜索部分

![](https://user-gold-cdn.xitu.io/2019/8/11/16c804bd87a2dbbe?w=372&h=667&f=gif&s=1275414)


### 项目部分模块分享

#### 1、利用better-scroll打造超级好用的scroll基础组件

```js
import React, { forwardRef, useState,useEffect, useRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import styled from 'styled-components';
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();

  const scrollContaninerRef = useRef();

  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;

  const { pullUp, pullDown, onScroll } = props;

  useEffect(() => {
    if(bScroll) return;
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce:{
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    setBScroll(scroll);
    if(pullUp) {
      scroll.on('scrollEnd', () => {
        //判断是否滑动到了底部
        if(scroll.y <= scroll.maxScrollY + 100){
          pullUp();
        }
      });
    }
    if(pullDown) {
      scroll.on('touchEnd', (pos) => {
        //判断用户的下拉动作
        if(pos.y > 50) {
          debounce(pullDown, 0)();
        }
      });
    }

    if(onScroll) {
      scroll.on('scroll', (scroll) => {
        onScroll(scroll);
      })
    }

    if(refresh) {
      scroll.refresh();
    }
    return () => {
      scroll.off('scroll');
      setBScroll(null);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(refresh && bScroll){
      bScroll.refresh();
    }
  })

  useImperativeHandle(ref, () => ({
    refresh() {
      if(bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    }
  }));

  const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={ PullUpdisplayStyle }></PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={ PullDowndisplayStyle }></PullDownLoading>
    </ScrollContainer>
  );
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: () => {},
  pullDown: () => {},
  bounceTop: true,
  bounceBottom: true
};

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,//是否支持向上吸顶
  bounceBottom: PropTypes.bool//是否支持向上吸顶
};

export default React.memo(Scroll);
```
#### 2、富有动感的loading组件

```js
import React from 'react';
import styled, {keyframes} from 'styled-components';
import style from '../../assets/global-style'

const dance = keyframes`
    0%, 40%, 100%{
      transform: scaleY(0.4);
      transform-origin: center 100%;
    }
    20%{
      transform: scaleY(1);
    }
`
const Loading = styled.div`
    height: 10px;
    width: 100%;
    margin: auto;
    text-align: center;
    font-size: 10px;
    >div{
      display: inline-block;
      background-color: ${style["theme-color"]};
      height: 100%;
      width: 1px;
      margin-right:2px;
      animation: ${dance} 1s infinite;
    }
    >div:nth-child(2) {
      animation-delay: -0.4s;
    }
    >div:nth-child(3) {
      animation-delay: -0.6s;
    }
    >div:nth-child(4) {
      animation-delay: -0.5s;
    }
    >div:nth-child(5) {
      animation-delay: -0.2s;
    }
`

function LoadingV2() {
  return (
    <Loading>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <span>拼命加载中...</span>
    </Loading>
  );
}

export default LoadingV2;
```

![](https://user-gold-cdn.xitu.io/2019/8/11/16c801f8bc254d65?w=250&h=35&f=gif&s=20097)

#### 3、模块懒加载及代码分割(CodeSpliting)
react官方已经提供了相应的方案, 用react自带的lazy和Suspense即可完成。
操作如下:
```js
import React, {lazy, Suspense} from 'react';
const HomeComponent = lazy(() => import("../application/Home/"));
const Home = (props) => {
  return (
    <Suspense fallback={null}>
      <HomeComponent {...props}></HomeComponent>
    </Suspense>
  )
};
......
export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render:  ()=> (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/recommend/",
        extra: true,
        key: 'home',
        component: Recommend,
        routes:[{
          path: '/recommend/:id',
          component: Album,
        }]
      }
      ......
    ]
  },

];
```


### 项目用到的知识清单

1. styled-components

styled-components 用于创建带样式的组件，参考[https://www.jianshu.com/p/2d5f037c7df9](https://www.jianshu.com/p/2d5f037c7df9)，本项目主要使用指南，在assets目录创建了一个global-style.js，定义全局样式（如皮肤）和一些通用样式（如禁止换行），在其他组件引入便可使用。

2. composeEnhancers、redux-thank

直接将thunk中间件引入，放在applyMiddleware方法之中，传入createStore方法，就完成了store.dispatch()的功能增强。
即可以在reducer中进行一些异步的操作。
```js
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
```
参考[https://blog.csdn.net/woshizisezise/article/details/51142968](https://blog.csdn.net/woshizisezise/article/details/51142968)


3. useState

useState 通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并。

我们在使用 useState 的第二个参数时，我们想要获取上一轮该 state 的值的话，只需要在 useState 返回的第二个参数，传入一个参数，该函数的参数就是上一轮的 state 的值
```js
setCount((count => count + 1)
```
当我们使用多个 useState 的时候，那 react 是如何识别那个是哪个呢，其实很简单，它是靠第一次执行的顺序来记录的，就相当于每个组件存放useState 的地方是一个数组，每使用一个新的 useState，就向数组中 push 一个 useState，所以，当我们在运行时改变 useState 的顺序，数据会混乱，增加 useState, 程序会报错。


4. useEffect

如果你熟悉 React class 的生命周期函数，你可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
```js
useEffect(() => {
  if(!bannerList.size){
    getBannerDataDispatch();
  }
  if(!recommendList.size){
    getRecommendListDataDispatch();
  }
  // return
  // eslint-disable-next-line
}, []);
```
参考[https://www.cnblogs.com/ascoders/p/10591832.html](https://www.cnblogs.com/ascoders/p/10591832.html)

useEffect 的第二个参数，有三种情况：<br/>
什么都不传，组件每次 render 之后 useEffect 都会调用，相当于 componentDidMount 和 componentDidUpdate；<br/>
传入一个空数组 [], 只会调用一次，相当于 componentDidMount 和 componentWillUnmount；<br/>
传入一个数组，其中包括变量，只有这些变量变动时，useEffect 才会执行。<br/>
如果方法最后 return 了方法，return 的方法会在dom卸载后执行，比如定时器的清除，就可以 return 一个 clearTimer 方法。
```js
useEffect(() => {
  window.addEventListener('resize', onChange, false)

  return () => {
    window.removeEventListener('resize', onChange, false)
  }
})
```


5. useMemo

useMemo 主要用于一个变量依赖于另一个变量，有点类似于vue的计算属性，主要用于性能优化。同时它也支持传入第二个参数，用法和 useEffect 类似。不过需要注意的是，它的首次执行是在渲染的时候，而不是渲染完成之后。
```js
const { pullUp, pullDown, onScroll } = props;

// 对传入的上拉和下拉函数进行防抖处理
let pullUpDebounce = useMemo(() => {
  return debounce(pullUp, 300)
}, [pullUp]);

let pullDownDebounce = useMemo(() => {
  return debounce(pullDown, 300)
}, [pullDown]);
```


6. useCallback

useCallback 可以说是 useMemo 的语法糖，能用 useCallback 实现的，都可以使用 useMemo, 在 react 中我们经常面临一个子组件渲染优化的问题，尤其是在向子组件传递函数props时，每次 render 都会创建新函数，导致子组件不必要的渲染，浪费性能，这个时候，就是 useCallback 的用武之地了，useCallback 可以保证，无论 render 多少次，我们的函数都是同一个函数，减小不断创建的开销。
```js
// 例1
const onClick = `useMemo`(() => {
  return () => {
    console.log('button click')
  }
}, [])

const onClick = useCallback(() => {
 console.log('button click')
}, [])

// 例2
const [count1, changeCount1] = useState(0);
const [count2, changeCount2] = useState(10);

const calculateCount = useCallback(() => {
  if (count1 && count2) {
    return count1 * count2;
  }
  return count1 + count2;
}, [count1, count2])

useEffect(() => {
  const result = calculateCount(count, count2);
  message.info(`执行副作用，最新值为${result}`);
}, [calculateCount])

/**其中和直接使用 useEffect 不同的地方在于使用 useCallback 生成计算的回调后，在使用该回调的副作用中，第二个参数应该是生成的回调。其实这个问题是很好理解的，我们使用 useCallback 生成了一个与 count1 / count2 相关联的回调方法，那么当关联的状态发生变化时会重新生成新的回调，副作用监听到了回调的变化就会去重新执行副作用，此时 useCallback 和 useEffect 是按顺序执行的， 这样就实现了副作用逻辑的抽离。
**/
```
同样，useCallback 的第二个参数和useMemo一样，没有区别。


7. useRef

useRef 总共有两种用法：

1.获取子组件的实例；
```js
const Children = forwardRef((props, ref) => {
  <div>
    <p>{props.title}</p>
  </div>
})

function App () {
  const [ count, setCount ] = useState(0)
  // 如果children组件不是一个forwardRef，这里会报错
  const childrenRef = useRef(null)
  // const
  const onClick = useMemo(() => {
    return () => {
      console.log('button click')
      console.log(childrenRef.current) // 这里可以得到Children实例
      setCount((count) => count + 1)
    }
  }, [])
  return (
    <div>
      点击次数: { count }
      <!-- ref得添加在一个forwardRef上才行 -->
      <Children ref={childrenRef}  count={count}></Children>
      <button onClick={onClick}>点我</button>
    </div>
    )
}
```

2.在函数组件中的一个全局变量，不会因为重复 render 而重复申明， 类似于类组件的 this.xxx。有些情况下，我们需要保证函数组件每次 render 之后，某些变量不会被重复申明，比如说 Dom 节点，定时器的 id 等等，在类组件中，我们完全可以通过给类添加一个自定义属性来保留，比如说 this.xxx， 但是函数组件没有 this，自然无法通过这种方法使用，有的朋友说，我可以使用 useState 来保留变量的值，但是 useState 会触发组件 render，在这里完全是不需要的，我们就需要使用 useRef 来实现了。
```js
function App () {
  const [ count, setCount ] = useState(0)
  // 注意，这里的ref并没有指定给任何元素
  const timer = useRef(null)
  console.log(timer)

  let timer2

  useEffect(() => {
    let id = setInterval(() => {
      setCount(count => count + 1)
    }, 500)

    timer.current = id
    timer2 = id
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const onClickRef = useCallback(() => {
    clearInterval(timer.current)
  }, [])

  const onClick = useCallback(() => {
    clearInterval(timer2)
  }, [])

  return (
    <div>
      点击次数: { count }
      <button onClick={onClick}>普通</button>
      <button onClick={onClickRef}>useRef</button>
    </div>
  )
}
```
参考：[https://blog.csdn.net/landl_ww/article/details/102158814](https://blog.csdn.net/landl_ww/article/details/102158814)


8. useImperativeHandle

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值，说简单点就是，子组件可以选择性的暴露给父组件一些方法，这样可以隐藏一些私有方法和属性，官方建议，useImperativeHandle 应当与 forwardRef 一起使用。
```js
function Kun (props, ref) {
  const kun = useRef()

  const introduce = useCallback (() => {
    console.log('i can sing, jump, rap, play basketball')
  }, [])
  // 这里用useImperativeHandle暴露了一个方法出去
  useImperativeHandle(ref, () => ({
    introduce: () => {
      introduce()
    }
  }));

  return (
    <div ref={kun}> { props.count }</div>
  )
}

const KunKun = forwardRef(Kun)

function App () {
  const [ count, setCount ] = useState(0)
  const kunRef = useRef(null)

  const onClick = useCallback (() => {
    setCount(count => count + 1)
    // 这里使用暴露出来的方法，执行子组件的内部逻辑
    kunRef.current.introduce()
  }, [])
  return (
    <div>
      点击次数: { count }
      <KunKun ref={kunRef}  count={count}></KunKun>
      <button onClick={onClick}>点我</button>
    </div>
    )
}
```


9. useReducer

useReducer 类似 redux 中的功能，相较于 useState，它更适合一些逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等特定场景， useReducer 总共有三个参数:<br/>
第一个参数是 一个 reducer，就是一个函数类似 (state, action) => newState 的函数，传入 上一个 state 和本次的 action;<br/>
第二个参数是初始 state，也就是默认值，是比较简单的方法;<br/>
第三个参数是惰性初始化，这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利。
```js
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0
  });
  return (
    <>
      点击次数: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```


10. 编写自己的钩子

最基本的钩子也就是返回包含了更多逻辑的 State 以及改变 State 方法的钩子。拿计数器来为例。
```js
import React, { useState } from 'react';

// 编写我们自己的hook，名字以use开头
function useCounter(initialValue) {
  // 接受初始化的值生成state
  const [count, changeCount] = useState(initialValue);
  // 声明减少的方法
  const decrease = () => {
    changeCount(count - 1);
  }
  // 声明增加的方法
  const increase = () => {
    changeCount(count + 1);
  }
  // 声明重置计数器方法
  const resetCounter = () => {
    changeCount(0);
  }
  // 将count数字与方法返回回去
  return [count, { decrease, increase, resetCounter }]
}

export default function myHooksView() {
  // 在函数组件中使用我们自己编写的hook生成一个计数器，并拿到所有操作方法的对象
  const [count, controlCount] = useCounter(10);
  return (
      <div>
        当前数量：{count}
            <button onClick={controlCount.decrease}>减少</button>
            <button onClick={controlCount.increase}>增加</button>
            <button onClick={controlCount.resetCounter}>重置</button>
    </div>
  )
}
```

封装一个弹窗
```js
import React, { useState } from 'react';
import { Modal } from 'antd';

function useModal() {
  const [visible, changeVisible] = useState(false);

  const toggleModalVisible = () => {
    changeVisible(!visible);
  };

  return [(
    <Modal
      visible={visible}
      onOk={toggleModalVisible}
      onCancel={toggleModalVisible}
    >
      弹窗内容
      </Modal>
  ), toggleModalVisible];
}

export default function HookDemo() {
  const [modal, toggleModal] = useModal();
  return (
    <div>
      {modal}
      <button onClick={toggleModal}>打开弹窗</button>
    </div>
  );
}
```


11. React.memo()

通常来说，在组件树中的 React 组件，只要有变化就会走一遍渲染流程。但是通过 PureComponent 和 React.memo()，我们可以仅仅让某些组件进行渲染。但是 PureComponent 要依靠 class 才能使用。由于 React.memo() 是一个高阶组件，你可以使用它来包裹一个已有的 functional component。


12. React.lazy() and suspence

React.lazy 用于做Code-Splitting，代码拆分。类似于按需加载，渲染的时候才加载代码。
```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
在我们的业务场景中，OtherComponent 可以代表多个条件渲染组件，我们全部加载完成才取消 loding。只要 promise 没执行到 resolve，suspense 都会返回 fallback 中的 loading。


13. immutableJS 部分 api

原生js转换为immutableData
```js
Immutable.fromJS([1,2]) // immutable的 list
Immutable.fromJS({a: 1}) // immutable的 map
```

从immutableData 回到 JavaScript 对象
```js
immutableData.toJS()
```

判断两个immutable数据是否一致
```js
Immutable.is(immutableA, immutableB)
```

判断是不是map或List
```js
Immutable.Map.isMap(x)
Immutable.Map.isList(x)
```

对象合并(注意是同个类型)
```js
immutableMaB = immutableMapA.merge(immutableMaC)
```

Map的增删改查
查
```js
immutableData.get('a') // {a:1} 得到1。
immutableData.getIn(['a', 'b']) // {a:{b:2}} 得到2。访问深层次的key
```

增和改(注意不会改变原来的值，返回新的值)
```js
immutableData.set('a', 2) // {a:1} 得到1。
immutableData.setIn(['a', 'b'], 3)
immutableData.update('a',function(x){return x+1})
immutableData.updateIn(['a', 'b'],function(x){return x+1})
```

删
```js
immutableData.delete('a')
immutableData.deleteIn(['a', 'b'])
```

List的增删查改
如同Map，不过参数变为数字索引。
```js
比如immutableList.set(1, 2)
```
其它便捷函数
如同underscore的方法。
