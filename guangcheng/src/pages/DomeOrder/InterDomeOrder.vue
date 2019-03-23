<template>
    <div class="dome-order">
        <HeaderTitle title="机票订单" :btnLeft="true" @back="goback" />
        <div class="dome-order-content">
            <div class="airline-wrapper" v-if="airlineData.length > 0">
                <!--控制是显示起步价还是完整价格用showlower-->
                <InterAirlineItem v-for="(airline,index) in airlineData" :showlow="false" :flight="airline" :key="index" />
            </div>
            <div class="passenger">
                <div class="people">
                    <div class="title" >
                        乘机人
                    </div>
                    <!--<div class="names">-->
                        <!--<div class="name"-->
                             <!--v-for="(item,index) in choosedPassengers"-->
                             <!--:key="index"-->
                        <!--&gt;-->
                            <!--{{item.uname}}-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--目前只做单乘机人-->
                    <div class="names">
                        <div class="name" style="color: rgb(117,117,117);">
                        {{userInfo.uname}}
                        </div>
                    </div>
                    <div class="add" @click="isShowPepole">
                        添加乘机人
                    </div>
                </div>
                <div class="phone" >
                    <div class="title">
                        手机
                    </div>
                    <div class="num">
                        <input type="text" v-model="telephone" placeholder="输入电话号码">
                    </div>
                </div>
                <!--后来加的-->
                <div class="phone" style="border-top: 1px solid rgb(240,240,240);padding-top: 0.2rem">
                    <div class="title">
                        性别
                    </div>
                    <div class="num"  @click="showSex=true">
                        <input type="text"  placeholder="请选择性别" v-model="sexData">
                    </div>
                </div>

                <div class="phone">
                    <div class="title">
                        出生日期
                    </div>
                    <div class="num" @click="showBirth=true">
                        <input type="text"  placeholder="选择日期" v-model="birthData">
                    </div>
                </div>

                <div class="phone" style="border-top: 1px solid rgb(240,240,240);padding-top: 0.2rem">
                    <div class="title">
                        国籍
                    </div>
                    <div class="num" @click="showNationality=true">
                        <input type="text"  placeholder="请选择国籍" v-model="nationalityData">
                    </div>
                </div>
                <div class="phone">
                    <div class="title">
                        证件类型
                    </div>
                    <div class="num" @click="showHuzhao=true">
                        <input type="text" v-model="huzhao">
                    </div>
                </div>
                <div class="phone">
                    <div class="title">
                        证件号码
                    </div>
                    <div class="num">
                        <input type="text"  placeholder="输入证件号码" v-model="Certificates">
                    </div>
                </div>
                <div class="phone">
                    <div class="title">
                        有效日期
                    </div>
                    <div class="num" @click="showEffe=true">
                        <input type="text"  placeholder="选择证件有效日期" v-model="effe">
                    </div>
                </div>

            </div>
            <!--退改声明国际机票似乎没有-->
            <!--<div class="retreating" v-if="airlineData.length > 0">-->
                <!--<p class="title">退改声明</p>-->
                <!--<p class="content" v-for="(airline,index) in airlineData">-->
                    <!--{{airline.seat.cmt}}-->
                <!--</p>-->
            <!--</div>-->
        </div>
        <div class="dome-order-footer">
      <span class="total-price">
        总额 ¥ {{ totalPrice }}
      </span>
            <span class="submit-order" @click="submitOrder">
        提交订单
      </span>
        </div>

        <!--<van-popup v-model="showPeople" position="bottom">-->
            <!--<div class="add-passenger">-->
                <!--<van-cell-group class="add">-->
                    <!--<van-cell class="add-pepole" title="新增乘机人" value="添加" @click="addPassenger"/>-->
                    <!--<van-field label="姓名" v-model="name" placeholder="请与证件保持一致" />-->
                    <!--<van-field label="证件号码" v-model="idCardNo" placeholder="请与证件保持一致" />-->
                <!--</van-cell-group>-->
                <!--<van-cell title="选择乘机人" />-->
                <!--<van-checkbox-group class="select-pepole" v-model="choosedPassengers">-->
                    <!--<van-checkbox-->
                            <!--v-for="(item,index) in passengers"-->
                            <!--:key="index"-->
                            <!--:name="item"-->
                            <!--:disabled="choosedPassengers.length ===1 && choosedPassengers[0]===item"-->
                    <!--&gt;-->
                        <!--{{item.uname}} ({{item.unum}})-->
                    <!--</van-checkbox>-->
                <!--</van-Checkbox-group>-->
            <!--</div>-->
        <!--</van-popup>-->


        <!--性别模板-->
        <van-popup v-model="showSex" position="bottom">
            <van-picker :columns="columns" @change="sexTap"/>
        </van-popup>
        <!--国籍模板-->
        <van-popup v-model="showNationality" position="bottom">
            <van-picker :columns="NatiColumns" @change="natiTap"/>
        </van-popup>
        <!--护照模板-->
        <van-popup v-model="showHuzhao" position="bottom">
            <van-picker :columns="huzhaoColumns" @change="huzhaoTap"/>
        </van-popup>

        <!--出生年月模板-->
        <van-popup v-model="showBirth" position="bottom">
            <van-datetime-picker
                    v-model="birthColumns"
                    type="date"
                    :min-date="minDates"
                    :max-date="maxDate"
                    @confirm="birthTap"
                    @cancel="showBirth=false"
            />
        </van-popup>


        <!--有效日期模板-->
        <van-popup v-model="showEffe" position="bottom">
            <van-datetime-picker
                    v-model="effeColumns"
                    type="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="effeTap"
                    @cancel="showEffe=false"
            />
        </van-popup>


    </div>
