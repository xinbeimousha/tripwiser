import request from 'api/config';
import  qs from 'qs';

export function getTravelOrderDetail(itineraryId){
  const [
    url,
    method
  ] = ['appTmcItineraryController.do?getTravelOrderDetail','post'];
  const obj = {
    itineraryId,
    page: 1,
		pageSize: 10
  }
  return request({
    url,
    method,
    data:qs.stringify(obj)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}