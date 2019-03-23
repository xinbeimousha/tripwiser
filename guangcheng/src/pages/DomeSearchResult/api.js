import request from 'api/config.js';
import { getDate2 } from 'common/js/day.js';
import qs from 'qs'




/**
 * 国际机票验价接口（国际不需要验价）
 */
export function IntercheckPrice(flight,seat) {
   const url = 'flightController.do?checkPriceWithoutPNR';
   const obj = {
      carrier: flight.carrier,//carrier
      flightNo: flight.voyages[0].legs[0].flightNo,//flightNo可能要把前面字母去掉
      classCode: seat.seatCode,//seatCode 在seat里面
      depart: flight.voyages[0].departureAirPort,//departureAirPort
      arrival: flight.voyages[0].arrivalAirPort,//arrivalAirPort
      departDate: flight.depDate//depDate
   }
   console.log(obj);
   return request({
      url,
      method: 'post',
      data: qs.stringify(obj)
   }).then(res => {
      return Promise.resolve(res.data)
   })
}


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


/**
 * @description 查询国外机票接口
 */
export function interSearchPlaneList(searchData) {
   return request({
      url: 'interFlightController.do?queryInterFlightsList',
      method: 'post',
      data: qs.stringify(searchData)
   }).then(res => {
      return Promise.resolve(res.data)
   })
}
//国外的




/**
 * @description 查询国内机票接口
 */
export function searchPlaneList(searchData) {
  return request({
    url: 'flightController.do?queryFlightsList',
    method: 'post',
    data: qs.stringify(searchData)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}


/**
 * @description 验价接口
 */
export function checkPrice(flight,seat) {
   console.log(flight,seat);
  const url = 'flightController.do?checkPriceWithoutPNR';
  const obj = {
    carrier: flight.airlineCode,
    flightNo: flight.flightNo,
    classCode: seat.code,
    depart: flight.depAirportCode,
    arrival: flight.arrAirportCode,
    departDate: getDate2(flight.depDate)
  }
  return request({
    url,
    method: 'post',
    data: qs.stringify(obj)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}



/**
 * @description 机票校验规则
 */
export function checkFlightRule({
                                   itineraryId,
                                   al,
                                   fTotalPrice,
                                   cause,
                                   contactTelephone,
                                   passengers,
                                   flightCheckPriceDTOList,
                                   domainType,
                                }) {
   const url = 'flightController.do?checkFlightRule';
   const method = 'post';
   let checkRuleData = {
      itineraryId,
      al,
      fTotalPrice,
      cause,
      contactTelephone,
      passengers,
      flightCheckPriceDTOList,
      domainType
   }

   return request({
      url,
      method,
      data: checkRuleData
   }).then(res => {
      return Promise.resolve(res.data);
   })
}