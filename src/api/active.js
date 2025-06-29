import request from '@/utils/request'

//活动列表查询
export const activeListService = (params) => {
    return request.get('/active',{params:params})
}

//社团活动列表查询
export const asActiveListService = (associationId) => {
    return request.get('/active/association?associationId='+associationId)
}

//社团活动结算列表查询
export const billingListService = (associationId) => {
    return request.get('/active/activeBillingList?associationId='+associationId)
}

//社团活动结算
export const activeBillingService = (billData) => {
    return request.put('/active/activeBilling',billData)
}
//活动添加
export const activeAddService = (activeData) => {
    return request.post('/active',activeData)
}

//修改活动
export const activeUpdateService = (activeData) => {
    return request.put('/active',activeData)
}

//删除活动
export const activeDeleteService = (id) => {
    return request.delete('/active?id='+id)
}

//点赞
export const addLikeService = (id) => {
    return request.put('/active/like?id='+id)
}

//确认点赞
export const isLikeService = (id) => {
    return request.put('/active/islike?id='+id)
 }
//点赞
export const addViewService = (id) => {
   request.put('/active/view?id='+id)
}


//活动统计
export const activeCensusService = () => {
    return request.get('/active/census')
}

//社团活动统计
export const associationActiveService = (associationId) => {
    return request.get('/active/associationData?associationId='+associationId)
}

//报名
export const signOnService = (activeId) => {
    return request.get('/active/signOn?activeId='+activeId)
}