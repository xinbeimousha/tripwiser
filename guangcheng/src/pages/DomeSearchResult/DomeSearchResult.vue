<template>
  <div class="search-result">
    <HeaderTitle
      :title="title"
      :btnLeft="true"
      :btnRight="true"
      :className="'fa-calendar'"
      @back="goback"
      @click="showDatePicker"
    >
      <span 
        class="skip" 
        v-if="tripType===2 && record.stops.length > 1"
        @click="skipCurrTrip"
      >跳过
     </span>
    </HeaderTitle>
    <div class="choose-sort border-1px">
      <span class="sort time-sort" @click="sortbyTime()">时间排序</span>
      <span class="sort price-sort" @click="sortbyPrice()">价格排序</span>
    </div>
    <div class="flight-list-wrapper">
      <!--国内的-->
      <FlightList v-if="showList" :flightData="flightData" @show="showSeat" @book="planebook" />
      <!--国际的-->
      <InterList v-if="showInterList" :flightData="flightData" @book="interPlanebook"></InterList>
      <!--<InterFilghtList v-if="showInterList" :flightList="flightData"></InterFilghtList>-->
      <div class="fail-tips" v-if="showTips">
        <van-icon name="warn" size="1.5rem" color="#c8c8c8" />
        <p class="text">抱歉，查询不到满足条件的航班</p>
      </div>
    </div>
    <van-popup v-model="showDate" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="hideDatePicker"
        @confirm="chooseDate"
      />
    </van-popup>

    <!--点击预订弹出框-->

    <van-dialog
            v-model="ReasonShow"
            show-cancel-button
            :before-close="beforeClose"
            title="请输入购票理由"

    >
      <van-field
              v-model="Reason"
              placeholder="在此输入文本"
      />

    </van-dialog>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import FlightList from "components/FlightList/FlightList";
//引用国际机票公共样式
import InterList from "components/FlightList/InterFilghtList"
import day from "dayjs";
import { classCode } from "common/js/data.js";
import { getLocal, setLocal } from "common/js/storage.js";
//checkFlightRule是新增的在预订按钮触发调用的机票效验规则
import { searchPlaneList,
   checkPrice ,
   checkFlightRule,
   asynCheckPrice,
   interSearchPlaneList,
   interGetSeatsList,
   IntercheckPrice} from "./api.js";
import { getTime,getDate2 } from "common/js/day.js";
import { airPortInfos } from "common/js/newairport.js";
import { Toast ,Dialog} from "vant";
import config from "../../api/config";

import bus from "common/js/bus.js";
let flag = true;


