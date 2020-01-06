import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from "./style";
import { CSSTransition } from "react-transition-group";
import Scroll from '../../baseUI/scroll/index';
import style from "../../assets/global-style";
import { connect } from 'react-redux';
import { getAlbumList, changePullUpLoading, changeEnterLoading } from './store/actionCreators';
import { EnterLoading } from './../Singers/style';
import Loading from './../../baseUI/loading/index';
import  Header  from './../../baseUI/header/index';
import AlbumDetail from '../../components/album-detail/index';
import { HEADER_HEIGHT } from './../../api/config';
import MusicNote from '../../baseUI/music-note/index';
import { isEmptyObject } from '../../api/utils';

function Album(props) {

  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false);

  const musicNoteRef = useRef();
  const headerEl = useRef();

  const id = props.match.params.id;

  const { currentAlbum, enterLoading, pullUpLoading, songsCount } = props;
  const { getAlbumDataDispatch, changePullUpLoadingStateDispatch } = props;

  let currentAlbumJS = currentAlbum.toJS();

  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  const handlePullUp = () => {
    changePullUpLoadingStateDispatch(true);
    changePullUpLoadingStateDispatch(false);
  };

  /**
   * 将传给子组件的函数用 useCallback 包裹，这也是 useCallback 的常用场景。
   * 以此为例，如果不用 useCallback 包裹，父组件每次执行时会生成
   * 不一样的 handleBack 和 handleScroll 函数引用，那么子组件每一次 memo
   * 的结果都会不一样，导致不必要的重新渲染，也就浪费了 memo 的价值。
   *
   * 因此 useCallback 能够帮我们在依赖不变的情况保持一样的函数引用，最大程度地节约浏览器渲染性能。
   */
  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y/minScrollY);
    let headerDom = headerEl.current;
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent-1)/2);
      setTitle(currentAlbumJS&&currentAlbumJS.name);
      setIsMarquee(true);
    } else{
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("歌单");
      setIsMarquee(false);
    }
  }, [currentAlbumJS]);

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const musicAnimation = (x , y) => {
    musicNoteRef.current.startAnimation({x, y});
  }

  return (
      <CSSTransition
        in={showStatus}
        timeout={300}
        classNames="fly"
        appear={true}
        unmountOnExit
        onExited={props.history.goBack}
      >
        <Container play={songsCount}>
          <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
          {
            !isEmptyObject(currentAlbumJS) ? (
              <Scroll
                onScroll={handleScroll}
                pullUp={handlePullUp}
                pullUpLoading={pullUpLoading}
                bounceTop={false}
              >
                <AlbumDetail currentAlbum={currentAlbumJS} pullUpLoading={pullUpLoading} musicAnimation={musicAnimation}></AlbumDetail>
              </Scroll>
            ) : null
          }
          { enterLoading ?  <EnterLoading><Loading></Loading></EnterLoading> : null}
          <MusicNote ref={musicNoteRef}></MusicNote>
        </Container>
      </CSSTransition>
  );
}
// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  pullUpLoading: state.getIn(['album', 'pullUpLoading']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  startIndex: state.getIn(['album', 'startIndex']),
  totalCount: state.getIn(['album', 'totalCount']),
  songsCount: state.getIn(['player', 'playList']).size
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id));
    },
    changePullUpLoadingStateDispatch(state) {
      dispatch(changePullUpLoading(state));
    }
  }
};

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
