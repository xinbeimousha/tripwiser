<template>
    <div class="Edit">
        <HeaderTitle title="编辑信息" :btnLeft="true" :btnRight="false" className="fa-plus" @back="fanhTap"
                     class="headerTitle"/>
        <!--头部修改头像-->
        <div class="head">
            <div class="head-img">

                <img :src="imgUrl" alt=""
                     ref="goodsImg"
                     multiple
                     @click="imgShow"
                     v-if="imgBoll1">
                <img src="./me_index_header.png" alt=""
                     ref="goodsImg"
                     multiple
                     @click="imgShow"
                     v-if="imgBoll2">

                <!--<input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>-->

                <!--192.168.2.-->
                <!--jpg jif png bmp--> <!--multiple
                capture="camera"-->
                <van-uploader
                        :after-read="onRead"
                        accept="image/*"
                >
                    <p>点击修改头像</p>
                </van-uploader>
            </div>


        </div>
        <!--中间表格区域-->
        <div class="table">
            <div class="jifen" style="color: rgb(153,153,153)">
                <div>工号</div>
                <div>{{info.userName}}</div>
                <div></div>
            </div>
            <div class="jifen" style="color: rgb(153,153,153)">
                <div>姓名</div>
                <div>{{info.realName}}</div>
                <div></div>
            </div>
            <div class="jifen">
                <div>性别</div>
                <div @click="showSex=true">{{info.sex | changeSex}}</div>
                <div class="fa fa-angle-right ico"></div>
            </div>
            <div class="jifen">
                <div>出生年月</div>
                <div @click="showDate=true">{{info.birthday | clicp}}</div>
                <div class="fa fa-angle-right ico"></div>
            </div>
            <div class="jifen">
                <div>身份证</div>
                <div @click="manage">{{cartIdChange}}</div>
                <div @click="eyesChange">
                    <img src="./me_user_editor_eyes1.png" v-show="imgTrue1" class="shenfImg">
                    <img src="./me_user_editor_eyes.png" v-show="imgTrue2" class="shenfImg">
                </div>
            </div>
            <div class="jifen">
                <div>手机号码</div>
                <div><input v-model="mobile"></div>
                <div></div>
            </div>
        </div>
        <!--底部退出按钮-->
        <div class="btn-bottom" @click="changeBtn">
            <div>完成修改</div>
        </div>

        <!--出生年月模板-->
        <van-popup v-model="showDate" position="bottom">
            <van-datetime-picker
                    v-model="pickerValue"
                    type="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="handleConfirm"
                    @cancel="showDate=false"
            />
        </van-popup>
        <!--性别模板-->
        <van-popup v-model="showSex" position="bottom">
            <van-picker :columns="columns" @change="sexTap"/>
        </van-popup>
    </div>
</template>

