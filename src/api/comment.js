import request from '@/utils/request'

//评论列表查询
export const commentListService = (params) => {
    return request.get('/comment',{params:params})
}
//评论添加
export const commentAddService = (commentData) => {
    return request.post('/comment',commentData)
}