import { defineStore } from 'pinia';
import {ref} from 'vue'

const useUserInfoStore = defineStore('userInfo',()=>{
    const info = ref({})
    const setInfo = (newInfo)=>{
        info.value = newInfo;
    };

    const removeInfo = ()=>{
        info.value = {};
    };

    return {
        info,setInfo,removeInfo
    }
},{
    persist:true //持久存储
});

export default useUserInfoStore;