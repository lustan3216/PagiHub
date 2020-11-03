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
      path: '/login',
      name: 'Login',
      meta: { noFbChat: true },
      component: () => import('@/pages/Login')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/pages/Dashboard'),
      children: [
        {
          path: 'projects',
          name: 'Projects',
          meta: { noNavbar: true },
          component: () => import('@/pages/Projects')
        }
      ]
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/pages/Help')
    },
    {
      path: '/terms',
      name: 'Terms',
      component: () => import('@/pages/Terms')
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: () => import('@/pages/Privacy')
    },
    {
      path: '/workboard/:projectId',
      name: 'Workboard',
      meta: { noFbChat: true, noNavbar: true },
      component: () => import('@/components/Layout/PanelDraft')
    },
    {
      path: '/:userLabel/:projectLabel/:componentSetLabel',
      name: 'PanelProduction',
      meta: { noNavbar: true, noFbChat: true, noNeedLogin: true },
      component: () => import('@/components/Layout/PanelProduction')
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound')
    }
  ]
})
