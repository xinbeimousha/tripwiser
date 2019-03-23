<template>
  <div class="my-apply">
    <HeaderTitle 
      title="我的申请"
      :btnRight="true"
      :showMsg="true"
    />
    <div class="banner-wrap">
      <div class="banner">
        <img src="./apply_index_banner.png" alt="">
      </div>
    </div>
    <div class="content">
      <div class="apply">
        <div class="trip">
          <img src="./apply_index_one.png" alt="">
          <div class="group" @click="linkToTripApply">
            <p class="title">
              行程申请
              <span class="msg-hint" v-if="messageNotice.applyMessage > 0">{{messageNotice.applyMessage}}</span>
            </p>
            <p class="text">新差旅从这里开始</p>
          </div>
        </div>
        <div class="reim" @click="reiSement">
          <img src="./apply_index_two.png" alt="">
          <div class="group">
            <p class="title" style="color: #000;">报销申请</p>
            <p class="text">费用报销清晰明了</p>
          </div>
        </div>
      </div>
      <div class="approval" v-show="isChecker">
        <div class="trip"  @click="linkToTripApprove">
          <img src="./apply_index_three.png" alt="">
          <div class="group">
            <p class="title">
              行程审批
              <span class="msg-hint" v-if="messageNotice.approveMessage > 0">{{messageNotice.approveMessage}}</span>
            </p>
            <p class="text">高效管理差旅行程</p>
          </div>
        </div>
        <div class="reim" @click="ReiApproval">
          <img src="./apply_index_four.png" alt="">
          <div class="group">
            <p class="title" style="color: #000;">报销审批</p>
            <p class="text">随时掌握差旅费用</p>
          </div>
        </div>
      </div>
    
    <div class="msg-title">
        <div class="line"></div>
        <div class="title">最新消息</div>
        <div class="line"></div>
    </div>
    <div class="msg-content">
      <van-list v-model="loading" :finished="finished" @load="onload">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <ul class="myul">
        <li class="myli" v-for="(item,index) in obj" :key="index" @click="divTap(item)">
          <div class="outcontent">
            <div class="msg-detail">
              <div class="message">{{item.title}}</div>
              <div class="msg">{{item.msgContent}}</div>
            </div>
          </div>
        </li>
        <p class="no-result" v-if="hasNoOrder">您当前没有消息通知</p>
        <p class="no-more" v-if="hasNoMore">没有更多数据了</p>
      </ul>
      </van-pull-refresh>
      </van-list>
    </div>
  </div>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import { getLocal } from "common/js/storage.js";
