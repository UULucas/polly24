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
      path: '/poll/:id/:name/',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/host/:id',
      name: 'PollHostView',
      component: () => import('../views/PollHostView.vue')
    },
    {
      path: '/lobby/:id/:userName/:avatar',
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
      path: '/join',
      name: 'JoinNoIDView',
      component: () => import('../views/JoinNoIDView.vue')
    },
    {
      path: '/join/:id',
      name: 'JoinView',
      component: () => import('../views/JoinView.vue')
    },
    {
      path: '/startquiz/:id',
      name: 'StartQuizView',
      component: () => import('../views/StartQuizView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
  ]
})

export default router
