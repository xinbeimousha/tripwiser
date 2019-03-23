<template>
    <div class="page">
        <ul class="myul">
            <van-pull-refresh class="PullRefresh" v-model="isLoading" @refresh="onRefresh">
                <van-list v-model="loading" :finished="finished" @load="onLoad">
                    <li class="myli" v-for="(item,index) in item" :key="index" v-if="item.state != -1" @click="getTripDetail(item)">
                        <ApprovalItem v-bind:item="item" />
                    </li>
                    <p class="no-result" v-if="hasNoOrder">您没有未审批的流程</p>
                    <p class="no-more" v-if="hasNoMore">没有更多数据了</p>
                    <!-- <div class="overtime-none">
                        <p>审批过的流程如未通过</p>
                        <p>超过15天不显示的哦</p>
                    </div> -->
                </van-list>
            </van-pull-refresh>
        </ul>
    </div>    
</template>
<script>
import ApprovalItem from "components/ApprovalItem/ApprovalItem";
import { getApproval } from "api/getApproval";
import { getDate2 } from "common/js/day.js";
import { approvalStatus } from "common/js/data.js";
export default {
  components: {
    ApprovalItem
  },
  data() {
    return {
      item: [],
      isdetail: false,
      page: 1,
      isPull: false, // 新加是否下拉
      isLoading: false, //是否处于下拉刷新状态
      loading: false, //是否处于加载状态
      finished: false, //是否已加载完所有数据
      hasNoOrder: false, // 是否有数据
      hasNoMore: false // 是否有更多数据
    };
  },
  methods: {
    getTripDetail(item) {
      this.$router.push({
        path: "/tripDetail",
        query: { tripId: item.id }
      });
    },
    async getApprovalData(showLoading) {
      let Page = {
        page: this.page,
        flowState: 0,
        pageSize: 10
      };
      const result = await getApproval(Page, showLoading);
      const obj = result.obj;
      console.log(obj);
      this.loading = false;
      if ((!result.success || !obj || obj.length < 1) && this.page === 1) {
        this.hasNoOrder = true;
        this.finished = true;
        return;
      }
      if (this.isPull) {
        this.item = [];
        this.isPull = false;
        this.isLoading = false;
        this.finished = false;
        this.hasNoMore = false;
      }
      if (!obj || obj.length < 10) {
        this.finished = true;
        this.hasNoMore = true;
      }
      if (obj && obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          obj[i].itinerBeginDate = getDate2(obj[i].itinerBegin);
          obj[i].itinerEndDate = getDate2(obj[i].itinerEnd);
          obj[i].headText = obj[i].applyUserRealName;
          if (obj[i].othersRealName) {
            let newOthersRealName = obj[i].othersRealName.split(",");
            for (let j = 0; j < newOthersRealName.length; j++) {
              obj[i].headText += "、" + newOthersRealName[j];
            }
          }
          obj[i].state = obj[i].flowState * 1;
          // if (new Date(obj[i].itinerEnd) < new Date() && obj[i].state != 1) {
          //   obj[i].state = 4; //已过期
          //   if (
          //     (new Date().getTime() - new Date(obj[i].itinerEnd).getTime()) /
          //       1000 /
          //       60 /
          //       60 /
          //       24 >
          //     15
          //   ) {
          //     obj[i].state = -1; //超过15天不显示
          //   }
          // }
          obj[i].statusText = approvalStatus[obj[i].state];
          this.item.push(obj[i]);
        }
      }
      this.page++;
    },
    onLoad() {
      setTimeout(() => {
        this.getApprovalData(false);
      }, 500);
    },
    onRefresh() {
      setTimeout(() => {
        this.isPull = true;
        this.page = 1;
        this.getApprovalData(false);
      }, 500);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.page {
  flex: 1;
  y-view();

  .myul {
    flex: 1;
    y-view();
    overflow: hidden;
    overflow-y: scroll;

    .PullRefresh {
      flex: 1;
      scrolling();

      .myli {
        border-top: 1px solid $color-solid;
        padding: 0 1em;
        background-color: #fff;
        margin-bottom: 0.6em;
        border-bottom: 1px solid $color-solid;
      }

      .no-result {
        font-size: 0.8em;
        margin-top: 1rem;
        color: $color-text-h;
        text-align: center;
      }

      .no-more {
        font-size: 0.8em;
        margin: 0.2rem 0;
        color: $color-text-h;
        text-align: center;
      }

      .overtime-none {
        text-align: center;
        font-size: 0.8em;
        color: $color-text-h;
        padding-top: 8em;
        line-height: 1.6em;
      }
    }
  }
}
</style>
