<template>
  <div class="dome-order">
    <HeaderTitle title="机票订单" :btnLeft="true" @back="goback" />
    <div class="dome-order-content">
      <div class="airline-wrapper" v-if="airlineData.length > 0">
        <AirLine v-for="(airline,index) in airlineData" :showlow="false" :flight="airline" :key="index" />
      </div>
      <div class="passenger">
        <div class="people">
          <div class="title">
            乘机人
          </div>
          <div class="names">
            <div class="name" 
              v-for="(item,index) in choosedPassengers"
              :key="index"
            >
              {{item.name || item.uname}}
            </div>
          </div>
          <div class="add" @click="isShowPepole">
            添加乘机人
          </div>
        </div>
        <div class="phone">
          <div class="title">
            手机
          </div>
          <div class="num">
            <input type="text" v-model="telephone" placeholder="输入电话号码">
          </div>
        </div>
      </div>
      <div class="retreating" v-if="airlineData.length > 0">
        <p class="title">退改声明</p>
        <p class="content" v-for="(airline,index) in airlineData">
          {{airline.seat.cmt}}
        </p>
      </div>
    </div>
    <div class="dome-order-footer">
      <span class="total-price">
        总额 ¥ {{ totalPrice }}
      </span>
      <span class="submit-order" @click="submitOrder">
        提交订单
      </span>
    </div>
    <van-popup v-model="showPeople" position="bottom">
      <div class="add-passenger">
        <van-cell-group class="add">
          <van-cell class="add-pepole" title="新增乘机人" value="添加" @click="addPassenger"/>
          <van-field label="姓名" v-model="name" placeholder="请与证件保持一致" />
          <van-field label="证件号码" v-model="idCardNo" placeholder="请与证件保持一致" />
        </van-cell-group>
        <van-cell title="选择乘机人" />
        <van-checkbox-group class="select-pepole" v-model="choosedPassengers">
          <van-checkbox
            v-for="(item,index) in passengers"
            :key="index"
            :name="item"
            :disabled="choosedPassengers.length ===1 && choosedPassengers[0]===item"
          >
            {{item.uname}} ({{item.unum}})
          </van-checkbox>
        </van-Checkbox-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import AirLine from "components/AirlineItem/AirlineItem";
import { getLocal } from "common/js/storage.js";
import { getTime,getDate2 } from "common/js/day.js";
import { IDCARDNO } from 'common/js/reg.js';
import { getOthersInItinerary } from "api/getOthersInItinerary.js";
import { checkFlightRule, planeBook } from "./api.js";
import {
  Toast,
  Dialog
} from "vant";
import { gobackMixin } from "common/js/mixins.js";
//机场名称需要的引入
import { airPortInfos } from "common/js/newairport.js";
//仓位等级需要的引入
import { classCode } from "common/js/data.js";