</template>

<script>
   import HeaderTitle from "components/HeaderTitle/HeaderTitle";
   import InterAirlineItem from "components/AirlineItem/InterAirlineItem";
   import { getLocal } from "common/js/storage.js";
   import { getDate2 } from "common/js/day.js";
   import { IDCARDNO } from 'common/js/reg.js';
   import { getOthersInItinerary } from "api/getOthersInItinerary.js";
   import { checkFlightRule, planeBook ,InterPlaneBook} from "./api.js";
   import {
      Toast,
      Dialog
   } from "vant";
   import { gobackMixin } from "common/js/mixins.js";

   export default {
      components: {
         HeaderTitle,
         InterAirlineItem
      },
      mixins: [gobackMixin],
      created() {

         //获取同行人
         // this._getOthersInItinerary();
         //获取预订页面传过来的数据
         this._getAirlineData();
         //获取个人总费用
         this._getSingleprice();
      },
      data() {
         return {
            telephone: '',
            airlineData: [],
            passengers: [],
            choosedPassengers:[],
            singlePrice: 0,
            showPeople: false,
            name:'',
            idCardNo:'',
            userInfo:'',//存储本地用户信息
            record:JSON.parse(localStorage.getItem('record')),
         //   用户要填写的数据
            huzhao:'护照',
            huzhaoColumns:['护照','港澳通行证','台湾通行证','台胞证'],
            showHuzhao:false,//控制护照显示
            showSex:false,//控制性别是否出现
            columns: ['请选择','女', '男'],
             sexData:'',//存储性别信息
            showBirth:false,//控制出生日期
            birthData:'',
            birthColumns:new Date(),
            showNationality:false,//控制国籍显示
            nationalityData:'',
            NatiColumns:['请选择国籍','中国大陆','中国香港','中国澳门','中国台湾'],
            showEffe:false,//控制有效日期显示
            effe:'',//有效日期
            effeColumns:new Date(),
            minDate:new Date(),//设置最小时间
            maxDate:new Date(2030,1,1),//设置最大时间
            minDates:new Date(1920, 1, 1),//出生日期的最小时间
            Certificates:'',//证件号码


         };
      },
      computed: {
         // peopleNum(){
         //    return this.choosedPassengers.length;
         // },
         totalPrice() {
            // return 123
            return this.singlePrice
         }
      },
      methods: {
         //改变有效日期
         effeTap(){
            this.showEffe=false
            let effe=this.effeColumns
            let month=parseInt(effe.getMonth())+1
            this.effe=effe.getFullYear()+'/'+month+'/'+effe.getDate()
         },
         //改变出生日期
         birthTap(){
            this.showBirth=false
            let birthData=this.birthColumns
            let month=parseInt(birthData.getMonth())+1
            this.birthData=birthData.getFullYear()+'/'+month+'/'+birthData.getDate()
         },
         //改变护照
         huzhaoTap(picker, value, index){
            this.huzhao=value
         },
         //改变国籍
         natiTap(picker, value, index){
            if (index!=0){
               this.nationalityData=value
            }

         },
         //       性别改变
         sexTap(picker, value, index) {
            console.log(picker, value, index);
            if (index!=0){
               this.sexData=value
            }


         },
         addPassenger(){
            if(!this.name || !this.idCardNo ){
               Toast('请填写完整的乘客信息');
               return;
            }else if(!IDCARDNO.test(this.idCardNo)){
               Toast('证件号码有误');
               return;
            }
            const passenger = {
               uname:this.name,
               unum:this.idCardNo
            }
            this.passengers.push(passenger);
            this.choosedPassengers.push(passenger);
            this.name = '';
            this.idCardNo = '';
         },
         isShowPepole() {
            this.showPeople = true;
         },
         //判断是用户填写的数据是否为空并符合规范
         judgeData(){
            if (this.telephone===''){
               Toast('电话号码不能为空')
               return false
            }

            if(!(/^1[34578]\d{9}$/.test(this.telephone))){
               Toast("手机号码有误，请重填");
               return false;
            }
            if (this.Certificates==='') {
               Toast("证件号码不能为空")
               return false
            }
            //身份证正则表达式(15位)
            var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
            //身份证正则表达式(18位)
            var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            if (!isIDCard1.test(this.Certificates) && !isIDCard2.test(this.Certificates)){
               Toast("证件号码有误，请重填");
               return false;
            }
            


            if (this.nationalityData==='') {
               Toast("请选择国籍")
               return false
            }

            if (this.sexData==='') {
               Toast("请选择性别")
               return false
            }
            if (this.birthData==='') {
               Toast("请选择出生日期")
               return false
            }

            if (this.effe==='') {
               Toast("请选择有效日期")
               return false
            }



         },
         //处理提交订单的数据
         // 提交订单按钮
         async submitOrder() {
            //判断是用户填写的数据是否为空并符合规范
            this.judgeData()
            Toast('未做完')
            //处理数据
            // let data=await InterPlaneBook()
            
            

         },
         // 提交订单
         async _planeBook(orderData) {
            return await planeBook(orderData);
         },
         // 校验规则(国际机票暂时不要)
         async _checkFlightRule(orderData) {
            const data = {
               // 效验规则需要的参数
               itineraryId: orderData.itineraryId,//行程id
               al: orderData.al,//航班信息
               fTotalPrice: orderData.fTotalPrice,//总价
               cause: orderData.cause,//
               contactTelephone: orderData.contactTelephone,//用户电话
               passengers: orderData.passengers,//乘客信息
               flightCheckPriceDTOList: orderData.flightCheckPriceDTOList//验票返回的飞机信息
            };
            //还要新增一个参数domainType:1 (国内机票标识)


            return await checkFlightRule(data);
         },
         // 获得航段数据
         _getAirlineData() {
            this.userInfo=JSON.parse(getLocal('userInfo'))
            this.telephone=this.userInfo.mobile
            const airlineData = JSON.parse(getLocal("airlines"));
            if (airlineData.length) {
               this.airlineData = airlineData;
            }
         },
         // 获取单个人的总费用
         _getSingleprice() {
            this.airlineData.forEach(item => {
               this.singlePrice += item.seats.totalFare;
            });
         },
         // 获取同行人
         async _getOthersInItinerary() {
            const tripId = JSON.parse(getLocal("record")).tripId;
            const data = await getOthersInItinerary(tripId);
            if (data.success) {
               this.passengers = data.obj;
               this.passengers.forEach(item => {
                  if (item.defaultUser) {
                     this.choosedPassengers.push(item);
                     this.telephone = item.mobile;
                  }
               });
               this._handlePassengers();
            } else {
               Dialog.alert({
                  title: "提示",
                  message: data.msg,
                  className: "check-tips"
               }).then(() => {
                  // dosomething
               });
            }
         },
         // 处理乘客信息
         _handlePassengers() {
            const passengers = [];
            for (let i = 0; i < this.choosedPassengers.length; i++) {
               let passenger = this.choosedPassengers[i];
               if (!passenger.unum) {
                  continue;
               }
               passengers.push({
                  id: passenger.id || '',//用户id
                  name: passenger.uname,//用户名
                  cardNo: passenger.unum,//身份证号
                  telephone: passenger.mobile || this.telephone,//电话号码
                  staffNo: passenger.id || '',//员工号
                  orgCode: passenger.orgCode || '',//部门orgCode
                  psgType: "ADT",//写死
                  departName: passenger.departName || ''//部门名称
               });
            }
            return passengers;
         },
         // 处理航线信息
         _handleAirlines() {
            const airlines = [];
            this.airlineData.forEach(flight => {
               const seat = flight.seat;
               airlines.push({
                  carrier: flight.airlineCode,
                  flightNo: flight.flightNo,
                  aircraft: flight.flightType,
                  classCode: seat.code,
                  departDate: getDate2(flight.depDate),
                  departTime: flight.depTime,
                  departCode: flight.depAirportCode,
                  arrivalCode: flight.arrAirportCode,
                  arriveDate: getDate2(flight.arrDate),
                  arriveTime: flight.arrTime,
                  voyageType: "GO",
                  seats: JSON.stringify({
                     //票面价
                     price: seat.price,
                     //基础折扣
                     sale: seat.fareBase
                  })
               });
            });
            return airlines;
         },
         //处理flightCheckPriceDTOList
         _handleFlightcheck() {
            const flightCheckPriceDTOList = [];
            this.airlineData.forEach(flight => {
               flightCheckPriceDTOList.push(flight.flightCheckPriceDTOList);
            });

            return flightCheckPriceDTOList;
         },
         // 处理提交订单的数据
         _handleOrderdata() {
            const record = JSON.parse(getLocal("record"));
            const userInfo = JSON.parse(getLocal("userInfo"));
            const orderData = {
               itineraryId: record.tripId,
               contactTelephone: this.telephone,//电话
               // fTotalPrice: this.totalPrice,//总价
               passengers: JSON.stringify(this._handlePassengers()),//乘客信息
               limitDate: "",//限界
               limitTime: "",
               fCityName: record.stops[0][0].n,//来自城市
               tCityName: record.stops[0][1].n,//去哪个城市
               depAirportName: this.airlineData[0].depAirportName,//起飞机场名称
               arrAirportName: this.airlineData[0].arrAirPortName,//到达机场名称
               al: JSON.stringify(this._handleAirlines()),//航班信息
               flightCheckPriceDTOList: this._handleFlightcheck(),//
               fareOrgCode: getLocal("fareOrgCode"),
               cause: "",
               contactName: userInfo.uname
            };

            return orderData;
         }
      }
   };
