import VueRouter from 'vue-router'

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('@/pages/HomePage')
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/pages/Help')
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
    }
  ]
})
