<script setup>
import {
    Management,
    House,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    BellFilled,
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { ref } from 'vue'
import { useTokenStore,usePermissionsStore } from '@/store/token.js'
//用户信息
const tokenStore = useTokenStore()
import {ElMessage,ElMessageBox} from 'element-plus'
import {useRouter} from 'vue-router'
//路由
const router = useRouter()
//用户权限
const user = ref({
    permissions:'',
})
//请求信息函数
import {userInfoService,} from '@/api/user.js'
const PermissionsStore = usePermissionsStore();
user.value.permissions = PermissionsStore.permissions;
//pinia
import useUserInfoStore from '@/store/userInfo';
const userInfo = useUserInfoStore();
const getUserInfo = async()=>{
    let result = await userInfoService();
    userInfo.setInfo(result.data)
}

getUserInfo();
//条目被点击切换路由
const handleCommand = (command)=>{
    if(command == 'logout'){
         //退出登录
         ElMessageBox.confirm(
            '你确认退出登录码？',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                //用户点击了确认
                //清空pinia中的token和个人信息
                userInfo.info={}
                tokenStore.token=''
                //跳转到登录页
                router.push('/login')
            })
            .catch(() => {
                //用户点击了取消
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    }else{
        router.push('/user/'+command)
    }

    
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
     
                <el-menu-item index="/Notice">
                    <el-icon>
                        <BellFilled />
                    </el-icon>
                    <span>公告</span>
                </el-menu-item>
                <el-menu-item index="/association/Association">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>社团信息</span>
                </el-menu-item>
                <el-menu-item index="/association/MyAssociation">
                    <el-icon>
                        <House />
                    </el-icon>
                    <span>我的社团</span>
                </el-menu-item>
                <el-menu-item index="/active/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>社团活动</span>
                </el-menu-item>
                <el-menu-item  v-if="user.permissions>= 2" index="/manager/Manager">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>管理员</span>
                </el-menu-item>
                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/password">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>用户：<strong>{{ userInfo.info.name }}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfo.info.userPic? userInfo.info.userPic:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区</div> -->
                     <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>智校园 ©2025 Created</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo2.png') no-repeat -20px center  / 200px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        font-size: 14px;
        color: #666;
    }
}
</style>