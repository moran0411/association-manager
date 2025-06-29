<script setup>
import {
    Warning,
    ChatSquare,
    Message,
    Plus,
    UserFilled,
    Delete,
    Edit
} from '@element-plus/icons-vue'
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { ElMessage,ElMessageBox } from 'element-plus'

//用户搜索时选中的社团id
const associationId=ref('')

import {associationListService} from '@/api/association'

//文章分类数据模型
const associations = ref([])
const getAssociationList = async () => {
    //获取所有分类
    let resultA = await associationListService();
    associations.value = resultA.data
}
getAssociationList()
// 定义图表容器的引用
const chartRef = ref(null);
// 定义图表容器的引用
const chartRefA = ref(null);
// 定义响应式数据
const chartData = ref([]);

const associationData = ref({}
);
// 定义 ECharts 实例 饼
let chartInstance = null;
//折线
let chartInstanceA = null;
// 初始化图表
onMounted(() => {
  chartInstance = echarts.init(chartRef.value);
  chartInstanceA = echarts.init(chartRefA.value);
  updateChartA();
  updateChart();
});

// 更新图表的方法 饼
function updateChart() {
  const option = {
    title: {
      text: '社团活动占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '活动总数',
        type: 'pie',
        radius: '50%',
        data: chartData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  chartInstance.setOption(option);
}


// 更新图表的方法 折线
function updateChartA() {
  const optionA = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['点赞数', '活动开支'],
  },
  xAxis: {
    type: 'category',
    data:associationData.value.xAxis,
  },
  yAxis: [
    {
      type: 'value',
      name: '点赞数',
    },
    {
      type: 'value',
      name: '活动开支',
    },
  ],
  series: [
    {
      name: '点赞数',
      type: 'line',
      data: associationData.value.like,
    },
    {
      name: '活动开支',
      type: 'line',
      yAxisIndex: 1,
      data:associationData.value.cost,
    },
  ],
};
  chartInstanceA.setOption(optionA);
}
// 监听 chartData 的变化，自动更新图表
watch(
  () => chartData.value,
  () => {
    updateChart();
  },
  { deep: true }
);

import {activeCensusService,associationActiveService} from '@/api/active'
// 动态更新数据的方法
const updateChartData = async()=> {
  let result = await activeCensusService()
  chartData.value =result.data
}
updateChartData()

// 动态更新数据的方法
const updateChartDataA = async()=> {
  let result = await associationActiveService(associationId.value)
  associationData.value =result.data
  associationData.value.xAxis = result.data.xaxis
  updateChartA()
}

// 销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});


const dialog = ref(false)
const title = ref('')

const updateData = ref('')
const dataModel = ref([])

import {venueListManageService,
        venueAddService,
        venueDeleteService} from '@/api/venue'
const addVenue = async()=>{
    let params = {
        name:updateData.value,
      }
  let result = await venueAddService(params)
  updateData.value=''
  ElMessage.success(result.msg? result.msg:'添加成功')
  venueList()
}

const venueList = async()=>{
  let result = await venueListManageService()
  dataModel.value = result.data
}

const deleteVenue = async (venue)=>{
  ElMessageBox.confirm(
    '您想要删除该场地吗？',
    '注意',
    {
      confirmButtonText: '是的',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result = await venueDeleteService(venue.id)
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
  venueList()
}
import {userListService,
        userUpdatePermissioneService} from '@/api/user'

const user =ref({
  studentNumber:'',
  name:'',
  permissions:''
})

const userPermissionList = async()=>{
  let result = await userListService();
  dataModel.value = result.data
  
}

const updatePermission = async(user)=>{
  let result =await userUpdatePermissioneService(user)
  ElMessage.success(result.msg? result.msg:'赋权成功')
  userPermissionList()
}

const setUserData = (userData)=>{
  user.value.studentNumber = userData.studentNumber
  user.value.name = userData.name
  user.value.permissions = userData.permissions
}

// const clearDataModel = ()=>{
//   dataModel.value = ''
// }
</script>
<template>
      <el-card class="manager-card">
        <h2 class="manager-title">管理工具</h2>
         <el-button  type="primary" @click="title = '场地管理';dialog=true;venueList()">场地管理</el-button>
         <el-button  type="primary" @click="title = '权限管理';dialog=true;userPermissionList()">权限管理</el-button>
         <!-- <el-button  type="primary" @click="title = '申请名单';dialog=true;overheadList()">团费申请</el-button> -->
     
         <div ref="chartRef" style="width: 400px; height:300px;padding-top: 10px;"></div>
         <h3>已结算活动数据</h3>
         <el-form-item label="社团：">
                <el-select placeholder="请选择" v-model="associationId" @change="updateChartDataA()">
                    <el-option 
                        v-for="c in associations" 
                        :key="c.id" 
                        :label="c.associationName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
         <div ref="chartRefA" style="width: 100%; height:300px;padding-top: 10px;"></div>
        </el-card>

      <el-dialog v-model="dialog" :title = "title"  width="60%">
        <template v-if="title =='场地管理'">
            <el-input v-model="updateData" style="width: 200px;" placeholder="场景名称" />
            <el-button type="primary" @click="addVenue()">添加场地</el-button>
      </template>
      <template v-if="title =='权限管理'">
          <el-input v-model="user.studentNumber" style="width: 240px; padding:10px ;"placeholder="学号"   />
          
          <el-select v-model="user.permissions" placeholder="权限" style="width: 100px;">
            <el-option label="普通用户" :value="0"></el-option>
            <el-option label="社长" :value="1"></el-option>
            <el-option label="管理员" :value="2"></el-option>
          </el-select>
          <el-input v-model="user.name" style="width: 240px; padding:10px ;" placeholder="姓名"  />
          <el-button type="primary" @click="updatePermission(user)">修改</el-button>
      </template>
      <el-table :data="dataModel"  :key="dataModel.length">
        <el-table-column v-if="title =='权限管理'" label="学号" prop="studentNumber"></el-table-column>
        <el-table-column label="名字" prop="name"></el-table-column>
        <el-table-column v-if="title =='权限管理'" label="职称" prop="permissions">
                <template #default="{ row }" >
                    {{ row.permissions === 1 ? '社长' : '管理员' }}
                 </template>
            </el-table-column>
        <el-table-column label="操作" width="100" >
                <template  #default="{ row }">
                  <el-button v-if="title =='权限管理'" @click="setUserData(row)" :icon="Edit" circle plain type="primary" ></el-button>
                  <el-button  v-if="title =='场地管理'"  @click="delete deleteVenue(row)" :icon="Delete" circle plain type="danger"></el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-dialog>

  </template>
  
 
  <style lang="scss" scoped>

  </style>
  