<script>


   import HeaderTitle from "components/HeaderTitle/HeaderTitle";
   //引入后台接口
   import {getMeEdit, submitMeEdit, postMeEditImg, postMeEditImgs} from "api/getMeApi";

   //引入
   import {
      Dialog,
      Toast,
      ImagePreview
   } from 'vant';

   export default {
      components: {
         HeaderTitle
      },
      data() {
         return {
            info: {},//渲染数据
            showDate: false,//控制出生日期
            pickerValue: '',
            minDate: new Date(1920, 1, 1),
            maxDate: new Date(),
            showSex: false,//控制性别选择器，
            columns: ['保密', '女', '男'],
            mobile: '',//电话号码,
            timeBeginC: '',
            changeaa: '',//上传图片的方法
            // imgUrl:'me_user_editor_eyes1.png'
            imgTrue1: true,
            imgTrue2: false,
            cartIdChange: '',
            //   头像图片me_index_header.png
            imgUrl: '',
            //控制显示后台图片或者本地固定图片
            imgBoll1: false,
            imgBoll2: true
         }
      },
      mounted() {
         getMeEdit().then(res => {
            console.log(res);
            if (res.success == true) {
               this.info = res.obj
               this.mobile = this.info.mobile
               this.pickerValue = new Date(this.info.birthday.replace(/\-/g, '/'));
               this.imgUrl = this.info.face

               //判断是否有图片，没有用本地的
               if (this.imgUrl) {
                  this.imgBoll1 = true
                  this.imgBoll2 = false
               }


               var newB = this.info.cardId.slice(0, 3)
               var newE = this.info.cardId.slice(12)

               this.cartIdChange = newB + '*********' + newE
            }
            if ((res.code && res.code == 10001) || (res.msg && res.msg.indexOf("自动登录失败") > -1)) {
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
      methods: {
         //预览图片
         imgShow() {

            if (this.imgUrl) {
               ImagePreview([
                  this.imgUrl
               ]);

            }

         },
         eyesChange() {
            if (this.imgTrue1) {
               this.imgTrue1 = false
               this.imgTrue2 = true
               this.cartIdChange = this.info.cardId

               // cartIdChange  3-9
            } else {
               this.imgTrue1 = true
               this.imgTrue2 = false
               var newB = this.cartIdChange.slice(0, 3)
               var newE = this.cartIdChange.slice(12)

               this.cartIdChange = newB + '*********' + newE
            }
         },
         fanhTap() {
            this.$router.push({name: 'MainMe'})
         },
         //   年月日点击确定
         handleConfirm() {
            this.showDate = false
            var monthBegin = this.pickerValue.getMonth() + 1
            this.timeBeginC = this.pickerValue.getFullYear() + '-' + monthBegin + '-' + this.pickerValue.getDate()

            this.info.birthday = this.timeBeginC

         },
         //       性别改变
         sexTap(picker, value, index) {
            console.log(picker, value, index);
            if (index == 1) {
               this.info.sex = 1
            } else if (index == 2) {
               this.info.sex = 0
            } else {
               this.info.sex = " "
            }
         },
         //       点击身份证
         manage() {
            Toast('请联系管理员修改')
         },
         //       点击按钮提交
         changeBtn() {
            this.info.mobile = this.mobile
            // 手机正则
            var isphone = /^1[3|4|5|7|8][0-9]{9}$/;
            //身份证正则
            var iscard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            if (!isphone.test(this.mobile) || this.mobile == '') {
               Toast.fail('手机号输入有误');
               return false;
            }
            if (!iscard.test(this.info.cardId) || this.info.cardId == '') {
               Toast.fail('身份证输入有误，请重新输入');
               return false;
            }
            var sex = this.info.sex
            var mobile = this.mobile
            var birthday = this.timeBeginC
            var picture = this.imgUrl
            var data = {
               sex: sex,
               birthday: birthday,
               mobilePhone: mobile,
               picture: picture
            }
            submitMeEdit(data).then(res => {
               if (res.success == true) {
                  Toast(res.msg)

               }
            })


         },
         //上传图片
         onRead(file) {
            let param = new FormData();
            // console.log(file.file);
            console.log(file.file);
            console.log(file.file.size);
            if (file.file.size>=3000000){
               Toast.fail('图片大小必须小于3M');
               return false
            }
            //判断是否是这种类型图片jpg gif png bmp
            if (file.file.type.indexOf('jpg')!=-1 || file.file.type.indexOf('gif')!=-1 || file.file.type.indexOf('png')!=-1 ||file.file.type.indexOf('bmp')!=-1 || file.file.type.indexOf('jpeg')!=-1){
               param.append("file", file.file, file.file.name);//第一

               postMeEditImgs(param).then(res => {
                  console.log(res);
                  if (res.success) {
                     this.imgUrl = res.obj.imgUrl;
                     //判断如果没有图片就用本地图片
                     if (this.imgUrl) {
                        this.imgBoll1 = true
                        this.imgBoll2 = false
                     }
                  }else{
                     Toast(res.msg); 
                  }

               })
            }else{
               Toast('图片格式必须为jpg/gif/png/bmp');
            }



         },


      },
      //   过滤器
      filters: {
         changeSex(value) {
            if (value == '1') {
               value = '女'
            } else if (value == '0') {
               value = '男'
            } else {
               value = '保密'
            }
            return value
         },
         clicp(bir) {
            if (bir) {
               if (bir.indexOf(' ') != -1) {
                  bir = bir.split(' ')[0]
               }
               return bir
            }

         }
      }

   }


</script>


<style lang="stylus" scoped>
    .headerTitle{
       //头部样式
       position fixed;
       top:0;
       left: 0;
       width: 100%;
       z-index:100;
   }
    .head {
        padding-top:1rem;
        height: 100px;
        width: 100%;
        background-color: rgb(100, 121, 173);
        color: #fff;
        font-weight: bolder;
        font-size: 0.3rem;

    }

    .head .head-img {
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        display: flex;
    }

    .head .head-img img {
        width: 60px;
        height: 60%;
        border-radius: 50%;
    }

    .head .head-img p {
        font-size: 0.28rem;
        margin-top: 5px;
    }

    /*表格区域*/
    .table {
        width: 100%;
        background-color: #fff;
        margin-top: 10px;
        border-top: 2px solid #EBEBEB;
        font-weight: 700;
        font-size: 0.3rem;

    }

    .table .jifen {
        height: 25px;
        /*width: 100%;*/
        display: flex;
        padding: 8px 0px 8px 10px;
        font-size: 0.18rem;
        border-bottom: 2px solid #EBEBEB;
        div {
            font-size: 0.28rem;
        }
    }

    .table .jifen div:nth-of-type(1) {
        width: 80%;
        display: flex;
        align-items: center;
        flex: 2;

    }

    .table .jifen div:nth-of-type(2) {
        width: 7%;
        display: flex;
        align-items: center;

        flex: 5;
        font-size: 0.28rem;
        input {
            font-size: 0.28rem;
        }
    }


    .shenfImg {
        height: 20px;
    }

    .table .jifen input {
        flex: 1;
    }

    .table .jifen div:nth-of-type(3) {
        width: 7%;
        display: flex;
        align-items: center;
        font-size: 0.28rem;
        flex: 1;
        justify-content: center;
    }

    /*底部按钮*/
    .btn-bottom {
        margin-top: 15px;
        padding: 10px;
    }

    .btn-bottom div {
        font-size: 0.28rem;
        background-color: rgb(64, 90, 155);
        text-align: center;
        color: #fff;
        padding: 8px 0;
        border-radius: 7px;
        font-weight: bolder;
    }

</style>