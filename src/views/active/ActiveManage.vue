<script setup>
import {
    Edit,
    Delete,
    Plus,
    Message,
    UserFilled,
    View,
    Trophy
} from '@element-plus/icons-vue'

import { ref,nextTick } from 'vue'
//用户权限
const user = ref({
    permissions:'',
})
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import {useTokenStore,usePermissionsStore} from '@/store/token.js'
const TokenStore = useTokenStore();
const PermissionsStore = usePermissionsStore();
//记录评论刷新次数
const commentPageNumber = ref(1)
//总评论数
const commentTotal  = ref(0)
//详细信息弹窗
const dialogVisibleMessage = ref(false)
//设置用户权限
user.value.permissions = PermissionsStore.permissions;
//点赞状态
const isLiked = ref(false)
//用户搜索时选中的分类id
const associationId=ref('')
const loadMore = ref('加载中...')
//用户搜索时选中的发布状态
const state = ref('')
//操作名称
const opreration= ref('')
//抽屉标题
const titleDrawer = ref('')
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const activeModel = ref({
    title: '',
    associationId: '',
    coverImg: '',
    content:'',
    state:'',
    like:'',
    view:'',
    beginTime:''
})

//待发表评论数据
const commentModel = ref({
  category: 0,
  content: '',
  parentId: ''
})
//评论列表数据
const comments = ref([])

//文章分类数据模型
const associations = ref([])
//文章列表数据模型
const actives = ref([])

//分页条数据模型
const pageNumber = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    getActiveList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNumber.value = num;
    getActiveList();
}

//社团列表查询

import {associationListService} from '@/api/association'
const getAssociationList = async () => {
    //获取所有分类
    let resultA = await associationListService();
    associations.value = resultA.data
}

//社团活动查询
import {activeListService,
        activeAddService,
        activeUpdateService,
        activeDeleteService,
        addLikeService,
        isLikeService,
        addViewService,
        signOnService} from '@/api/active'
const getActiveList = async () => {
    //获取所有活动
    let params = {
        pageNumber:pageNumber.value,
        pageSize:pageSize.value,
        associationId:associationId.value? associationId.value : null,
        state:state.value? state.value : null
    }
    let result = await activeListService(params);
    total.value = result.data.total;
    actives.value = result.data.items;

    for(let i = 0;i<actives.value.length;i++){
        let active = actives.value[i];
        for(let j = 0;j < associations.value.length;j++){
            if(active.associationId == associations.value[j].id){
                active.associationName = associations.value[j].associationName;
            }
        }
    }
    
    // actives.value = result.data
}

//上传图片
const uploadSuccess = (result)=>{
    activeModel.value.coverImg = result.data;
}

//格式化date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

//设置begintime数据
const setBeginTime = ()=>{
    const date = activeModel.value.beginTime;
    activeModel.value.beginTime =formatDate(date)
}

//获取当前时间
const getNowTime = ()=>{
    const now = new Date();
    // 提取年份、月份和日期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(now.getDate()).padStart(2, '0');
    // 拼接为 yyyy-mm-dd 00:00:00 格式
    const nowDate = `${year}-${month}-${day} 00:00:00`;
    return nowDate; // 输出示例：2025-01-02 00:00:00
}

import { ElMessage,ElMessageBox } from 'element-plus'
const addActive = async() =>{
    let activeTime = new Date(activeModel.value.beginTime).getTime();
    let nowTime = new Date( getNowTime()).getTime();
    //比较时间设置活动属性
    if(activeTime > nowTime){
        activeModel.value.state = '报名';
    }else{
        activeModel.value.state = '进行中';
    }
    let result = await activeAddService(activeModel.value);
    ElMessage.success(result.msg? result.msg:'添加成功')
    visibleDrawer.value = false;
    getActiveList();
}

