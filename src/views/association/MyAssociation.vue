<script setup>
import {
    Edit,
    Delete,
    Plus,
    Select,
    CloseBold
} from '@element-plus/icons-vue'
import router from '@/router';
import { ElMessage,ElMessageBox } from 'element-plus'
//AES
import {decryptAES} from '@/utils/AES.js'
//用户信息
import {userInfoService} from '@/api/user.js'
import useUserInfoStore from '@/store/userInfo';
const userInfo = useUserInfoStore();
const getUserInfo = async()=>{
    let result = await userInfoService();
    userInfo.setInfo(result.data)
}
getUserInfo();

import { ref } from 'vue'

//用户权限
const user = ref({
    permissions:'',
})
import {usePermissionsStore} from '@/store/token.js'
const PermissionsStore = usePermissionsStore();
//设置用户权限
user.value.permissions = PermissionsStore.permissions;
//活动结算窗口
const activeVisibleDrawer=ref(false)
//用户搜索时选中的社团id
const associationId=ref('')
//用户搜索时选中的社团名称
const associationName=ref('')
//用户搜索时选中的发布状态
const state = ref('')
//操作名称
const opreration= ref('')
//抽屉标题
const titleDrawer = ref('')
//控制抽屉是否显示
const visibleDrawer = ref(false)
//文章分类数据模型
const associations = ref([])

const applyMembers = ref([])
const activity = ref([])
const members = ref([])

//分页条数据模型
const pageNumber = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    getMemberList(1);
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNumber.value = num;
    getMemberList(1);
}

//我的社团列表查询
import {joinAssociationListService,
        memberListService,
        memberApplyService,
        memberRejectService} from '@/api/member'

        //社团活动查询
import {activeDeleteService,
        asActiveListService,
        billingListService,
        activeBillingService} from '@/api/active'

const getAssociationList = async () => {
    //获取所有分类
    let resultA = await joinAssociationListService();
    associations.value = resultA.data
    associationName.value = associations.value[0].associationName;
    associationId.value = associations.value[0].id;
    getMemberList(1);
    //Todo
}

//成员查询
const getMemberList = async (stateDate) => {
    let params = {
        pageNumber:pageNumber.value,
        pageSize:pageSize.value,
        associationId:associationId.value? associationId.value : null,
        state:stateDate,
    }
    if(stateDate ==0){
        params.pageNumber = 1;
        params.pageSize = 100;
    }
    let result = await memberListService(params);
    if(stateDate ==0){
        applyMembers.value = result.data.items;
        for(let j = 0;j<applyMembers.value.length;j++){
            applyMembers.value[j].phoneNumber = decryptAES(applyMembers.value[j].phoneNumber);
        }
        return
    }
    
    total.value = result.data.total;
    members.value = result.data.items;
    //解析密码
    if(user.value.permissions >= 1){
        for(let j = 0;j<members.value.length;j++){
            members.value[j].phoneNumber = decryptAES(members.value[j].phoneNumber);
        }
    }
    //修改标题
    for(let i = 0;i<associations.value.length;i++){
        let association = associations.value[i];
        if(association.id == associationId.value){
                associationName.value = association.associationName;
                
        }
    }
}

