import axios from 'axios';
import qs from 'qs';

import { Toast } from 'vant';
import { getLocal } from 'common/js/storage.js';

//配置基准路径
const baseURL='http://192.168.2.19:8888/'
axios.defaults.baseURL = baseURL


// 添加请求拦截器
axios.interceptors.request.use(config => {
   let token = getLocal('token');
   if (token) {
      token = `${token};app;`;
      config.headers.Token = token
   }
   if (config.showLoading) {
      Toast.loading({
         duration: 0, // 持续展示 toast
         forbidClick: true, // 禁用背景点击
      })
   }
   return config;
}, error => {
   return Promise.reject(error)
})


// 响应拦截
axios.interceptors.response.use(response => {
   if (response.config.showLoading) {
      Toast.clear();
   }
   return response;
}, error => {
   if(error.response){
      const status = error.response.status;
      switch(status){
         case 400 :
            Toast('错误的请求');
            break;
         case 500 :
            Toast('服务器发生错误');
         default:
            Toast('加载失败');
      }
   }else{
      if(error.message.indexOf('timeout') > -1){
         Toast('连接超时');
      }else if(error.message==='Network Error'){
         Toast('请检查网络');
      }
   }
   return Promise.reject(error)
})

//添加请求头
let config = {
   headers:{'Content-Type':'multipart/form-data'}
};
export const postMeEditImgs=(data)=>{
   return axios.post('appBaseController.do?upload',data,config).then(res=>{
      return res.data
   })
}

// export const postMeEditImgs=(data)=>{
//    return request({
//       url: 'appBaseController.do?upload',
//       method: 'post',
//       data:data
//    //'http://120.77.51.162:8081/appBaseController.do?upload'
//    }).then(res => {
//       return Promise.resolve(res.data)
//    })
// }