import request from '@/utils/request'

//加入社团列表查询
export const joinAssociationListService = () => {
    return request.get('/member')
}

//成团列表查询
export const memberListService = (params) => {
    return request.get('/member/list',{params:params});
}

//审批申请
export const memberApplyService = (params) => {
    return request.get('/member/apply',{params:params});
}

export const memberRejectService = (params) => {
    return request.delete('/member/apply',{params:params});
}