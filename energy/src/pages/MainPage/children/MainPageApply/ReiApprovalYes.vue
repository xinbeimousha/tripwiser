<template>
    <div class="apply-yes">
        <van-list class="apply-yes-list" v-model="loading" :finished="finished" @load="onload">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div class="apply-yes-item"
                     v-for="(tripData,index) in tripDatas"
                     :key="index"
                     @click="tripDetail(tripData.id,tripData.reimburseId)"
                >
                    <ReiSementItem :tripData="tripData"/>
                </div>
                <p class="no-result" v-if="hasNoOrder">您没有已审批的行程</p>
                <p class="no-more" v-if="hasNoMore">没有更多数据了</p>
            </van-pull-refresh>
        </van-list>
    </div>
</template>

<script>
   import { getApprovalYes } from "./api.js";
   import ReiSementItem from "./ReiSementItem";
   import bus from "common/js/bus.js";

   export default {
      components: {
         ReiSementItem
      },
      data() {
         return {
            tripDatas: [],
            page: 1,
            flowState: 1,
            isPull: false, // 是否下拉
            isLoading: false, //是否处于下拉刷新状态
            loading: false, //是否处于加载状态
            finished: false, //是否已加载完所有数据
            hasNoOrder: false, // 是否有数据
            hasNoMore: false // 是否有更多数据
         };
      },
      methods: {
         async _getItinerInfo() {
            const result = await getApprovalYes(this.flowState, this.page);
            const obj = result.obj;
            console.log(result);
            this.loading = false;
            if ((!result.success || !obj || obj.length < 1) && this.page === 1) {
               this.hasNoOrder = true;
               this.finished = true;
               return;
            }
            if (this.isPull) {
               this.orderDatas = [];
               this.tripDatas=[];
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
               obj.forEach(item => {
                  this.tripDatas.push(item);
               });
            }
            this.page++;
         },
         onload() {
            setTimeout(() => {
               this._getItinerInfo()
            }, 500);
         },
         onRefresh() {
            setTimeout(() => {
               this.isPull = true;
               this.page = 1;
               this._getItinerInfo();
            }, 500);
         },
         tripDetail(tripId,reimburseId){
            this.$router.push({
               path:'/reiSementYesDetail',
               query:{
                  itineraryId:tripId,//行程id
                  reimburseId:reimburseId,//报销id

               }
            })
         }
      }
   };
</script>

<style lang="stylus" scoped>
    @import '~common/style/mixin.styl';
    @import '~common/style/variable.styl';

    .apply-yes{
        flex: 1;
        y-view();

        .apply-yes-list{
            flex:1;
            scrolling();

            .apply-yes-item{
                background-color :#fff;
                padding:0 0.2rem;
                margin-bottom:0.2rem;
            }
            .no-result {
                margin-top: 1rem;
                color: $color-text-h;
                text-align: center;
            }

            .no-more {
                margin: 0.2rem 0;
                color: $color-text-h;
                text-align: center;
            }
        }
    }

</style>


