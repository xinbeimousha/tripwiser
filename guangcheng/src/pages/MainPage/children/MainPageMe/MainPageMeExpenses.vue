<template>
    <div style="height: 100%;display: flex;flex-direction: column">
        <HeaderTitle title="费用查询"
                     :btnLeft="true"
                     :btnRight="true"
                     :className="search"
                     @back="fanhTap"
                     @click="addApply"
                     />

        <div style="flex: 1;height: 100%;width: 100%;
            overflow: hidden;" ref="wrapper">
            <div>
            <!--时间模板-->
            <div v-show="showDated" class="mainTime">
            <div class="timeBegin" @click="showDateBegin">
            <img src="./me_money_detail_dateb.png" alt="">
            <div class="timeBg">开始时间：{{timeBegin}}</div>
            <div class="head-right">
                <div class="fa fa-angle-right ico">
                </div>
            </div>
        </div>
            <div class="timeEnd timeBegin" @click="showDateEnd">
            <img src="./me_money_detail_dateb.png" alt="">
            <div class="timeBg">结束时间：{{timeEnd}}</div>
            <div class="head-right">
                <div class="fa fa-angle-right ico">
                </div>
            </div>
        </div>
            </div>
            <!--box-->
            <div class="box" v-show="showMoney">
            <div>费用总支出</div>
            <div>{{sum}}</div>
            <div>您本年度产生了您本年度产生了<span>{{obj.orderNum}}</span>张差旅订单</div>
        </div>
            <div class="ann">
            <div class="ann-left" @click="tripTap">差旅成本分析(报表)</div>
            <div class="ann-width"></div>
            <div class="ann-right" @click="productTap">产品采购额(报表)</div>
        </div>
            <div class="table">
            <div class="child">
                <div class="child-top van-clearfix">
                    <img src="./book_index_plane.png" alt="">
                    <span>机票支出</span>
                </div>
                <div class="child-bottom van-clearfix">
                    <div>最近一笔</div>
                    <div>
                        <span>累计消费</span>
                        <span>{{obj.planeCost}}</span>
                    </div>
                </div>
            </div>
            <div class="child">
                <div class="child-top van-clearfix">
                    <img src="./book_index_train.png" alt="">
                    <span>火车支出</span>
                </div>
                <div class="child-bottom van-clearfix">
                    <div>最近一笔</div>
                    <div>
                        <span>累计消费</span>
                        <span>{{obj.trainCost}}</span>
                    </div>
                </div>
            </div>
            <div class="child">
                <div class="child-top van-clearfix">
                    <img src="./book_index_hotel.png" alt="">
                    <span>酒店支出</span>
                </div>
                <div class="child-bottom van-clearfix">
                    <div>最近一笔</div>
                    <div>
                        <span>累计消费</span>
                        <span>{{obj.hotelCost}}</span>
                    </div>
                </div>
            </div>
            <div class="child">
                <div class="child-top van-clearfix">
                    <img src="./book_index_car.png" alt="">
                    <span>专车支出</span>
                </div>
                <div class="child-bottom van-clearfix">
                    <div>最近一笔</div>
                    <div>
                        <span>累计消费</span>
                        <span>{{obj.taxCost}}</span>
                    </div>
                </div>
            </div>
            <div class="child">
                <div class="child-top van-clearfix">
                    <img src="./book_index_food.png" alt="">
                    <span>餐饮支出</span>
                </div>
                <div class="child-bottom van-clearfix">
                    <div>最近一笔</div>
                    <div>
                        <span>累计消费</span>
                        <span>{{obj.trainCost}}</span>
                    </div>
                </div>
            </div>
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
                    :min-date="startDate"
                    @confirm="handleConfirmEnd"
                    @cancel="showDEnd=false"
            />

        </van-popup>

    </div>
</template>

