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
      path: '/about',
      name: 'About',
      children: [
        {
          path: 'terms',
          name: 'Terms',
          component: () => import('@/pages/Terms')
        },
        {
          path: 'privacy',
          name: 'Privacy',
          component: () => import('@/pages/Privacy')
        }
      ]
    },
    {
      path: '/workboard/:projectId',
      name: 'Workboard',
      component: () => import('@/components/Layout/PanelDraft')
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound')
    }
  ]
})
