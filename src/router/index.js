// 该文件专门用于创建整个应用的路由
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Welcome from '../pages/Welcome.vue'
import User from '../pages/user/User.vue'
import Rights from '../pages/power/Rights.vue'
import Roles from '../pages/power/Roles.vue'
import Categories from '../pages/goods/Categories.vue'
import Params from '../pages/goods/Params.vue'
import List from '../pages/goods/List.vue'
import Add from '../pages/goods/Add.vue'


// 创建并暴露路由器
const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' }, // 若路径为/，则重定位到/login
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/users',
                    component: User
                }, 
                {
                    path: '/rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    component: Roles
                },
                {
                    path: '/categories',
                    component: Categories
                },
                {
                    path: '/params',
                    component: Params
                },
                {
                    path: '/goods',
                    component: List
                },
                {
                    path: '/goods/add',
                    component: Add
                }
            ]
        }
    ]
})
// 定义全局前置路由守卫
router.beforeEach((to, from, next) => {
    // 若用户访问的是login页面 直接放行
    if (to.path === '/login') return next();
    // 从sessionStorage中获取到保存的token值
    const tokenStr = window.sessionStorage.getItem('token');
    // 没有token强制跳转到登录页
    if (!tokenStr) return next('/login');
    next()
})
export default router