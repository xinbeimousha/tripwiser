<template>
  <div class="plane-search">
    <HeaderTitle
      title="机票预订"
      :btnLeft="true"
      @back="goback"
    />
    <div class="search-container">
      <!-- <div class="trip-choosed" @click="showSelet">
        <span class="trip-title">{{ tripName }}</span>
        <van-icon name="arrow" />
      </div> -->
      <div class="flight-detail">
        <van-tabs class="reset"
          @click="chooseTripType"
          v-model="tripType"
        >
          <van-tab
            v-for="(item,index) in tripTypes"
            :title="item.name"
            :key="index"
            :disabled="index === 2 && defaulType!==2"
          >
            <div class="flight-content">
              <div class="one-way" v-if="tripType === 0" >
                  <div class="city border-1px">
                    <div class="from" @click="chooseCity(0)">
                      {{ fromCity }}
                    </div>
                    <div class="icon">
                      <div class="logo">
                        <img src="./one-way.png" alt="">
                      </div>
                    </div>
                    <div class="to" @click="chooseCity(1)">
                      {{ toCity }}
                    </div>
                  </div>
                  <div class="date border-1px">
                    <span class="depart" @click="showDatePicker(0)">{{ departDate }}</span>
                  </div>
              </div>
              <div class="two-way" v-else-if="tripType === 1">
                  <div class="city border-1px">
                    <div class="from" @click="chooseCity(0)">
                      {{ fromCity }}
                    </div>
                    <div class="icon">
                      <div class="logo">
                        <img src="./return.png" alt="">
                      </div>
                    </div>
                    <div class="to" @click="chooseCity(1)">
                      {{ toCity }}
                    </div>
                  </div>
                  <div class="date border-1px">
                    <span class="depart" @click="showDatePicker(0)"> {{ departDate }} </span>
                    <span class="pad"></span>
                    <span class="arrival" @click="showDatePicker(1)"> {{ arrivalDate }}</span>
                  </div>
              </div>
              <div class="multi-way" v-else>
                <div v-for="(date,index) in planeSearchData.date" :key="index">
                  <div class="city border-1px">
                    <div class="from" @click="chooseCity(index*2)">
                      {{planeSearchData.stops[planeSearchData.stopsIds[index*2]].n}}
                    </div>
                    <div class="icon">
                      <div class="logo">
                        <img src="./one-way.png" alt="">
                      </div>
                    </div>
                    <div class="to" @click="chooseCity(index*2+1)">
                      {{planeSearchData.stops[planeSearchData.stopsIds[index*2+1]].n}}
                    </div>
                  </div>
                  <div class="date border-1px">
                    <span class="depart" @click="showDatePicker(index)">{{date}}</span>
                    <span class="pad"></span>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="cabin-wrapper">
        <p class="title">要求舱位</p>
        <ul class="cabin-require">
          <li class="item"
            v-for="(cabin,index) in cabinData"
            :class="{'active-item':cabin.value}"
            :key="index"
            @click="chooseSpaceType(index)"
          >
            {{ cabin.name }}
          </li>
        </ul>
      </div>
      <div class="btn-query" @click="query">
        查询
      </div>
    </div>
    <van-actionsheet
      v-model="showTrip"
      :actions="tripList"
      @select="chooseTrip"
    />
    <van-popup v-model="showDate" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="mimDate"
        :max-date="maxDate"
        @cancel="hideDatePicker"
        @confirm="chooseDate"
      />
    </van-popup>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle.vue";
import { cabinData } from "./cabinData.js";
import {
  Toast,
  Dialog
} from "vant";
import { getBudgetSpaceType, getItineraryList } from "./api.js";
import { getDate1, getDate2, getTime } from "common/js/day.js";
import day from "dayjs";
import { setLocal } from "common/js/storage.js";
import { cityList } from 'common/js/cityData.js';
import planeSearchData from './planeSearchData.js';
import { objDeepCopy } from 'common/js/utils.js'
import { mapGetters, mapMutations } from "vuex";
import { gobackMixin } from "common/js/mixins.js";
import bus from "common/js/bus.js";

