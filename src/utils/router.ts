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
        component: () => import('@/pages/archive/Archive.vue'),
      },

      // 分类
      {
        path: 'categories', name: 'categories',
        component: () => import('@/pages/categories/Categories.vue'),
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
        component: () => import('@/pages/tags/Tags.vue'),
      },
      {
        path: 'tags/:name', name: 'tag_list',
        component: () => import('@/pages/tags/TagList.vue'),
        props: true,
      },

      // 友链
      {
        path: 'friends', name: 'friends',
        component: () => import('@/pages/friends/Friends.vue'),
      },

      // 文章页面
      {
        path: 'articles/:aid(\\d+)', name: 'article',
        component: () => import('@/pages/article/Article.vue'),
        props: route => ({
          aid: Number(route.params.aid),
        }),
      },
    ],
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
    ],
  },

  // 404页面
  {
    path: '/:pathMatch(.*)*', name: '404',
    component: () => import('@/pages/error/Error.vue'),
    props: {
      code: '404',
      title: '页面丢失了',
    },
  },
]

export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  routes,
})

router.beforeEach((to, from, next) => {
  store.state.isPageLoading = true
  store.state.isSideMenuOpen = false

  // 动态添加路由
  if (store.state.isUserLoaded) {
    next()
  } else {
    store.getLoginUser().then(() => {
      parseRouter(store.state.user?.role.permissions || [])
      next({ path: to.fullPath, replace: true })
    })
  }
})

router.beforeResolve(() => {
  store.state.isPageLoading = false
})

// 根据用户权限添加管理路由
function parseRouter(permissions: string[]) {
  // 添加公共路由
  router.addRoute('admin', {
    path: '', name: 'admin_layout',
    component: () => import('@/pages/admin/Layout.vue'),
    children: [
      {
        path: '', name: 'admin_index',
        component: () => import('@/pages/admin/index/Index.vue'),
      },
    ],
  })

  // 权限判定，添加管理路由
  let pages: Record<string, RouteRecordRaw> = {}
  permissions.forEach(permission => {
    switch (permission) {
      case 'ARTICLE:READONLY':
      case 'ARTICLE:FULLACCESS':
        pages.article = {
          path: 'articles', name: 'admin_article',
          component: () => import('@/pages/admin/article/AdminArticle.vue'),
        }
        break
      case 'CATEGORY:FULLACCESS':
        pages.category = {
          path: 'categories', name: 'admin_category',
          component: () => import('@/pages/admin/category/AdminCategory.vue'),
        }
        break
      case 'COMMENT:READONLY':
      case 'COMMENT:FULLACCESS':
        pages.comment = {
          path: 'comments', name: 'admin_comment',
          component: () => import('@/pages/admin/comment/AdminComment.vue'),
        }
        break
      case 'ROLE:READONLY':
      case 'ROLE:FULLACCESS':
        pages.role = {
          path: 'roles', name: 'admin_role',
          component: () => import('@/pages/admin/role/AdminRole.vue'),
        }
        break
      case 'TAG:FULLACCESS':
        pages.tag = {
          path: 'tags', name: 'admin_tag',
          component: () => import('@/pages/admin/tag/AdminTag.vue'),
        }
        break
      case 'USER:READONLY':
      case 'USER:FULLACCESS':
        pages.user = {
          path: 'users', name: 'admin_user',
          component: () => import('@/pages/admin/user/AdminUser.vue'),
        }
        break
    }
  })

  // 添加路由
  for (const key in pages) {
    if (pages[key]) {
      router.addRoute('admin_layout', pages[key])
    }
  }

  // 添加404路由
  router.addRoute('admin_layout', {
    path: ':pathMatch(.*)+', name: 'admin_404',
    component: () => import('@/pages/error/Error.vue'),
    props: {
      code: '404',
      title: '页面丢失了',
    },
  })
}