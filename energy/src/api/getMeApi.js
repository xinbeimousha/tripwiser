import request from 'api/config';
import qs from 'qs';
import axios from "axios/index";
//获取me主页数据
// appBaseController.do?getUserInfo
export const getMeMain=()=>{
   return request({
      url: "appBaseController.do?getUserInfo",
      method: 'post'

   }).then(res => {
      return Promise.resolve(res.data)
   })
}


//获取管理页面的数据
export const getMeManage=(data)=>{
   console.log(data)
   const Page = {
      startDate: data.startDate,
      endDate: data.endDate,
   }
   return request({
      url: "travelStatitcsReportController.do?showTravelStatitcs",
      method: 'get',
      params : Page

   }).then(res => {
      return Promise.resolve(res.data)
   })
}

//上传意见数据
export const PostIde=(ucode,title,content)=>{
   return request({
      url: "appBaseController.do?feedback",
      method: 'post',
      data:{
         "userId": ucode,
         "title": title,
         "feedbackContent": content,
      }

   }).then(res => {
      return Promise.resolve(res.data)
   })
}



//获取消息通知数据
// msgPushController.do?getPushMsgList
//msgPushController/readMsg.do
export const getMeMessage=(page)=>{

     return request({
        url: "msgPushController.do?getPushMsgList",
        method: 'post',
        data: qs.stringify(page),

     },false).then(res => {

        return Promise.resolve(res.data)
     })


}


//获取编辑页面数据
export const getMeEdit=()=>{
   return request({
      url: "appBaseController.do?getUserInfo",
      method: 'post',

   }).then(res => {
      return Promise.resolve(res.data)
   })
}

//编辑页面提交修改
//tsUsertsUser
export const submitMeEdit=(data)=>{
   return request({
      url: "appBaseController.do?updatePerInfo",
      method: 'post',
      // data:{
      //    sex:data.sex,
      //    birthday:data.birthday,
      //    mobilePhone:data.mobilePhone
      // },
      data: qs.stringify(data),

   }).then(res => {
      return Promise.resolve(res.data)
   })
}


//获取MeExpenses数据
// appTmcItineraryController.do?getCost
// data:{
//    begin: data.startDate,
//        end: data.endDate
// }
export const getMeExpenses=(data)=>{
   return request({
      url: "appTmcItineraryController.do?getCost",
      method: 'post',
      data: qs.stringify(data),

   }).then(res => {
      return Promise.resolve(res.data)
   })
}


//获取meTrip数据
export const getMeTrip=(start,end,orgCode)=>{
   return request({
      url: `travelStatitcsReportController.do?getCosts1&startDate=${start}&endDate=${end}&orgCode=${orgCode}`,
      method: 'get',

   }).then(res => {
      return Promise.resolve(res.data)
   })
}


//获取meProduct数据
export const getMeProduct=(startDate,endDate,comId)=>{
   return request({
      url: `travelStatitcsReportController.do?getProductAmount&startDate=${startDate}&endDate=${endDate}&companyCode=${comId}`,
      method: 'get',
      data:' ',

   }).then(res => {
      return Promise.resolve(res.data)
   })
}
export const postMeEditImgs=(data)=>{
  return request({
    url:'appBaseController.do?uploadPicture',
    method:'post',
    headers:{
      'Content-Type':'multipart/form-data'
    },
    data:data
  }).then(res => {
    return Promise.resolve(res.data)
  })
//   jpg jif png bmp
}



//退出
export const getMeLogout=()=>{
   return request({
      url: 'appBaseController.do?applogout',
      method: 'post',

   }).then(res => {
      return Promise.resolve(res.data)
   })
}
