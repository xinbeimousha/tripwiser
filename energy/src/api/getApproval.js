import request from './config.js';
import qs from 'qs';
export function getApproval(page, showLoading) {
  console.log(page)
  const Page = {
    flowState: page.flowState,
    page: page.page,
    pageSize: page.pageSize
  }
  return request({
    url: 'appTmcItineraryController.do?getAllApprovedItinerByComp',
    method: 'get',
    params : Page
  }, showLoading).then(res => {
    return Promise.resolve(res.data)
  })
}