//编辑活动内容填充
const updateDrawer = (active)=>{
    activeModel.value.id = active.id,
    activeModel.value.title = active.title,
    activeModel.value.associationId = active.associationId,
    activeModel.value.coverImg = active.coverImg,
    activeModel.value.content = active.content,
    activeModel.value.state = active.state,
    activeModel.value.like = active.like,
    activeModel.value.view = active.view,
    activeModel.value.beginTime = active.beginTime
}

//清空ActiveModle
const clearActiveModle = ()=>{
    activeModel.value.title = '',
    activeModel.value.associationId = associationId.value,
    activeModel.value.coverImg = '',
    activeModel.value.content = '<p></p>',
    activeModel.value.state = '',
    activeModel.value.beginTime = ''
}

//编辑活动
const updateActive = async() =>{
    let activeTime = new Date(activeModel.value.beginTime).getTime();
    let nowTime = new Date( getNowTime()).getTime();
    //比较时间设置活动属性
    if(activeTime > nowTime){
        activeModel.value.state = '报名';
    }else{
        activeModel.value.state = '进行中';
    }
    let result = await activeUpdateService(activeModel.value);
    ElMessage.success(result.msg? result.msg:'编辑成功')
    visibleDrawer.value = false;
    getActiveList();
}

//删除活动
const deleteActive = (row)=>{
    ElMessageBox.confirm(
    '您想要删除该活动吗？',
    '注意',
    {
      confirmButtonText: '是的',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result = await activeDeleteService(row.id)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
          //刷新列表
          getActiveList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })

}
//获取社团信息
getAssociationList();
//获取活动列表
getActiveList();

//公告详细信息
const activeMassage = (row)=>{
    commentModel.value.parentId=row.id;
    updateDrawer(row);
  
}
//获取评论
const  getCommentList = async()=>{
      //获取所有评论
      commentPageNumber.value = 0;
      let params = {
        pageNumber:1,
        pageSize:5,
        category:commentModel.value.category,
        parentId:commentModel.value.parentId
    }
    let result = await commentListService(params)
    commentTotal.value = result.data.total;
    comments.value = result.data.items;

}
//添加评论
const addComment =async () => {
    ob();
    loadMore.value = '加载中...'
    if(commentModel.value.content==''){
      return 
    }
    if (commentModel.value.content.trim() === '') {
    ElMessage.error("内容仅包含空格");
    return 
}
    commentModel.value.category = 0;
    let result = await commentAddService(commentModel.value)
    ElMessage.success(result.msg? result.msg:'添加成功')
    commentModel.value.content = '';
    getCommentList();
}

const getCssVarName = (type) => {
  return `--el-box-shadow${type ? '-' : ''}${type}`
}
import { commentAddService,
         commentListService} from '@/api/comment'
//懒加载
const loadingIndicator = ref(null); // 加载指示器元素的引用
let observer = null; // IntersectionObserver 实例

// 销毁 IntersectionObserver 实例，避免内存泄漏
const stopObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};
// 模拟加载更多评论的函数
const loadMoreComments = async() => {
    pageNumber.value += 1;
    //获取所有活动
    let params = {
    pageNumber:pageNumber.value,
    pageSize:5,
    category:commentModel.value.category,
    parentId:commentModel.value.parentId
    }
    let result = await commentListService(params);
    if (result.data.items && result.data.items.length > 0) {
    comments.value.push(...result.data.items); // 添加到评论列表中
    }else{
      loadMore.value = '没有更多评论了！'
      stopObserver();
    }
};

// 使用 IntersectionObserver
const ob = () => {
  nextTick(() => {
    if (!loadingIndicator.value) {
      console.error('未找到加载指示器');
      return;
    }

    // 定义 IntersectionObserver 回调函数
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('加载指示器进入视口，加载更多评论...');
          loadMoreComments(); // 触发加载更多评论
        }
      });
    };

    // 创建 IntersectionObserver 实例
    observer = new IntersectionObserver(observerCallback, {
      root: null, // 默认视口为整个页面
      rootMargin: '0px', // 可选的视口边距
      threshold: 1.0, // 完全进入视口时触发
    });

    // 开始观察目标元素
    observer.observe(loadingIndicator.value);
  });
};


