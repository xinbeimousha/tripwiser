import request from 'api/config';
export default{
  verformLogin: function (code) {
    return request({
      url: 'enterpriseWechatController.do?login',
      method: 'get',
      params:{
        code:code
      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      return Promise.resolve(res.data)
    })
  },
  bindingUser:function(corpId,userId,username,password){
    const obj = {
      username: username,
      password:password,
      corpId:corpId,
      enterpriseWechatUserId:userId
    }
    return request({
      url: 'enterpriseWechatController.do?bind',
      method: 'post',
      data:obj,

    }).then(res => {
      return Promise.resolve(res.data)
    })
  }
}

