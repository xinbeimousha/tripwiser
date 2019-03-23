<template>
    <div class="tripApproval">
        <HeaderTitle title="行程审批" @back="goback" :btnLeft="true"/>
        <div class="content">
            <van-tabs class="reset" @click="getCurrentComponent">
                <van-tab>
                    <div slot="title">
                        <span class=""></span>已审批
                    </div>
                </van-tab>
                <van-tab>
                    <div slot="title">
                        <span class=""></span>未审批
                    </div>
                </van-tab>

            </van-tabs>
            <div class="list-view">
                <keep-alive>
                    <component :is="currentComponent" />
                </keep-alive>
            </div>    
        </div>    
    </div>    
</template>
<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import { gobackMixin } from "common/js/mixins.js";
import Approvaled from "./Approvaled";
import Approvaling from "./Approvaling";
export default {
  mixins: [gobackMixin],
  components: {
    HeaderTitle,
    Approvaling,
    Approvaled
  },
  data() {
    return {
      Tabs: [
        {
          title: "已审批",
          content: "Approvaled"
        },
        {
          title: "未审批",
          content: "Approvaling"
        }
      ],
      currentComponent: "Approvaled"
    };
  },
  methods: {
    getCurrentComponent(index) {
      this.currentComponent = this.Tabs[index].content;
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';
.tripApproval {
    flex 1
    y-view();

    .content {
        flex: 1;
        y-view();

        .list-view {
            flex: 1;
            y-view();
        }

        .reset >>> .van-tabs__line {
            background-color: $color-text-active;
        }

        .reset >>> .van-tab--active {
            color: $color-text-active;
        }
    }
}
</style>
