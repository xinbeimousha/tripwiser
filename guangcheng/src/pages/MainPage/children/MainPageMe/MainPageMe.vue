<template>
  <!--为什么加这么多div和style，为了兼容企业微信的滚动所以用了better-scroll-->
  <div class="me" style="height: 100%;">
    <div class="displays" style="height: 100%; display: flex;flex-direction: column">
    <HeaderTitle 
      title="个人中心"
      :btnRight="true" 
      :showMsg="true"
    />
      <!--头部-->
      <div style="flex: 1;overflow: hidden;width: 100%;" ref="wrapper" >
        <div>
        <div class="head" @click="headTap">
      <div class="head-left">
        <img :src="imgUrl" alt=""
        v-if="imgBoll1">
        <img src="./me_index_header.png" alt=""
        v-if="imgBoll2">
      </div>
      <div class="head-center">
        <div >{{obj.realName}}</div>
        <div>{{obj.userName}}</div>
        <div class="head-c-bottom">
          <div class="head-c-bottom-left">积分0</div>
          <div class="head-c-bottom-center"></div>
          <div class="head-c-bottom-right">本月费用0</div>
        </div>
      </div>
      <div class="head-right">
        <div class="fa fa-angle-right ico">
        </div>
      </div>

    </div>

        <!--中间表格区域-->
        <div class="table">
      <div class="jifen" @click="jifenTap">
        <img src="./me_index_jifen.png" alt="">
        <div>积分兑换</div>
        <div class="fa fa-angle-right ico"></div>
      </div>
      <div class="jifen" @click="serverTap">
        <img src="./me_index_service.png" alt="">
        <div>服务卡卷</div>
        <div class="fa fa-angle-right ico"></div>
      </div>
      <div class="jifen" @click="manageTap" v-if="isApplyer">
        <img src="./index_psw.png" alt="">
        <div>管理报告</div>
        <div class="fa fa-angle-right ico"></div>
      </div>
      <div class="jifen" @click="expensesTap">
        <img src="./me_index_money.png" alt="">
        <div>费用查询</div>
        <div class="fa fa-angle-right ico"></div>
      </div>
      <div class="jifen" @click="msgTap">
        <img src="./me_index_msg.png" alt="">
        <div>消息通知</div>
        <div class="fa fa-angle-right ico"></div>
      </div>
      <div class="jifen" @click="ideaTap">
        <img src="./me_index_feedback.png" alt="">
        <div>意见反馈</div>
        <div class="fa fa-angle-right ico"></div>
      </div>
      <div class="jifen" @click="aboutTap">
        <img src="./me_index_aboutus.png" alt="">
        <div>关于我们</div>
        <div class="fa fa-angle-right ico"></div>
      </div>
      <!-- <div class="jifen">
        <img src="./index_psw.png" alt="">
        <div>修改密码</div>
        <div class="fa fa-angle-right ico"></div>
      </div> -->
    </div>
        <!--底部退出按钮  小程序不需要退出按钮-->
          <!--<div class="btn-bottom" @click="LogOut">-->
            <!--<div>退出登录</div>-->
          <!--</div> -->
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from 'components/HeaderTitle/HeaderTitle.vue';

import { Toast,Dialog } from 'vant';
import { getMeMain,getMeLogout} from "api/getMeApi";
import { getLocal } from 'common/js/storage.js'
import BScroll from 'better-scroll'

