<script setup>
import {
    Warning,
    ChatSquare,
    Message,
    Plus,
    UserFilled
} from '@element-plus/icons-vue'
import { ref , nextTick } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//用户权限
const user = ref({
    permissions:'',
})
//通过pinia获取用户权限
import {useTokenStore,usePermissionsStore} from '@/store/token.js'
const TokenStore = useTokenStore();
const PermissionsStore = usePermissionsStore();
//设置用户权限
user.value.permissions = PermissionsStore.permissions;
//
const loadMore = ref('加载中...')
//总评论数
const total  = ref(0)
//记录评论刷新次数
const pageNumber = ref(1)
//待发表评论数据
const commentModel = ref({
  category: 1,
  content: '',
  parentId: ''
})
//评论列表数据
const comments = ref( [ {
        "id": 3,
        "img":"123",
        "name":"123",
        "comment": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 3,
        "title": "123",
        "type": "1",
        "name":"123",
        "comment": "2023-09-0撒大大飒飒2 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },        
    {
        "id": 3,
        "title": "1部",
        "type": "0",
        "name":"123",
        "comment": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },])

//通知列表数据
const  notices  = ref( [
        {
        "id": 3,
        "title": "12",
        "type": "0",
        "img":"123",
        "name":"123",
        "content": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 3,
        "title": "123",
        "type": "1",
        "name":"123",
        "content": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },        
    {
        "id": 3,
        "title": "1部",
        "type": "0",
        "name":"123",
        "content": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
      ]
      )
      
const dialogVisibleNotice = ref(false)
const dialogVisible = ref(false)
//记录用户操作方法
const title = ref('')
//选项
const options = ref([
        { value: 1, label: "重要公告" },
        { value: 0, label: "普通公告" },
]
)
//社团活动查询
import {noticeListService,
        noticeAddService,
        noticeUpdateService,
        noticeDeleteService} from '@/api/notice'

const noticeModel = ref({
    id: '',
    title: '',
    type: '',
    img: '',
    content: '',
    expireTime:''
})
        
//图片回显
const uploadSuccess = (result)=>{
    noticeModel.value.img = result.data;
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

//设置expireTime数据
const setBeginTime = ()=>{
    const date = noticeModel.value.expireTime;
    noticeModel.value.expireTime =formatDate(date)  
}
const getNoticeList =  async()=>{
    let result = await noticeListService();
    notices.value = result.data;
};
//添加公告
const addNotice = async()=>{
    let result = await noticeAddService(noticeModel.value)
    ElMessage.success(result.msg? result.msg:'添加成功')
    dialogVisible.value = false;
    getNoticeList();
}
//删除公告
const deleteNotice = async(row)=>{
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
       let result = await noticeDeleteService(row.id)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
          //刷新列表
          getNoticeList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

//填充NOtice信息
const Notice = (notice)=>{
    noticeModel.value.id = notice.id
    noticeModel.value.title= notice.title
    noticeModel.value.type=  notice.type
    noticeModel.value.img= notice.img
    noticeModel.value.content= notice.content
    noticeModel.value.expireTime= notice.expireTime
}
//编辑公告
const editNotice = async(row)=>{
    Notice(row);
    dialogVisible.value = true
}

//编辑公告
const updateNotice = async()=>{
    let result = await noticeUpdateService(noticeModel.value)
    ElMessage.success(result.msg? result.msg:'修改成功')
    dialogVisible.value = false;
    getNoticeList();
}
const clearData = ()=>{
    noticeModel.value.id= ''
    noticeModel.value.title= ''
    noticeModel.value.type= ''
    noticeModel.value.img= ''
    noticeModel.value.content= '<p></p>'
    noticeModel.value.expireTime= ''
}

getNoticeList();
//公告详细信息
const noticeMassage = (row)=>{
    commentModel.value.parentId=row.id;
    Notice(row)
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
          // console.log('加载指示器进入视口，加载更多评论...');
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


//获取评论
const  getCommentList = async()=>{
      //获取所有活动
      pageNumber.value = 1;
      let params = {
        pageNumber:1,
        pageSize:5,
        category:commentModel.value.category,
        parentId:commentModel.value.parentId
    }
    let result = await commentListService(params)
    total.value = result.data.total;
    comments.value = result.data.items;

};
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
    commentModel.value.category = 1;
    let result = await commentAddService(commentModel.value)
    ElMessage.success(result.msg? result.msg:'添加成功')
    commentModel.value.content = '';
    getCommentList();
}


</script>
<template>
      <el-card class="notice-card">
        <h2 class="notice-title">公告列表</h2>
        

            <dev >        
                <el-button  v-if="user.permissions >= 1" type="primary" class="add-notice-btn" @click="dialogVisible=true;clearData();title = '添加'">
                     添加公告
                </el-button>
            </dev>

        <el-table :data="notices"  stripe class="notice-table">
            <el-table-column label="" prop="type" width="50"
            sortable>
                <template #default="{ row }" >
                    <el-icon v-if="row.type == 0" ><ChatSquare/></el-icon>
                    <el-icon v-else style = "color :red;"><Warning/></el-icon>
                 </template>
            </el-table-column>
          <el-table-column prop="title" label="标题" min-width="80"></el-table-column>
          <el-table-column label="封面" prop="img" width="400px" >
                 <!-- 使用插槽自定义单元格内容 -->
                <template #default="{ row }">
                    <!-- row 是当前行的数据association -->
                    <img :src="row.img" alt="图片" style="width: 200px; height: 50px; border-radius: 8px;" />
                </template>
            </el-table-column>
          <el-table-column prop="name" label="发布人" width="100px"></el-table-column>
          <el-table-column label="详细信息" width="100">
                <template #default="{ row }">
                    <el-button type="info" :icon="Message" circle @click="noticeMassage(row);dialogVisibleNotice=true;ob();getCommentList()"/>
                </template>
            </el-table-column>
          <el-table-column label="操作" width="160" v-if="user.permissions >= 1">
            <template #default="{row}">
              <el-button type="text" size="small" @click="editNotice(row);title = '编辑'">编辑</el-button>
              <el-button type="text" size="small" @click="deleteNotice(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
<!-- 添加信息弹窗 -->
<el-dialog v-model="dialogVisible" :title = "title" width="60%">
            <el-form :model="noticeModel" label-width="100px" style="padding-right: 30px">

                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="noticeModel.title"></el-input>
                </el-form-item>
                <el-form-item label="公告类型">
                        <el-select placeholder="请选择" v-model="noticeModel.type">
                            <el-option 
                            v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="公告封面">
                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                        action="/api/upload"
                        name = "file"
                        :headers = "{'Authorization':TokenStore.token}"
                        :on-success = "uploadSuccess"
                        >
                        <img v-if="noticeModel.img" :src="noticeModel.img" class="avatar" />
                        <!-- 当 img 为空时，自动显示 "+" -->
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="公告内容">
                    <div class="editor">
                            <quill-editor
                                        theme="snow"
                                        v-model:content="noticeModel.content"
                                        contentType="html"
                                        >
                            </quill-editor>
                        </div>
                </el-form-item>
                    <h1 style="text-align: center;">过期时间</h1>


                <!-- 日期选择器 -->
                <el-form-item label="选择日期" prop="beginTime">
                <el-date-picker
                    v-model="noticeModel.expireTime"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                    @blur="setBeginTime()"
                />
                </el-form-item>

                <!-- 时间选择器 -->
                <el-form-item label="选择时间">
                <el-time-picker
                    v-model="noticeModel.expireTime"
                    placeholder="选择时间"
                    style="width: 100%;"
                    @blur="setBeginTime()"
                />
                </el-form-item>
            </el-form>

            <el-form-item>
                    <el-button  v-if="user.permissions >= 1"type="primary" style="margin: auto;width: 40%"  @click="title == '添加'? addNotice():updateNotice()">提交</el-button>
                </el-form-item>
        </el-dialog>

            <!-- 评论弹窗 -->
            <el-dialog v-model="dialogVisibleNotice" width="90%" :style="{ padding: '0 80px' }" @close="stopObserver">
    <h1 style="text-align: center;font-size: 40px;">{{ noticeModel.title }}</h1>

    <img v-if="noticeModel.img" :src="noticeModel.img" class="commentavatar" />
    <div class="rendered-content" v-html="noticeModel.content"></div>

    <div id="comments">
        <!-- 动态渲染评论 -->
        <div id="comments-title">
            <h2>评论</h2>
            <div>{{ total }}</div>
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

  </template>
  
 
  
  <style lang="scss" scoped>
.el-select{
    width: 110px;
}
.notice-title {
width: 200px;
font-size: 20px;
font-weight: bold;
}
.add-notice-btn {
float: right;
margin-bottom: 20px;
}
.notice-table {
margin-top: 20px;
}

.avatar-uploader {
    width: 100%;
    :deep() {
        .avatar {
            width: 100%;
            height: 120px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 100%; /* 设置宽度为父容器的100% */
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100%;;
            height: 120px;
            text-align: center;
        }
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
.commentavatar {
            width: 100%;
            height: 160px;
            display: block;
            margin: auto;
        }
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}

#comments-title {
    display: flex;           /* 使用 flex 布局 */
    align-items: center;     /* 垂直居中对齐 */
  }

  #comments-title h2 {
    margin-right: 10px;      /* 设置 h2 和 div 之间的间距 */
  }
  </style>
  