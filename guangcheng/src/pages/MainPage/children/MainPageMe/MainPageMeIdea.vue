<template>
    <div>
        <HeaderTitle title="编辑信息"
                     :btnLeft="true"
                     :btnRight="false"
                     className="fa-plus"
                     @back="fanhTap"
                     class="headerTitle"
        />
        <!--反馈区域-->
        <div class="content">
            <input type="text" placeholder="请简要描述您的反馈意见" v-model="title">
            <textarea name="" id="" placeholder="详细描述您的问题或建议，以便我们将尽快为您解决" v-model="content"></textarea>
        </div>
        <div class="detail">您的意见对我们至关重要，感谢您对航行家的支持</div>
        <!--底部退出按钮-->
        <div class="btn-bottom" @click="btnTap">
            <div>提交反馈</div>
        </div>
    </div>
</template>

<script>
   import HeaderTitle from 'components/HeaderTitle/HeaderTitle.vue';
   import {PostIde} from "api/getMeApi";

   import { Dialog,Toast } from 'vant';

   export default {
      components: {
         HeaderTitle
      },
      data() {
         return {
            title: '',
            content: ''
         }
      },
      methods: {
         fanhTap() {
            this.$router.push({name: 'MainMe'})
         },
         //判断标题或内容是否为空

         //    发送给后台

         btnTap() {
            console.log(this.title, this.content);
            if (!this.title.trim()) {
               Toast('标题不能为空');
               return false
            }
            if (!this.content.trim()) {
               Toast('内容不能为空')
               return false
            }
            PostIde('88694562', this.title, this.content).then(res => {
               console.log(res);
               if (res.success) {
                  Dialog.alert({
                     title: '提交反馈',
                     message: '您的意见已反馈给工作人员 我们将尽快处理，谢谢'
                  }).then(() => {
                     this.title = ""
                     this.content = ""
                     this.fanhTap()
                  });

               } else if ((res.code && res.code == 10001) || (res.msg && res.msg.indexOf("自动登录失败") > -1)) {
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
   }
</script>

<style scoped lang="stylus">
    .headerTitle {
        //头部样式
        position fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
    }
    /*content*/
    .content {
        /*height: 300px;*/
        background-color: white;
        width: 100%;
        /*padding: 10px;*/
        padding: 10px 0;
        font-size: 0.3rem;
        padding-top:1rem
    }

    .content input {
        border-bottom: 2px solid #EBEBEB;
        display: block;
        width: 96%;
        padding: 10px 0 10px 10px;
    }

    .content textarea {
        margin-top: 5px;
        display: block;
        width: 95%;
        border: none;
        border-bottom: 2px solid #EBEBEB;
        height: 250px;
        padding: 10px 10px;
        resize:none;//禁止拉升
    }

    .detail {
        color: #999999;
        text-align: center;
        padding: 10px 0 30px 0;
        font-size: 0.26rem;
    }

    /*底部按钮*/
    .btn-bottom {
        margin-top: 15px;
        padding: 10px;
    }

    .btn-bottom div {
        font-size: 0.24rem;
        background-color: rgb(64, 90, 155);
        text-align: center;
        color: #fff;
        padding: 8px 0;
        border-radius: 7px;
        font-weight: bolder;
    }
</style>