import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/Inicio.vue')
  },
  {
    path: '/estudiante',
    name: 'Estudiante',
    component: () => import(/* webpackChunkName: "estudiante" */ '../views/Estudiante.vue'),
    meta: { requireAuth: true },
    beforeEnter: (to, from, next) => {
      if (existToken()) {
        next()
      } else {
        next('/')
      }
    }
  },
  {
    path: '/profesor',
    name: 'Profesor',
    component: () => import(/* webpackChunkName: "profesor" */ '../views/Profesor.vue'),
    meta: { requireAuth: true },
    beforeEnter: (to, from, next) => {
      if (existToken()) {
        next()
      } else {
        next('/')
      }
    }
  },
  {
    path: '/coordinador',
    name: 'Coordinador',
    component: () => import(/* webpackChunkName: "coordinador" */ '../views/Coordinador.vue'),
    meta: { requireAuth: true },
    beforeEnter: (to, from, next) => {
      if (existToken()) {
        next()
      } else {
        next('/')
      }
    }
  },
  {
    path: '/cliente',
    name: 'Stakeholder',
    component: () => import(/* webpackChunkName: "coordinador" */ '../views/Stakeholder.vue'),
    meta: { requireAuth: true },
    beforeEnter: (to, from, next) => {
      if (existToken()) {
        next()
      } else {
        next('/')
      }
    }
  },
  {
    path: '/usuario/cambio/clave',
    name: 'CambioClave',
    component: () => import(/* webpackChunkName: "coordinador" */ '../views/CambioClave.vue'),
    meta: { requireAuth: true },
    beforeEnter: (to, from, next) => {
      if (existToken()) {
        next()
      } else {
        next('/')
      }
    }
  }
]

function existToken () {
  return !!localStorage.user_tk
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
