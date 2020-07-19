import VueRouter from 'vue-router'

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('@/pages/Editor')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/pages/Profile')
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('@/pages/Projects')
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/pages/Help')
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/pages/Projects')
    },
    {
      path: '/:projectId/draft',
      name: 'Draft',
      component: () => import('@/pages/Editor')
    }
  ]
})
