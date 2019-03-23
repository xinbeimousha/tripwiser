<template>
    <div class="section">
        <div class="sectionDetail" @click="getTripDetail(item)">
            <div class="sectionhead">
                <div class="sectiontitle">
                    <div class="sectionname">{{item.headText}}</div>
                    <div class="workfor">--{{item.itinerWorkType}}</div>
                </div>
                <div class="sectiontime">{{getDt(item.createTime)}}</div>
            </div>
            <div class="sectionbody">
                <div class="left">
                    <div class="main-txt">{{item.itinerFrom}}</div>
                    <div class="gray">{{item.itinerBeginDate}}</div>
                </div>
                <div class="center">
                    <img src="./trip_apply_one_way.png"  v-if="item.tripType==0 || item.tripType==2">
                    <img src="./trip_apply_two_way.png"  v-else-if="item.tripType==1">
                </div>
                <div class="right">
                    <div class="main-txt">{{item.itinerTo}}</div>
                    <div class="gray">{{item.itinerEndDate}}</div>
                </div>
            </div>
        </div>
        <div class="foot-order" v-if="item.state==1 && item.flowState==1" @click="checkOrder(item)">查看订单</div>
    </div>    
</template>
<script>
import { getDate2 } from "common/js/day.js";
export default {
  methods: {
    getDt(type) {
      return getDate2(type);
    },
    getTripDetail(item){
        this.$emit('getTripDetail', 'item')
    },
    checkOrder(item){
        this.$emit('checkOrder', 'item')
    },
  },
  props: {
    item: {
      type: Object,
      default: null
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.section {
    .sectionDetail {
        .sectionhead {
            x-middle();
            padding: 0.8em 0;
            font-size: 1em;
            color: #333;
            font-weight: bold;

            .sectiontitle {
                x-middle();
                flex 1;
                width 70%

                .sectionname {
                    
                    max-width 50%
                    text-over();
                }

                .workfor {

                }
            }

            .sectiontime {
                color: $color-text-h;
                font-size: 0.8em;
            }
        }

        .sectionbody {
            x-middle();
            padding: 0.8em 0;
            border-top: 1px dashed $color-dashed;
            font-size: 0.875em;

            .left {
                flex: 1;

                .main-txt {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 0.3em;
                }

                .gray {
                    color: #9b9b9b;
                }
            }

            .center {
                img {
                    width: 2.5em;
                    height: 2.5em;
                    margin: 0 1em;
                }
            }

            .right {
                flex: 1;
                text-align: right;

                .main-txt {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 0.3em;
                }

                .gray {
                    color: #9b9b9b;
                }
            }
        }
    }

    .foot-order {
        text-align: center;
        padding: 0.8em 0;
        color: #3B5999;
        border-top: 1px dashed $color-dashed;
    }
}
</style>
