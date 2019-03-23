import request from 'api/config';
import qs from 'qs';


//获取页面渲染数据
export const getSementYesDetail=(TripId,reimburseId)=>{
   const id ={
      itineraryId: TripId,
      reimburseId:reimburseId
   }
   return request({
      url: 'tmcReimburseController.do?getReimburseDetail',
      method: 'POST',
      data:qs.stringify(id),
   }).then(res => {
      return Promise.resolve(res.data)
   })
}


//获取历史审批意见
export const getHistory=(reimburseId)=>{
   const id ={
      reimburseId:reimburseId
   }
   return request({
      url: 'tmcReimburseController.do?getHisComments',
      method: 'POST',
      data:qs.stringify(id),
   }).then(res => {
      return Promise.resolve(res.data)
   })
}



//被驳回以后的提交
// tmcReimburseController.do?updateReimburse

export const RejectSubmit=(list,itineraryId,itineraryContent,RemId)=>{
   let id ={
      "tmcReimburseDetailList":list,//数组对象
      "itineraryId":itineraryId ,//行程id
      "understanding":itineraryContent,//行程感悟
      "id":RemId//报销id
   }
   id = JSON.stringify(id)
   return request({
      url: 'tmcReimburseController.do?updateReimburse',
      method: 'POST',
      headers:{
         'content-type':'application/json'
      },
      data:id,
   }).then(res => {
      return Promise.resolve(res.data)
   })
}


//第一次提交
export const firstSubmit=(list,itineraryId,itineraryContent)=>{
   //报销实体，报销明细实体
   let id ={
      tmcReimburseDetailList:list,
      itineraryId:itineraryId,
      understanding:itineraryContent
   }
   id=JSON.stringify(id)
   return request({
      url: 'tmcReimburseController.do?submitReimburse',
      method: 'POST',
      headers:{
         'content-type':'application/json'
      },
      data:id,
   }).then(res => {
      return Promise.resolve(res.data)
   })
}



//审批的按钮
export const ApprovalButton=(reimburseId,status,comment)=>{
   //报销实体，报销明细实体
   let id ={
      reimburseId:reimburseId,
      status:status,
      comment:comment
   }
   // id=JSON.stringify(id)
   return request({
      url: 'tmcReimburseController.do?auditReimburse',
      method: 'POST',
      // headers:{
      //    'content-type':'application/json'
      // },
      data:qs.stringify(id),
   }).then(res => {
      return Promise.resolve(res.data)
   })
}