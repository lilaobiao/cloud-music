import React, { lazy, Suspense } from "react";
import { Redirect } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
// 这一级显得有点多余，暂时注释掉
// import BlankLayout from "../layouts/BlankLayout";

const SuspenseComponent = Component => props => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  )
}

// 组件懒加载
const RecommendComponent = lazy(() => import("../application/Recommend/"));
const SingersComponent = lazy(() => import("../application/Singers/"));
const RankComponent = lazy(() => import("../application/Rank/"));
const AlbumComponent = lazy(() => import("../application/Album/"));
const SingerComponent = lazy(() => import("./../application/Singer/"));
const SearchComponent = lazy(() => import("./../application/Search/"));

// export default [
//   {
//     component: BlankLayout,
//     routes: [
//       {
//         path: "/",
//         component: HomeLayout,
//         routes: [
//           {
//             path: "/",
//             exact: true,
//             render: () => <Redirect to={"/recommend"} />
//           },
//           {
//             path: "/recommend", // 首页
//             component: SuspenseComponent(RecommendComponent),
//             routes: [
//               {
//                 path: "/recommend/:id", // 歌单
//                 component: SuspenseComponent(AlbumComponent)
//               }
//             ]
//           },
//           {
//             path: "/singers", // 歌手
//             component: SuspenseComponent(SingersComponent),
//             key: "singers",
//             routes: [
//               {
//                 path: "/singers/:id", // 歌手详情页
//                 component: SuspenseComponent(SingerComponent)
//               }
//             ]
//           },
//           {
//             path: "/rank/", // 排行榜
//             component: SuspenseComponent(RankComponent),
//             key: "rank",
//             routes: [
//               {
//                 path: "/rank/:id", // 排行榜详情页
//                 component: SuspenseComponent(AlbumComponent)
//               }
//             ]
//           },
//           {
//             path: "/album/:id",
//             exact: true,
//             key: "album",
//             component: SuspenseComponent(AlbumComponent)
//           },
//           {
//             path: "/search",
//             exact: true,
//             key: "search", // 搜索页
//             component: SuspenseComponent(SearchComponent)
//           }
//         ]
//       }
//     ]
//   }
// ];



// 固定在底部的播放组件是所有页面公用的
export default [
  {
    path: "/",
    component: HomeLayout,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/recommend"} />
      },
      {
        path: "/recommend", // 首页
        component: SuspenseComponent(RecommendComponent),
        routes: [
          {
            path: "/recommend/:id", // 歌单
            component: SuspenseComponent(AlbumComponent)
          }
        ]
      },
      {
        path: "/singers", // 歌手
        component: SuspenseComponent(SingersComponent),
        key: "singers",
        routes: [
          {
            path: "/singers/:id", // 歌手详情页
            component: SuspenseComponent(SingerComponent)
          }
        ]
      },
      {
        path: "/rank/", // 排行榜
        component: SuspenseComponent(RankComponent),
        key: "rank",
        routes: [
          {
            path: "/rank/:id", // 排行榜详情页
            component: SuspenseComponent(AlbumComponent)
          }
        ]
      },
      {
        path: "/album/:id",
        exact: true,
        key: "album",
        component: SuspenseComponent(AlbumComponent)
      },
      {
        path: "/search",
        exact: true,
        key: "search", // 搜索页
        component: SuspenseComponent(SearchComponent)
      }
    ]
  }
];