export default {
  components: {
    HeaderTitle
  },
  mixins: [gobackMixin],
  name: "search",
  data() {
    return {
      showTrip: false,
      showDate: false,
      currentSearchDateIndex: 0,
      airlines: [],
      tripList: [
        {
          name: "无"
        }
      ],
      tripName: "无",
      tripTypes: [
        {
          name: "单程",
          tripType: 0
        },
        {
          name: "往返",
          tripType: 1
        },
        // {
        //   name: "多程",
        //   tripType: 2
        // }
      ],//多程还是单程
      planeSearchData:objDeepCopy(planeSearchData),
      tripType: 0,
      defaulType: 0,
      cabinData: cabinData,
      currentDate: new Date(),
      mimDate: new Date(),
      maxDate: new Date(day().add(10, "years"))
    };
  },

  computed: {
    fromCity() {
      const stopId = this.planeSearchData.stopsIds[0];
      const stopN = this.planeSearchData.stops[stopId].n;
      return stopN;
    },
    toCity() {
      const stopId = this.planeSearchData.stopsIds[1];
      const stopN = this.planeSearchData.stops[stopId].n;
      return stopN;
    },
    departDate() {
      return this.planeSearchData.date[0];
    },
    arrivalDate() {
      return this.planeSearchData.date[1];
    }
  },
  created() {
    // 获取舱位等级
    this._getBudgetSpaceType();
    // 获取行程
    // this._getItineraryList();
    bus.$on('city',(item,index) => {
      let {n,c} = item;

      let data = this.planeSearchData;
      this._setStops(item)
      data.stopsIds.splice(index,1,c);
    })
  },
  methods: {
    chooseTrip(item) {
      let trip = item.trip ? item.trip : null;
      let tripId = trip ? trip.id : "";
      this._setTripId(tripId);
      this.tripName = item.name;
      // 如果选择了行程
      if(trip){
          this.defaulType = trip.tripType;
          this.tripType = this.defaulType;
          // 设置行程的类型
          this._setTripType(this.tripType);
          // 设置行程的时间
          this._setTripDate(trip);
          // 设置行程的目的地
          this._setTripPlace(trip);
          setLocal('fareOrgCode',trip.applyUserOrgCode);
      }else{
        this.planeSearchData = objDeepCopy(planeSearchData);
        this.chooseTripType(0);
        this.mimDate = new Date();
        this.maxDate = new Date(day().add(10, "years"));
      }
      this.showTrip = false;
    },

    showSelet() {
      this.showTrip = true;
    },

    chooseTripType(index) {
      this.tripType = index;
      this._setTripType(index);
    },
    chooseCity(index) {
      this.$router.push({
        path: `/cityList/${index}`
      });
    },
    showDatePicker(index) {
      this.showDate = true;
      this.currentSearchDateIndex = index;
      this.currentDate = new Date(this.planeSearchData.date[index]);

    },

    hideDatePicker() {
      this.showDate = false;
    },

    chooseDate(val) {
      const index = this.currentSearchDateIndex;
      const newDate = getDate2(val);
      const obj = {
        index,
        newDate
      };
      this.showDate = false;
      this._setDate(obj);
    },

    chooseSpaceType(index) {
      this.cabinData[index].value = !this.cabinData[index].value;
      if (!this.cabinData[index].changeable) {
        Toast("根据预算规则，您无权预订该舱位!");
        this.cabinData[index].value = false;
        return;
      }
      const record = this.cabinData.filter(item => {
        return item.value === true;
      });
      if (record.length < 1) {
        Toast("请至少选择一个仓位等级");
        this.cabinData[index].value = true;
      } else {
        // this.cabinData[index].value = !this.cabinData[index].value;
      }
    },
    // 查询
    query() {
      // 如果没有选择行程,让用户选择行程
      // if (!this.planeSearchData.tripId) {
      //   Dialog.alert({
      //     title: "提示",
      //     message: "请先选择行程",
      //     className: "check-tips"
      //   }).then(() => {
      //     this.showTrip = true;
      //   });
      //   return;
      // }
      
      // if (this.planeSearchData.stops.f)
     // console.log(this.planeSearchData);
      let fromId=this.planeSearchData.stopsIds[0]
       let toId=this.planeSearchData.stopsIds[1]
       let stops=this.planeSearchData.stops

      //判断是否有国外城市
      if (stops[fromId].region==1||stops[toId].region==1){
         console.log(123);
         this._handleCabinRequire();
         // this.tripType=1为单程，2为双程，3为多程和国外没关系
         this._setTripIntoLocal();
         this.$router.push("/domeSearchResult/0");
      } else{
         // 处理已经选择的舱位
         this._handleCabinRequire();
         // 保存行程记录到本地
         this._setTripIntoLocal();
         this.$router.push("/domeSearchResult/0");
      }


    },
    // 获取行程
    _getItineraryList() {
      getItineraryList().then(res => {
        if (res.success) {
          this._normalizeTripList(res.obj);
        }
      });
    },
    // 处理行程返回的数据
    _normalizeTripList(obj) {
      obj.forEach((item, i) => {
        this.tripList.push({
          trip: item,
          name: i + 1 + "." + item.itinerWorkType,
          subname: this._handleTripDate(item.itinerBegin, item.itinerEnd)
        });
      });
    },
    // 处理行程的开始和截止日期
    _handleTripDate(begin, end) {
      return getDate1(begin) + " ~ " + getDate1(end);
    },
    // 获取舱位等级
    _getBudgetSpaceType() {
      getBudgetSpaceType().then(res => {
        if (res.success) {
          this._handleSpaceType(res.obj.spaceType);
        }
      });
    },
    _handleSpaceType(type) {
      switch (type) {
        case "first":
          break;

        case "business":
          this._handleSpaceTypeVal(3);
          break;

        case "superTourist":
          this._handleSpaceTypeVal(3);
          this._handleSpaceTypeVal(2);
          break;
        default:
          this._handleSpaceTypeVal(3);
          this._handleSpaceTypeVal(2);
          this._handleSpaceTypeVal(1);
      }
    },
    _handleSpaceTypeVal(index) {
      this.cabinData[index].value = false;
      this.cabinData[index].changeable = false;
    },
    // 处理已经选择的舱位
    _handleCabinRequire() {
      const cabinArr = [];
      let cabinRequire = "";
      this.cabinData.forEach(item => {
        if (item.value) {
          cabinArr.push(item.data);
        }
      });
      cabinRequire = cabinArr.join(",");
      this._setCabin(cabinRequire);
    },
    // 保存行程记录到本地
    _setTripIntoLocal() {
      let record = {
        date: [],
        dateBetween:this.dateBetween,
        tripType: this.tripType,
        cabinRequire: this.planeSearchData.cabinRequire,
        stops: [],
        tripId: this.planeSearchData.tripId
      };
      this._setTripInfo(record);
      setLocal("record", JSON.stringify(record));
      setLocal("airlines", JSON.stringify(this.airlines));
    },
    // 给行程记录填充信息
    _setTripInfo(record) {
      const { date, stops, stopsIds } = this.planeSearchData;
      const multiStops = [...stopsIds];
      switch (this.tripType) {
        case 0:
          record.date.push(date[0]);
          record.stops.push([stops[stopsIds[0]], stops[stopsIds[1]]]);
          break;
        case 1:
          record.date.push(date[0], date[1]);
          record.stops.push([stops[stopsIds[0]], stops[stopsIds[1]]]);
          break;
        default:
          record.date = date;
          this._handleMultiInfo(multiStops, record, stops);
      }
    },
    // 处理多程的行程信息
    _handleMultiInfo(ids, record, stops) {
      const tripLength = ids.length / 2;
      const newArr = [];
      for (let i = 0; i < tripLength; i++) {
        newArr.push(ids.splice(0, 2));
      }
      newArr.forEach(item => {
        record.stops.push([stops[item[0]], stops[item[1]]]);
      });
    },
    // 选择行程后，重新设置日历时间
    _setTripDate(trip){
      let [nowDate,beginDate,endDate] = [
        new Date(),
        new Date(trip.itinerBegin),
        new Date(trip.itinerEnd)
      ]
      beginDate = nowDate > beginDate ? nowDate:beginDate;
      this.mimDate = beginDate;
      this.maxDate = endDate;
      this.dateBetween = [getDate2(this.mimDate),getDate2(this.maxDate)]
      // 如果不是多程
      const newDate = [];
      if(trip.tripType !== 2){
        newDate[0] = getDate2(beginDate);
        newDate[1] = getDate2(endDate);
      }else{
        // 如果是多程逻辑不一样
        const tripData = trip.tmcItineraryTrips;
        console.log(tripData)
        tripData.forEach((item,index) => {
          if(new Date(item.itinerBegin) < nowDate){
            item.itinerBegin = nowDate;
          }
          newDate.push(getDate2(item.itinerBegin));
        })
      }
      this.planeSearchData.date = newDate;
    },
    // 选择行程后，重新设置行程的目的地
    _setTripPlace(trip){
      const tripData = trip.tmcItineraryTrips;
      const newStopsIds = [];
        for(let i = 0;i < tripData.length;i++){
          this._handleStopsData(tripData[i].itinerFrom,newStopsIds);
          this._handleStopsData(tripData[i].itinerTo,newStopsIds);
        }
      this.planeSearchData.stopsIds = newStopsIds;
    },
    // 根据行程里面的目的地，给planeSearchData修改stopsId,stops的数据
    _handleStopsData(name,stopsIds){
      const city = cityList.find((item) => {
        return item.n === name
      })
      this._setStops(city);
      stopsIds.push(city.c)
    },
    _setStops(city){
      for(let key in this.planeSearchData.stops){
        if(key === city.c){
          return ;
        }
      }
      this.planeSearchData.stops[city.c] = {
        c:city.c,
        n:city.n,
        region:city.region
      }
    },
    _setDate(newData){
      const {index,newDate} = newData;
      this.planeSearchData.date.splice(index,1,newDate);
    },
    _setTripType(newTripType) {
      this.planeSearchData.tripType = newTripType;
    },
    _setCabin(cabinrequire) {
      this.planeSearchData.cabinRequire = cabinrequire;
    },
    _setTripId(tripId) {
      this.planeSearchData.tripId = tripId;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.plane-search {
  y-view();

  .search-container {
    scrolling()
    flex:1
    .trip-choosed {
      x-middle();
      padding: 0 0.2rem;
      margin-bottom: 0.1rem;
      background-color: $color-white;
      line-height: 3;

      .trip-title {
        flex: 1;
        color: $color-text;
      }
    }

    .flight-detail {
      margin-bottom: 0.1rem;
      background-color: $color-white;

      .reset >>> .van-tabs__line {
        background-color: $color-text-active;
      }

      .reset >>> .van-tab--active {
        color: $color-text-active;
      }

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
      }
    }

    .cabin-wrapper {
      padding: 0.2rem 0.1rem 0.2rem 0.2rem;
      background-color: $color-white;

      .title {
        margin-bottom: 0.4rem;
      }

      .cabin-require {
        x-middle();
        text-align: center;

        & > .active-item {
          color: $color-white;
          background-color: $color-text-active;
        }

        .item {
          flex: 1;
          padding: 0.1rem 0;
          margin-right: 0.1rem;
          border: 1px solid #e1e1e1;
          border-radius: 5px;
        }
      }
    }

    .btn-query {
      padding: 0.2rem;
      border-radius: 5px;
      margin: 1rem 0.2rem;
      font-size: 0.32rem;
      color: $color-white;
      text-align: center;
      background-color: $color-bg-high;
    }
  }
}
</style>