import { readMsg } from "api/getMessageNotice.js";
import { getMeMessage } from "api/getMeApi.js";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "mainApply",
  components: {
    HeaderTitle
  },
  data() {
    return {
      isChecker:false,
      flowState: 1,
      isPull: false, // 是否下拉
      isLoading: false, //是否处于下拉刷新状态
      loading: false, //是否处于加载状态
      finished: false, //是否已加载完所有数据
      hasNoOrder: false, // 是否有数据
      hasNoMore: false, // 是否有更多数据
      page: {
        page: 1,
        pageSize: 10
      },
      obj: [] //获取的数据
    }
     
   
  },
  computed: {
    ...mapGetters(["messageNotice"])
  },
  created() {
    const userInfo = JSON.parse(getLocal("userInfo"));
    this.isChecker = userInfo.isChecker;
    console.log(this.isChecker);

     const checker = JSON.parse(getLocal('userInfo')).isApplyer;
     this.isApplyer=checker
  },
  methods: {
    ...mapMutations({
      getAllMessage: "GET_ALLMESSAGE",
      getApplyMessage: "GET_APPLYMESSAGE",
      getApproveMessage: "GET_APPROVEMESSAGE"
    }),
    async linkToTripApply() {
      if (this.messageNotice.applyMessage > 0) {
        const readApply = await readMsg(6);
        const allMsg = this.messageNotice.allMessage - readApply;
        this.getApplyMessage(0);
        this.getAllMessage(allMsg);
      }
      this.$router.push("/tripApply");
    },
    async linkToTripApprove() {
      if (this.messageNotice.approveMessage > 0) {
        const readApprove = await readMsg(7);
        const allMsg = this.messageNotice.allMessage - readApprove;
        this.getApproveMessage(0);
        this.getAllMessage(allMsg);
      }
      this.$router.push('/tripapproval')
    },
     getListAdd() {
        getMeMessage(this.page).then(res => {
           // 加载状态结束
           this.loading = false;
           // 数据全部加载完成

           // 是否是下拉
           if (this.isPull) {
              this.obj = [];
              this.isPull = false;
              this.isLoading = false;
              this.finished = false;
              this.hasNoMore = false;
           }
           console.log(res);
           if (res.obj) {
              if (this.page.page > 1) {
                 res.obj.forEach((value, index) => {
                    this.obj.push(value);
                 });
              } else {
                 this.obj = res.obj;
              }

              this.page.page += 1;
           } else if (
               (!res.success || !res || res.length < 1) &&
               this.page === 1
           ) {
              this.finished = true;
              this.hasNoOrder = true;
              this.hasNoMore = true;
           } else if (res.length < 10) {
              this.finished = true;
              this.hasNoMore = true;
           } else {
              this.finished = true;
              this.hasNoMore = true;
           }
        });
     },
     divTap(item) {
        switch (item.msgType) {
           case 1: //机票通知
              if (!item.itineraryId) {
                 return;
              }
              this.$router.push({
                 path: `/orderDetailDome/0/${item.itineraryId}`
              });
              break;
           case 6: //出差申请已通过通知
              if (!item.itineraryId) {
                 return;
              }
              this.$router.push({
                 path: "/tripDetail",
                 query: { tripId: item.itineraryId }
              });
              break;
           case 7: //出差审批通知
              if (!item.itineraryId) {
                 return;
              }
              this.$router.push({
                 path: "/tripDetail",
                 query: { tripId: item.itineraryId }
              });
              break;

           case 5://待审批通知
              if (!item.itineraryId) {
                 //行程通知
                 return;
              }
              this.$router.push({
                 path:'/reiSementYesDetail',
                 query:{
                    itineraryId:'',//行程id
                    reimburseId:item.itineraryId,//报销id

                 }
              })
              break;

           case 10://退审通知
              if (!item.itineraryId) {
                 //行程通知
                 return;
              }
              if (!item.id) {
                 // 审批通知
                 return;
              }
              this.$router.push({
                 path:'/reiSementYesDetail',
                 query:{
                    itineraryId:'',//行程id
                    reimburseId:item.itineraryId,//报销id

                 }
              })
              break;
        }
     },
     onload() {
        // 异步更新数据
        setTimeout(() => {
           this.getListAdd();
        }, 500);
     },
     onRefresh() {
        setTimeout(() => {
           this.isPull = true;
           this.page.page = 1;
           this.getListAdd();
        }, 1000);
     },
     //跳转报销申请
     reiSement(){
       this.$router.push({path:'/reiSement'})
     },
     //跳转报销审批
     ReiApproval(){
        this.$router.push({path:'/reiApproval'})
     }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/mixin.styl';
@import '~common/style/variable.styl';

.my-apply {
  y-view();
  flex: 1;

  .banner-wrap {
    padding-top: 40%;
    position: relative;

    .banner {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }

  .content {
    y-view();
    padding: 0.2rem;
    padding-bottom:0;
    color: $color-text-h;
    font-size: 14px;

    .msg-title {
      x-middle();
      margin: 0.6em 0;

      .line {
        flex: 1;
        border-1px-top-dashed(#999);
      }

      .title {
        margin: 0 0.7em;
        color: black;
      }
    }

    .msg-content {
      scrolling();
      flex: 1;
      y-view();

      .myul {
        flex: 1;

        .myli {
          margin-bottom: 1em;

          .msg-detail {
            background-color: $color-white;
            border: 1px solid #DDD;
            border-radius: 0.8em;
            padding: 0.625em 0.38em 0.625em 0.77em;
            font-size: 0.8em;

            .message {
              color: black;
            }
          }
        }
        .reim img{
          /*filter:grayscale(100%);*/
        }
        .no-more{
          text-align center
        }
      }
    }

    img {
      width: 0.8rem;
    }

    .text {
      font-size: 10px;
    }

    .apply, .approval {
      x-middle();
      margin-bottom: 0.2rem;

      .trip, .reim {
        flex: 1;
        x-middle();
      }

      .reim img {
        /*filter: grayscale(100%);*/
      }

      .trip {
        .group {
          position: relative;

          .title {
            color: #000;

            .msg-hint {
              position: absolute;
              top: auto;
              right: auto;
              width: 0.35rem;
              height: 0.35rem;
              font-size: 0.2rem;
              line-height: 0.35rem;
              overflow: hidden;
              background-color: #FE3C0F;
              color: #fff;
              text-align: center;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}
</style>


