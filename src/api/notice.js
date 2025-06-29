import request from '@/utils/request'


//公告列表查询
export const noticeListService = () => {
    return request.get('/notice')
}
//发布公告
export const noticeAddService = (noticeData) => {
    return request.post('/notice',noticeData)
}


//更新公告
export const noticeUpdateService = (noticeData) => {
    return request.put('/notice',noticeData)
}

//删除公告
export const noticeDeleteService = (id) => {
    return request.delete('/notice?id='+id)
}