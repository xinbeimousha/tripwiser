<template>
    <div class="trip-add">
        <HeaderTitle :title="title" :btnLeft="true" :btnRight="true" @back="goBack">
            <span @click="submission">提交</span>
        </HeaderTitle>
        <!--<div @click="cececece">测试按钮</div>-->
        <div class="container">
            <div class="passenger">
                <div class="travel-pepole border-1px">
                    <span class="title">出行人</span>
                    <span class="name" v-if="traveler">{{traveler.name}}</span>
                    <router-link to="/TripChangeTraveler" tag="span" class="fixed" v-show="!status">修改</router-link>
                </div>
                <div class="travel-peer border-1px" v-if="peers.length > 0">
                    <p class="title">
                        同行人
                    </p>
                    <ul class="peer-list">
                        <li class="peer-item border-1px" v-for="(item,index) in peers">
                            <p class="name">{{item.realname}}</p>
                            <p class="delete" @click="peerDelete(index)" v-show="!status">删除</p>
                        </li>
                    </ul>
                </div>
                <p @click="addTripPeer" class="add-peer" v-show="!status">
                    添加同行人
                </p>
            </div>
            <div class="business-trip">
                <div class="title-wrapper border-1px" v-if="!status" @click="showReasons">
                    <div class="title">出差事由</div>
                    <div class="text">{{reason}}</div>
                    <i class="fa fa-angle-right"></i>
                </div>
                <div class="title-wrapper border-1px" v-else>
                    <div class="title">出差事由</div>
                    <div class="text">{{reason}}</div>
                </div>
                <div class="reason-content">
                    <textarea class="content" placeholder="简要描述出差事由" v-model="reasonDetail"></textarea>
                </div>
            </div>
            <div class="trip-detail">
                <van-tabs class="reset" @click="chooseTripType" v-model="tripType">
                    <van-tab
                            v-for="(item,index) in tripTypes"
                            :title="item.name"
                            :key="index"
                            :disabled="(index!==tripType)&&(status==1)"
                    >
                        <!--如果是新提交行程，页面是可编辑的-->
                        <div class="flight-content" v-if="!status">
                            <div class="one-way" v-if="index===0">
                                <div class="city border-1px">
                                    <div class="from" @click="chooseCity(0)">
                                        {{fromCity}}
                                    </div>
                                    <div class="icon">
                                        <div class="logo">
                                            <img src="./return.png" alt="">
                                        </div>
                                    </div>
                                    <div class="to" @click="chooseCity(1)">
                                        {{toCity}}
                                    </div>
                                </div>
                                <div class="date border-1px">
                                    <span class="depart" @click="showDatePicker(0)"> {{depDate}} </span>
                                </div>
                            </div>
                            <div class="two-way" v-if="index===1">
                                <div class="city border-1px">
                                    <div class="from" @click="chooseCity(0)">
                                        {{fromCity}}
                                    </div>
                                    <div class="icon">
                                        <div class="logo">
                                            <img src="./return.png" alt="">
                                        </div>
                                    </div>
                                    <div class="to" @click="chooseCity(1)">
                                        {{toCity}}
                                    </div>
                                </div>
                                <div class="date border-1px">
                                    <span class="depart" @click="showDatePicker(0)">{{depDate}}</span>
                                    <span class="pad"></span>
                                    <span class="arrival" @click="showDatePicker(1)">{{arrDate}}</span>
                                </div>
                            </div>
                            <div class="multi-way" v-if="index === 2">
                                <ul class="trip-list">
                                    <li class="trip-item" v-for="(data,index) in multiDatas">
                                        <div class="city border-1px">
                                            <div class="from-group">
                                                <div class="from" v-show="data[0]" @click="chooseCity(index*2)">
                                                    {{data[0]}}
                                                </div>
                                                <div class="from empty" v-show="!data[0]" @click="chooseCity(index*2)">
                                                    出发
                                                </div>
                                            </div>
                                            <div class="icon">
                                                <div class="logo">
                                                    <img src="./return.png" alt="">
                                                </div>
                                            </div>
                                            <div class="to-group">
                                                <div class="to" v-show="data[1]" @click="chooseCity(index*2+1)">
                                                    {{data[1]}}
                                                </div>
                                                <div class="to empty" v-show="!data[1]" @click="chooseCity(index*2+1)">
                                                    到达
                                                </div>
                                            </div>
                                        </div>
                                        <div class="date border-1px">
                                            <span class="depart" @click="showDatePicker(index)"> {{tripDatas.dateWeek[index]}} </span>
                                            <span class="pad"></span>
                                            <span class="delete" v-if="index>1" @click="deleteTrip(index)">删除</span>
                                        </div>
                                    </li>
                                </ul>
                                <div class="add-trip border-1px" @click="addTrip()">
                                    添加一程
                                </div>
                            </div>
                        </div>
                        <!--如果是已经通过要修改的行程，页面是不可编辑的-->
                        <div class="flight-content" v-else>
                            <div class="one-way" v-if="index===0">
                                <div class="city border-1px">
                                    <div class="from">
                                        {{fromCity}}
                                    </div>
                                    <div class="icon">
                                        <div class="logo">
                                            <img src="./return.png" alt="">
                                        </div>
                                    </div>
                                    <div class="to">
                                        {{toCity}}
                                    </div>
                                </div>
                                <div class="date border-1px">
                                    <span class="depart"> {{depDate}} </span>
                                </div>
                            </div>
                            <div class="two-way" v-if="index===1">
                                <div class="city border-1px">
                                    <div class="from">
                                        {{fromCity}}
                                    </div>
                                    <div class="icon">
                                        <div class="logo">
                                            <img src="./return.png" alt="">
                                        </div>
                                    </div>
                                    <div class="to">
                                        {{toCity}}
                                    </div>
                                </div>
                                <div class="date border-1px">
                                    <span class="depart">{{depDate}}</span>
                                    <span class="pad"></span>
                                    <span class="arrival">{{arrDate}}</span>
                                </div>
                            </div>
                            <div class="multi-way" v-if="index === 2">
                                <ul class="trip-list">
                                    <li class="trip-item" v-for="(data,index) in multiDatas">
                                        <div class="city border-1px">
                                            <div class="from-group">
                                                <div class="from" v-show="data[0]">
                                                    {{data[0]}}
                                                </div>
                                                <div class="from empty" v-show="!data[0]">
                                                    出发
                                                </div>
                                            </div>
                                            <div class="icon">
                                                <div class="logo">
                                                    <img src="./return.png" alt="">
                                                </div>
                                            </div>
                                            <div class="to-group">
                                                <div class="to" v-show="data[1]">
                                                    {{data[1]}}
                                                </div>
                                                <div class="to empty" v-show="!data[1]">
                                                    到达
                                                </div>
                                            </div>
                                        </div>
                                        <div class="date border-1px">
                                            <span class="depart"> {{tripDatas.dateWeek[index]}} </span>
                                            <span class="pad"></span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>

            <!--跳转查询机票-->
            <div class="cost" @click="searchPlan"
            v-if="showSearchPlane">
                <div class="attribution budget border-1px">查询机票</div>
            </div>
            <!--机票信息组件-->
            <div class="dome-order-content cost"
                >
                <div class="airline-wrapper newMargin" v-if="airlineData.length > 0">
                    <airLine v-for="(airline,index) in airlineData" :showlow="false" :flight="airline" :key="index" />
                </div>

            </div>

            <!--添加的机票预订理由-->
            <div class="cost" v-show="ReasonText">
                <div class="attribution budget border-1px"
                     >超出航班预定规则原因：
                </div>
                <div class="attribution budget border-1px"
                     style="color: red;">{{ReasonText}}
                </div>

            </div>





            <!--费用预算-->
            <div class="cost">
                <div @click="queryCostBudget" class="budget border-1px">
                    <span class="title">费用预算</span>
                    <span class="money">¥{{budget}}</span>
                    <i class="fa fa-angle-right"></i>
                </div>
                <router-link to="/tripAttribution" tag="div" class="attribution" v-if="!status">
                    <span class="title">费用归属</span>
                    <span class="text">{{attribution}}</span>
                    <i class="fa fa-angle-right"></i>
                </router-link>
                <div class="attribution" v-else>
                    <span class="title">费用归属</span>
                    <span class="text">{{attribution}}</span>
                </div>
            </div>
        </div>
        <van-actionsheet v-model="iSshowReasons" :actions="reasons" @select="selectReason"/>
        <van-popup v-model="showDate" position="bottom">
            <van-datetime-picker
                    type="date"
                    v-model="currentDate"
                    :min-date="mimDate"
                    @cancel="hideDatePicker"
                    @confirm="chooseDate"
            />
        </van-popup>
    </div>
