import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Leaderboard from '../views/Leaderboard'

Vue.use(VueRouter)

const DEFAULT_TITLE = process.env.VUE_APP_SITE_NAME || 'L4D2 Stats Plugin';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/leaderboard',
    alias: '/top',
    name: 'Leaderboard',
    meta: {
      title_part: 'Leaderboards'
    },
    component: Leaderboard
  },
  {
    path: '/maps/:map?',
    name: 'Maps',
    meta: {
      title_part: 'Maps'
    },
    component: () => import(/* webpackChunkName: "maps" */ '@/views/Maps'),
  },
  {
    path: '/search/:query',
    name: 'Search',
    meta: {
      title_part: 'Search'
    },
    component: () => import(/* webpackChunkName: "search" */ '@/views/Search.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    meta: {
    },
    component: () => import(/* webpackChunkName: "faq" */ '@/views/FAQ.vue')
  },
  {
    path: '/times',
    name: 'Times',
    component: () => import(/* webpackChunkName: "times" */ '@/views/Times.vue')
  },
  {
    path: '/user/:user',
    name: 'User',
    redirect: '/user/:user/overview',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '@/views/User.vue'),
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'overview',
        meta: { keep_title: true },
        component: () => import('@/components/user/overview')
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user /:id/posts is matched
        path: 'campaign',
        meta: { keep_title: true },
        component: () => import('@/components/user/campaign')
      },
      {
        path: '*',
        component: () => import(/* webpackChunkName: "error_404" */ '@/views/404.vue') 
      }
    ]
  },
  {
    path: '*',
    meta: { title_part: 'Page Not Found' },
    name: 'PageNotFound',
    component: () => import(/* webpackChunkName: "error_404" */ '@/views/404.vue') 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to) => {
    if (to.hash) {      
      return {       
        selector: to.hash      
      }
    }  
  },
  linkActiveClass: 'is-active'
})
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    if(!to.meta.keep_title) {
      if(to.meta.title) document.title =  to.meta.title || DEFAULT_TITLE;
      else {
        const part = to.meta.title_part || to.name;
        if(part) {
          document.title = `${part} - ${DEFAULT_TITLE}`
        }else{
          document.title = DEFAULT_TITLE;
        }
      }
    }
  });
});

export default router
