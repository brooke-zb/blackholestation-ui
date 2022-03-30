import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/utils/store'

const routes: RouteRecordRaw[] = [
  // 前台展示
  {
    path: '/', name: 'home',
    component: () => import('@/pages/Layout.vue'),
    children: [
      // 主页
      {
        path: 'index.html', redirect: '/',
      },
      {
        path: '', name: 'index',
        component: () => import('@/pages/index/Index.vue'),
      },

      // 归档
      {
        path: 'archive', name: 'archive',
        component: () => import('@/pages/archive/Archive.vue')
      },

      // 分类
      {
        path: 'categories', name: 'categories',
        component: () => import('@/pages/categories/Categories.vue')
      },
      {
        path: 'categories/:cid(\\d+)', name: 'category_list',
        component: () => import('@/pages/categories/CategoryList.vue'),
        props: route => ({
          cid: Number(route.params.cid),
        }),
      },

      // 标签
      {
        path: 'tags', name: 'tags',
        component: () => import('@/pages/tags/Tags.vue')
      },
      {
        path: 'tags/:name', name: 'tag_list',
        component: () => import('@/pages/tags/TagList.vue'),
        props: true
      },

      // 友链
      {
        path: 'friends', name: 'friends',
        component: () => import('@/pages/friends/Friends.vue')
      },

      // 文章页面
      {
        path: 'articles/:aid(\\d+)', name: 'article',
        component: () => import('@/pages/article/Article.vue'),
        props: route => ({
          aid: Number(route.params.aid),
        }),
      },
    ]
  },

  // 后台管理
  {
    path: '/admin', name: 'admin',
    component: () => import('@/pages/admin/Admin.vue'),
    children: [
      {
        path: 'login', name: 'login',
        component: () => import('@/pages/admin/Login.vue'),
      },
      {
        path: '', name: 'admin_index',
        component: () => import('@/pages/admin/Index.vue'),
        children: [
          {
            path: 'articles', alias: [''],
            component: () => import('@/pages/admin/Article.vue'),
          },
        ]
      },
    ],
  },


  // 404页面
  {
    path: '/:pathMatch(.*)*', name: '404',
    component: () => import('@/pages/error/Error.vue'),
    props: {
      code: '404',
      title: '页面丢失了',
    }
  },
]

export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  routes,
})

router.beforeEach(async (to, from) => {
  store.state.isPageLoading = true
  // }
  store.state.isSideMenuOpen = false
  // await sleep(500)
})
router.beforeResolve((to, from) => {
  store.state.isPageLoading = false
})

// DEBUG
// function sleep(ms: number) {
//   return new Promise<void>((resolve, reject) => {
//     setTimeout(() => {
//       resolve()
//     }, ms)
//   })
// }