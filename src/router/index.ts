import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/index",
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/index.vue'),
      meta: {
        title: '蜗蜗租房',
      },
    },
    //收藏房源
    {
      path: '/collect',
      name: 'collect',
      component: () => import('@/views/collect.vue'),
      meta: {
        title: '收藏房源',
        keepAlive: true,
      },
    },
    //租房福利 
    {
      path: '/welfare',
      name: 'welfare',
      component: () => import('@/views/welfare.vue')
    }, //租房社区community
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/community.vue')
    },   //房源详情
    {
      path: '/details',
      name: 'details',
      // params: { houseResourceNo: '' },
      component: () => import('@/views/details.vue')
    },
    //房管政策
    {
      path: '/note',
      name: 'note',
      component: () => import('@/views/note.vue')
    },
    //房管政策
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/map.vue')
    },
  ],
})

export default router
