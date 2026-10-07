import { getRole, isAuthenticated } from '@/services/auth.js'
import OperatorView from '@/views/OperatorView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/operator',
      component: OperatorView,
      meta: {
        requiresAuth: true,
        role: 'Operador'
      }
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login'
  }

  if (to.meta.role && getRole() !== to.meta.role) {
    return '/login'
  }
})


export default router