//退出社团
const quietAssociation =()=>{
    ElMessageBox.confirm(
    '您想要社团退出吗？',
    '注意',
    {
      confirmButtonText: '是的',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
        if(associationId.value == ''){
            ElMessage.error("您未加入任何社团");
            return 
        }
        let params = {
            associationId:associationId.value? associationId.value : null,
            userId:userInfo.info.id
           }
      let result = await memberRejectService(params)
      ElMessage({
        type: 'success',
        message: '退出成功',
      })
          router.push('/association/MyAssociation');
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}

//获取申请名单
const getApplyList = ()=>{
    getMemberList(0)
}
//添加成员
const addMember = async(row)=>{
    let params = {
        associationId:associationId.value? associationId.value : null,
        userId:row.id
    }
    let result = await memberApplyService(params);
    ElMessage.success(result.msg? result.msg:'受理成功')
    getMemberList(1);
    visibleDrawer.value = false
}

//拒绝申请
const rejectMember = (row)=>{
    ElMessageBox.confirm(
    '您想要移除该用户吗？',
    '注意',
    {
      confirmButtonText: '是的',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
        let params = {
            associationId:associationId.value? associationId.value : null,
            userId:row.id
           }
      let result = await memberRejectService(params)
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
      visibleDrawer.value = false;
      getMemberList(1);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}


import {venueListService,venueUpdateService} from '@/api/venue'
const getMyActiveList = async()=>{
    let result = await asActiveListService(associationId.value)
    activity.value = result.data
}

const venue = ref([])
const getVenue = async()=>{
   let result = await venueListService()
   venue.value = result.data
   console.log(venue.value);
   
}
const selectAenue = async(row)=>{
    let params = {
        venueId:row.venueId,
        activeId:row.id
    }
    let result = await venueUpdateService(params)
    ElMessage.success(result.msg? result.msg:'添加成功')
    getVenue()
}

const getBillList = async()=>{
    let result = await billingListService(associationId.value)
    activity.value = result.data
}
const billModel = ref({
    activityId:'',
    associationId:'',
    totalAmount: 0,
    content: '',
})
const activeBillVisible =ref(false)
const activeBill = async(row)=>{
    activeBillVisible.value = true
    billModel.value.activityId = row.id
    billModel.value.associationId = associationId.value
}
const sendBill = async()=>{
    let result = await activeBillingService(billModel.value)
    ElMessage.success(result.data? result.data:'添加成功')
    getBillList()
    activeBillVisible.value = false
}

//获取社团信息
getAssociationList();
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>{{associationName}}</span>
                <div class="extra">
                    <el-button   v-if="user.permissions >= 1" type="primary" @click="getMyActiveList();activeVisibleDrawer = true ;titleDrawer = '社团活动';;opreration='添加场地';getVenue()">社团活动</el-button>
                    <el-button   v-if="user.permissions >= 1" type="primary" @click="getBillList();activeVisibleDrawer = true ;titleDrawer = '社团结算';;opreration='结算';getVenue()">社团结算</el-button>
                    <el-button   v-if="user.permissions >= 1" type="primary" @click="visibleDrawer = true ;titleDrawer = '申请列表';opreration='申请列表';getApplyList()">申请名单</el-button>
                    <el-button  type="danger" @click="quietAssociation">退出社团</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="社团：">
                <el-select placeholder="请选择" v-model="associationId" @change="getMemberList(1)">
                    <el-option 
                        v-for="c in associations" 
                        :key="c.id" 
                        :label="c.associationName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!--成员列表 -->
        <el-table :data="members" style="width: 100%" >
            <el-table-column label="名称" width="130" prop="name"></el-table-column>
            <el-table-column label="职称" prop="permissions">
                <template #default="{ row }" >
                    {{ row.permissions === 0 ? '成员' : '社长' }}
                 </template>
            </el-table-column>
                    
                <el-table-column label="头像" prop="userPic">
                    <!-- 使用插槽自定义单元格内容 -->
                    <template #default="{ row }">
                    <!-- row 是当前行的数据associations -->
                    <img :src="row.userPic" alt="头像" style="width: 100px; height: 100px; border-radius: 8px;" />
                </template>
            </el-table-column>
            <el-table-column v-if="user.permissions >= 1" label="手机号码" prop="phoneNumber"></el-table-column>
            <el-table-column label="操作" width="100" v-if="user.permissions >= 1">
                <template #default="{ row }">
                    <el-button :icon="Delete" circle plain type="danger" @click="rejectMember(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="您没有加入任何社团" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNumber" v-model:page-size="pageSize" :page-sizes="[3 , 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
<!-- ******************************************************************************************* -->
            <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="titleDrawer" direction="rtl" size="60%">
            <el-table :data="applyMembers" style="width: 100%" >
            <el-table-column label="名称" width="130" prop="name"></el-table-column>
                <el-table-column label="头像" prop="userPic">
                    <!-- 使用插槽自定义单元格内容 -->
                    <template #default="{ row }">
                    <!-- row 是当前行的数据associations -->
                    <img :src="row.userPic" alt="头像" style="width: 100px; height: 100px; border-radius: 8px;" />
                </template>
            </el-table-column>
            <el-table-column v-if="user.permissions >= 1" label="手机号码" prop="phoneNumber"></el-table-column>
            <el-table-column label="操作" width="100" v-if="user.permissions >= 1">
                <template #default="{ row }">
                    <el-button :icon="Select" circle plain type="success" @click="addMember(row)"></el-button>
                    <el-button :icon="CloseBold" circle plain type="danger" @click="rejectMember(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有申请需要受理" />
            </template>
        </el-table>
        </el-drawer>    
<!-- ******************************************************************************************* -->

            <!-- 抽屉 -->
            <el-drawer v-model="activeVisibleDrawer" :title="titleDrawer" direction="rtl" size="60%">
            <el-table :data="activity" style="width: 100%" >
            <el-table-column label="活动标题" width="130" prop="title"></el-table-column>
            <el-table-column label="活动封面" prop="coverImg">
                    <!-- 使用插槽自定义单元格内容 -->
                    <template #default="{ row }">
                    <!-- row 是当前行的数据associations -->
                    <img :src="row.coverImg" alt="活动封面" style="width: 100px; height: 100px; border-radius: 8px;" />
                </template>
            </el-table-column>
            <el-table-column label="场地" v-if="titleDrawer == '社团活动'">
                <template #default="{ row }">
                <el-select placeholder="请选择" v-model="row.venueId">
                    <el-option 
                        v-for="v in venue" 
                        :key="v.id" 
                        :label="v.name"
                        :value="v.id">
                    </el-option>
                </el-select>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button style="width: 80px;" type="success" @click="opreration=='结算'?activeBill(row):selectAenue(row)">{{ opreration }}</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有活动" />
            </template>
        </el-table>
        </el-drawer>    
        
                <!-- 社团结算弹窗 -->
                <el-dialog v-model="activeBillVisible" :title = "title" width="60%">
            <el-form :model="billModel"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="活动金额" prop="totalAmount">
                    <el-input v-model="billModel.totalAmount"  placeholder="输入金额"></el-input>
                </el-form-item>
                <el-form-item label="详细描述" prop="introduction">
                        <el-input
                            v-model="billModel.content"
                            :autosize="{ minRows: 2, maxRows: 16 }"
                            type="textarea"
                            placeholder="支出明细"
                        />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button v-if="title != '详细信息'" @click="activeBillVisible = false ;">取消</el-button>
                    <el-button v-if="title != '详细信息'" type="primary" @click="sendBill()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;
    .el-select{
        width: 110px;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>