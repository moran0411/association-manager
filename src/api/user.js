import request from '@/utils/request'

//注册
export const userRegisterService = (registerData) => {
    var params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key])
    }
    return request.post('/user/register', params)
}

//登入
export const userLoginrService = (loginrData) => {
    var params = new URLSearchParams()
    for (let key in loginrData) {
        params.append(key, loginrData[key])
    }
    return request.post('/user/login', params)
}
//短信发送
export const sendService = (aESphoneNumbers) => {
    return request.post('/send?aESphoneNumbers='+aESphoneNumbers)
}

//手机登入
export const userPhoneLoginrService = (phoneData) => {
    var params = new URLSearchParams()
    for (let key in phoneData) {
        params.append(key, phoneData[key])
    }
    return request.post('/user/phoneLogin', params)
}
//手机登入
export const userBindPhoneService = (phoneData) => {
    var params = new URLSearchParams()
    for (let key in phoneData) {
        params.append(key, phoneData[key])
    }
    return request.post('/user/bindPhone', params)
}

//手机解除绑定
export const userUnBindPhoneService = (phoneData) => {
    var params = new URLSearchParams()
    for (let key in phoneData) {
        params.append(key, phoneData[key])
    }
    return request.delete('/user/phone', params)
}
//获取权限
export const userPermissionsService = () => {

    return request.post('/user/permissions')
}

//获取用户详细信息
export const userInfoService = ()=>{
    return request.get('/user/userInfo')
}

//获取用户详细信息
export const userUpdateService = (userInfoDate)=>{
    return request.put('/user/update',userInfoDate)
}

//修改头像
export const userUpdateAvatarService = (userAvatar)=>{
    const params = new URLSearchParams();
    params.append('avaterUrl',userAvatar)
    return request.patch('/user/updateAvatar',params)
}

//修改密码
export const userPasswordUpdateService = (pwd)=>{
    return request.patch('/user/updatePwd',pwd)
}

//获取特权用户列表
export const userListService = ()=>{
    return request.get('/user/userPermission')
}

//修改密码
export const userUpdatePermissioneService = (user)=>{
    return request.put('/user/userPermission',user)
}