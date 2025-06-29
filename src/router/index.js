//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import NoticeVue from '@/views/notice/Notice.vue'
import AssociationVue from '@/views/association/Association.vue'
import ActiveManageVue from '@/views/active/ActiveManage.vue'
import ManagerVue from '@/views/manager/Manager.vue'
import UserInfoVue from '@/views/user/Userinfo.vue'
import UserAvatarVUe from '@/views/user/UserAvatar.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import MyAssociation from '@/views/association/MyAssociation.vue'

//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        component: LayoutVue,
        //重定向
        redirect: '/association/Association',
        //子路由
        children: [
                { path: '/Notice', component: NoticeVue },
                { path: '/association/Association', component: AssociationVue },
                { path: '/association/MyAssociation', component: MyAssociation },
                { path: '/active/manage', component: ActiveManageVue },
                { path: '/manager/Manager', component: ManagerVue },
                { path: '/user/info', component: UserInfoVue },
                { path: '/user/avatar', component: UserAvatarVUe },
                { path: '/user/password', component: UserResetPasswordVue },
            
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router