export default {
  components: {
    HeaderTitle,
    FlightList,
     Dialog,
     InterList
  },
  props: ["id"],
  data() {
    return {
      record: JSON.parse(getLocal("record")),
      showList: false,
      showTips: false,
      showInterList:false,//控制显示国际机票模板
      flightData: [],
      currIndex: -1,
      page: Number.parseInt(this.id),//如果是多程机票，判断到达当前第几页
      showDate:false,
      currentDate: new Date(),
      minDate: new Date(),
      maxDate: new Date(day().add(10, "years")),
       Reason:'',//预订要写的理由
       ReasonShow:false,//点击预订是否弹出框
       needQuery:'',//判断是否有true
      flights:'',//验价需要的两个参数
      seat:'',
       singlePrice:0,//单个人机票的总费用
       checkAirLine:[],//效验不合规把后台新的航程信息（包括机票等）存入此数组
       airRegions:0,//判断是国内机票还是国外机票
       interFlightList:[],//处理国际机票所需要的数组
    };
  },
  computed: {
    //顶部的标题
    title() {
      let [title, fromCity, toCity, index] = ["", "", "", 0];
      let maxIndex = this.record.stops.length-1
      if (this.tripType === 2) {
        index = this.page;
      }
      // 因为多程存在跳过行程的情况，要考虑跳过行程之后实际的page大于record的最大索引
      if(this.page <  maxIndex || this.page ===  maxIndex){
         fromCity = this.record.stops[index][0].n;
         toCity = this.record.stops[index][1].n;
      }
      if (this.tripType === 1 && this.page === 1) {
        fromCity = this.record.stops[index][1].n;
        toCity = this.record.stops[index][0].n;
      }
      title = fromCity + ' -- ' + toCity;
      return title;
    }
  },
  created() {

     //如果有国际航程则套用国际机票
     this.record.stops.forEach((value,index)=>{
         value.forEach((value2,index2)=>{
            if (value2.region==1){
               this.airRegions=1
               return
            }
         }) 
      })  
     console.log(this.airRegions);
    this.tripType = this.record.tripType;
    this.dateBetween = this.record.dateBetween;
    this.minDate = new Date(this.dateBetween[0].replace(/\-/g,'/'));
    this.maxDate = new Date(this.dateBetween[1].replace(/\-/g,'/'));
    this.currentDate = new Date(this.record.date[this.page].replace(/\-/g,'/'));
    this._searchPlaneList();

     //判断是否是从申请页面跳转过来的
     console.log(this.$route.query.needQuery);
     if (this.$route.query.needQuery) {
        setLocal('needQuery',this.$route.query.needQuery)
     }



  },
  // 如果是从申请页面跳过来的跳回去的时候需要清除本地needQuery、
  // meReason看情况
  methods: {
     //效验不合规，将后台传与的数据给前台数据（未写完）
     _changeAriLineData(res){
        //这里的数据木有注释，都是一个个对照来的
        let newData=this._getAirlineData()
        //因为是引用类型，内存堆指向一样，所以打印的也一样
        // console.log('newData:',newData);
        console.log('newData:',this._getAirlineData());
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
     //调用效验规则以后并且跳转
    getRuleJump(){
       // 担心缓存问题，没有重置，这个值还在所以每次效验跳转前先重置
       this.checkAirLine=[]
       let AirlineData=this._getAirlineData()
       console.log('airlineData',AirlineData);



       //验价成功以后开始进行机票效验规则
       let checkRuleData=this._checkFlightRuleData()
       checkFlightRule(checkRuleData).then(res=>{
          console.log(res);
          if (res.success){
             //说明验价成功,可以跳转
             this.lastJump()
          } else{
             //验价不合格，需要弹出框选择
             //调整消息提示的排版
             const msgArr = res.obj;
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
                //如果是第二次换机票，判断前面有没有写过原因，有的话直接赋值给它
                if (getLocal('meReason')){
                   this.Reason=getLocal('meReason')
                }
                //继续预订
                this.ReasonShow=true
                //   继续预订需要填写理由
             }).catch(()=>{


                //更改航班
                //自动获取后台不需要Reason
                this.Reason=''
                localStorage.removeItem('meReason')
                //把后台新的airline数据传给他
                this.checkAirLine=this._changeAriLineData(res)
                // this.checkAirLine.forEach((value,index)=>{
                //    // console.log("flight和seat",value.flight);
                //       checkPrice(value.flight, value.seat).then(res=>{
                //          console.log(res);
                //       })
                // })

                Dialog.alert({
                   title: '提示',
                   message: '已自动获取符合预定规则的机票',
                   className:'check-tips'
                }).then(() => {
                   //跳转
                   this.lastJump()
                });


             })


          }
       })

    },

   //预订机票验价和效验规则成功以后需要跳转时触发（只限于从查询机票跳转过来）
     lastJump(){
        //$emit里面不能有localStore的方法
        let AirlineData=this._getAirlineData()
        console.log('airlineData',AirlineData);



        //判断是否有在效验不合规时后台传过来的新数据，有就用新的传过去
        //跳回tripAdd无需在意本地存储airlines，只需要做好emit的PlaneTicket数据
        if (this.checkAirLine.length>0){
           bus.$emit('PlaneTicket',this.checkAirLine)
           bus.$emit('reasonText','')
        }else{
           bus.$emit('PlaneTicket',AirlineData)
           bus.$emit('reasonText',this.Reason)
        }



        //清除从行程页面跳过来存储的本地存储
        localStorage.removeItem('needQuery')
        //清除同行人本地存储数据
        localStorage.removeItem('peers')

        this.$router.push({
           path: `/tripAdd`,
           // query: {tripType: this.tripType}
        });


     },
     //处理验价规则的数据
     _checkFlightRuleData(){
        //处理验价规则的数据
        const record = JSON.parse(getLocal("record"));
        const userInfo = JSON.parse(getLocal("userInfo"));
        //同行人
        let peers=JSON.parse(getLocal("peers"));
        //真实可靠的airLine数据
        let AirlineData=this._getAirlineData()

        let data={
           itineraryId: '',//行程id
           al: JSON.stringify(this._handleAirlines()),//航班信息(暂时没搞)
           fTotalPrice: this._getSingleNumPri(),//总价
           cause: '',//理由
           contactTelephone: userInfo.mobile,//用户电话
           passengers: JSON.stringify(this._handlePassengers()),//乘客信息
           flightCheckPriceDTOList: this._handleFlightcheck(),//验票返回的飞机信息
           domainType:1,//这是1国内机票，2国际机票
        }

        return data
     },
     //获取所有人的机票总费用
     _getSingleNumPri(){
        this._getAirlineData().forEach(item => {
           this.singlePrice += item.seat.totalPrice;
        });

       let num=JSON.parse(getLocal('peers')).length+1
       return this.singlePrice*num
     },
     // 获取单个人的机票总费用(注意是单个)
     _getSingleprice() {
        this._getAirlineData().forEach(item => {
           this.singlePrice += item.seat.totalPrice;
        });
     },
     // 处理乘客信息
     _handlePassengers() {
        let userInfo=JSON.parse(getLocal('userInfo'))
        //自己的用户信息
        const passengers = [{
           id: userInfo.uid || '',//用户id
           name: userInfo.uname,//用户名
           cardNo: userInfo.userNum,//身份证号
           telephone: userInfo.mobile,//电话号码
           staffNo: userInfo.uid || '',//员工号
           orgCode: userInfo.orgCode || '',//部门orgCode
           psgType: "ADT",//写死
           departName: userInfo.departName || ''//部门名称
        }];

        //添加同行人用户信息
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

        return passengers;
     },
     // 处理航线信息
     _handleAirlines() {
        const airlines = [];
        this._getAirlineData().forEach(flight => {
           let seat = flight.seat;
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
     //处理flightCheckPriceDTOList(验价规则需要的)
     _handleFlightcheck() {
        const flightCheckPriceDTOList = [];
        this._getAirlineData().forEach(flight => {
           flightCheckPriceDTOList.push(flight.flightCheckPriceDTOList);
        });

        return flightCheckPriceDTOList;
     },
     //弹出点击确定要触发的函数
     TestPrice(flight,seat){
        console.log(this._handlePassengers());
        // 验价
        console.log(flight,seat);
        checkPrice(flight, seat).then(checkResults=>{
           console.log(checkResults);


           //表示验价成功
           if (checkResults.success) {
              // 验价后显示最新的价格
              console.log(flight,seat);
              const flightCheckPriceDTOList = checkResults.obj;
              seat.price = flightCheckPriceDTOList.salesPrice;
              seat.totalPrice = flightCheckPriceDTOList.totalPrice;

              flight.seat = seat;
              flight.flightCheckPriceDTOList = flightCheckPriceDTOList;

              const airlines = this._getAirlines();
              airlines[this.page] = flight;
              setLocal("airlines", JSON.stringify(airlines));
              console.log(airlines);

              if(this.tripType === 0 ){

                 //调用验价规则并且跳转（在每个要跳转回申请详情页面的地方都要添加）
                 this.getRuleJump()

              }else{
                 this._mulWayLinkto2()
              }
           } else {
              Dialog.alert({
                 title: "提示",
                 message: checkResults.msg,
                 className: "check-tips"
              }).then(() => {
                 // dosomething
              });
           }
        })




     },
     //弹出框点击确认或取消触发

     beforeClose(action, done){

        if (action === 'confirm') {
           if (this.Reason){
              // console.log(this.flights,this.seat);
              localStorage.setItem('meReason',this.Reason)
              //成功后点击跳转
              setTimeout(Dialog.alert({
                 title: '机票选取成功',
                 message: '点击跳转到提交页面'
              }).then(() => {
                 this.lastJump()
              }),800)


           } else{
              Toast('文本不能为空')
              done(false)
           }

        } else {
           this.ReasonShow=false
        }
     },
    // 返回按钮
    goback(){
      this.$router.go(-1);
      (this.page > 0) && this.page--;
    },
    // 多程跳过当前行程（）
    skipCurrTrip(){
      Dialog.confirm({
        title: '提示',
        className:'check-tips',
        message: '确定要跳过这一程?'
    }).then(() => {
      this.record.stops.splice(this.page,1);
      this.record.date.splice(this.page,1);
      const airlines = JSON.parse(getLocal('airlines'));
     // 如果当前跳过的airline信息已经存在，需要删除该条记录
      if(airlines[this.page]){
        airlines.splice(this.page,1);
        setLocal('airlines',JSON.stringify(airlines));
      }
      setLocal('record',JSON.stringify(this.record));
      // 因为多程存在跳过行程的情况，要考虑跳过行程之后实际的page大于record的最大索引
      if(this.page > this.record.stops.length-1){

         if (localStorage.getItem('needQuery')){
            //验价成功以后开始进行机票效验规则
            //调用验价规则并且跳转（在每个要跳转回申请详情页面的地方都要添加）
           this.getRuleJump()

         } else{
            this.$router.replace("/domeOrder");
         }
      }else{
        this.$router.replace(`/domeSearchResult/${this.page}`);
        this._reSearchPlaneList();
      }
    }).catch(() => {
  // on cancel
    });
    },
    // 拿到储存在airline的数据发送给tripAdd
     // 获得航段数据
     _getAirlineData() {
        let airlineData = JSON.parse(getLocal("airlines"));
        if (airlineData) {
           let planeNum=JSON.parse(localStorage.getItem('record')).stops.length
           console.log(planeNum);
           switch (this.tripType){
              case 0:
                 return [airlineData[0]]
              case 1:
                 return airlineData.slice(0,2)
              case 2:
                 let planeNum=JSON.parse(localStorage.getItem('record')).stops.length
                 console.log(planeNum);
                 return airlineData.slice(0,planeNum)
           }
        }
     }
     ,
    // 时间排序
    sortbyTime() {
      if (!this.flightData.length) {
        return;
      }
      if (this.currIndex > -1) {
        this.flightData[this.currIndex].showSeat = false;
      }
      this.flightData.sort((a, b) => {
        if (flag) {
          return a.depDate - b.depDate;
        } else {
          return b.depDate - a.depDate;
        }
      });
      flag = !flag;
    },
    // 价格排序
    sortbyPrice() {
      if (!this.flightData.length) {
        return;
      }
      if (this.currIndex > -1) {
        this.flightData[this.currIndex].showSeat = false;
      }
      this.flightData.sort((a, b) => {
        if (flag) {
          return a.seats[0].price - b.seats[0].price;
        } else {
          return b.seats[0].price - a.seats[0].price;
        }
      });
      flag = !flag;
    },
    // 重新选择日期时间后查询
    chooseDate(val){
      const newDate = getDate2(val);
      this.record.date.splice(this.page,1,newDate);
      setLocal('record',JSON.stringify(this.record));
      this.hideDatePicker();
      this._reSearchPlaneList();
      
    },
    // 显示日期选项
    showDatePicker(){
      this.showDate = true;
    },
    // 隐藏日期选项
    hideDatePicker(){
      this.showDate = false;
    },
    // 控制座位显示选项
    showSeat(index, lastIndex) {
      this.currIndex = index;
      this.flightData[index].showSeat = !this.flightData[index].showSeat;
      // 如果点击了不同的选项，需要把上一项的showSeat设为false
      if (index !== lastIndex && lastIndex > -1) {
        this.flightData[lastIndex].showSeat = false;
      }
    },
    // 国际机票的预订
     async interPlanebook(flight,seat){
        this.flight=flight
        this.seat=seat
        console.log(this.flight,this.seat);

        this._handleFinalLink(flight,seat)
     },
    // 国际机票点击后跳转
     _handleFinalLink(flight, seat) {
        //单程双程
        if (this.tripType === 0) {
           this._doNotReturnTripData(flight, seat);
        } else if (this.tripType === 1) {
           this._doReturnTripData(flight, seat)
        }
        //  else if (this.tripType === 2) {
        //    this._doNotReturnTripData(flight, seat);
        //    if (tripIndex < searchData.tmcItineraryTrips.length - 1) {
        //       this._linkToResult();
        //       return
        //    } else {
        //       this._linkToOrder();
        //       return
        //    }
        // }

        //国际机票跳转
        this.interJump()
     },
    // 国际机票单程
     _doNotReturnTripData(flight,seat){
        // searchData.tmcItineraryTrips[tripIndex].flight = flight;
        // searchData.tmcItineraryTrips[tripIndex].seat = seat;
        // searchData.tmcItineraryTrips[tripIndex].serviceCharge = this.serviceCharge;
        // searchData.tmcItineraryTrips[tripIndex].flightCheckPriceDTOList = this._getFlightCheckPriceDTOList(flight, seat, 0);
        flight.seats=seat
        let airline=[]
        airline[0]=flight
        setLocal('airlines',JSON.stringify(airline))
        if (this.tripType==0){
           this.$router.push("/interDomeOrder");
        }

     },
    // 国际机票双程
     _doReturnTripData(flight,seat){
        if (searchData.tmcItineraryTrips.length < 2) {
           searchData.tmcItineraryTrips.push({
              id: searchData.tmcItineraryTrips[0].id,
              itinerBegin: searchData.tmcItineraryTrips[0].itinerBegin,
              itinerDepartDate: searchData.tmcItineraryTrips[0].itinerReturnDate,
              itinerEnd: searchData.tmcItineraryTrips[0].itinerEnd,
              itinerFrom: searchData.tmcItineraryTrips[0].itinerTo,
              itinerFromCode: searchData.tmcItineraryTrips[0].itinerToCode,
              itinerOthers: searchData.tmcItineraryTrips[0].itinerOthers,
              itinerReason: searchData.tmcItineraryTrips[0].itinerReason,
              itinerTo: searchData.tmcItineraryTrips[0].itinerFrom,
              itinerToCode: searchData.tmcItineraryTrips[0].itinerFromCode,
              itineraryId: searchData.tmcItineraryTrips[0].itineraryId,
              orderNumber: searchData.tmcItineraryTrips[0].orderNumber,
              planeType: 1
           });
           for (var i = 0; i < 2; i++) {
              searchData.tmcItineraryTrips[i].flight = {
                 depAirportName: airPortInfos[flight.voyages[i].departureAirPort].airPortName,
                 arrAirportName: airPortInfos[flight.voyages[i].arrivalAirPort].airPortName,
                 depDatehm: flight.voyages[i].departureTime,
                 depDate :flight.voyages[i].departureDate,
                 arrDatehm: flight.voyages[i].arrivalTime,
                 carrier: flight.voyages[i].legs[0].carrier,
                 flightNo: app.flightProxy==='EUET'?flight.voyages[i].legs[0].flightNo:flight.voyages[i].legs[0].carrier+flight.voyages[i].legs[0].flightNo,
                 flightType: flight.voyages[i].legs[0].machineCode,
                 cabins: flight.voyages[i].legs[0].cabin,
                 lowestPrice: flight.lowestPrice,
                 voyages: flight.voyages
              }
              searchData.tmcItineraryTrips[i].seat = seat;
              searchData.tmcItineraryTrips[i].serviceCharge = this.serviceCharge;
              searchData.tmcItineraryTrips[i].flightCheckPriceDTOList = this._getFlightCheckPriceDTOList(flight, seat, i);
           }
        }
     },
    // 国际机票多程
    // 国际机票跳转
     interJump(){

    },

    // 预订(这里有异步) async
     async planebook(flight, seat) {
      // 往返或多程，后程航班起飞时间不能早于前程航班到达时间
      if((this.tripType === 1 || this.tripType === 2)&&this.page > 0){
        if(!this._handleArrAndDepartTime(flight)){
          Toast('后程航班起飞时间不能早于前程航班到达时间');
          return;
        }
      }

      //在此判断是否有数据要不要弹出框
       if (localStorage.getItem('needQuery')){
          //如果已经写过理由了，就不需要再把ReasonShow再写一次
          // 用于往返或者多程
          this.flight=flight
          this.seat=seat
          console.log(this.flight,this.seat);
          //判断如果是从申请行程页面跳转过来的就调用这个函数
          this.TestPrice(flight,seat)

       }else{
          // 验价        （这里也有异步await）
          const checkResult =await this._checkPrice(flight, seat);
          if (checkResult.success) {
             // 验价后显示最新的价格
             console.log(flight,seat);
             const flightCheckPriceDTOList = checkResult.obj;
             seat.price = flightCheckPriceDTOList.salesPrice;
             seat.totalPrice = flightCheckPriceDTOList.totalPrice;

             flight.seat = seat;
             flight.flightCheckPriceDTOList = flightCheckPriceDTOList;

             const airlines = this._getAirlines();
             airlines[this.page] = flight;
             setLocal("airlines", JSON.stringify(airlines));
             console.log(airlines);

             //跳转前要调用checkFlightRule颜家规则
             //如果不通过说明，，比如点的票贵了，需要写一条理由才能继续预订

             if(this.tripType === 0 ){
                this.$router.push("/domeOrder");
             }else{
                this._mulWayLinkto()
             }
          } else {
             Dialog.alert({
                title: "提示",
                message: checkResult.msg,
                className: "check-tips"
             }).then(() => {
                // dosomething
             });
          }
       }


    },
    // 查询机票列表
    async _searchPlaneList() {
        //判断是否是国际机票，是国际机票执行上面的
        if (this.airRegions==1) {

           //从本地record拿到数据处理为国际机票查询所要的数据
           const searchData=this._handleInterPlaneData()
           //调用查询国际机票接口
           const searResult=await interSearchPlaneList(searchData)

           console.log(searResult);
           if (searResult.success) {
              const flights = searResult.obj.flights;
              // 过滤没有仓位的航班
              // const flights = obj.filter(item => {
              //    return item.seats.length > 0;
              // });
              if (flights.length === 0) {
                 this.showTips = true;
                 return;
              }
              //生成机票展示列表数据结构
              const newFlights = this.inter_normalizeFlightData(flights);

              this.flightData = newFlights;
              console.log(this.flightData);

              //进入的时候进行时间排序
              // this.sortbyTime()
           //   国际的显示
              this.showInterList=true
           } else {
              this.showTips = true;
           }
        }else {
           //国内机票走这边
           const searchData = this._handleSearchPlaneData();
           //打印刷新机票数据接口所需要的参数
           console.log(searchData, 'searchdata');
           const searResult = await searchPlaneList(searchData);

           if (searResult.success) {
              const obj = searResult.obj.data.flights;
              // 过滤没有仓位的航班
              const flights = obj.filter(item => {
                 return item.seats.length > 0;
              });
              if (flights.length === 0) {
                 this.showTips = true;
                 return;
              }
              const newFlights = this._normalizeFlightData(flights);

              this.flightData = newFlights;

              //进入的时候进行时间排序
              this.sortbyTime()

              this.showList = true;
           } else {
              this.showTips = true;
           }

        }
    },
    // 重新查询机票列表
    _reSearchPlaneList(){
      this.showTips &&(this.showTips =!this.showTips);
      this.flightData = [];
      this.currentDate = new Date(this.record.date[this.page].replace(/\-/g,'/'));
      this._searchPlaneList();
    },
    // 验价
    async _checkPrice(flight, seat) {
      return await checkPrice(flight, seat);
    },

    // 在往返或者多程的时候限制后起飞行程不能早于前程航班的到达时间
    _handleArrAndDepartTime(flight){
        const airlines = JSON.parse(getLocal('airlines'));
        const [preArrTime,nextDepTime] = [airlines[this.page-1].arrDate,flight.depDate];
        if(nextDepTime < preArrTime){
          return false
        }
        return true;
    },
     /**
      * 处理国际查询机票所需要的数据
      * 国际机票只处理单程和往返
      **/
      _handleInterPlaneData(index=0){
        // if (this.tripType === 2) {
        //    index = this.page;
        // }
        const searchData = {
           agentsTag:"YEESKY",
           boardPoint: this.record.stops[index][0].c,
           offPoint: this.record.stops[index][1].c,
           departDate: this.record.date[0],
           returnDate: (this.record.tripType == 1 && index == 0) ? this.record.date[1] : null,
           siteType: this.record.cabinRequire,
           stopType: "D",
           travelType: (this.record.tripType == 1 && index == 0) ? "RT" : "OW",
           psgType:'ADT',
           psgQuantity:1
        };
        if (this.tripType === 1 && this.page === 1) {
           searchData.fromCity = this.record.stops[index][1].c;
           searchData.toCity = this.record.stops[index][0].c;
        }
        return searchData;
     },
    /**
     * @description 处理查询机票所需要的数据
     * @param {index} 当前行程的索引，单程和往返只有一条行程，所以默认为0
     */
    _handleSearchPlaneData(index = 0) {
      if (this.tripType === 2) {
        index = this.page;
      }
      const searchData = {
        fromCity: this.record.stops[index][0].c,
        toCity: this.record.stops[index][1].c,
        airDate: this.record.date[this.page],
        siteType: this.record.cabinRequire,
        cmdShare: "1",
        stopType: "N"
      };
      if (this.tripType === 1 && this.page === 1) {
        searchData.fromCity = this.record.stops[index][1].c;
        searchData.toCity = this.record.stops[index][0].c;
      }
      return searchData;
    },
     /**
      * 整理查询国际机票返回的航班列表数据
      */
     inter_normalizeFlightData(flights){
        var flightList = [];
        for(var i=0; i<flights.length; i++){
           // 如果是往返，要调整voyages的顺序
           if(flights[i].voyages.length===2){
              //如果是双程，return代表是返回的那程，所以要颠倒来
              if(flights[i].voyages[0].segmentType==='RETURN'){
                 flights[i].voyages.reverse()
              }
           }
           flightList.push(
               this.finalFlightList(
                   flights[i].voyages,
                   flights[i].salePrice
               )
           )
        }

        return flightList



     },
     //处理国际机票数据
     finalFlightList(voyages,lowestPrice){
        var obj = {};
        var tripType = this.tripType;
        console.log('tripType:',tripType);
        // 根据往返还是单程来组合机票列表展示所需要的数据，0为单程，1为往返
        if(tripType===1){
           obj.depAirportName = {
              go:airPortInfos[voyages[0].departureAirPort].airPortName,
              return:airPortInfos[voyages[1].departureAirPort].airPortName,
           }
           obj.arrAirportName = {
              go:airPortInfos[voyages[0].arrivalAirPort].airPortName,
              return:airPortInfos[voyages[1].arrivalAirPort].airPortName
           }
           obj.depDatehm = {
              go:voyages[0].departureTime,
              return:voyages[1].departureTime
           }
           obj.arrDatehm = {
              go:voyages[0].arrivalTime,
              return:voyages[1].arrivalTime
           }
           obj.carrier = {
              go:voyages[0].legs[0].carrier,
              return:voyages[1].legs[0].carrier
           }
           obj.flightNo = {
              go:app.flightProxy==='EUET'?voyages[0].legs[0].flightNo:voyages[0].legs[0].carrier+voyages[0].legs[0].flightNo,
              return:app.flightProxy==='EUET'?voyages[1].legs[0].flightNo:voyages[1].legs[0].carrier+voyages[1].legs[0].flightNo,
           }
           obj.flightType  = {
              go:voyages[0].legs[0].machineCode,
              return:voyages[1].legs[0].machineCode
           }
           obj.cabins = {
              go:voyages[0].legs[0].cabin,
              return:voyages[1].legs[0].cabin
           }
        }else{
           obj.depAirportName = airPortInfos[voyages[0].departureAirPort].airPortName;
           obj.arrAirportName = airPortInfos[voyages[0].arrivalAirPort].airPortName
           obj.depDatehm = voyages[0].departureTime;
           obj.depDate = voyages[0].departureDate;
           obj.arrDatehm = voyages[0].arrivalTime;
           obj.arrDate = voyages[0].arrivalDate;
           obj.carrier = voyages[0].legs[0].carrier;
           obj.flightNo = app.flightProxy==='EUET'?voyages[0].legs[0].flightNo:voyages[0].legs[0].carrier+voyages[0].legs[0].flightNo;
           obj.flightType = voyages[0].legs[0].machineCode;
           obj.cabins = voyages[0].legs[0].cabin;
        }
        obj.lowestPrice = lowestPrice;
        obj.voyages = voyages;
        obj.seats = []

        return obj
     },
    // 整理查询机票返回的航班列表数据
    _normalizeFlightData(data) {
      const flightList = [];
      data.forEach(item => {
        const [
          depDate,
          arrDate,
          depAirportCode,
          arrAirportCode,
          depAirportTerm,
          arrAirportTerm,
          airlineCode,
          flightNo,
          shareFlightNo,
          flightType,
          lowPrice,
          seats
        ] = [
          item.departureDate.time,
          item.arrivalDate.time,
          item.depart,
          item.arrival,
          item.departureTerminal,
          item.arrivalTerminal,
          item.carrier,
          item.flightNo,
          item.shareFlightNo,
          item.aircraft,
          item.price,
          item.seats
        ];
        // 给seat添加className
        seats.forEach(seat => {
          seat.className = this._getClassName(seat.code);
          seat.totalPrice = seat.price + seat.fuelTax + seat.airportTax;
        });
        flightList.push({
          showSeat: false,
          depDate,
          arrDate,
          depTime: getTime(depDate),
          arrTime: getTime(arrDate),
          depAirportCode,
          arrAirportCode,
          depAirportName: this._getAirportName(depAirportCode, depAirportTerm),
          arrAirPortName: this._getAirportName(arrAirportCode, arrAirportTerm),
          airlineCode,
          flightNo,
          flightName: airlineCode + flightNo,
          shareFlightNo,
          flightType,
          lowPrice,
          seats
        });
      });
      return flightList;
    },
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
    // 获取存储在本地airlines
    _getAirlines() {
      let airlines = getLocal("airlines");
      airlines ? (airlines = JSON.parse(airlines)) : (airlines = []);

      return airlines;
    },
    // 往返和多程的跳转
    _mulWayLinkto() {
      // 总的搜索结果页面数;
      let totalPage = this.tripType === 2 ? this.record.stops.length-1:1
      if (this.page < totalPage) {
        this.page++;
        this.$router.push(`/domeSearchResult/${this.page}`);
      } else {
        this.$router.push(`/domeOrder`);
      }
    },
  //   往返和多程的跳转（来自行程的订票）
     _mulWayLinkto2() {
        // 总的搜索结果页面数;
        let totalPage = this.tripType === 2 ? this.record.stops.length-1:1
        if (this.page < totalPage) {
           this.page++;
           this.$router.push(`/domeSearchResult/${this.page}`);
        } else {

           //调用验价规则并且跳转（在每个要跳转回申请详情页面的地方都要添加）
          this.getRuleJump()

        }
     },
  },
  watch: {
    $route(to, from) {
      this._reSearchPlaneList();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.search-result {
  full-fixed(100);
  y-view();
  background-color: $color-body;
  .skip{
    margin-left:0.1rem;
  }
  .choose-sort {
    x-middle();
    padding: 0.2rem 0;
    border-1px(#BABABA);
    background-color: $color-white;

    .sort {
      flex: 1;
      text-align: center;
    }

    .time-sort {
      border-right: 1px solid #e1e1e1;
    }
  }

  .flight-list-wrapper {
    position: relative;
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .fail-tips {
      position: absolute;
      top: 30%;
      left: 0;
      right: 0;
      text-align: center;

      .text {
        color: $color-text;
      }
    }
  }
}
</style>


