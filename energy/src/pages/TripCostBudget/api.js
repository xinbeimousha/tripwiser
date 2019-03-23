import request from 'api/config';
import qs from 'qs'
/**
 * @description 获取费用预算
 */
export function getBudgets(obj){
  const [url,method] = [
    'appBudgetRuleController.do?getBudgets',
    'post'
  ];
  return request({
    url,
    method,
    data:qs.stringify(obj)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}