<script>
    import HeaderTitle from 'components/HeaderTitle/HeaderTitle.vue';
    import { Dialog } from 'vant';
    import { getMeExpenses} from "api/getMeApi";
    //引入滚动插件
    import BScroll from 'better-scroll'

    export default {
        name: "MainPageMeExpenses",
        components:{
            HeaderTitle
        },
       data(){
           return{
              showMoney:true,
              showDated:false,
              search:'fa-search',//fa-search-minus
              pickerValue: new Date("2016/1/1"),
              timeBegin: '',
              timeEnd: '',
              pickerValue2: new Date("2016/1/1"),
              startDate: new Date("2016/1/1"),
              endDate: new Date(),
              //需要传的值
              obj:{},//需要得到的数据，
              sum:'　',
              //   控制时间选择器是否弹出
              showDate:false,
              showDEnd:false,
           //   前面乱了不管了后面重新定义两个
              newBegin:new Date("2018/1/1"),
              newEnd:new Date()
           }

       },
        methods:{
            fanhTap(){
                this.$router.push({name:'MainMe'})
            },
        //    点击搜索
            addApply(){
                console.log('search');
                if (this.search=='fa-search-minus'){
                   this.search='fa-search'
                   this.showMoney=true
                   this.showDated=false
                } else {
                   this.search='fa-search-minus'
                   this.showMoney=false
                   this.showDated=true
                }

            },
           //   开始时间
           showDateBegin() {
              this.showDate=true
           },
           //结束时间
           showDateEnd() {
              this.showDEnd=true
           },
           //   选择日期确认begin
           handleConfirm() {
              this.newBegin=this.pickerValue.getTime()
              var monthBegin = this.pickerValue.getMonth() + 1
              if (monthBegin<10){
                 monthBegin='0'+monthBegin
              }
              var dayStar=this.pickerValue.getDate()
              if (dayStar<10){
                 dayStar='0'+dayStar
              }
              this.timeBegin = this.pickerValue.getFullYear() + '年' + monthBegin + '月' + dayStar + '日'
              // this.timeBeginC=this.pickerValue.getFullYear()+'-'+monthBegin+'-'+this.pickerValue.getDate()+' 00:00:00'
              this.showDate=false
              this.getMeManageData()

           },
           //   选择日期确认end
           handleConfirmEnd() {
              this.newEnd=this.pickerValue2.getTime()
              var monthEnd = this.pickerValue2.getMonth() + 1
              if (monthEnd<10){
                 monthEnd='0'+monthEnd
              }
              var dayEnd=this.pickerValue2.getDate()
              if (dayEnd<10){
                 dayEnd='0'+dayEnd
              }
              this.timeEnd = this.pickerValue2.getFullYear() + '年' + monthEnd + '月' + dayEnd + '日'
              // this.timeEndC=this.pickerValue2.getFullYear()+'-'+monthEnd+'-'+this.pickerValue2+' 23:59:59'
              this.showDEnd=false
              this.getMeManageData()
           },
           //   拿到渲染页面所需的数据
           getMeManageData(){
               console.log(this.newBegin,this.newEnd);
              // console.log(this.newBegin.getTime(),this.newEnd.getTime());
              var ddd={
                 begin: this.newBegin,
                 end: this.newEnd
              }
              //2018-10-25 00:00:00

              getMeExpenses(ddd).then(res=>{
                 console.log(res);
                 if (res.success) {
                    this.obj=res.obj
                    console.log(this.obj);
                    this.sum=this.obj.planeCost+this.obj.hotelCost+this.obj.taxCost+this.obj.trainCost

                    this.scroll = new BScroll(this.$refs.wrapper, {
                       startX:0,
                       click:true,
                       // scrollX:true,
                       scrollY:true,
                       bounce:false
                       // eventPassthrough:'vertical'
                    });

                 }else if ((res.code && res.code == 10001) || (res.msg && res.msg.indexOf("自动登录失败") > -1)) {
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
           //点击trip跳转
           tripTap(){
               this.$router.push({name:'MeTrip'})
           },
        //   点击product跳转
           productTap(){
              this.$router.push({name:'MeProduct'})
           }

        },
       mounted() {
          var mounMonth=new Date(2018/1/1).getMonth()+1
          var mounMonthEnd=new Date().getMonth()+1
          var mounDay=new Date(2018/1/1).getDate()
          var mounDayEnd=new Date().getDate()


          this.newBegin=this.newBegin.getTime()
          this.newEnd=this.newEnd.getTime()
          if (mounMonthEnd<10){
             mounMonthEnd='0'+mounMonthEnd
          }
          if (mounMonthEnd>12){
             mounMonthEnd='01'
          }
          if (mounMonth<10){
             mounMonth='0'+mounMonth
          }
          if (mounDay<10){
             mounDay='0'+mounDay
          }
          if (mounDayEnd<10){
             mounDayEnd='0'+mounDayEnd
          }
          this.timeBegin=2018+'年'+mounMonth+'月'+mounDay+'日'
          this.timeEnd=new Date().getFullYear()+'年'+mounMonthEnd+'月'+mounDayEnd+'日'

          //   拿到渲染页面所需的数据
          this.getMeManageData()


       },
    }
</script>

<style scoped lang="stylus" type="text/stylus">

    /*时间*/
    .mainTime{
        padding-right: 0.2rem;

    }
    .timeBegin {
        height: 1rem;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #3b5999;
        padding-left: 20px;
        font-size: 0.3rem;
        color: white;
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
    }

    .timeEnd {
        border-top: 1px solid white;
    }


    .box{
        /*height: 200px;*/

        background-color: #6078ab;
        div{
            text-align: center;
            font-size: 0.28rem;
            color: #fff;
            font-weight: 700;
        }
        div:nth-child(1){
            font-size: 0.24rem;
            padding-top: 15px;
        }
        div:nth-child(2){
            font-size: 0.6rem;
            /*padding: 5px 0;*/
        }
        div:nth-child(3){
            padding-bottom: 15px;
            span{
                color:#ACCBFF ;
            }
        }
    }
    .ann{
        width: 100%;
        display: flex;
        padding: 18px 0;
        font-size: 0.28rem;
        .ann-left{
            width: 49%;
            text-align: center;
        }
        .ann-width{
            width: 1px;
            background-color: #999999;
        }
        .ann-right{
            width: 49%;
            text-align: center;
        }
    }
    .table{
        width: 100%;
        border-bottom: 2px solid #E1E1E1;
        .child{
            border-top: 2px solid #E1E1E1;
            padding: 10px 15px 5px;
            font-size: 0.28rem;
            .child-top{
                height: 35px;
                padding-left: 5px;
                img{
                    height: 100%;
                    float: left;
                }
                span{
                    float: left;
                    display: inline-block;
                    line-height: 35px;
                    height: 35px;
                    margin-left: 10px;
                }
            }
            .child-bottom{
                /*margin-top: 8px;*/
                color: #999999;
                font-size: 0.24rem;
                >div:nth-child(1){
                    float: left;
                    line-height: 28px;
                    height: 28px;
                    display: inline-block;
                }
                >div:nth-child(2){
                    float: right;
                    span:nth-child(1){
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                    }
                    span:nth-child(2){
                        padding-left: 6px;
                        color: black;
                        font-size: 0.4rem;
                        display: inline-block;
                        line-height: 24px;
                        height: 24px;
                        font-weight: 700;
                    }
                }
            }
        }

    }

</style>