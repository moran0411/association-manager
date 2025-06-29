import request from '@/utils/request'

//社团列表查询
export const associationListService = () => {
    // const tokenStore = useTokenStore();
    // return request.get('/association',{headers:{'Authorization':tokenStore.token}})
    return request.get('/association')
}
//新建社团
export const associationAddService = (associationData) => {
    return request.post('/association',associationData)
}

//编辑社团
export const associationUpdateService = (associationData) => {
    return request.put('/association',associationData)
}

//删除社团
export const associationDeleteService = (id) => {
    return request.delete('/association?id='+id)
}

//加入社团
export const AddService = (associationId) => {
    return request.post('/member?associationId='+associationId)
}