import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'*',
    redirect:'/'
  }
]

const router = new VueRouter({
  routes
})

//导航守卫进行权限的认证
//全局路由守卫
router.beforeEach((to, from, next)=>{
  const auth = ["/center","/order","/money","/card"]

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
