<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/store/userInfo';
const isOpen = ref(false);
//AES
import {encryptAES,decryptAES} from '@/utils/AES.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})
// 自定义手机号码校验函数
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
const rules = {
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }, // 自定义校验规则
  ],
}
import { ElMessage } from 'element-plus'
import {userUpdateService} from '@/api/user.js'
const updateUserInfo = async()=>{
    let result = await userUpdateService(userInfo.value);
    ElMessage.success(result.msg? result.msg:'修改成功')
    userInfoStore.setInfo(userInfo.value)
}
import {userBindPhoneService,sendService,userUnBindPhoneService} from '@/api/user.js'

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
const updateUserPhone = async()=>{
    if(!validatePhoneNumber(phoneData.value.phone)){
        ElMessage.error("格式错误")
        return
    }
    phoneData.value.aESphoneNumbers = encryptAES(phoneData.value.phone)
    let result = await userBindPhoneService(phoneData.value);
    ElMessage.success(result.data? result.data:"绑定成功")
}

const userUnbindPhone = async()=>{
    if(!validatePhoneNumber(phoneData.value.phone)){
        ElMessage.error("格式错误")
        return
    }
    phoneData.value.aESphoneNumbers = encryptAES(phoneData.value.phone)
    let result = await userUnBindPhoneService(phoneData.value);
    ElMessage.success(result.data? result.data:"解除绑定")
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules"  label-width="100px" size="large">
                    <el-form-item label="用户名">
                        <el-input v-model="userInfo.studentNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="userInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>

                    <el-form :model="phoneData" :rules="rules"  label-width="100px" size="large">
                    <h4>绑定手机</h4>
                    <el-form-item label="手机号" prop="phone" >
                    <el-input  placeholder="请输入手机号" v-model="phoneData.phone"></el-input>
                    </el-form-item  >
                    <el-form-item >
                    <el-input   placeholder="请输入验证码" style="width: 50%;" v-model="phoneData.code"></el-input>
                    <el-button id="sendCode" class="button" type="primary" :disabled="codeIsDisabled" style="width: 40%;margin-left: 10%;" auto-insert-space @click="send">
                        发送验证码
                    </el-button>
                </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserPhone">绑定</el-button>
                        <el-button type="danger" style="margin-left: 30px;" @click="userUnbindPhone">解除绑定</el-button>
                    </el-form-item>
                </el-form>
            </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>