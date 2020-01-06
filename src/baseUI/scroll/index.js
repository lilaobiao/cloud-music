import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo } from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import styled from 'styled-components';
import Loading from '../loading/index';
import Loading2 from '../loading-v2/index';
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const PullUpLoading = styled.div`
  position: absolute;
  left:0; right:0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

export const PullDownLoading = styled.div`
  position: absolute;
  left:0; right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`

// 下为问题代码，以此为鉴
// useEffect(() => {
//   if(bScroll) return;
//   const scroll = new BScroll(scrollContaninerRef.current, {
//     scrollX: direction === "horizental",
//     scrollY: direction === "vertical",
//     probeType: 3,
//     click: click,
//     bounce:{
//       top: bounceTop,
//       bottom: bounceBottom
//     }
//   });
//   setBScroll(scroll);
//   if(pullUp) {
//     scroll.on('scrollEnd', () => {
//       //判断是否滑动到了底部
//       if(scroll.y <= scroll.maxScrollY + 100){
//         pullUp();
//       }
//     });
//   }
//   if(pullDown) {
//     scroll.on('touchEnd', (pos) => {
//       //判断用户的下拉动作
//       if(pos.y > 50) {
//         debounce(pullDown, 0)();
//       }
//     });
//   }

//   if(onScroll) {
//     scroll.on('scroll', (scroll) => {
//       onScroll(scroll);
//     })
//   }

//   if(refresh) {
//     scroll.refresh();
//   }
//   return () => {
//     scroll.off('scroll');
//     setBScroll(null);
//   }
//   // eslint-disable-next-line
// }, []);
const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();

  const scrollContaninerRef = useRef();

  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;

  const { pullUp, pullDown, onScroll } = props;

  // 对上拉和下拉函数进行防抖处理
  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp]);

  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown]);

  // 组件挂载后创建scroll实例
  useEffect(() => {
    // scrollContaninerRef.current，拿到的是scrollContaniner组件
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
    return () => {
      setBScroll(null);
    }
    // eslint-disable-next-line
  }, []);

  // 绑定scroll方法
  useEffect(() => {
    if(!bScroll || !onScroll) return;
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll);
    })
    return () => {
      bScroll.off('scroll');
    }
  }, [onScroll, bScroll]);

  // 绑定scrollEnd方法
  useEffect(() => {
    if(!bScroll || !pullUp) return;
    bScroll.on('scrollEnd', () => {
      // 判断是否滑动到了底部
      if(bScroll.y <= bScroll.maxScrollY + 100){
        pullUpDebounce();
      }
    });
    return () => {
      bScroll.off('scrollEnd');
    }
  }, [pullUp, pullUpDebounce, bScroll]);

  // 绑定touchEnd方法
  useEffect(() => {
    if(!bScroll || !pullDown) return;
    bScroll.on('touchEnd', (pos) => {
      // 判断用户的下拉动作
      if(pos.y > 50) {
        pullDownDebounce();
      }
    });
    return () => {
      bScroll.off('touchEnd');
    }
  }, [pullDown, pullDownDebounce, bScroll]);

  // 绑定refresh方法，
  // 每次重新渲染都要刷新实例，防止无法滑动:
  useEffect(() => {
    if(refresh && bScroll){
      bScroll.refresh();
    }
  });

  // useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值，
  // 一般和 forwardRef 一起使用，ref 已经在 forWardRef 中默认传入
  // 说简单点就是，子组件可以选择性的暴露给父组件一些方法
  useImperativeHandle(ref, () => ({
    // 给外界暴露 refresh 方法
    refresh() {
      if(bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    // 给外界暴露 getBScroll 方法，提供 bs 实例
    getBScroll() {
      if(bScroll) {
        return bScroll;
      }
    }
  }));

  const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={ PullDowndisplayStyle }><Loading2></Loading2></PullDownLoading>
    </ScrollContainer>
  );
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll:null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
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

export default Scroll;
