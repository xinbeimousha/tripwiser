import request from 'api/config';

export  function checkBookTime (){
  const [url,method] = [
    'flightController.do?checkBookTime',
    'get'
  ];
  return request({
    url,
    method
  },false).then(res => {
    return Promise.resolve(res.data)
  })
}