</script>

<style lang="stylus" scoped>
    @import '~common/style/variable.styl';
    @import '~common/style/mixin.styl';

    .dome-order {
        y-view();

        .dome-order-content {
            flex: 1;
            scrolling();

            .airline-wrapper {
                padding: 0 0.2rem;
                margin-bottom: 0.1rem;
                background-color: #fff;
            }

            .passenger {
                padding: 0.2rem;
                background-color: #fff;

                .title {
                    width: 2rem;
                }

                .people {
                    x-middle();

                    .names {
                        flex: 1;
                        color: $color-text;
                    }

                    .add {
                        color: $color-text-active;
                    }
                }

                .phone {

                    x-middle();
                    margin-top: 0.2rem;

                    .num {
                        color: rgb(117,117,117)

                    }
                    input::-webkit-input-placeholder {
                              color: $color-text;

                    }
                }
            }

            .retreating {
                padding: 0.2rem;
                font-size: 12px;

                .title {
                    color: $color-text-active;
                }

                .content {
                    color: $color-text-h;
                    margin-bottom: 0.1rem;
                }
            }
        }

        .dome-order-footer {
            x-middle();
            padding-left: 0.2rem;
            background-color: #fff;

            .total-price {
                flex: 1;
                color: $color-text-h;
            }

            .submit-order {
                padding: 0.2rem 0.3rem;
                color: #fff;
                background-color: $color-text-active;
            }
        }
        .add-passenger >>> .van-cell__title{
            color:$color-text;
        }
        .add-passenger {
            .add-pepole >>> .van-cell__value{
                color:$color-text-active;
            }
            .select-pepole >>> .van-checkbox__label{
                color:$color-text;
            }
            .select-pepole{
                padding-top:10px;
                .van-checkbox{
                    padding:0 15px 10px;
                }
            }
        }
    }
</style>


