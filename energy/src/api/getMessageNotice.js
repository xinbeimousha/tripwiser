import request from './config.js';
import qs from 'qs';
/**
 * @description 获取未读消息列表
 * @param {type} 未读消息的类型
 * 
 */
export function getNotReadMessages(type=''){
  const [url,method] = [
    'msgPushController/getNotReadMessages.do',
    'get'
  ]
  return  request({
    url,
    method,
    params:{
      type
    }
  },false).then(res => {
    return Promise.resolve(res.data);
  })
}
/**
 * @description 设置消息已读
 */
export function readMsg(type=''){
  const [url,method] = [
    'msgPushController/readMsg.do',
    'post'
  ];
  return request({
    url,
    method,
    data:qs.stringify({type})
  },false).then(res => {
    return Promise.resolve(res.data)
  })
}