<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import avatar from '@/assets/default.png'
//pinia
import useUserInfoStore from '@/store/userInfo';
import {useTokenStore} from '@/store/token.js'
const TokenStore = useTokenStore();
const userInfo = useUserInfoStore();

const uploadRef = ref()

//用户头像地址
const imgUrl=  ref(userInfo.info.userPic)

//上传图片回显数据
const uploadSuccess = (result)=>{
    imgUrl.value = result.data;
}

import {userUpdateAvatarService} from '@/api/user.js'
//修改用户头像
const updateAvatar = async()=>{
    let result = await userUpdateAvatarService(imgUrl.value);
    ElMessage.success(result.msg? result.msg:'修改成功')
    userInfo.info.userPic = imgUrl.value;
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload 
                    ref="uploadRef"
                    class="avatar-uploader" 
                    :auto-upload="true" 
                    :show-file-list="false"
                    action="/api/upload"
                        name = "file"
                        :headers = "{'Authorization':TokenStore.token}"
                        :on-success = "uploadSuccess"
                    >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <!-- <img v-else src="avatar" width="278" /> -->
                    <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large"  @click="uploadRef.$el.querySelector('input').click()">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>