export default {
  components:{
    HeaderTitle
  },
   data(){
     return{
        obj:{},
        imgUrl:'',
        //判断是否有头像，没有用本地
        imgBoll1:false,
        imgBoll2:true,
        isApplyer:false
     }

   },
   created(){
     const userInfo = JSON.parse(getLocal('userInfo'));
     this.isApplyer = userInfo.isApplyer;
   },
    methods:{
        headTap(){
            this.$router.push({name:'Edit'})
        },
        manageTap(){
            this.$router.push({name:'Manage'})
        },
        expensesTap(){
            this.$router.push({name:'Expenses'})
        },
        msgTap(){
           this.$router.push({name:'Message'})
           this.$store.commit('SET_ALIVEPAGE','MainPageMeMessage')
        },
        ideaTap(){
            this.$router.push({name:'Idea'})
        },
        aboutTap(){
            this.$router.push({name:'About'})
        },
        addApply(){
            console.log("触发邮件");
        },
       jifenTap(){
           Toast('功能暂未开放。。。')
       },
       serverTap(){
          Toast('功能暂未开放。。。')
       },
    //   退出功能
       LogOut(){
          Dialog.confirm({
             title: '提示',
             message: '确定退出登录吗？'
          }).then(() => {
             getMeLogout().then(res=>{
                console.log(res);
                if (res.success){
                   localStorage.removeItem('userInfo')
                   localStorage.removeItem('username')
                   localStorage.removeItem('password')
                   localStorage.removeItem('savedUser')
                   localStorage.removeItem('token')
                   this.$router.push({path:'/'})
                }
             })
          }).catch(() => {
             // on cancel
          });

       }
    },
   mounted(){
      getMeMain().then(res=>{
         console.log(res);
         if (res.success){
            this.obj=res.obj
            this.imgUrl=res.obj.face
            //开启滚动
            this.$nextTick(() => {
               this.scroll = new BScroll(this.$refs.wrapper,{
                  startX:0,
                  click:true,
                  // scrollX:true,
                  scrollY:true,
                  bounce:false,
                  scrollbar: true


               });
            });

            if (this.imgUrl) {
               this.imgBoll1 = true
               this.imgBoll2 = false
            }
         }else if ((res.code && res.code == 10001) || (res.msg && res.msg.indexOf("自动登录失败") > -1)) {
            //如果登录不成功就跳回首页重新登录
            Dialog.alert({
               title: '错误',
               message: '账号在其他设备登录了或登录超时，请重新登录'
            }).then(() => {
               //    然后跳转登录页
               this.$router.push({name: 'login'})
            });

         }
      })
   },
   //从别的路由切换回来重新调用一次函数
   activated: function() {
      getMeMain().then(res=>{
         console.log(res);
         if (res.success){
            this.obj=res.obj
            this.imgUrl=res.obj.face
            if (this.imgUrl) {
               this.imgBoll1 = true
               this.imgBoll2 = false
            }
         }else if ((res.code && res.code == 10001) || (res.msg && res.msg.indexOf("自动登录失败") > -1)) {
            //如果登录不成功就跳回首页重新登录
            Dialog.alert({
               title: '错误',
               message: '账号在其他设备登录了或登录超时，请重新登录'
            }).then(() => {
               //    然后跳转登录页
               this.$router.push({name: 'login'})
            });

         }
      })
   }


}
</script>

<style lang="stylus" scoped>
  .me{
    flex:1;
    display flex
    .displays{
      flex:1
      height:100%

      .table{

      }
    }
  }


  .head{
    height: 100px;
    width: 100%;
    background-color: rgb(100,121,173);
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #fff;
    font-weight: bolder;
    font-size:0.3rem;
    /*font-size 1rem*/
  }
  .head-left{
    width: 20%;
    height: 80%;
    position: relative;
  }
  .head-left img{
    height: 75%;
    width:60px;
    border-radius:50%;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

  }
  .head-center{
    width: 65%;
    height: 80%;
  }
  /*头部中间区域*/
  .head-right{
    width: 8%;
    height: 50px;
    line-height: 50px;
    color: white;
    font-size: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    div{
      font-size 0.35rem;
    }
  }
    .head-center div{
      font-size 0.28rem
    }
  .head-center>div{
    height: 33.3%;
   }
  .head-center>div:nth-child(1){
      font-size: 0.28rem;
   }
  .head-center>div:nth-child(2){
    font-size: 0.26rem;
    color: rgb(193,194,198);
  }
  .head-c-bottom{
    display: flex;
    justify-content: space-between;
    font-size: 0.28rem;
  }
  .head-c-bottom .head-c-bottom-left{
    height: 100%;
    width: 49%;

  }
  .head-c-bottom .head-c-bottom-center{
    height: 60%;
    width: 1px;
    background-color: rgb(139,151,182);

  }
  .head-c-bottom .head-c-bottom-right{
    height: 100%;
    width: 49%;
    text-align: right;
  }

  /*表格区域*/
  .table{
    width: 100%;
    background-color: #fff;
    margin-top: 10px;
    border-top: 2px solid #EBEBEB;

  }
  .table .jifen{
    height: 25px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 8px 10px;
    font-weight: bolder;
    font-size: 0.28rem;
    border-bottom: 2px solid #EBEBEB;
  }
  .table .jifen img{
    height: 100%;
  }
  .table .jifen div:nth-of-type(1){
    width: 80%;
    display: flex;
    align-items: center;
  }
  .table .jifen div:nth-of-type(2){
    width: 7%;
    display: flex;
    align-items: center;
    font-size: 0.28rem;
  }

  /*底部按钮*/
  .btn-bottom{
    margin-top: 15px;
    padding: 10px;

  }
  .btn-bottom div{
    font-size: 0.3rem;
    background-color:rgb(64,90,155) ;
    text-align: center;
    color: #fff;
    padding: 8px 0;
    border-radius: 7px;
    font-weight: bolder;
  }





</style>


