import request from 'api/config.js';
import qs from 'qs';
import { PAGE_SIZE } from 'api/constant.js';
/**
 * @description 获取部门和人员的列表
 */

export function getDepartsAndNames(obj){
 const url = 'appTmcItineraryController.do?getDepartsAndNames';
 const method = 'post';
 
  return request({
    url,
    method,
    data:qs.stringify(obj)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
/**
 * @description 搜索部门人员
 */
export function searchOthers(keyWord,page,selfId = ''){
  const url = 'appTmcItineraryController.do?searchOthers';
  const method = 'post';
  const obj = {
    keyWord,
    selfId,
    page,
    pageSize:PAGE_SIZE
  }

  return request({
    url,
    method,
    data:qs.stringify(obj)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}