const addLike = async()=>{
    let result = await addLikeService(activeModel.value.id)
    if(result.data=='点赞成功'){
        ElMessage.success(result.data)
        activeModel.value.like++;
        isLiked.value = true;
    }else{
        ElMessage.info(result.data)
        activeModel.value.like--;
        isLiked.value = false;
    }
}

//增加浏览数
const addView = ()=>{
   addViewService(activeModel.value.id)
}

//用户是否点赞
const isLike = async()=>{
   let result = await isLikeService(activeModel.value.id)
   if (result.data == '已点赞') {
        isLiked.value = true;
    } else{
        isLiked.value = false;
    }
}
const signOn = async(active)=>{
    let result = await signOnService(active.id)
    if(result.code == 0){
        ElMessage.success(result.data? result.data:'报名')
        return
    }
    ElMessage.error(result.data? result.data:'请勿重复报名')
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>活动管理</span>
                <div class="extra">
                    <el-button v-if="user.permissions >= 1" type="primary" @click="visibleDrawer = true ;clearActiveModle();titleDrawer = '添加活动';opreration='添加活动'">添加活动</el-button>
                </div>
            </div>
        </template>
<!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="社团：">
                <el-select placeholder="请选择" v-model="associationId">
                    <el-option 
                        v-for="c in associations" 
                        :key="c.id" 
                        :label="c.associationName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="报名" value="报名"></el-option>
                    <el-option label="进行中" value="进行中"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getActiveList">搜索</el-button>
                <el-button @click="associationId = '';state = '';">重置</el-button>
            </el-form-item>
        </el-form>
<!-- 文章列表 -->
        <el-table :data="actives" style="width: 100%">
            <el-table-column label="活动标题" width="150" prop="title"></el-table-column>
            <el-table-column label="社团" prop="associationName"></el-table-column>
            <el-table-column label="活动封面" prop="coverImg">
                    <!-- 使用插槽自定义单元格内容 -->
                    <template #default="{ row }">
                    <!-- row 是当前行的数据associations -->
                    <img :src="row.coverImg" alt="活动封面" style="width: 100px; height: 100px; border-radius: 8px;" />
                </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="beginTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="详细信息" width="100">
                <template #default="{ row }">
                    <el-button type="info" :icon="Message" circle @click="activeMassage(row);dialogVisibleMessage = true;ob();getCommentList();addView();isLike()"/>
                </template>
            </el-table-column>
            <el-table-column label="报名" width="100">
                <template #default="{ row }">
                    <el-button v-if="row.state == '报名'" type="primary" @click="signOn(row)">报名</el-button>
                    <el-button v-else type="warning" disabled>进行中</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" v-if="user.permissions >= 1">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="updateDrawer(row);visibleDrawer = true;titleDrawer = '修改活动';opreration='修改活动'"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteActive(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNumber" v-model:page-size="pageSize" :page-sizes="[3 , 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
<!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="titleDrawer" direction="rtl" size="50%">
            <!-- 添加活动表单 -->
            <el-form :model="activeModel" label-width="100px" >
                <el-form-item label="活动标题" >
                    <el-input v-model="activeModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="所属社团">
                    <el-select placeholder="请选择" v-model="activeModel.associationId">
                        <el-option v-for="a in associations" :key="a.id" :label="a.associationName" :value="a.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动封面">

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                        action="/api/upload"
                        name = "file"
                        :headers = "{'Authorization':TokenStore.token}"
                        :on-success = "uploadSuccess"
                    >
                        <img v-if="activeModel.coverImg" :src="activeModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                            <quill-editor
                                        theme="snow"
                                        v-model:content="activeModel.content"
                                        contentType="html"
                                        >
                            </quill-editor>
                        </div>
                </el-form-item>
                <!-- 日期选择器 -->
                <el-form-item label="选择日期" prop="beginTime">
                <el-date-picker
                    v-model="activeModel.beginTime"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                    @blur="setBeginTime()"
                />
                </el-form-item>

                <!-- 时间选择器 -->
                <el-form-item label="选择时间">
                <el-time-picker
                    v-model="activeModel.beginTime"
                    placeholder="选择时间"
                    style="width: 100%;"
                    @blur="setBeginTime()"
                />
                </el-form-item>

                <el-form-item>
                    <!-- <el-button type="primary" style="margin: auto;width: 40%"  @click="addActive('进行中')">正在进行</el-button> -->
                    <el-button type="primary" style="margin: auto;width: 40%" @click="titleDrawer == '添加活动'? addActive():updateActive()">{{opreration}}</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>    
<!-- 评论弹窗 -->
    <el-dialog v-model="dialogVisibleMessage" width="90%" :style="{ padding: '0 80px' }" @close="stopObserver">
        <h1 style="text-align: center;font-size: 40px;">{{ activeModel.title }}</h1>
    <div class="rendered-content" v-html="activeModel.content"></div>
    <div class="active-like">
            <el-icon @click="addLike" :style="{ color: isLiked ? 'gold' : 'gray' }"><Trophy /></el-icon>
            <div>{{ activeModel.like }}</div>
            <el-icon><View /></el-icon>
            <div>{{ activeModel.view }}</div>
        </div>
    <div id="comments">
        <!-- 动态渲染评论 -->
        <div id="comments-title">
            <h2>评论</h2>
            <div>{{ commentTotal }}</div>
        </div>
        <!-- 评论输入框 -->
        <el-input v-model="commentModel.content" style="width: 240px" placeholder="这里需要一条查重率0%的评论" />
        <!-- 提交按钮 -->
        <el-button style="margin-left:10px;" type="primary" plain @click="addComment">发布</el-button>

        <div v-for="(comment, index) in comments" :key="index" :style="{
            border: '1px solid #ccc',  /* 边框样式 */
            padding: '10px',           /* 内边距 */
            margin: '10px',            /* 每个评论之间的间距 */
            borderRadius: '5px',       /* 圆角边框 */
            boxShadow: `var(${getCssVarName('')})`,
            position: 'relative'       /* 为了定位创建时间 */
        }">
            <div style="display: flex; align-items: center; gap: 5px; padding-right: 10px; margin-bottom: 10px;">
                <el-avatar :src="comment.userPic" :icon="UserFilled" />
                <div>{{ comment.name }}</div>
            </div>

            <div style="padding-left: 20px;">
                {{ comment.content }}
                <br>
                <br>
                <!-- 创建时间，使用绝对定位将其放置在评论的右下角 -->
                <div style="position: absolute; right: 10px; bottom: 10px; font-size: 12px; color: #888;">
                    {{ comment.createTime }}
                </div>
            </div>
        </div>

        <!-- 加载指示器 -->
        <div ref="loadingIndicator" style="height: 50px; text-align: center;">{{loadMore}}</div>
    </div>
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

// 文本
.rendered-content {
  text-indent: 2em; /* 设置段落首行缩进 2 个字符 */
  margin: 0 0 1em;  /* 可选：调整段落之间的间距 */
  line-height: 1.6; /* 可选：设置行高，增加可读性 */
  white-space: normal; /* 允许文本换行 */
  word-wrap: break-word; /* 防止长单词溢出 */
}


#comments-title {
    display: flex;           /* 使用 flex 布局 */
    align-items: center;     /* 垂直居中对齐 */
  }

#comments-title h2 {
margin-right: 10px;      /* 设置 h2 和 div 之间的间距 */
}
.active-like {
display: flex;           /* 使用 flex 布局 */
align-items: center;     /* 垂直居中对齐 */

gap: 8px; /* 图标和数字之间的间距 */
}

</style>