<template>
  <div class="apply-item">
    <p class="workinfo border-1px">
      {{tripData.workInfo}}
    </p>
    <div class="citys">
      <div class="from">
        <h2 class="name">{{tripData.itinerFrom}}</h2>
        <p class="date">{{beginDate}}</p>
      </div>
      <div class="logo">
        <img src="./return.png" alt="" v-if="tripData.tripType==1" >
        <img src="./trip_apply_one_way.png" alt="" v-else>

      </div>
      <div class="to">
        <h2 class="name">{{tripData.itinerTo}}</h2>
        <p class="date">{{endDate}}</p>
      </div>
    </div>
    <div class="status-wrapper">
      <p class="content">
        <span class="status" :class="statusClassname">
          {{status}}
        </span>
        <span class="detail">
          查看详情
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { getDate2 } from "common/js/day.js";
import { approvalStatus } from "common/js/data.js";

export default {
  props: {
    tripData: {
      type: Object,
      default: null
    }
  },
  computed: {
    beginDate() {
      return getDate2(this.tripData.itinerBegin);
    },
    endDate() {
      return getDate2(this.tripData.itinerEnd);
    },
    status() {
      return approvalStatus[this.tripData.flowState*1];
    },
    statusClassname(){
      return `status-${this.tripData.flowState*1}`
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/mixin.styl';
@import '~common/style/variable.styl';

.apply-item {
  .workinfo {
    padding: 0.2rem 0;
    border-1px($color-solid);
    text-over();
  }

  .citys {
    x-middle();
    justify-content: space-between;
    padding: 0.2rem 0;
    border-1px($color-solid);

    .name {
      color: $color-bg-high;
    }

    .date {
      color: $color-text-h;
    }

    .logo {
      width: 0.5rem;
    }

    .to {
      text-align: right;
    }
  }

  .status-wrapper {
    .content {
      x-middle();
      justify-content: space-between;
      padding: 0.2rem 0;

      .status {
        font-weight: bold;

        &.status-0 {
          color:$color-bg-high;
        }

        &.status-1 {
          color: #88d632;
        }

        &.status-2, &.status-3 {
          color: #fe3c0f;
        }
        &.status-4{
          color:$color-text-h;
        }
        &.status-5{
          color:$color-bg-high;
        }
      }

      .detail {
        color: $color-text-h;
      }
    }
  }
}
</style>


