<template>
    <div style="display: flex;flex-direction: column;height: 100%;">
        <HeaderTitle title="消息通知"
                     :btnLeft="true"
                     :btnRight="false"
                     className="fa-plus"
                     @back="fanhTap"
        />
        <div style="flex: 1;height: 100%;overflow: scroll;"
             ref="list"
             id="list"
             v-scroll>
            <!--消息通知-->
            <van-list class="apply-yes-list"
                  v-model="loading"
                  :finished="finished"
                  @load="onload"

            >
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                    <div class="msg van-clearfix"
                         @click="divTap(item)"
                         v-for="(item,index) in obj"
                         :key="index">
                        <div class="timed">
                            {{item.createTime}}
                        </div>
                        <div class="msg-left">
                            <img src="./me_msg_detail.png" alt="">
                        </div>
                        <div class="msg-right">
                            <div class="notify">
                                <p>{{item.title}}</p>
                                <p>
                                    {{item.msgContent}}</p>
                            </div>
                        </div>
                    </div>
                    <p class="no-result" v-if="hasNoOrder">您当前没有消息通知</p>
                    <p class="no-more" v-if="hasNoMore">没有更多数据了</p>
                </van-pull-refresh>
            </van-list>
            <!--列表-->
        </div>

    </div>
</template>


<script>
   import HeaderTitle from 'components/HeaderTitle/HeaderTitle.vue';
   // 引入后台接口
   import {getMeMessage} from "api/getMeApi";


   export default {
      name: "MainPageMeMessage",
      components: {
         HeaderTitle
      },
      data() {
         return {
            // tripDatas: [],//数组
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
            obj: [],//获取的数据
         }
      },
      methods: {
         fanhTap() {
            this.$store.commit('DELETE_ALIVEPAGE', 2)
            //清除跳转回来的scroll值
            localStorage.removeItem('scrollChange')
            this.$router.go(-1)

         },
         //点击消息列表跳转
         divTap(item){
            console.log(item.msgType,item.id,item.itineraryId);
         localStorage.setItem('scrollChange', this.$refs.list.scrollTop)
           switch (item.msgType) {
               case 1://机票通知
                  if (!item.itineraryId) {
                     return;
                  }
                  this.$router.push({
                     path: `/orderDetailDome/0/${item.itineraryId}`,
                  });
                  break;
               case 6://出差申请已通过通知
                  if (!item.itineraryId) {
                     return;
                  }
                  this.$router.push({
                     path: "/tripDetail",
                     query: {tripId: item.itineraryId}
                  });
                  break;
               case 7://出差审批通知
                  if (!item.itineraryId) {
                     return;
                  }
                  this.$router.push({
                     path: "/tripDetail",
                     query: {tripId: item.itineraryId}
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
         getListAdd() {

            getMeMessage(this.page).then(res => {
               console.log(res);
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
               if (res.obj) {
                  if (this.page.page > 1) {
                     res.obj.forEach((value, index) => {
                        this.obj.push(value)
                     })


                  } else {
                     this.obj = res.obj
                  }


                  this.page.page += 1;
               } else if ((!res.success || !res || res.length < 1) && this.page === 1) {
                  this.finished = true;
                  this.hasNoOrder = true;
                  this.hasNoMore = true
               } else if (res.length < 10) {
                  this.finished = true;
                  this.hasNoMore = true;
               }
               else {
                  this.finished = true;
                  this.hasNoMore = true;
               }

            })


         },
         //list加载事件
         onload() {
            // 异步更新数据
            setTimeout(() => {

               this.getListAdd()

            }, 500);
         },
         // 下拉刷新
         onRefresh() {
            setTimeout(() => {
               this.isPull = true;
               this.page.page = 1;
               this.getListAdd();
            }, 1000)

         }


      },
      directives: {
         scroll(el) {
            console.log(el.scrollTop);
         }
      },
      mounted() {
         console.log('mounted');
      },
      //只有缓存的时候才有用
      activated() {
         console.log('activeid');
         console.log(localStorage.getItem('scrollChange'));
         if (localStorage.getItem('scrollChange')) {
            this.$refs.list.scrollTop = localStorage.getItem('scrollChange')
         }
      }
      // beforeRouteEnter(to,from,next){
      //    if (from.name==='tripDetail'){
      //       if (localStorage.getItem('scrollChange')){
      //          var abc=localStorage.getItem('scrollChange');
      //          console.log(abc);
      //          // document.getElementById('list').scrollTop=abc
      //       }
      //    }
      //    next()
      //
      // }

      // activated(){
      //
      //    if (this.$route.meta.keepAlive){
      //       console.log(123);
      //       console.log(this.$route.meta.keepAlive);
      //       this.isPull = true;
      //       this.page.page=1;
      //       this.getListAdd();
      //    }
      // }
   }


</script>

<style scoped lang="stylus" type="text/stylus">
    @import '~common/style/mixin.styl';
    @import '~common/style/variable.styl';
    /*头部样式*/
    .headerTitle {
        position fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index 100;

    }

    .apply-yes-list {

    }

    .msg {
        margin-top: 0.3rem;
        padding: 0 0.3rem;

        .timed {
            text-align: center;
            padding-bottom: 15px;
            font-size: 0.28rem;
            color: rgb(154, 154, 154);

        }

        .msg-left {
            float: left;
            width: 10%;
            height: 100%;
            display: flex;
            align-items: center;

            img {
                width: 100%;
            }
        }

        .msg-right {
            width: 84%;
            margin-left: 10px;
            float: left;
            font-size: 0.28rem;
            color: rgb(154, 154, 154);

            .notify {
                border: 1px solid #C8C8C8;
                border-radius: 8px;
                background-color: #fff;
                padding: 7px;

                p:nth-child(1) {
                    font-size: 0.32rem;
                    color: rgb(84, 84, 84);
                    padding-bottom: 5px;
                }

                p:nth-child(2) {

                }

            }
        }
    }

    /*没有更多的数据*/
    .no-more {
        margin: 0.2rem 0;
        color: $color-text-h;
        text-align: center;
    }

    /*没有数据了*/
    .no-result {
        margin-top: 1rem;
        color: $color-text-h;
        text-align: center;
    }

</style>