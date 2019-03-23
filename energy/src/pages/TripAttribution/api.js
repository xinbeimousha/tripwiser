import request from 'api/config.js';
import qs from 'qs';
/**
 * @description 获取部门数据
 */
export function getProject(){
  const url = 'appTmcItineraryController.do?getProject';
  const method = 'get';

  return request({
    url,
    method
  }).then(res => {
    return Promise.resolve(res.data);
  })
}
/**
 * @description 搜索部门数据
 */
export function searchDeparts(keyWord){
  const [url,method,obj] = [
    'appTmcItineraryController.do?searchDeparts',
    'post',
    {
      'keyWord':keyWord
    }
  ]
  return request({
    url,
    method,
    data:qs.stringify(obj)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
