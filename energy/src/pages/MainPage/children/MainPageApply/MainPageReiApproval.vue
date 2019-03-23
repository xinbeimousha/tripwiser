<template>
    <div class="trip-apply">
        <HeaderTitle title="报销审批" :btnLeft="true"  className="fa-plus" @back="goBack"/>
        <van-tabs @click="getCurrComponent" v-model="active">
            <van-tab>
                <div slot="title">已审批</div>
            </van-tab>
            <van-tab>
                <div slot="title">未审批</div>
            </van-tab>
        </van-tabs>
        <div class="scroll-main">
            <keep-alive>
                <component :is="currentComponent" />
            </keep-alive>
        </div>
    </div>
</template>

<script>
   import HeaderTitle from "components/HeaderTitle/HeaderTitle";
   import ReiApprovalYes from "./ReiApprovalYes.vue";
   import ReiApprovalNo from "./ReiApprovalNo.vue";
   import bus from 'common/js/bus.js';
   import { mapMutations,mapGetters } from 'vuex';
   export default {
      name:'tripApply',
      components: {
         HeaderTitle,
         ReiApprovalYes,
         ReiApprovalNo
      },
      data(){
         return {
            tripTabs:[
               {
                  name:'ReiApprovalYes'
               },
               {
                  name:'ReiApprovalNo'
               }
            ],
            currentComponent:'ReiApprovalYes',
            active:0
         }
      },
      computed:{
         ...mapGetters({
            includes:'includePageNames'
         })
      },
      methods: {
         ...mapMutations({
            setPage:'SET_ALIVEPAGE',
            deletePage:'DELETE_ALIVEPAGE'
         }),
         goBack() {
            this.$router.push({name:"mainApply"})
         },
         getCurrComponent(index){
            this.currentComponent = this.tripTabs[index].name;
         }
      },
      // beforeRouteEnter(to,from,next){
      //    next(vm => {
      //       if(from.name === 'tripAdd'){
      //          vm.active = 1;
      //          vm.currentComponent = 'TripApplyNo';
      //       }
      //    })
      // },
      // beforeRouteLeave(to,from,next){
      //    if(to.name === 'mainApply'){
      //       const index = this.includes.indexOf(from.name);
      //       index > -1 && this.deletePage(index);
      //    }else if(to.name === 'tripAdd'){
      //       this.setPage(to.name)
      //    }
      //    next();
      // }
   };
</script>

<style lang="stylus" scoped>
    @import '~common/style/mixin.styl';
    @import '~common/style/variable.styl';

    .trip-apply {
        y-view();

        .scroll-main {
            flex: 1;
            y-view();
        }
    }
</style>


