import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users'
import Roles from '@/components/power/Roles'
import Rights from '@/components/power/Rights'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
import List from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'
import Order from '@/components/order/Order.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      },{
        path:'/goods',
        component:List
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:Order
      }
    ]
  },
  {
    path:'/',
    redirect:'/login'
  }
]

const router = new VueRouter({
  routes
})

//导航守卫进行权限的认证
//全局路由守卫
router.beforeEach((to, from, next)=>{

  console.log(to.path)
  if(to.path === '/login'){
    let token = window.sessionStorage.getItem("token")
    if(!token){
      next()
    }else{
      next('/home')
    }
  }else{
    let token = window.sessionStorage.getItem("token")
    if(!token){
      next('/login')
    }else{
      next()
    }
  }
 
})

export default router
