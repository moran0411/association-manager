<script setup>
import {
    Edit,
    Delete,
    Star,
    Message,
    Plus
} from '@element-plus/icons-vue'

import { ref } from 'vue'
//用户权限
const user = ref({
    permissions:'',
})
import { ElMessage, ElMessageBox } from 'element-plus'
//通过pinia获取用户权限
import {useTokenStore,usePermissionsStore} from '@/store/token.js'
const TokenStore = useTokenStore();
const PermissionsStore = usePermissionsStore();
//设置用户权限
user.value.permissions = PermissionsStore.permissions;


const association = ref([
    {
        "id": 3,
        "associationName": "1部",
        "logo": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "associationName": "2部",
        "logo": "yl",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "associationName": "3部",
        "logo": "js",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])

//控制添加社团弹窗
const dialogVisible = ref(false)

//弹窗状态
const title = ref('');
//添加社团数据模型
const associationModel = ref({
    id: 4,
    associationName: '',
    introduction: '',
    logo: ''
})
//添加社团表单校验
const rules = {
    associationName: [
        { required: true, message: '请输入社团名称', trigger: 'blur' },
    ],
    introduction: [
        { required: true, message: '请输入社团简介', trigger: 'blur' },
    ]
}
//清除associationModel的数据
const clearassociationModel = ()=>{
    associationModel.value.id = '',
    associationModel.value.associationName= '',
    associationModel.value.introduction ='',
    associationModel.value.logo = ''
}


import {associationListService,
        associationAddService,
        associationUpdateService,
        associationDeleteService,
        AddService} from '@/api/association'
//查询社团列表
const associationList = async()=>{
    let result = await associationListService();
    association.value = result.data;
}



//图片回显
const uploadSuccess = (result)=>{
    console.log(result.data);
    associationModel.value.logo = result.data;
}

//添加社团
const addAssociation = async()=>{
    let result = await associationAddService(associationModel.value);
    ElMessage.success(result.msg? result.msg:'编辑成功')
    associationList();
    dialogVisible.value = false
}

//编辑社团
const editAssociation = async()=>{
    let result = await associationUpdateService(associationModel.value);
    ElMessage.success(result.msg? result.msg:'编辑成功')
    associationList();
    dialogVisible.value = false
}




//显示社团详细信息
const associationInfo = (associationDate)=>{
    associationModel.value.id = associationDate.id,
    associationModel.value.associationName= associationDate.associationName,
    associationModel.value.introduction = associationDate.introduction,
    associationModel.value.logo = associationDate.logo,
    dialogVisible.value = true;
}

//删除社团
const deleteAssociation = (row)=>{
    ElMessageBox.confirm(
    '您想要删除该社团吗？',
    '注意',
    {
      confirmButtonText: '是的',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result = await associationDeleteService(row.id)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
          //刷新列表
        associationList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })

}
//加入社团
const joinAssociation = async(association)=>{
    let result = await AddService(association.id);
    ElMessage.success(result.msg? result.msg:'申请成功')
}

//显示列表
associationList();
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>社团信息</span>
                <div class="extra">
                    <el-button type="primary" v-if="user.permissions >= 1" @click="dialogVisible=true;title = '添加社团';clearassociationModel();">添加社团</el-button>
                </div>
            </div>
        </template>
        <el-table :data="association" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="社团名称" prop="associationName"></el-table-column>
            <el-table-column label="社团logo" prop="logo">
                 <!-- 使用插槽自定义单元格内容 -->
                <template #default="{ row }">
                    <!-- row 是当前行的数据association -->
                    <img :src="row.logo" alt="社团 Logo" style="width: 50px; height: 50px; border-radius: 8px;" />
                </template>
            </el-table-column>
            <el-table-column label="详细信息" width="100">
                <template #default="{ row }">
                    <el-button type="info" :icon="Message" circle @click="associationInfo(row);title = '详细信息'"/>
                </template>
            </el-table-column>
            <el-table-column label="加入我们" width="100">
                <template #default="{ row }">
                    <el-button  circle type="warning" @click="joinAssociation(row)">→</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" v-if="user.permissions >= 1">
                <template  #default="{ row }">
                    <el-button @click="dialogVisible=true;title = '编辑社团信息';associationInfo(row)" :icon="Edit" circle plain type="primary" ></el-button>
                    <el-button @click="deleteAssociation(row)" :icon="Delete" circle plain type="danger"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 添加信息弹窗 -->
        <el-dialog v-model="dialogVisible" :title = "title" width="60%">
            <el-form :model="associationModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="社团名称" prop="associationName">
                    <el-input v-model="associationModel.associationName" minlength="1" maxlength="10" placeholder="输入社团名"></el-input>
                </el-form-item>
                <el-form-item label="社团logo">
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                        action="/api/upload"
                        name = "file"
                        :headers = "{'Authorization':TokenStore.token}"
                        :on-success = "uploadSuccess"
                        >
                        <img v-if="associationModel.logo" :src="associationModel.logo" class="avatar" />
                        <!-- 当 logo 为空时，自动显示 "+" -->
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="社团简介" prop="introduction">
                    <!-- <el-input v-model="associationModel.introduction" minlength="1" maxlength="15"></el-input> -->
                        <el-input
                            v-model="associationModel.introduction"

                            :autosize="{ minRows: 2, maxRows: 16 }"
                            type="textarea"
                            placeholder="输入简介"
                        />
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button v-if="title != '详细信息'" @click="dialogVisible = false ;clearassociationModel()">取消</el-button>
                    <el-button v-if="title != '详细信息'" type="primary" @click="title =='添加社团'? addAssociation():editAssociation();clearassociationModel()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
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
            width: 100px;
            height: 100px;
            text-align: center;
        }
    }
}
</style>