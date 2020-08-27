import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (
      err.name !== 'NavigationDuplicated' &&
      !err.message.includes('Avoided redundant navigation to current location')
    ) {
      // But print any other errors to the console
      throw err
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
          path: 'designs',
          name: 'Designs',
          component: () => import('@/pages/Designs')
        },
        {
          path: 'websites',
          name: 'Websites',
          component: () => import('@/pages/Websites')
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
      component: () => import('@/pages/Designs')
    },
    {
      path: '/:projectId/draft',
      name: 'Draft',
      component: () => import('@/components/Layout/PanelDraft')
    }
  ]
})
