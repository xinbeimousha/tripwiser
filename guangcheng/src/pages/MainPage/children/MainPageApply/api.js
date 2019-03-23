import request from 'api/config';
import { PAGE_SIZE } from 'api/constant.js';
import qs from 'qs';
/**
 * @description 获取行程列表
 */



//reiSement渲染页面
export function getItinerInfo(flowState,page,showLoading = false){
   const url = 'tmcReimburseController.do?getItineraryList';
   const method = 'get';
   const obj = {
      type:flowState,
      page,
      pageSize:PAGE_SIZE
   }
   return request({
      url,
      method,
      params:obj
   },showLoading).then(res => {
      return Promise.resolve(res.data)
   })
}


//reiApproval报销审批渲染页面（待审批）
export function getApprovalNo(page, showLoading) {
   console.log(page)
   const Page = {
      page: page.page,
      pageSize: page.pageSize
   }
   return request({
      url: 'tmcReimburseController.do?getMyToReview',
      method: 'get',
      params : Page
   }, showLoading).then(res => {
      console.log(res);
      return Promise.resolve(res.data)
   })
}


//reiApproval报销审批渲染页面（已审批）

export function getApprovalYes(page, showLoading) {
   console.log(page)
   const Page = {
      page: page.page,
      pageSize: page.pageSize
   }
   return request({
      url: 'tmcReimburseController.do?getMyReviewed',
      method: 'get',
      params : Page
   }, showLoading).then(res => {
      console.log(res);
      return Promise.resolve(res.data)
   })
}