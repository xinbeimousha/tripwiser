<template>
    <div style="height: 100%;display: flex;flex-direction: column">
        <HeaderTitle
                title="管理驾驶舱"
                :btnLeft="true"
                :btnRight="false"
                className="fa-plus"
                @back="fanhTap"
                class="headerTitle"
        />
        <!--时间选择器+弹出层-->
        <!--时间开始-->
        <van-popup v-model="showDate" position="bottom">
            <van-datetime-picker
                    v-model="pickerValue"
                    type="date"
                    :min-date="startDate"
                    @confirm="handleConfirm"
                    @cancel="showDate=false"
            />


        </van-popup>
        <!--结束时间-->
        <van-popup v-model="showDEnd" position="bottom">
            <van-datetime-picker
                    v-model="pickerValue2"
                    type="date"
                    :min-date="startDate"
                    @confirm="handleConfirmEnd"
                    @cancel="showDEnd=false"
            />

        </van-popup>
        <div ref="wrapper" style="flex: 1;height: 100%;width: 100%;
            overflow: hidden;"
             class="contentBox">
            <div class="top1rem">
                <div class="timeBegin" @click="showDateBegin">
                    <img src="./me_money_detail_date.png" alt="">
                    <div class="timeBg">开始时间：{{timeBegin}}</div>
                    <div class="head-right">
                        <div class="fa fa-angle-right ico">
                        </div>
                    </div>
                </div>
                <div class="timeEnd timeBegin" @click="showDateEnd">
                    <img src="./me_money_detail_date.png" alt="">
                    <div class="timeBg">结束时间：{{timeEnd}}</div>
                    <div class="head-right">
                        <div class="fa fa-angle-right ico">
                        </div>
                    </div>
                </div>
                <!--content盒子-->
                <div class="content">
                    <div class="content-box">
                        <div class="content-boxNum van-clearfix">
                            <span>{{obj.availableCreditQuota}}</span>
                            <span>{{obj.flightTotalCost}}</span>
                        </div>
                        <div class="content-boxText van-clearfix">
                            <span>可用授信额度</span>
                            <span>已用授信额度</span>
                        </div>
                    </div>
                </div>
                <!--miniContent-->
                <div class="miniContent">
                    <div class="miniLeft">
                        <span>{{obj.totalCost}}</span><span>总消费额</span>
                    </div>
                    <div class="miniCenter">
                        <span>{{obj.flightTotalCost}}</span><span>机票总消费额</span>
                    </div>
                    <div class="miniRight">
                        <span>{{obj.hotelTotalCost}}</span><span>酒店总消费额</span>
                    </div>
                </div>
                <!--采购金额-->
                <div class="caig">
                    <div class="caigou">采购金额</div>
                    <div class="caig-table">
                        <div>
                            <span>机票产品</span>
                            <span>{{obj.flightTotalCost}}</span>
                        </div>
                        <div>
                            <span>国内机票</span>
                            <span>{{obj.yskFlightTotalCost}}</span>
                        </div>
                        <div>
                            <span>国际机票</span>
                            <span>{{obj.interYskFlightTotalCost}}</span>
                        </div>
                        <div class="lastd1">
                            <span>酒店产品</span>
                            <span>{{obj.hotelTotalCost}}</span>
                        </div>
                        <div class="lastd2">
                            <span>其他产品</span>
                            <span>{{obj.otherTotalCost}}</span>
                        </div>

                    </div>
                </div>
                <!--采购数量-->
                <div class="caig">
                    <div class="caigou">采购数量</div>
                    <div class="caig-table">
                        <div>
                            <span>机票产品数量</span>
                            <span>{{obj.flightMonthNumber}}</span>
                        </div>
                        <div>
                            <span>国内机票 / 张</span>
                            <span>{{obj.yskFlightMonthNumber}}</span>
                        </div>
                        <div>
                            <span>国际机票 / 套</span>
                            <span>{{obj.interYskFlightMonthNumber}}</span>
                        </div>
                        <div class="lastd1">
                            <span>酒店产品 / 晚</span>
                            <span>{{obj.hotelTotalDays}}</span>
                        </div>
                    </div>
                </div>
                <!--采购分析-->
                <div class="caig caigouFx">
                    <div class="caigou">采购分析</div>
                    <div class="caig-table">
                        <div class="lastd1">
                            <span>平均票价</span>
                            <span>{{obj.averageMonthTicketPrice}}</span>
                        </div>
                        <div class="lastd1">
                            <span>平均折扣</span>
                            <span>{{obj.averageMonthMarketDiscounts}}%</span>
                        </div>
                        <div class="lastd2">
                            <span>平均提前预定天数</span>
                            <span>{{obj.averageMonthBookDiffDays}}</span>
                        </div>
                        <div class="lastd1">
                            <span>退改比例</span>
                            <span>{{obj.averageMonthRetirementScale}}%</span>
                        </div>
                        <div class="lastd2">
                            <span>全价票比例</span>
                            <span>{{obj.averageMonthFullFareScale}}%</span>
                        </div>

                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
   import HeaderTitle from 'components/HeaderTitle/HeaderTitle.vue';
   import {Dialog} from 'vant';

   import {getMeManage} from "api/getMeApi";

   //引入滚动
   import BScroll from 'better-scroll'

   export default {
      name: "MainPageMeManage",
      components: {
         HeaderTitle
      },
      data() {
         return {
            pickerValue: new Date("2016/1/1"),
            timeBegin: '',
            timeEnd: '',
            pickerValue2: new Date("2016/1/1"),
            startDate: new Date("2016/1/1"),
            endDate: new Date(),
            //需要传的值
            timeBeginC: '',
            timeEndC: '',
            obj: {},//需要得到的数据，
            //   控制时间选择器是否弹出
            showDate: false,
            showDEnd: false,


         }
      }
      ,
      methods: {
         hahaha(){
           console.log(123); 
         },
         fanhTap() {
            this.$router.push({name: 'MainMe'})
         },
         //   开始时间
         showDateBegin() {
            this.showDate = true
            console.log(123);

         },
         //结束时间
         showDateEnd() {
            this.showDEnd = true
            console.log(123);
         },
         //   选择日期确认begin
         handleConfirm() {
            console.log(this.pickerValue);
            var monthBegin = this.pickerValue.getMonth() + 1
            if (monthBegin < 10) {
               monthBegin = '0' + monthBegin
            }
            var dayStar = this.pickerValue.getDate()
            if (dayStar < 10) {
               dayStar = '0' + dayStar
            }
            this.timeBegin = this.pickerValue.getFullYear() + '年' + monthBegin + '月' + dayStar + '日'
            this.timeBeginC = this.pickerValue.getFullYear() + '-' + monthBegin + '-' + this.pickerValue.getDate() + ' 00:00:00'
            this.getMeManageData()
            this.showDate = false

         },
         //   选择日期确认end
         handleConfirmEnd() {
            var monthEnd = this.pickerValue2.getMonth() + 1
            if (monthEnd < 10) {
               monthEnd = '0' + monthEnd
            }
            var dayEnd = this.pickerValue2.getDate()
            if (dayEnd < 10) {
               dayEnd = '0' + dayEnd
            }
            this.timeEnd = this.pickerValue2.getFullYear() + '年' + monthEnd + '月' + dayEnd + '日'
            this.timeEndC = this.pickerValue2.getFullYear() + '-' + monthEnd + '-' + dayEnd + ' 23:59:59'
            this.getMeManageData()
            this.showDEnd = false
         },
         //获取数据
         getMeManageData() {
            //   拿到渲染页面所需的数据
            console.log(this.timeBeginC, this.timeEndC);
            var ddd = {
               startDate: this.timeBeginC,
               endDate: this.timeEndC
            }
            //2018-10-25 00:00:00
            console.log(ddd.startDate);
            console.log(ddd.endDate);
            getMeManage(ddd).then(res => {
               console.log(res.obj);
               if (res.success == true) {
                  this.obj = res.obj
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

      },
      mounted() {
         var mounMonth = new Date().getMonth() + 1
         var mounMonthEnd = new Date().getMonth() + 2
         var mounDay = new Date().getDate()
         var mounDayEnd = new Date().getDate()
         if (mounMonthEnd < 10) {
            mounMonthEnd = '0' + mounMonthEnd
         }
         if (mounMonthEnd > 12) {
            mounMonthEnd = '01'
         }
         if (mounMonth < 10) {
            mounMonth = '0' + mounMonth
         }
         if (mounDay < 10) {
            mounDay = '0' + mounDay
         }
         if (mounDayEnd < 10) {
            mounDayEnd = '0' + mounDayEnd
         }
         this.timeBegin = new Date().getFullYear() + '年' + mounMonth + '月' + mounDay + '日'
         this.timeEnd = new Date().getFullYear() + '年' + mounMonthEnd + '月' + mounDayEnd + '日'

         this.timeBeginC = new Date().getFullYear() + '-' + mounMonth + '-' + mounDay + ' 00:00:00'
         this.timeEndC = new Date().getFullYear() + '-' + mounMonthEnd + '-' + mounDayEnd + ' 23:59:59'
         //   拿到渲染页面所需的数据
         this.getMeManageData()

         this.scroll = new BScroll(this.$refs.wrapper, {
            startX:0,
            click:true,
            // scrollX:true,
            scrollY:true,
            // eventPassthrough:'vertical'
         });


      },
   }
</script>

<style scoped lang="stylus">
    /*.headerTitle{
        //头部样式
        position fixed;
        top:0;
        left: 0;
        width: 100%;
        z-index:100;
    }*/
    .contentBox {
        /*padding-top 1rem*/
    }

    .top1rem {

    }

    /*时间*/
    .timeBegin {
        height: 45px;
        /*width: 100%;*/
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #fff;
        padding-left: 20px;
        font-size: 0.3rem;
        margin-top: 10px
    }

    .timeBegin img {
        height: 25px;

    }

    .timeBegin .timeBg {
        flex: 10;
        padding-left: 15px;
    }

    .timeBegin .head-right {
        flex: 1;
        color: #C8C8C8;
        text-align center
    }

    .timeEnd {
        margin-top: 10px;
    }

    /*盒子content*/
    .content {
        width: 100%;
        height: 100px;
        justify-content: center;
        align-items: center;
        display: flex;
        color: white;
        font-weight: bolder;
    }

    .content .content-box {
        background: linear-gradient(133deg, #46D2FD 0%, #5351F0 100%);
        width: 85%;
        height: 60%;
        border-radius: 8px;
        padding: 15px;
        padding-top: 10px;
        font-size: 0.28rem;
    }

    .content .content-box .content-boxNum {
    }

    .content .content-box .content-boxNum span:nth-child(1) {
        float: left;
        font-size: 0.48rem;
    }

    .content .content-box .content-boxNum span:nth-child(2) {
        float: right;
        line-height: 0.8rem;
    }

    .content .content-box .content-boxText {
        margin-bottom 10px
    }

    .content .content-box .content-boxText span:nth-child(1) {
        float: left;
    }

    .content .content-box .content-boxText span:nth-child(2) {
        float: right;

    }

    /*miniContent*/
    .miniContent {
        width: 92%;
        height: 100px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        font-weight: bolder;
    }

    .miniContent > div {
        height: 80%;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 0.28rem;
    }

    .miniLeft {
        background: linear-gradient(133deg, #F15887 0%, #FE9B86 100%);
        width: 28%;
    }

    .miniCenter {
        background: linear-gradient(133deg, #645AFF 0%, #A573FF 100%);
        width: 33%;
    }

    .miniRight {
        background: linear-gradient(133deg, #2DC9EB 0%, #14D2B8 100%);
        width: 33%;
    }

    /*采购金额*/
    .caig {
        width: 100%;
        font-size: 0.32rem;
        font-weight: 700;
    }

    .caigou {
        color: #B7B7B7;
        height: 30px;
        padding-left: 15px;
        padding-bottom: 5px;
        padding-top: 8px;
    }

    .caig-table {
        background-color: #fff;
        padding-left: 15px;
        padding-right: 15px;
    }

    .caig-table > div {
        height: 40px;
    }

    .caig-table > div:nth-child(1) {
        padding-top: 5px;
    }

    .caig-table > div:nth-child(2), .caig-table > div:nth-child(3) {
        text-indent: 2em;
        color: #B7B7B7;
        font-weight: bolder;
    }

    .caig-table > div:nth-child(4), .caig-table > div:nth-child(5) {
        border-top: 2px solid #EBEBEB;
        line-height: 40px;
    }

    .caig-table > div span:nth-child(1) {
        float: left;
    }

    .caig-table > div span:nth-child(2) {
        float: right;
        color: #3B5999;
    }

    .caigouFx {
        padding-bottom: 20px;
    }

    .caigouFx .caig-table > div {
        border-top: 2px solid #EBEBEB;
        line-height: 40px;
    }

    .caigouFx .caig-table > div:nth-child(1) {
        border: none;
    }

    .caigouFx .caig-table > div:nth-child(2), .caigouFx .caig-table > div:nth-child(3) {
        color: black;
        text-indent: 0;
    }


</style>