</template>

<script>
   import HeaderTitle from "components/HeaderTitle/HeaderTitle";
   import {getDetailDate3, getDate2, addDays, getDate1} from "common/js/day.js";
   import {submitApply, getWorkInfos, getBudgetSpaceType,submitOtherApply} from './api.js';
   import bus from "common/js/bus.js";
   import {getCompaDate} from 'common/js/utils.js';
   import {getLocal,setLocal} from "common/js/storage.js";
   import {Toast,Dialog} from "vant";
   import {mapMutations, mapGetters} from "vuex";

   //引入机票公共组件
   import AirLine from "components/AirlineItem/AirlineItem.vue"

   const firstDate = new Date();
   const secondDate = addDays(firstDate, 1);
   const thirdDate = addDays(secondDate, 1);
   const date = [firstDate, secondDate, thirdDate];
   const stops = ['广州', '北京', '北京', '上海'];

   class CityJson {
      constructor({from, to, begin, end, beginText, endText}) {
         this.from = from;
         this.to = to;
         this.begin = begin;
         this.end = end;
         this.beginText = beginText;
         if (endText) {
            this.endText = endText;
         }
      }
   }

   export default {
      name: "tripAdd",
      components: {
         HeaderTitle,
         AirLine,//引入机票公共组件
      },
      data() {
         return {
            Reason: false,//是否显示理由
            ReasonText:'',//理由内容
            title: '添加行程',
            tripTypes: [
               {
                  name: "单程"
               },
               {
                  name: "往返"
               },
               {
                  name: "多程"
               }
            ],
            reasons: [
               {name: "会议"},
               {name: "考察"},
               {name: "调研"},
               {name: "项目"},
               {name: "驻场"},
               {name: "其他"}
            ],
            traveler: null,
            peers: [],//同行人存放数组
            choosedDepart: null,
            reason: "会议",
            reasonDetail: "",
            iSshowReasons: false,
            tripInitDatas: {
               date: [...date],
               stops: [...stops]
            },
            tripType: 1,
            budgetList: [],
            budgetFlag: false,
            showDate: false,
            currentDate: "",
            attribution: "",
            mimDate: new Date(),
            currDateIndex: 0,
            // 数据初始化flag，因为标识第一次watch
            start: -1,
            status: '',// 判断当前行程是否是已通过后修改的
            WarehouseRank: [],//仓位等级数组
            PlaneDate: [],//机票时间（数组可能双向）
            dateBetween: [],//行程时间（数组必须双向，如果是多程就多向）
            PlanStops: [
               {c: "CAN", n: "广州", region: 0},
               {c: "BJS", n: "北京", region: 0},
               {c: "SHA", n: "上海", region: 0}
            ],
            PlanTrueStops: [[]],//存放stops的数组,默认的是广州到北京
            needQuery:JSON.parse(localStorage.getItem('userInfo')).needQuery,//是否出现查询机票按钮
            airlineData:[],//渲染机票所需要的数据
            showSearchPlane:false,//是否显示查询机票按钮
            singlePrice:0,//单个人机票的总费用
         };
      },
      computed: {
         ...mapGetters({
            includes: "includePageNames"
         }),
         fromCity() {
            return this.tripDatas.stops[0];
         },
         toCity() {
            return this.tripDatas.stops[1];
         },
         depDate() {
            return this.tripDatas.dateWeek[0];
         },
         arrDate() {
            return this.tripDatas.dateWeek[1];
         },
         multiDatas() {
            const oldDatas = [...this.tripDatas.stops];
            const len = oldDatas.length / 2;
            const datas = [];
            for (let i = 0; i < len; i++) {
               datas.push(oldDatas.splice(0, 2));
            }

            return datas;
         },
         users() {
            const users = [];
            users.push(this.traveler);
            if (this.peers.length) {
               this.peers.forEach(item => {
                  users.push({
                     code: item.username,
                     name: item.realname
                  });
               });
            }
            return users;
         },
         // 选择的时间
         tripDatas() {
            const tripDatas = {
               date: this.tripInitDatas.date,
               stops: this.tripInitDatas.stops
            };
            tripDatas.date.forEach((item, index, arr) => {
               if (arr[index + 1] < arr[index] && arr[index + 1]) {
                  arr[index + 1] = addDays(arr[index], 1)
               }
            })
            const dateWeek = tripDatas.date.map(item => {
               return getDetailDate3(item);
            });
            const dateNum = tripDatas.date.map(item => {
               return getDate2(item);
            });
            tripDatas.dateWeek = dateWeek;
            tripDatas.dateNum = dateNum;

            return tripDatas;
         },
         tripCitiesJson() {
            const tripCitesJson = [];
            if (this.tripType === 0) {
               tripCitesJson.push(
                   new CityJson({
                      from: this.tripDatas.stops[0],
                      to: this.tripDatas.stops[1],
                      begin: this.tripDatas.dateNum[0] + " 00:00:00",
                      end: this.tripDatas.dateNum[0] + " 23:59:59",
                      beginText: this.tripDatas.dateWeek[0],
                      endText: this.tripDatas.dateWeek[0]
                   })
               );
            } else if (this.tripType === 1) {
               tripCitesJson.push(
                   new CityJson({
                      from: this.tripDatas.stops[0],
                      to: this.tripDatas.stops[1],
                      begin: this.tripDatas.dateNum[0] + " 00:00:00",
                      end: this.tripDatas.dateNum[1] + " 23:59:59",
                      beginText: this.tripDatas.dateWeek[0],
                      endText: this.tripDatas.dateWeek[1]
                   }),
                   new CityJson({
                      from: this.tripDatas.stops[1],
                      to: this.tripDatas.stops[0],
                      begin: this.tripDatas.dateNum[0] + " 00:00:00",
                      end: this.tripDatas.dateNum[1] + " 23:59:59",
                      beginText: this.tripDatas.dateWeek[0],
                      endText: this.tripDatas.dateWeek[1]
                   })
               )
            } else {
               for (let i = 0; i < this.multiDatas.length; i++) {
                  tripCitesJson.push(
                      new CityJson({
                         from: this.multiDatas[i][0],
                         to: this.multiDatas[i][1],
                         begin: this.tripDatas.dateNum[i] + " 00:00:00",
                         end: this.tripDatas.dateNum[i] + " 23:59:59",
                         beginText: this.tripDatas.dateWeek[i]
                      })
                  );
               }
            }

            return tripCitesJson;
         },
         queryBudgetDatas() {
            const queryBudgetDatas = {
               users: JSON.stringify(this.users),
               tripCitiesJson: JSON.stringify(this.tripCitiesJson),
            };
            return queryBudgetDatas;
         },
         budget() {
            if (!this.budgetList.length) {
               return 0;
            } else {
               return this.budgetList.reduce((x, y) => {
                  return x + y;
               });
            }
         },
         othersUserName() {
            if (!this.peers.length) {
               return "";
            }
            const codes = [];
            this.peers.forEach(item => {
               codes.push(item.username);
            });
            return codes.join(",");
         },
         othersRealName() {
            if (!this.peers.length) {
               return "";
            }
            const names = [];
            this.peers.forEach(item => {
               names.push(item.realname);
            });
            return names.join(",");
         }
      },
      watch: {
         queryBudgetDatas() {
            this.budgetFlag = false;
            // 如果是重新编辑的行程，可以直接提交
            if (this.$route.params.edit && this.start && this.start === -1) {
               this.budgetFlag = true;
            }
            this.start++;
         }
      },
      created() {
         // 获取用户信息
         this.userInfo = JSON.parse(getLocal("userInfo"));
         // 设置初始化出行人信息
         this.traveler = {
            code: this.userInfo.ucode,
            name: this.userInfo.uname
         };
         this.comName = this.userInfo.comName;
         this.comId = this.userInfo.comId;
         // 如果是从审批页面来的
         if (this.$route.params.edit) {
            // 如果是未通过的
            this.id = this.$route.params.tripId;
            this.belongId = this.$route.params.belongId;
            this.edit = this.$route.params.edit;
            this._editApply();
            // 如果是已通过
            if (this.$route.params.status) {
               this.status = this.$route.params.status;
               this.title = '修改行程';
            }
         }
         this._handleOnEvent();
         this._getWorkInfos();

         //  获取机票仓位等级
         //   this.WarehouseRank 就是cabinRequire需要的参数
         getBudgetSpaceType().then(res => {
            console.log(res);
            if (res.success) {
               switch (res.obj.spaceType) {
                  case 'tourist'://经济舱
                     this.WarehouseRank = res.obj.tourist
                     this.WarehouseRank = this.WarehouseRank.join(',')
                     console.log(this.WarehouseRank);
                     break;
                  case 'superTourist'://高级经济舱
                     this.WarehouseRank = res.obj.tourist.concat(res.obj.superTourist)
                     this.WarehouseRank = this.WarehouseRank.join(',')
                     console.log(this.WarehouseRank);
                     console.log('superTourist');
                     break;
                  case 'business'://公务舱
                     this.WarehouseRank = res.obj.tourist.concat(res.obj.superTourist).concat(res.obj.business)
                     this.WarehouseRank = this.WarehouseRank.join(',')
                     console.log(this.WarehouseRank);
                     console.log('business');
                     break;
                  case 'first'://头等舱
                     this.WarehouseRank = res.obj.tourist.concat(res.obj.superTourist).concat(res.obj.business).concat(res.obj.first)
                     this.WarehouseRank = this.WarehouseRank.join(',')
                     console.log(this.WarehouseRank);
                     console.log('first');
                     break;

               }
            }
         })
         //   this.tripType 现成
         //   date和dateBetween到this.tripCitiesJso函数里面拿

         //   判断是否有权限查询机票按钮
         if (JSON.parse(localStorage.getItem('userInfo')).needQuery){
            this.showSearchPlane=true
         }


         
      },
      //八个生命周期之一的结束之前
      beforeDestroy() {
         //生命周期结束清除$emit
         bus.$off(["choosedItem", "choosedPeer", "choosedDepart", "confirmCost", 'city','PlaneTicket','reasonText']);
         //清除预订机票回传过来的两个本地数据
         localStorage.removeItem('airlines')
         localStorage.removeItem('meReason')
         },
      methods: {
         //测试
         cececece(){
            console.log(this.multiDatas);
            console.log(this.peers);

            console.log(this._handlePassengers());

         },

         //获取所有人的机票总费用
         _getSingleNumPri(){
            this.airlineData.forEach(item => {
               this.singlePrice += item.seat.totalPrice;
            });

            let num=this.peers.length+1
            return this.singlePrice*num
         },
         // 获取单个人的机票总费用(注意是单个)
         _getSingleprice() {
            this.airlineData.forEach(item => {
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
            let peersTx=this.peers
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
            this.airlineData.forEach(flight => {
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
            this.airlineData.forEach(flight => {
               flightCheckPriceDTOList.push(flight.flightCheckPriceDTOList);
            });

            return flightCheckPriceDTOList;
         },
         //查询机票调用该函数，将订票所需的数据存在本地
         ceshi() {
            // console.log(this.traveler.name);
            // console.log(this.traveler.code);
            //行程类型 0单程 1往返 2多程
            console.log(this.tripType);
            console.log(typeof this.tripType);
            console.log(this.tripDatas);
            // console.log(this.reason);
            //现在差stops了
            // console.log(this.tripInitDatas);


            //每次调用前把PlanTrueStops清空
            this.PlanTrueStops=[[]]
            //在申请行程的列表中默认行程时间和机票时间一致
            switch (this.tripType) {
               case 0://单程
                  this.PlaneDate = [this.tripDatas.dateNum[0]]
                  this.dateBetween = [this.tripDatas.dateNum[0], this.tripDatas.dateNum[1]]
                  console.log(this.PlaneDate, this.dateBetween);

                  // 城市名字
                  let city1 = [this.tripDatas.stops[0], this.tripDatas.stops[1]]
                  console.log(city1);
                  console.log(this.PlanStops);

                  let city1Start = city1[0]
                  let city1End = city1[1]
                  this.PlanStops.forEach((item, index) => {
                     if (item.n == city1Start) {
                        this.PlanTrueStops[0][0] = item
                     }
                     if (item.n == city1End) {
                        this.PlanTrueStops[0][1] = item
                     }
                  })

                  console.log(this.PlanTrueStops);
                  break;
               case 1://双程
                  this.PlaneDate = [this.tripDatas.dateNum[0], this.tripDatas.dateNum[1]]
                  this.dateBetween = [this.tripDatas.dateNum[0], this.tripDatas.dateNum[1]]
                  console.log(this.PlaneDate, this.dateBetween);

                  // 城市名字
                  let city2 = [this.tripDatas.stops[0], this.tripDatas.stops[1]]
                  console.log(city2);
                  console.log(this.PlanStops);

                  let city2Start = city2[0]
                  let city2End = city2[1]

                  this.PlanStops.forEach((item, index) => {
                     if (item.n == city2Start) {
                        this.PlanTrueStops[0][0] = item
                     }
                     if (item.n == city2End) {
                        this.PlanTrueStops[0][1] = item
                     }
                  })

                  console.log(this.PlanTrueStops);


                  break;
               case 2://多程
                  this.PlaneDate = []
                  this.dateBetween = []
                  for (var i = 0; i < this.tripDatas.dateNum.length - 1; i++) {
                     // console.log(this.tripDatas.dateNum[i]);
                     this.PlaneDate.push(this.tripDatas.dateNum[i])
                     // this.dateBetween.push(this.tripDatas.dateNum[i])
                  }
                  this.dateBetween=[this.tripDatas.dateNum[0],this.tripDatas.dateNum[this.tripDatas.dateNum.length-1]]
                  console.log(this.PlaneDate, this.dateBetween);
                  console.log(this.PlanStops);
    
                  
                  console.log(this.tripDatas.stops);
                  var arr=[[]]
                   var arrJ=[]//奇数
                   var arrOu=[]//偶数
                  // 循环遍历把{n:'北京',region:1}这种格式按照顺序生成一个新数组
                  for(var i = 0; i <this.tripDatas.stops.length ; i++) {
                     console.log(this.tripDatas.stops[i]);
                     this.PlanStops.forEach((value,index)=>{
                        if (value.n==this.tripDatas.stops[i]){
                           if (i%2==0){
                              arrOu.push(value)
                           } else{
                              arrJ.push(value)
                           }

                        }
                     })
                  }
                  //成功把数据加入到arr中

                   for(var k = 0; k <arrOu.length ; k++) {
                        arr[k]=[]
                        arr[k][0]=arrOu[k]
                        arr[k][1]=arrJ[k]
                   }


                  this.PlanTrueStops=arr
                   console.log(this.PlanTrueStops);

                  break;
            }

            console.log('分割线');
            console.log(this.WarehouseRank);
            console.log(this.PlaneDate);
            console.log(this.dateBetween);
            console.log(this.PlanTrueStops);
            console.log(this.tripType);
            console.log('分割线');


            let record = {
               date: this.PlaneDate,
               dateBetween:this.dateBetween,
               tripType: this.tripType,
               cabinRequire: this.WarehouseRank,
               stops: this.PlanTrueStops,
               tripId: ''
            };

            //将数据存储到本地
            setLocal("record", JSON.stringify(record));
            setLocal("peers", JSON.stringify(this.peers));

            this.$router.push({
               path:"/domeSearchResult/0",
               query:{needQuery:this.needQuery}
               });


         },
         ...mapMutations({
            setPage: "SET_ALIVEPAGE",
            deletePage: "DELETE_ALIVEPAGE"
         }),
         // 查询机票
         searchPlan() {
            console.log('查询机票');
            console.log(this.reason);

            //多程情况必须添加城市才能跳转
            const stops = this.tripDatas.stops;
            for (let i = 0; i < stops.length; i++) {
               if (!stops[i]) {
                  Toast("请先添加城市");
                  return;
               }
            }
            //把数据存到本地然后跳转
            this.ceshi()


         },
         goBack() {
            this.$router.push({path:'/tripApply'});
         },
         peerDelete(index) {
            this.peers.splice(index, 1);
            if (this.budgetList.length > 1) {
               this.budgetList.splice(index + 1, 1);
            }
         },
         queryCostBudget() {
            // 要判断当前页面是否是从未通过的审批页面路由而来
            let edit = false;
            let budgetDetail = []
            if (this.$route.params.edit) {
               edit = this.$route.params.edit;
               budgetDetail = this.$route.params.tmcItinerary.budgetDetail;
            }
            this.$router.push({
               name: "tripCostBudget",
               query: Object.assign({}, this.queryBudgetDatas, {
                  budgetFlag: this.budgetFlag,
                  budgetList:JSON.stringify(this.budgetList)
               }),
               params: {
                  edit,
                  budgetDetail
               }
            });
         },
         addTripPeer() {
            this.$router.push({
               name: 'tripPeerAdd',
               params: {
                  users: this.users
               }
            })
         },
         chooseCity(index) {
            this.$router.push({
               path: `/cityList/${index}`
            })
         },
         chooseTripType(index) {
            this.tripType = index;
         },
         showDatePicker(index) {
            this.showDate = true;
            this.currentDate = this.tripDatas.date[index];
            this.currDateIndex = index;
         },
         chooseDate(val) {
            this.tripDatas.date.splice(this.currDateIndex, 1, val);
            this.showDate = false;
            ;
         },
         hideDatePicker() {
            this.showDate = false;
         },
         addTrip() {
            const stops = this.tripDatas.stops;
            const date = this.tripDatas.date;
            for (let i = 0; i < stops.length; i++) {
               if (!stops[i]) {
                  Toast("请先添加城市");
                  return;
               }
            }
            stops.push(stops[stops.length - 1], "");
            if (stops.length + 1 > 6) {
               date.push(date[date.length - 1])
            }
         },
         deleteTrip(index) {
            this.tripDatas.stops.splice(index * 2, 2);
         },
         showReasons() {
            this.iSshowReasons = true;
         },
         selectReason(item) {
            this.reason = item.name;
            this.iSshowReasons = false;
         },
         //点击提交
         submission() {
            if (!this.reasonDetail) {
               Toast("简要描述事由不能为空");
               return;
            }
            console.log(this.budgetFlag)
            if (!this.budgetFlag) {
               Toast("请先确定预算");
               return;
            }
            if (!this.attribution) {
               Toast("请先选择费用归属");
               return;
            }

            //判断是否有机票信息
            if (this.showSearchPlane&&this.airlineData.length==0){
               Toast('请点击机票查询机票信息')
               return;
            }

            //万力或者科大讯飞账号的提交
            if (this.showSearchPlane&&this.airlineData.length>0){
              this._submitPlane();

            } else{
               //普通账号的提交
               this._submitApply();
            }

         },
         //点击提交（这个是带有机票的提交）
         _submitPlane(){
            console.log(this.airlineData);
            //提交时所要的数据
            const submitData = this._getSubmitPlaneData();
            console.log(submitData);
            //调用提交接口
            submitOtherApply(submitData,this.status).then(result=>{
               if (result.success) {
                  //提交成功以后删除这两个本地存储
                  localStorage.removeItem('airlines')
                  localStorage.removeItem('meReason')
                  this.$router.push('/tripApply');
               } else {
                  Dialog.alert({
                     title: '提示',
                     message: result.msg,
                     className: 'check-tips'
                  }).then(() => {
                     // do something
                  })
               }
            })
         },
         //点击提交调用（限于没有机票的提交）
         async _submitApply() {
            //提交时所要的数据
            const submitData = this._getSubmitTripData();
            //调用提交接口
            const result = await submitApply(submitData, this.status);
            if (result.success) {
               this.$router.push('/tripApply');
            } else {
               Dialog.alert({
                  title: '提示',
                  message: result.msg,
                  className: 'check-tips'
               }).then(() => {
                  // do something
               })
            }
         },
         //获取出差描述的事由
         async _getWorkInfos() {
            const result = await getWorkInfos();
            if (result.length > 0) {
               const workInfos = [];
               result.forEach(item => {
                  workInfos.push({name: item.name})
               })
               this.reason = result[0].name;
               this.reasons = workInfos;
            }
         },
         //带有机票的提交申请需要的数据`````````````````
         _getSubmitPlaneData(){
            let data=this._getSubmitTripData()

            let orgCodes= data.orgCode //费用归属id
            let belongTypess=data.belongType //费用归属类型
            let departNamess=data.departName //费用归属名字
            // orgCode: data.orgCode, //费用归属id
            //     belongType: data.belongType, //费用归属类型
            //     departName: data.departName //费用归属名字


            let data2Plane=data
            data2Plane.remark=this.ReasonText

            delete data2Plane.orgCode
            delete data2Plane.belongType
            delete data2Plane.departName

            //处理验价规则的数据
            const record = JSON.parse(getLocal("record"));
            const userInfo = JSON.parse(getLocal("userInfo"));


            //这里要坑爹的转格式啊转格式
            data2Plane.itinerBegin=data2Plane.itinerBegin.replace(/\-/g, "/")
            data2Plane.itinerEnd=data2Plane.itinerEnd.replace(/\-/g, "/")


            let applyData={
               tmcItineraryDO:data2Plane,
               tmcItineraryCostDO:{
                  orgCode: orgCodes, //费用归属id
                  belongType: belongTypess, //费用归属类型
                  departName: departNamess//费用归属名字
               },
               flightChangeDTO:{
                  al: JSON.stringify(this._handleAirlines()),//航班信息1
                  fTotalPrice: this._getSingleNumPri(),//总价1
                  totalPoundage: 0,//手续费1
                  cause: '',//空1
                  domainType: 1,//国内机票2国际机票1（以后做国际机票要改）
                  roleTag:userInfo.isWanLi,//isWanLi userinfo里面1
                  contactTelephone: userInfo.mobile,//联系人电话1
                  flightCheckPriceDTOList:this._handleFlightcheck(),//验票返回的飞机信息,airline里面的list1
                  passengers: JSON.stringify(this._handlePassengers()),//乘客信息
               }
            }


            // let applyData={
            //    al: JSON.stringify(this._handleAirlines()),//航班信息1
            //    fTotalPrice: this._getSingleNumPri(),//总价1
            //    totalPoundage: 0,//手续费1
            //    cause: '',//空1
            //    domainType: 1,//国内机票2国际机票1（以后做国际机票要改）
            //    roleTag:userInfo.isWanLi,//isWanLi userinfo里面1
            //    contactTelephone: userInfo.mobile,//联系人电话1
            //    flightCheckPriceDTOList:JSON.stringify(this._handleFlightcheck()),//验票返回的飞机信息,airline里面的list1
            //    passengers: JSON.stringify(this._handlePassengers()),//乘客信息
            // //   分割线


            return applyData


         },
         // 获取提交申请需要的数据
         _getSubmitTripData() {
            let id, belongId;
            let edit = false;
            if (this.$route.params.hasOwnProperty("tripId")) {

               id = this.$route.params.tripId;
               belongId = this.$route.params.belongId;
               edit = true;
            }

            //提交所需要的参数
            const submitData = {
               applyUserName: this.traveler.code,//申请人编号
               applyUserRealName: this.traveler.name,//申请人姓名
               tripType: this.tripType,//行程类型 0 单程 1往返 2多程
               tripDetail: JSON.stringify(this.tripCitiesJson), //行程数据
               itinerWorkType: this.reason,//出差事由
               workInfo: this.reasonDetail,//描述事由
               othersUserName: this.othersUserName,//同行人编号
               othersRealName: this.othersRealName,//同行人姓名
               isSubmit: 1,//是否是保存或提交 0保存 1提交
               budgetDetail: this.budgetDetail ? JSON.stringify(this.budgetDetail) : "",//预算列表
               budgetTotal: this.budget+'',//预算总额
               picPath: "",//附件列表
               orgCode: this.comId,//费用归属id
               belongType: '1',//费用归属类型
               departName: this.attribution//费用归属名字
            };
            if (this.edit) {
               submitData.id = this.id;
               submitData.belongId = this.belongId;
            }
            if (this.tripType === 0) {
               submitData.itinerBegin = this.tripDatas.dateNum[0] + " 00:00:00";
               submitData.itinerEnd = this.tripDatas.dateNum[0] + " 23:59:59";
               submitData.itinerFrom = this.tripDatas.stops[0];
               submitData.itinerTo = this.tripDatas.stops[1];
            } else if (this.tripType === 1) {
               submitData.tripDetail = JSON.stringify([this.tripCitiesJson[0]]);
               submitData.itinerBegin = this.tripDatas.dateNum[0] + " 00:00:00";
               submitData.itinerEnd = this.tripDatas.dateNum[1] + " 23:59:59";
               submitData.itinerFrom = this.tripDatas.stops[0];
               submitData.itinerTo = this.tripDatas.stops[1];
            } else {
               submitData.itinerBegin = this.tripDatas.dateNum[0] + " 00:00:00";
               submitData.itinerEnd = this.tripDatas.dateNum[this.multiDatas.length - 1] + " 23:59:59";
               submitData.itinerFrom = this.tripDatas.stops[0];
               submitData.itinerTo = this.multiDatas[this.multiDatas.length - 1][1];
            }
            return submitData;
         },
         // 从未通过的审批页面路由来的，给页面赋值
         _editApply() {
            const tmcItinerary = this.$route.params.tmcItinerary;
            const tripDetail = tmcItinerary.tripDetail;
            // 出行人
            this.traveler.code = tmcItinerary.applyUserName;
            this.traveler.name = tmcItinerary.applyUserRealName;
            // 同行人
            if (tmcItinerary.associate) {
               tmcItinerary.associate.forEach(item => {
                  item.username = item.code;
                  item.realname = item.name;
               })
               this.peers = tmcItinerary.associate;
            }
            // 出差事由
            this.reason = tmcItinerary.itinerWorkType;
            this.reasonDetail = tmcItinerary.workInfo;
            // 行程类型和时间
            this.tripType = tmcItinerary.tripType;
            if (this.tripType !== 2) {
               this.tripInitDatas.stops.splice(0, 1, tripDetail[0].from);
               this.tripInitDatas.stops.splice(1, 1, tripDetail[0].to);
               this.tripInitDatas.date.splice(0, 1, new Date(getCompaDate(tripDetail[0].begin)));
               this.tripInitDatas.date.splice(1, 1, new Date(getCompaDate(tripDetail[0].end)));
            }
            if (this.tripType === 2) {
               for (let i = 0; i < tripDetail.length; i++) {
                  this.tripInitDatas.stops.splice(i * 2, 1, tripDetail[i].from);
                  this.tripInitDatas.stops.splice(i * 2 + 1, 1, tripDetail[i].to);
                  this.tripInitDatas.date.splice(i, 1, new Date(getCompaDate(tripDetail[i].begin)));
               }
            }

            // 费用预算
            tmcItinerary.budgetDetail.forEach(item => {
               this.budgetList.push(item.myTotal)
            })
            this.budgetDetail = tmcItinerary.budgetDetail;
            // 费用归属地
            this.attribution = tmcItinerary.tmcItineraryCost.departName;

         },
         // 监听该页面的$on事件
         _handleOnEvent() {
            bus.$on("choosedItem", item => {
               this.traveler.name = item.realname;
               this.traveler.code = item.username;
            });
            bus.$on("choosedPeer", peers => {
               this.peers = this.peers.concat(peers);
               if(this.needQuery){
                  this.peers.forEach(peer => {
                     this.budgetList.push(this.singlePrice)
                  })
               }

            });
            bus.$on("choosedDepart", depart => {
               if (depart.comId) {
                  this.attribution = depart.name;
               } else {
                  this.attribution = `${this.comName}/${depart.name}`;
               }
            });
            bus.$on("confirmCost", (item, costData) => {
               this.budgetList = item;
               this.budgetFlag = true;
               console.log(this.budgetFlag)
               this.budgetDetail = [];
               costData.forEach((item, index) => {
                  this.budgetDetail.push({
                     name: this.users[index].name,
                     code: this.users[index].code,
                     myTotal: this.budgetList[index],
                     isShow: index === 0 ? true : false,
                     detailsLi: item.detailsLi
                  });
               });
            });
            bus.$on('city', (item, index) => {
               let {n} = item;
               this.tripDatas.stops.splice(index, 1, n);
               //    添加item到PlanStops
               this.PlanStops.push(item)
            })

            bus.$on('PlaneTicket',(item)=>{
               // 查询机票后需要把单个人机票总价归零
               this.singlePrice=0;
               this.airlineData=item;   
                if (this.airlineData.length){
                   this.Reason=true;
                   this._getSingleprice();
                   const budgetList = [];
                   this.users.forEach(user => {
                     budgetList.push(this.singlePrice)
                   })
                   this.budgetList = budgetList;
                }
                console.log(this.airlineData);
            })


            bus.$on('reasonText', (item) => {
               if (item){
                  this.ReasonText=item
               } else{
                  this.ReasonText=""
               }

            })
         },
         // 获得航段数据
         // _getAirlineData() {
         //    const airlineData = JSON.parse(getLocal("airlines"));
         //    if (airlineData.length) {
         //       this.airlineData = airlineData;
         //    }
         // },
      },
      beforeRouteLeave(to, from, next) {
         if (to.name === "tripApply" || to.name === 'tripDetail') {
            const index = this.includes.indexOf(from.name);
            index > -1 && this.deletePage(index);
            const i = this.includes.indexOf("tripCostBudget");
            i > -1 && this.deletePage(i);
         }
         if (to.name === "tripCostBudget" && this.includes.indexOf(to.name) < 0) {
            this.setPage(to.name);
         }
         next();
      },

   };
</script>

<style lang="stylus" scoped>
    @import '~common/style/variable.styl';
    @import '~common/style/mixin.styl';

    .trip-add {
        y-view();
        height: 100%;

        .container {
            flex: 1;
            scrolling();
            padding-bottom: 0.5rem;

            .passenger {
                background-color: #fff;
                margin-bottom: 0.2rem;

                .travel-pepole {
                    padding: 0.2rem;
                    x-middle();
                    border-1px($color-solid);

                    .title {
                        width: 1.5rem;
                        color: $color-text-h;
                    }

                    .name {
                        flex: 1;
                        color: $color-text-h;
                    }

                    .fixed {
                        padding-right: 0.1rem;
                        color: $color-text-active;
                    }
                }

                .travel-peer {
                    display: flex;
                    padding-left: 0.2rem;
                    border-1px($color-solid);

                    .title {
                        padding: 0.2rem 0;
                        width: 1.5rem;
                    }

                    .peer-list {
                        flex: 1;

                        .peer-item {
                            display: flex;
                            justify-content: space-between;
                            padding: 0.2rem 0;
                            padding-right: 0.3rem;

                            .delete {
                                color: red;
                            }

                            &:not(:last-child) {
                                border-1px($color-solid);
                            }
                        }
                    }
                }

                .add-peer {
                    padding: 0.2rem 0;
                    color: $color-text-active;
                    text-align: center;
                }
            }

            .business-trip {
                padding-left: 0.2rem;
                margin-bottom: 0.2rem;
                background-color: #fff;

                .title-wrapper {
                    x-middle();
                    padding: 0.2rem 0;
                    padding-right: 0.3rem;
                    border-1px($color-solid);

                    .title {
                        width: 1.5rem;
                    }

                    .text {
                        flex: 1;
                    }
                }

                .reason-content {
                    padding: 0.2rem 0.3rem 0.2rem 0;

                    .content {
                        resize: none;
                        width: 100%;
                        outline: none;
                    }
                }
            }

            .trip-detail {
                margin-bottom: 0.1rem;
                background-color: $color-white;

                .flight-content {
                    .city, .date {
                        x-middle();
                        padding: 0 0.2rem;
                        line-height: 3;
                        border-1px(#e5e5e5);

                        .icon, .pad {
                            flex: 1;

                            .logo {
                                width: 0.5rem;
                                margin: 0 auto;
                            }
                        }
                    }

                    .multi-way {
                        .depart {
                            flex: 1;
                        }
                        .delete {
                            color: red;
                        }
                        .from-group {
                            .empty {
                                color: $color-text-h;
                            }
                        }

                        .to-group {
                            .empty {
                                color: $color-text-h;
                            }
                        }

                        .add-trip {
                            padding: 0.2rem;
                            border-1px($color-solid);
                            text-align: center;
                            color: $color-text-active;
                        }
                    }
                }
            }

            .cost {
                padding-left: 0.2rem;
                background-color: #fff;

                .budget {
                    x-middle();
                    padding: 0.2rem 0.3rem 0.2rem 0;
                    border-1px($color-solid);

                    .title {
                        width: 1.5rem;
                    }

                    .money {
                        flex: 1;
                        color: $color-text-active;
                    }
                }

                .attribution {
                    x-middle();
                    padding: 0.2rem 0.3rem 0.2rem 0;

                    .title {
                        width: 1.5rem;
                    }

                    .text {
                        flex: 1;
                    }
                }
            }
        }
    }

//     新增样式
    .newMargin{
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>

