import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/production-report'
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/pages/demo/index.vue')
  },
  {
    path: '/production-report',
    name: 'production-report',
    component: () => import('@/pages/production-report/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
