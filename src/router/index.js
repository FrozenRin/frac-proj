import Vue from 'vue'
import Router from 'vue-router'
import Calc from '../pages/Calc.vue'
import Comments from '../pages/Comments.vue'

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      name: 'Calc',
      component: Calc
    },
    {
      path: '/Calc',
      name: 'Calc',
      component: Calc
    },
    {
      path: '/Comments',
      name: 'Comments',
      component: Comments
    }
  ]
})