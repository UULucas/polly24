import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/poll/:id/:playerId/',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/lobby/:id/:playerId',
      name: 'LobbyView',
      component: () => import('../views/LobbyView.vue'),
      props: true
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/join/',
      name: 'JoinView',
      component: () => import('../views/JoinView.vue')
    },
    {
      path: '/host/:id',
      name: 'HostVue',
      component: () => import('../views/HostView.vue')
    },
  ]
})

export default router