export default {
  components: {
    HeaderTitle,
    AirLine
  },
  mixins: [gobackMixin],
  created() {
    // 这个不需要了
    // this._getOthersInItinerary();
     this.choosedPassengers=this._handlePassengers()
    this._getAirlineData();
    this._getSingleprice();
  },
  data() {
    return {
      telephone: '',
      airlineData: [],
      // 添加新的乘机人存放数组
      passengers: [],
      // 所有乘机人信息存放数组
      choosedPassengers:[],
      singlePrice: 0,
      showPeople: false,
      name:'',
      idCardNo:'',
       checkBool:false,//判断是否校验规则过一次
    };
  },
  computed: {
    peopleNum(){
      return this.choosedPassengers.length;
    },
    totalPrice() {
      return this.singlePrice * this.peopleNum;
    }
  },
  methods: {
    // 添加新的乘机人
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

    // 提交订单时如果校验成功则调用该函数提交并跳转
    async submitSuccess(orderData){
        const orderResult = await this._planeBook(orderData);
        if (orderResult.success) {
           Dialog.alert({
              title: "预订成功",
              message: orderResult.msg,
              className: "check-tips",
              confirmButtonTexT: "查看订单"
           }).then(() => {
              this.$router.push("/order");
           });
        } else {
           let message = '';
           if(orderResult.obj){
              orderResult.obj.forEach(item => {

                 message += `<p>${item.replace(';','')}</p>`
              })
           }else{
              message = orderResult.msg
           }
           Dialog.alert({
              title: "预订失败",
              message,
              className: "check-tips"
           }).then(() => {
              this.goback()
           });
        }
     },
    // 提交订单按钮
    async submitOrder() {
      // 判断是否有电话号码
       if (this.telephone===''){
          Dialog.alert({
             title: "提示",
             message: '手机号码不能为空',
             className: "check-tips",
             confirmButtonTexT: "查看订单"
          });
          return false;
       }
       if(!(/^1[34578]\d{9}$/.test(this.telephone))){
          Dialog.alert({
             title: "提示",
             message: '手机格式有误',
             className: "check-tips",
             confirmButtonTexT: "查看订单"
          });
          return false;
       }


       // 拿到校验规则需要的数据
      const orderData = this._handleOrderdata();
      console.log(this.choosedPassengers);

       //checkbool判断是第几次校验，如果校验过一次第二次就不用校验了
       if (!this.checkBool){
          // 进行校验规则校验
          const checkRule = await this._checkFlightRule(orderData);

          //校验规则成功后
          if (checkRule.success) {
             await this.submitSuccess(orderData)
          } else {

             //校验规则失败后
             //验价不合格，需要弹出框选择
             //调整消息提示的排版
             const msgArr = checkRule.obj;
             let message = '';
             msgArr.forEach(item => {
                message += `<p>${item.reason}</p>`
             })
             Dialog.confirm({
                title: '预订提示',
                message: message,
                confirmButtonText:'继续预订',
                cancelButtonText:'更改航班',
             }).then(() => {
                // 继续预订，不改变直接提交
                this.submitSuccess(orderData)
             }).catch(()=>{
                //更改航班
                //把后台新的airline数据传给他
                // JSON.parse(getLocal("airlines"))
                localStorage.setItem('airlines',JSON.stringify(this._changeAriLineData(checkRule)))
                Dialog.alert({
                   title: '提示',
                   message: '已自动获取符合预定规则的机票',
                   className:'check-tips'
                }).then(() => {
                   //说明更换了航班不需要校验第二次
                   this.checkBool=true
                   //刷新
                   // this.$router.go(0)
                   this.singlePrice=0
                   // this.choosedPassengers=this._handlePassengers()
                   this._getAirlineData();
                   this._getSingleprice();
                });
             })
             //华丽的分割线`````


          }

       } else{
          //已经校验过一次，可以直接提交
          await this.submitSuccess(orderData)
       }



    },
     //效验不合规，将后台传与的数据给前台数据（未写完）
     _changeAriLineData(res){
        //这里的数据木有注释，都是一个个对照来的
        this._getAirlineData()
        let newData=this.airlineData
        //因为是引用类型，内存堆指向一样，所以打印的也一样
        // console.log('newData:',newData);
        for(var i = 0; i <res.obj.length ; i++) {
           console.log(JSON.parse(res.obj[i].minPriceFlightList));
           let minPriceFlightList=JSON.parse(res.obj[i].minPriceFlightList)
           let index=res.obj[i].orderIndex;
           newData[index]={}
           newData[index].airlineCode=minPriceFlightList.carrier
           newData[index].arrAirportCode=minPriceFlightList.arrival//起始地三字码
           newData[index].depAirportCode=minPriceFlightList.depart//结束地三字码
           //depAirportCode：三字码 depAirportTerm：T几航站楼
           newData[index].arrAirPortName=this._getAirportName(minPriceFlightList.arrival, minPriceFlightList.arrivalTerminal)
           newData[index].depAirportName=this._getAirportName(minPriceFlightList.depart, minPriceFlightList.departureTerminal)

           //   arrDate arrTime
           newData[index].arrDate=minPriceFlightList.arrivalDate.time
           newData[index].arrTime=getTime(minPriceFlightList.arrivalDate.time)
           newData[index].depDate=minPriceFlightList.departureDate.time
           newData[index].depTime=getTime(minPriceFlightList.departureDate.time)
           //flightName
           newData[index].flightName=minPriceFlightList.carrier + minPriceFlightList.flightNo
           newData[index].flightNo=minPriceFlightList.flightNo
           newData[index].flightType=minPriceFlightList.aircraft
           newData[index].lowPrice=minPriceFlightList.price//最低价吧

           newData[index].flightCheckPriceDTOList={
              arrival:minPriceFlightList.arrival,
              carrier:minPriceFlightList.carrier,
              classCode:minPriceFlightList.seat.code,
              depart:minPriceFlightList.depart,
              departDate:getDate2(minPriceFlightList.departureDate.time),
              flightNo:minPriceFlightList.flightNo,
              enginePrice:minPriceFlightList.seat.airportTax,
              fuelPrice:minPriceFlightList.seat.fuelTax,
              salesPrice:minPriceFlightList.seat.price,
              totalPrice:minPriceFlightList.seat.price+minPriceFlightList.seat.airportTax+minPriceFlightList.seat.fuelTax,
              totalTax:minPriceFlightList.seat.airportTax+minPriceFlightList.seat.fuelTax,

           }


           newData[index].seat={
              airlineType:minPriceFlightList.seat.airlineType,
              airportTax:minPriceFlightList.seat.airportTax,
              carrier:minPriceFlightList.seat.carrier,
              //这里可能有问题
              className:this._getClassName(minPriceFlightList.seat.code),
              cmt:minPriceFlightList.seat.cmt,
              code:minPriceFlightList.seat.code,
              ei:minPriceFlightList.seat.ei,
              fareBase:minPriceFlightList.seat.fareBase,
              fuelTax:minPriceFlightList.seat.fuelTax,
              price:minPriceFlightList.seat.price,
              seatRemain:minPriceFlightList.seat.seatRemain,
              totalPrice:minPriceFlightList.seat.price+minPriceFlightList.seat.fuelTax+minPriceFlightList.seat.airportTax,
           }


           //   添加验价所需要的参数
           //    newData[i].flight={
           //       airlineCode:minPriceFlightList.carrier,
           //       flightNo:minPriceFlightList.flightNo,
           //       depAirportCode:minPriceFlightList.depart,
           //       arrAirportCode:minPriceFlightList.arrival,
           //       depDate:minPriceFlightList.departureDate.time
           //    }

        }
        //打印以前的来对比下
        // console.log('_getAirlineData',this._getAirlineData());
        console.log('newData2',newData);
        return newData
     },




    // 提交订单
    async _planeBook(orderData) {
      return await planeBook(orderData);
    },
    // 校验规则
    async _checkFlightRule(orderData) {
      const data = {
        // 效验规则需要的参数
        itineraryId: orderData.itineraryId,//行程id
        al: orderData.al,//航班信息
        fTotalPrice: orderData.fTotalPrice,//总价
        cause: orderData.cause,//
        contactTelephone: orderData.contactTelephone,//用户电话
        passengers: orderData.passengers,//乘客信息
        flightCheckPriceDTOList: orderData.flightCheckPriceDTOList,//验票返回的飞机信息
         domainType:1,
      };

      //还要新增一个参数domainType:1 (国内机票标识)


      return await checkFlightRule(data);
    },
    // 获得航段数据
    _getAirlineData() {
      const airlineData = JSON.parse(getLocal("airlines"));
      if (airlineData.length) {
        this.airlineData = airlineData;
      }
    },
    // 获取单个人的总费用
    _getSingleprice() {
      this.airlineData.forEach(item => {
        this.singlePrice += item.seat.totalPrice;
      });
    },


     /**
      * 广汽定制版不需要获取同行人，要同行人自己添加
      */
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


     // 处理乘客信息（带有行程id的）
     /*
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
     */
     // 处理乘客信息（直接订票的，没有行程id的）
     _handlePassengers() {
        let userInfo=JSON.parse(getLocal('userInfo'))
        this.telephone=userInfo.mobile||''
        //自己的用户信息
        const passengers = [{
           id: userInfo.uid || '',//用户id
           name: userInfo.uname,//用户名
           cardNo: userInfo.userNum,//身份证号
           telephone: userInfo.mobile||'',//电话号码
           staffNo: userInfo.uid || '',//员工号
           orgCode: userInfo.orgCode || '',//部门orgCode
           psgType: "ADT",//写死
           departName: userInfo.departName || ''//部门名称
        }];

        //添加同行人用户信息
        /*
        let peersTx=JSON.parse(getLocal("peers"))
        if (peersTx){
           for (let i = 0; i < peersTx.length; i++) {
              let passenger = peersTx[i];
              // if (!passenger.unum) {
              //    continue;
              // }
              passengers.push({
                 id: passenger.id || '',//用户id
                 name: passenger.realname,//用户名
                 cardNo: passenger.cardNo,//身份证号
                 telephone: passenger.mobile || this.telephone,//电话号码
                 staffNo: passenger.id || '',//员工号
                 orgCode: passenger.orgCode || '',//部门orgCode
                 psgType: "ADT",//写死
                 departName: passenger.departName || ''//部门名称
              });
           }
        }
        */


        //添加同行人用户信息new（其实就是加名字和身份证号就行了）
        if (this.choosedPassengers.length>=2){
           for (let i = 1; i < this.choosedPassengers.length; i++) {
              let passenger = this.choosedPassengers[i];
              // if (!passenger.unum) {
              //    continue;
              // }
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
        fTotalPrice: this.totalPrice,//总价
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
    },


     /**
      *GQ定制版新加的
      */
     // 获取机场的名称
     _getAirportName(code, iterm) {
        let airportName = "";
        airportName = airPortInfos[code].airPortName + iterm;
        return airportName;
     },
     // 获取舱位等级的名称
     _getClassName(code) {
        return classCode[code] ? classCode[code] : "其他舱位";
     },
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
          //color: $color-text-active;
          //添加乘机人按钮颜色
          color: $color-greenGQ;
        }
      }

      .phone {
        x-middle();
        margin-top: 0.2rem;

        .num {
          color: $color-text;
        }
      }
    }

    .retreating {
      padding: 0.2rem;
      font-size: 12px;

      .title {
        //color: $color-text-active;
        color: $color-greenGQ;
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
      //background-color: $color-text-active;
      background-color: $color-greenGQ;
    }
  }
  .add-passenger >>> .van-cell__title{
    color:$color-text;
  }
  .add-passenger {
    .add-pepole >>> .van-cell__value{
      //color:$color-text-active;
      //弹出添加框的添加按钮颜色
      color: $color-greenGQ;
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


