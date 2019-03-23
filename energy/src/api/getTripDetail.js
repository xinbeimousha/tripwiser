import request from './config.js';
import qs from 'qs';
export function getTripDetail(TripId,showLoading) {
  const id ={
    id: TripId
  }
  return request({
    url: 'appTmcItineraryController.do?getApplyInfo',
    method: 'POST',
    data:qs.stringify(id),
  },showLoading).then(res => {
    return Promise.resolve(res.data)
  })
}
