
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueMoment from 'vue-moment'
import VueHead from 'vue-head'
import App from './App'
import { routes } from './routes'
import { store } from './store/store'
import { sync } from 'vuex-router-sync'
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueMoment)
Vue.use(VueHead)

// a directive for focusing on newly inserted dom elements
// Vue.directive('focus', {
//   // When the bound element is inserted into the DOM...
//   inserted: function (el) {
//     // Focus the element
//     el.focus()
//   }
// })


// enviornment detector
let my_host = window.location.host
let parts = my_host.split('.')
let sub = parts[0]

// other settings that should be environment specific
  // console logging should be turned off in production
  // stripe API key ...

if (sub == 'app') {
  Vue.http.options.root = 'https://www.omnibuilds.com'
  Vue.config.devtools = false
  Raven
    .config('https://cc47c177364e4ca59afc07d083c36356@sentry.io/180771')
    .addPlugin(RavenVue, Vue)
    .install();
} else {
  console.log('Current subdomain is: ' + sub)
  Vue.http.options.root = 'https://stage.omnibuilds.com'
  Vue.config.devtools = true
  Raven
    .config('https://3def935f457d4f61888ad45450af3d44@sentry.io/180768')
    .addPlugin(RavenVue, Vue)
    .install();
}



// Vue Resource Config
Vue.http.interceptors.push((request, next) => {
  if (store.state.session.token) {
    request.headers.set('Authorization', 'JWT ' + store.state.session.token)
    request.headers.set('Accept', 'application/json')
    next()
  } else {
    // if route is get token then ignore
    if (sub != 'app') {
      console.log('No token yet')
    }
    next()
  }
})

// Vue.http.interceptors.push((request, next) => {
//   if (store.state.session.token) {
//     if (store.state.session.token == 'expired' ) {
//       // the token has expired
//         // end the session
//         // redirect the user to the login page
//     } else {
//       // should be a valid token
//       request.headers.set('Authorization', 'JWT ' + store.state.session.token)
//       request.headers.set('Accept', 'application/json')
//       // if token is set to expire in the next X minutes then refresh the token
//     }
//   } else {
//     // value is null (default)
//     console.log('No token yet, should be getting token now...')
//     next()
//   }
// })

// need a global event to clear local storage if the tab is killed (in navbar)

// In Vuex Store
  // set a timer when the sessions starts and assign to store variable
    // set timer in navbar on login, assign value to store variable every minute
  // check expiration in interceptors, if within x minutes call refreshToken
  // refresh the Token in the store and reset the timer
  // if timer expires without an intercepotr call, then expire the token



// Vue Router Config
const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
})

// if (response.body.detail == "Signature has expired.")

/*
  User logs in -> receives a token
    Set a timer to clear the token after 30 minutes

  Before Each route
    1. Check if there is a token
      -> we will assume it is valid if not null, since timeout clear is less than actual token expiration
      -> after entering the new route (page load complete)
        -> refresh the token and the reset the timer
      -> if the timer expires, prompt the user to refresh
        -> else clear the token and end the session

    2. What is the difference between internal route transitions and calling the API?
      - beforeEach is only checking if there is a current token (Not if it is valid)
      - HTTP interceptors is actually using the token for authentication on each API call


*/

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth) && !(store.state.session.token)) {
//     console.log('Not authenticated')
//     next({
//       path: '/home'
//       // query: { redirect: to.fullPath }
//     })
//   } else {
//     console.log('user is authenticated')
//     // store.commit('setRefs')
//     // if (store.state.route.params) {
//     //   console.log('Refs set during route navigation')
//     //   store.commit('setRefs')
//     // } else {
//     //   console.log('Route not detected during navigation ')
//     //   console.log(store.state.route);
//     // }
//     next()
//   }
// })

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.session.token) {
      // how to know if token is expired ?
      if (sub != 'app') {
        console.log('user is authenticated')
      }
      next()
    } else {
      if (sub != 'app') {
        console.log('Not authenticated, redirecting to login')
      }
      next({
        path: '/accounts/login'
      })
    }
  } else {
    if (sub != 'app') {
      console.log('User is not authenticated, but not in a protected route')
    }
    next()
  }
})

// Vue router sync config
sync(store, router)

var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

/*eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
