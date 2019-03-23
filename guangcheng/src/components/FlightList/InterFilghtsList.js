import request from 'api/config.js';
import { getDate2 } from 'common/js/day.js';
import qs from 'qs'

/**
 * 查询国外机票舱位详情
 */
export function interGetSeatsList(i,f) {
   let data={
      agentsTag:"YEESKY"||"YEESKY_INTERNATIONAL",
      personType:'ADT',
      voyages:f.voyages
   }
   return request({
      url: 'interFlightController.do?getSeatPriceList',
      method: 'post',
      headers:{
         'content-type':'application/json'
      },
      data: JSON.stringify(data)
   }).then(res => {
      return Promise.resolve(res.data)
   })
}

