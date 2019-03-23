<template>
  <div class="dome-detail">
    <HeaderTitle 
      title="订单详情" 
      :btnLeft="true"
      @back="goback"
    />
    <div class="content">
      <div class="ticket-wrapper" v-for="(item,index) in orderDetails" :key="index">
        <PlaneTicket :orderDetail="item" />
      </div>
      <!--status=1说明可以取消-->
      <div class="btn-cancel" 
        v-if="orderDetails.length > 0 && orderDetails[0].status === 1"
      >
        <BtnCommon @click="cancelFlight" />
      </div>
      <!--<div @click="cccc">点击测试</div>-->
    </div>
  </div>
</template>

<script>
import { getDomeFlightorderDetail,cancelFlight } from "./api.js";
import bus from 'common/js/bus.js';
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import BtnCommon from "components/BtnCommon/BtnCommon";
import PlaneTicket from "./PlaneTicket";
import { gobackMixin } from 'common/js/mixins.js';
import { Toast } from 'vant';

export default {
  components: {
    HeaderTitle,
    PlaneTicket,
    BtnCommon
  },
  mixins:[gobackMixin],
  props: ["index","detailId"],
  created() {
    this._getDomeFlightorderDetail();
  },
  data() {
    return {
      orderDetails: []
    };
  },
  methods: {
    async cancelFlight() {
     const reuslt = await cancelFlight(this.detailId);
     console.log(reuslt)
     if(reuslt.success){
       this.orderDetails.forEach(item => {
         item.status = 4;
       }) 
       Toast('取消成功');
       bus.$emit('cancel',this.index);  
     }else{
       Toast(reuslt.msg);
     }
    },
    async _getDomeFlightorderDetail() {
      const orderObj = await getDomeFlightorderDetail(this.detailId);
      if (orderObj.success) {
        this.orderDetails = orderObj.obj;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.dome-detail {
  full-fixed(100);
  y-view();
  background-color: $color-body;

  .content {
    padding: 0.05rem 0.2rem;
    flex:1;
    scrolling();

    .ticket-wrapper{
      margin-bottom:0.01rem;
    }
    .btn-cancel {
      margin-top: 0.3rem;
    }
  }
}
</style>


