<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
const router = useRouter()

//AES
import {encryptAES,decryptAES} from '@/utils/AES.js'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
const isPhone = ref(false)
const registerData = ref({
    studentNumber:'asdasd',
    password:'asdasd',
    rePassword:'asdasd'
})


const validatePhone = (rule, value, callback) => {
  const regex = /^1[3-9]\d{9}$/; // 正则表达式：11位数字，以1开头
  if (!value) {
    callback(new Error("请输入手机号码"));
  } else if (!regex.test(value)) {
    callback(new Error("手机号码格式不正确"));
  } else {
    callback();
  }
};
const phoneRules = {
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }, // 自定义校验规则
  ],
}
//自定义确认密码的校验函数
const rePasswordValid = (rule, value, callback) => {
    if (value == null || value === '') {
        return callback(new Error('请输入确认密码'))
    }
    if (registerData.value.password !== value) {
        return callback(new Error('两次输入密码不一致'))
    }
}
//用于注册的表单校验模型
const registerDataRules = ref({
    studentNumber: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '用户名的长度必须为2~16位', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度必须为2~16位', trigger: 'blur' }
    ],
    rePassword: [
        { validator: rePasswordValid, trigger: 'blur' }
    ]
})


import {userRegisterService,userLoginrService,userPermissionsService,sendService,userPhoneLoginrService} from '@/api/user.js'

//用于注册的事件函数
const register = async () => {
    //console.log('注册...');
    if(registerData.value.password ==registerData.value.rePassword){    
        let result = await userRegisterService(registerData.value);
        ElMessage({
        message: '注册成功',
        type: 'success',
        })
    }
}
//用于登入的事件函数
import {useTokenStore,usePermissionsStore} from '@/store/token.js'
const tokenStore = useTokenStore();
const PermissionsStore = usePermissionsStore();
const login = async ()=>{
    let result = await userLoginrService(registerData.value);
    ElMessage({
    message: '登入成功',
    type: 'success',
  })
  tokenStore.setToken(result.data);
  result = await userPermissionsService();
  PermissionsStore.setPermissions(result.data);
  //跳转首页
  router.push('/');
}

const clearRegisterData = ()=>{
    registerData.value={
        studentNumber :'',
        password:'',
        rePassword:''
    }
}

const phoneData = ref({
    aESphoneNumbers:'',
    code:'',
    phone:''
})


const validatePhoneNumber = (phoneNumber)=> {
    // 正则表达式：匹配以1开头的11位数字
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phoneNumber);
}

//验证码按钮
const codeIsDisabled =  ref(false);
// 点击事件处理函数
const handleClick = () => {
  // 禁用按钮
  codeIsDisabled.value = true;
  // 更新按钮文本
  // 模拟异步操作（例如 API 请求）
  setTimeout(() => {
    // 启用按钮
    codeIsDisabled.value = false;
  }, 30000); // 30 秒后恢复
};
const send = ()=>{
    if(!validatePhoneNumber(phoneData.value.phone)){
        ElMessage.error("格式错误")
        return
    }
    let p = encryptAES(phoneData.value.phone)
    sendService(p)
    handleClick()
    // ElMessage.success(result.msg? result.msg:'发送成功')
}
//手机登陆
const phoneLogin = async()=>{
    phoneData.value.aESphoneNumbers = encryptAES(phoneData.value.phone)
    let result = await userPhoneLoginrService(phoneData.value);
    ElMessage({
    message: '登入成功',
    type: 'success',
  })
  tokenStore.setToken(result.data);
  result = await userPermissionsService();
  PermissionsStore.setPermissions(result.data);
  //跳转首页
  router.push('/');
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model = "registerData" :rules="registerDataRules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="studentNumber">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.studentNumber"></el-input>
                </el-form-item >
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"  v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码"  v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false;clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
             <!-- 手机登入表单 -->
             <el-form ref="form" size="large" autocomplete="off" v-if="isPhone" :model = "phoneData" :rules="phoneRules" >
                <el-form-item>
                    <h1>手机登入</h1>
                </el-form-item>
                <el-form-item  prop="phone">
                    <el-input :prefix-icon="User" placeholder="请输入手机号" v-model="phoneData.phone"></el-input>
                </el-form-item >
                <el-form-item >
                    <el-input   placeholder="请输入验证码" style="width: 50%;" v-model="phoneData.code"></el-input>
                    <el-button class="button" type="primary" :disabled="codeIsDisabled" style="width: 40%;margin-left: 10%;" auto-insert-space @click="send">
                        发送验证码
                    </el-button>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="phoneLogin">
                        登入
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isPhone = false;clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="!isRegister && !isPhone" :model="registerData" :rules="registerDataRules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="studentNumber">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.studentNumber"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-link type="primary" :underline="false" @click="isPhone = true;clearRegisterData()">
                        手机登入 →
                    </el-link>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true;clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 50% center / 500px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>