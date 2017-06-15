import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { SESSION_SIGNOUT } from '../store/modules/user/mutation-types'

// common
import Index from '../views/index.vue'
import Signin from '../views/signin.vue'
import Signup from '../views/signup.vue'
import Password from '../views/password.vue'
import Active from '../views/active.vue'
import NotFound from '../views/404.vue'

// user
import UserIndex from '../views/user/index.vue'
import UserProfile from '../views/user/profile.vue'

// notification
import NotificationIndex from '../views/notification/index.vue'

// project
import ProjectIndex from '../views/project/index.vue'
import ProjectNew from '../views/project/new.vue'
import ProjectLayout from '../views/project/layout.vue'
import ProjectDashboard from '../views/project/dashboard.vue'
import ProjectMember from '../views/project/member.vue'
import ProjectDocument from '../views/project/document.vue'
import ProjectEditor from '../views/project/editor.vue'
import ProjectSchema from '../views/project/schema.vue'
import ProjectModule from '../views/project/module.vue'
import ProjectApi from '../views/project/api.vue'
import ProjectTable from '../views/project/table.vue'
import ProjectField from '../views/project/field.vue'
import ProjectError from '../views/project/error.vue'
import ProjectTheme from '../views/project/theme.vue'
import ProjectSetting from '../views/project/setting.vue'

// document
import DocumentIndex from '../views/document/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: ProjectIndex
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/password',
    name: 'password',
    component: Password
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
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
    path: '/active/:token',
    component: Active
  },
  {
    path: '/profile',
    name: 'user-profile',
    component: UserProfile,
    meta: {
      requireAuth: true
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
    path: '/document',
    name: 'document',
    component: DocumentIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/document/:id',
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
        path: 'document',
        name: 'project-document',
        component: ProjectDocument,
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
        path: 'theme',
        name: 'project-theme',
        component: ProjectTheme,
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
