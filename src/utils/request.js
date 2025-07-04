//定制请求的实例
import { ElMessage } from 'element-plus'
//导入axios  npm install axios
import axios from 'axios';
//导入token状态
import { useTokenStore } from '@/store/token.js';
//导入路由
import router from '@/router'
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})
//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //在发送请求之前做什么
        let tokenStore = useTokenStore()
        //如果token中有值，在携带
        if(tokenStore.token){
            config.headers.Authorization=tokenStore.token
        }
        return config
    },
    (err)=>{
        //如果请求错误做什么
        Promise.reject(err)
    }
)
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if(result.data.code ===0){
            return result.data;
        }
        ElMessage.error(result.data? result.data:'服务异常')  
        return Promise.reject(result.data);
        // ElMessage.error(result.msg? result.msg:'服务异常')  
        // return Promise.reject(result.data);
    },
    err=>{
        //如果响应状态码时401，代表未登录，给出对应的提示，并跳转到登录页
        if(err.response.status===401){
            ElMessage.error('请先登录！')
            router.push('/login')
        }else{
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;