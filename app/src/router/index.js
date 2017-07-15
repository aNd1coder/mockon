import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { SESSION_SIGNOUT } from '../store/modules/user/mutation-types'

// common
import Signin from '../views/signin.vue'
import NotFound from '../views/404.vue'

// user
import UserIndex from '../views/user/index.vue'

// notification
import NotificationIndex from '../views/notification/index.vue'

// project
import ProjectIndex from '../views/project/index.vue'
import ProjectNew from '../views/project/new.vue'
import ProjectLayout from '../views/project/layout.vue'
import ProjectDashboard from '../views/project/dashboard.vue'
import ProjectMember from '../views/project/member.vue'
import ProjectModule from '../views/project/module.vue'
import ProjectApi from '../views/project/api.vue'
import ProjectError from '../views/project/error.vue'
import ProjectSetting from '../views/project/setting.vue'

// document
import DocumentIndex from '../views/document/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: ProjectIndex
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/signout',
    name: 'signout',
    beforeEnter(to, from, next) {
      store.commit(SESSION_SIGNOUT)
      next('/signin')
    }
  },
  {
    path: '/@:username',
    name: 'user',
    component: UserIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/notification',
    name: 'notification',
    component: NotificationIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/doc',
    name: 'document',
    component: DocumentIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/doc/:id',
    name: 'document-view',
    component: DocumentIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/project',
    name: 'project',
    component: ProjectIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/project/new',
    name: 'project-new',
    component: ProjectNew,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/project/:code',
    component: ProjectLayout,
    children: [
      {
        path: '',
        redirect: {
          name: 'project-dashboard'
        }
      },
      {
        path: 'dashboard',
        name: 'project-dashboard',
        component: ProjectDashboard,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'api',
        name: 'project-module',
        component: ProjectModule,
        meta: {
          requireAuth: true,
          baseName: 'project-module'
        }
      },
      {
        path: 'api/new/:module_id',
        name: 'project-api-new',
        component: ProjectApi,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'api/edit/:id',
        name: 'project-api-edit',
        component: ProjectApi,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'member',
        name: 'project-member',
        component: ProjectMember,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'error',
        name: 'project-error',
        component: ProjectError,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'setting',
        name: 'project-setting',
        component: ProjectSetting,
        meta: {
          requireAuth: true
        }
      },
    ],
    meta: {
      requireAuth: true
    }
  },
  {
    path: '*',
    name: '404',
    component: NotFound
  }
]

const Router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes
})

Router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.getters.signedIn) {
      next()
    } else {
      next({
        path: '/signin',
        query: {
          next: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default Router
