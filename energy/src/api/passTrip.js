import request from './config.js';
import qs from 'qs';
export function passTrip(tripData,showLoading) {
  const data ={
    id: tripData.id,
    taskId: tripData.taskId
  }
  return request({
    url: 'appTmcItineraryController.do?appDoPass',
    method: 'POST',
    data:qs.stringify(data),
  },showLoading).then(res => {
    return Promise.resolve(res.data)
  })
}
