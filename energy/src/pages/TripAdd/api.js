import request from 'api/config';
import qs from 'qs';

/**
 * @description 提交行程的接口（万力集团带机票的）
 */
export function submitOtherApply(obj,status){

   let url = 'appTmcItineraryController.do?submitOtherApply';
   const method = 'post';
   if(status){
      url = 'appTmcItineraryController.do?reviseBudget';
   }
   return request({
      url,
      method,
      headers:{
         'content-type':'application/json'
      },
      data:JSON.stringify(obj)
   }).then(res => {
      return Promise.resolve(res.data)
   })
}




/**
 * @description 提交行程的接口
 */
export function submitApply(obj,status){
  let url = 'appTmcItineraryController.do?submitApply';
  const method = 'post';
  if(status){
    url = 'appTmcItineraryController.do?reviseBudget';
  }
  return request({
    url,
    method,
    data:qs.stringify(obj)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
/**
 * @description 获取出差事由
 */
export function getWorkInfos(){
  const url = 'workinfo.do?getWorkInfos';
  const method = 'get';

  return request({
    url,
    method,
  }).then(res => {
    return Promise.resolve(res.data)
  })
}



/**
*获取账号权限的机票仓位登记
 */
export function getBudgetSpaceType() {
   return request({
      url: 'appBudgetRuleController.do?getBudgetSpaceType',
      method: 'post'
   }).then(res => {
      return Promise.resolve(res.data)
   })
}

