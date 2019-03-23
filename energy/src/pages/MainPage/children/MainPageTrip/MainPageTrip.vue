<template>
  <div class="order-list">
    <HeaderTitle title="我的行程" :btnRight="true" :showMsg="true"/>
    <van-tabs class="reset" @click="getCurrentComponent">
      <van-tab>
        <div slot="title">
          <span class="triping"></span>进行中
        </div>
      </van-tab>
      <van-tab>
        <div slot="title">
          <span class="tripPlan"></span>计划中
        </div>
      </van-tab>
      <van-tab>
        <div slot="title">
          <span class="triped"></span>已完成
        </div>
      </van-tab>
    </van-tabs>
    <div class="list-view">
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import MainPageTriping from "./MainPageTriping";
import MainPageTripPlan from "./MainPageTripPlan";
import MainpageTriped from "./MainPageTriped";

export default {
  name:'trip',
  components: {
    HeaderTitle,
    MainPageTriping,
    MainPageTripPlan,
    MainpageTriped
  },
  data() {
    return {
      orderTabs: [
        {
          title: "进行中",
          content: "MainPageTriping"
        },
        {
          title: "计划中",
          content: "MainPageTripPlan"
        },
        {
          title: "已完成",
          content: "MainpageTriped"
        }
      ],
      currentComponent: "MainPageTriping"
    };
  },
  methods: {
    getCurrentComponent(index) {
      this.currentComponent = this.orderTabs[index].content;

    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';
@import '~common/style/base.styl';

.order-list {
  y-view();

  .reset {
    .on{
      
    }
    .triping {
      display inline-block
      width: 1.25em;
      height: 1.25em;
      vertical-align middle
      background-repeat: no-repeat;
      background-size: cover;
      margin-right: 0.4em;
      background-image: url('./travel_index_tab1_ing.png');
    }

    .tripPlan {
      display inline-block
      width: 1.25em;
      height: 1.25em;
      vertical-align middle
      background-repeat: no-repeat;
      background-size: cover;
      margin-right: 0.4em;
      background-image: url('./travel_index_tab2_ing.png');
    }

    .triped {
      display inline-block
      width: 1.25em;
      height: 1.25em;
      vertical-align middle
      background-repeat: no-repeat;
      background-size: cover;
      margin-right: 0.4em;
      background-image: url('./travel_index_tab3_ing.png');
    }
  }

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


