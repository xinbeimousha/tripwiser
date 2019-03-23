<template>
    <div style="display: flex;height: 100%;flex-direction: column">
        <HeaderTitle title="差旅成本分析" :btnLeft="true" @back="fanhTap" />
        <!--增加scroll滚动-->
        <div style="flex: 1;height: 100%;overflow: scroll">
        <div>
            <div class="ub" style="font-size:0.3rem;margin-bottom:0.5em;color:red;">
                *关联app端提交行程申请时选择费用归属，默认查询本年度已通过行程预算和订单数据
            </div>

            <!--开始时间-->
            <div class="timeBegin" @click="showDateBegin">
                <img src="./me_money_detail_date.png" alt="">
                <div class="timeBg">开始时间：{{timeBegin}}</div>
                <div class="head-right">
                    <div class="fa fa-angle-right ico">
                    </div>
                </div>
            </div>
            <!--结束时间-->
            <div class="timeEnd timeBegin" @click="showDateEnd">
                <img src="./me_money_detail_date.png" alt="">
                <div class="timeBg">结束时间：{{timeEnd}}</div>
                <div class="head-right">
                    <div class="fa fa-angle-right ico">
                    </div>
                </div>
            </div>


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
                        :min-date="endDate"
                        @confirm="handleConfirmEnd"
                        @cancel="showDEnd=false"
                />

            </van-popup>
        </div>

        <!--图表位置-->
        <div class="wrapper" ref="wrapper">
            <div class="childWrapp" id="container">

            </div>
        </div>
        </div>
    </div>
</template>

<script>
   import HeaderTitle from 'components/HeaderTitle/HeaderTitle.vue';
   //引入后台数据接口
   import {getMeTrip} from "api/getMeApi";
   import BScroll from 'better-scroll'
   //引入highCharts
   import Highcharts from 'highcharts'


   export default {
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
            endDate: new Date("2016/1/1"),
            //需要传的值
            timeBeginC: '',
            timeEndC: '',
            obj: {},//需要得到的数据，
            //   控制时间选择器是否弹出
            showDate: false,
            showDEnd: false,


         }
      },
      methods: {
         fanhTap() {
            this.$router.push({name: 'Expenses'})
         },
         //   开始时间
         showDateBegin() {
            this.showDate = true
         },
         //结束时间
         showDateEnd() {
            this.showDEnd = true
         },
         //   选择日期确认begin
         handleConfirm() {
            var monthBegin = this.pickerValue.getMonth() + 1
            if (monthBegin < 10) {
               monthBegin = '0' + monthBegin
            }
            var dayStar = this.pickerValue.getDate()
            if (dayStar < 10) {
               dayStar = '0' + dayStar
            }
            this.timeBegin = this.pickerValue.getFullYear() + '年' + monthBegin + '月' + dayStar + '日'
            this.timeBeginC = this.pickerValue.getFullYear() + '-' + monthBegin + '-' + dayStar + ' 00:00:00'

            this.showDate = false


            console.log(this.timeBeginC, this.timeEndC);
            getMeTrip(this.timeBeginC, this.timeEndC, this.orgCode).then(result => {
               console.log(result);
               this.tableChange(result)

            })

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

            this.showDEnd = false

            console.log(this.timeBeginC, this.timeEndC);
            getMeTrip(this.timeBeginC, this.timeEndC, this.orgCode).then(result => {
               console.log(result);
               this.tableChange(result)

            })
         },
         tableChange(result) {
            var chart = {
               type: 'column'
            };
            var title = {
               text: '各部门差旅分析'
            };
            var subtitle = {
               text: 'Source: 广东机场白云信息科技有限公司'
            };
            var xAxis = {
               categories: result.xAxis,
               labels: {
                  rotation: -45,
                  style: {
                     fontSize: '12px',
                     fontFamily: 'Verdana, sans-serif'
                  }
               },
               crosshair: true
            };
            var yAxis = {
               min: 0,
               title: {
                  text: '人民币 (元)'
               }
            };
            var tooltip = {
               headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
               pointFormat: '<tr><td style="color:{series.color};padding:10px">{series.name}: </td>' +
               '<td style="padding:0">&nbsp&nbsp<b>￥{point.y:.1f}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</b></td></tr>',
               footerFormat: '</table>',
               shared: true,
               useHTML: true
            };
            var plotOptions = {
               column: {
                  pointPadding: 0.1,
                  maxPointWidth: 500,
                  borderWidth: 0
               }
            };
            var credits = {
               enabled: false
            };
            var series = [{
               name: '预算',
               data: result.planCost,
            }, {
               name: '实际花费',
               data: result.cost
            }, {
               name: '机票花费',
               data: result.flightCost
            }, {
               name: '酒店花费',
               data: result.hotelCost
            }, {
               name: '火车票花费',
               data: result.trainCost
            }, {
               name: '其他花费',
               data: result.otherCost
            }];

            var json = {};
            json.chart = chart;
            json.title = title;
            json.subtitle = subtitle;
            json.tooltip = tooltip;
            json.xAxis = xAxis;
            json.yAxis = yAxis;
            json.series = series;
            json.plotOptions = plotOptions;
            json.credits = credits;

            Highcharts.chart('container', json)
            // $('#container').highcharts(json);


            this.$nextTick(() => {
               this.scroll = new BScroll(this.$refs.wrapper, {
                  startX: 0,
                  click: true,
                  scrollX: true,
                  scrollY: false,
                  eventPassthrough: 'vertical'
               });
            });
         }
      },
      mounted() {
         var date = new Date(2018, 1, 1)
         var mounMonth = date.getMonth()
         var mounMonthEnd = new Date().getMonth() + 1
         var mounDay = date.getDate()
         var mounDayEnd = new Date().getDate()

         if (mounMonth < 10) {
            mounMonth = '0' + mounMonth
         }
         if (mounMonthEnd < 10) {
            mounMonthEnd = '0' + mounMonthEnd
         }
         if (mounDay < 10) {
            mounDay = '0' + mounDay
         }
         if (mounDayEnd < 10) {
            mounDayEnd = '0' + mounDayEnd
         }


         //显示在页面上的值
         this.timeBegin = date.getFullYear() + '年' + mounMonth + '月' + mounDay + '日'
         this.timeEnd = new Date().getFullYear() + '年' + mounMonthEnd + '月' + mounDayEnd + '日'

         //传给后台的值
         this.timeBeginC = date.getFullYear() + '-' + mounMonth + '-' + mounDay + ' 00:00:00'
         this.timeEndC = new Date().getFullYear() + '-' + mounMonthEnd + '-' + mounDayEnd + ' 23:59:59'
         console.log(this.timeBeginC, this.timeEndC);
         // console.log(localStorage.getItem('token'));

         // console.log(JSON.parse(localStorage.getItem('userInfo')).orgCode);
         this.orgCode = JSON.parse(localStorage.getItem('userInfo')).orgCode
         getMeTrip(this.timeBeginC, this.timeEndC, this.orgCode).then(result => {
            console.log(result);
            this.tableChange(result)

         })


      }
   }
</script>

<style scoped lang="stylus">
    .wrapper {
        overflow: hidden;
        /*height:100px;*/
        width: 100%;
        background-color: #fff;
        margin-top: 0.2rem;
        padding-bottom : 0.4rem;
    }

    .childWrapp {
        height: 500px;
        width 1000px;

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

</style>