<script setup>
import { ref } from 'vue'
// const userInfo = ref({

// })

const userPassword = ref({
    old_pwd:'',
    new_pwd:'',
    re_pwd:''

})

const checkRePassword = (rule,value,callback)=>{
    if(value===''){
        callback(new Error('不能为空'))
    }else if(value !== userPassword.value.new_pwd){
        callback(new Error('两次密码应当一样'))
    }else{
        callback()
    }
}

const rules = {
    old_pwd:[
        {required: true ,message:'请输入原密码',trigger:'blur'},
        {min:5,max:16,message:'length is 5-16',trigger:'blur'}
    ],
    new_pwd: [
        {required: true ,message:'请输入新密码',trigger:'blur'},
        {min:5,max:16,message:'length is 5-16',trigger:'blur'}
    ],
    re_pwd: [
        {validator:checkRePassword,trigger:'blur'}
    ]
}

import { userPasswordUpdateService } from '@/api/user.js';

import { useRouter } from 'vue-router';
const router = useRouter();
import { ElMessage } from 'element-plus';

 const updateUserPassword = async ()=>{
      // 校验密码长度
    if (!validatePasswordLength(userPassword.value)) {
        return;
    }
    try {
    let result = await userPasswordUpdateService(userPassword.value);
    ElMessage.success(result.msg? result.msg:'修改成功');
    router.push('/login')
    }catch (error) {
        ElMessage.error('修改失败，请重试');
    }
 }

 // 校验密码长度的函数
 const validatePasswordLength = (passwordData) => {
  const minLength = 5; // 设置最小长度
  const maxLength = 16; // 设置最大长度

  if (!passwordData.old_pwd || passwordData.old_pwd.length < minLength || passwordData.old_pwd.length > maxLength) {
    ElMessage.error(`旧密码长度必须在 ${minLength}-${maxLength} 个字符之间`);
    return false;
  }
  if (!passwordData.new_pwd || passwordData.new_pwd.length < minLength || passwordData.new_pwd.length > maxLength) {
    ElMessage.error(`新密码长度必须在 ${minLength}-${maxLength} 个字符之间`);
    return false;
  }
  if (!passwordData.re_pwd || passwordData.re_pwd.length < minLength || passwordData.re_pwd.length > maxLength) {
    ElMessage.error(`确认密码长度必须在 ${minLength}-${maxLength} 个字符之间`);
    return false;
  }

  return true;
};
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userPassword" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input placeholder="请输入原密码" v-model="userPassword.old_pwd" ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                    <el-input  type="password" placeholder="请输入新密码" v-model="userPassword.new_pwd"></el-input>
                </el-form-item>
                <el-form-item  label="确认密码" prop="re_pwd">
                    <el-input  type="password" placeholder="再次输入" v-model="userPassword.re_pwd"></el-input>
                </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click = "updateUserPassword()">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>