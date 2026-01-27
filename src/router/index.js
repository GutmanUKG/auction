import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Detail_house from "@/views/Detail_house";
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin/AdminPanel')
  },
  {
    path: '/dashboard',
    name: 'DashboardPanel',
    component: () => import('../views/Admin/DashboardPanel')
  },
  {
    path: '/adminLots',
    name: 'AdminLots',
    component: () => import('../views/Admin/AdminLots')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/create-house',
    name: 'create_house',
    component: () => import('../views/CreateHousePage.vue')
  },
  {
    path: '/:id',
    name: 'detail_house',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Detail_house
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
