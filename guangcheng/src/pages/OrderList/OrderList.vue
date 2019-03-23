<template>
  <div class="order-list">
    <HeaderTitle 
      title="订单列表" 
      :btnLeft="true" 
      @back="goback"
    />
    <van-tabs class="reset" @click="getCurrentComponent">
      <van-tab v-for="tab in orderTabs" :title="tab.title" :key="tab.title" />
    </van-tabs>
    <div class="list-view">
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import OrderListDome from "./OrderListDome";
import OrderListInter from "./OrderListInter";
import { gobackMixin } from 'common/js/mixins.js';
import { mapMutations,mapGetters } from 'vuex';
export default {
  name:'order',
  components: {
    HeaderTitle,
    OrderListDome,
    OrderListInter
  },
  mixins:[gobackMixin],
  data() {
    return {
      orderTabs: [
        {
          title: "国内机票",
          content: "OrderListDome"
        },
        // {
        //   title: "国际机票",
        //   content: "OrderListInter"
        // }
      ],
      currentComponent: "OrderListDome"
    };
  },
  computed:{
    ...mapGetters({
      includes:'includePageNames'
    })
  },
  methods: {
    ...mapMutations({
      deletePage:'DELETE_ALIVEPAGE'
    }),
    goback(){
      this.$router.push('/main');
    },
    getCurrentComponent(index) {
      this.currentComponent = this.orderTabs[index].content;
    }
  },
  beforeRouteLeave(to,from,next){
    if(to.name === 'mainBook'){
      const index = this.includes.indexOf(from.name);
      index > -1 && this.deletePage(index);
    }
    next();
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.order-list {
  y-view();

  .reset >>> .van-tabs__line {
    background-color: $color-text-active;
  }

  .reset >>> .van-tab--active {
    color: $color-text-active;
  }

  .list-view {
    flex: 1;
    y-view();
  }
}
</style>


