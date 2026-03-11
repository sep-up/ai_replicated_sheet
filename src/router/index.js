import { createRouter, createWebHistory } from 'vue-router'
import ProductionReport from '../views/ProductionReport.vue'

const routes = [
  {
    path: '/',
    name: 'ProductionReport',
    component: ProductionReport
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
