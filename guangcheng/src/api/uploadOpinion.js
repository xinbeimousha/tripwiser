import request from './config.js';
import qs from 'qs';
export function uploadOpinion(tripData,showLoading) {
  const data ={
    id: tripData.id,
    taskId: tripData.taskId,
    comment:tripData.comment
  }
  return request({
    url: 'appTmcItineraryController.do?appDoReject',
    method: 'POST',
    data:qs.stringify(data),
  },showLoading).then(res => {
    return Promise.resolve(res.data)
  })
}
