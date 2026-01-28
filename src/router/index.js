import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Detail_house from "@/views/Detail_house";
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin/AdminPanel'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/dashboard',
    name: 'DashboardPanel',
    component: () => import('../views/Admin/DashboardPanel'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/adminLots',
    name: 'AdminLots',
    component: () => import('../views/Admin/AdminLots'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // {
  //   path: '/admin/users',
  //   name: 'AdminUsers',
  //   component: () => import('../views/Admin/AdminUsers'),
  //   meta: { requiresAuth: true, requiresAdmin: true }
  // },
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

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthenticated = store.getters.isAuthenticated;
   

  // Если требуется аутентификация
  if (requiresAuth && !isAuthenticated) {
    return next('/');
  }

  // Если требуются права администратора
  if (requiresAdmin) {
    // Если пользователь не загружен, ждем загрузки
    if (isAuthenticated && store.state.user.status === 'loading') {
      await store.dispatch('fetchCurrentUser');
    }

    if (!store.getters.isAdmin) {
      return next('/');
    }
  }

  next();
});

export default router
