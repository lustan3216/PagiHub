import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (
      err.name !== 'NavigationDuplicated' &&
      !err.message.includes('Avoided redundant navigation to current location')
    ) {
      // But print any other errors to the console
      throw (err)
    }
  })
}

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('@/pages/HomePage')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/pages/Dashboard'),
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/pages/Profile')
        },
        {
          path: 'design',
          name: 'Design',
          component: () => import('@/pages/Design')
        },
        {
          path: 'pages',
          name: 'Pages',
          component: () => import('@/pages/Pages')
        }
      ]
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/pages/Help')
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/pages/Design')
    },
    {
      path: '/:projectId/draft',
      name: 'Draft',
      component: () => import('@/components/Layout/PanelDraft')
    }
  ]
})
