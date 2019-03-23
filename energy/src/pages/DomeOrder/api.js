import request from 'api/config';

/**
 * 国际机票提交订单
 */
export function InterPlaneBook(orderData) {
   const url = 'interFlightController.do?interPlaneBook';
   const method = 'post';

   return request({
      url,
      method,
      headers:{
         'content-type':'application/json'
      },
      data: JSON.stringify(orderData),
   }).then(res => {
      return Promise.resolve(res.data);
   })
}

/**
 * 机票验价接口（国际没用。。。。）
 */
export function IntercheckPrice(flight,seat) {
   const url = 'flightController.do?checkPriceWithoutPNR';
   const obj = {
      carrier: flight.airlineCode,//carrier
      flightNo: flight.flightNo,//flightNo可能要把前面字母去掉
      classCode: seat.code,//seatCode 在seat里面
      depart: flight.depAirportCode,//departureAirPort
      arrival: flight.arrAirportCode,//arrivalAirPort
      departDate: getDate2(flight.depDate)//depDate
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
  flightCheckPriceDTOList
}) {
  const url = 'flightController.do?checkFlightRule';
  const method = 'post';
  const checkRuleData = {
    itineraryId,
    al,
    fTotalPrice,
    cause,
    contactTelephone,
    passengers,
    flightCheckPriceDTOList
  }
  return request({
    url,
    method,
    data: checkRuleData
  }).then(res => {
    return Promise.resolve(res.data);
  })
}
/**
 * @description 提交订单
 */
export function planeBook(orderData) {
  const url = 'flightController.do?planeBook';
  const method = 'post';

  return request({
    url,
    method,
    data: orderData,
  }).then(res => {
    return Promise.resolve(res.data);
  })
}
