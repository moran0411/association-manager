import request from '@/utils/request'


//社团列表查询
export const venueListManageService = () => {
    return request.get('/venue/list')
}

//社团列表查询
export const venueListService = () => {
    return request.get('/venue')
}
//新建社团
export const venueAddService = (associationDate) => {
    return request.post('/venue',associationDate)
}

//占用场地
export const venueUpdateService = (params) => {
    return request.put('/venue', null, { params });
}

//删除社团
export const venueDeleteService = (id) => {
    return request.delete('/venue?id='+id)
}