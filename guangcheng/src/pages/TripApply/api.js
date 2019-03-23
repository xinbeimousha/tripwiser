import request from 'api/config';
import { PAGE_SIZE } from 'api/constant.js';
/**
 * @description 获取行程列表
 */

export function getItinerInfo(flowState,page,showLoading = false){
  const url = 'appTmcItineraryController.do?getItinerInfo';
  const method = 'get';
  const obj = {
    flowState,
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