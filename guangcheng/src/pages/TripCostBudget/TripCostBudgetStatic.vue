<template>
  <div class="cost-budget">
    <HeaderTitle :btnLeft="true" title="费用预算" @back="goBack" />
    <div class="container">
      <div class="content pepole border-1px-right" v-if="users.length" >
        <p 
          class="name"
          :class="{active:index === currIndex}"  
          v-for="(name,index) in users"
          :key="name"
          @click="showPepoleCost(index)"
        >
         {{name}}
        </p>
      </div>
      <div class="content money-single" 
        v-if="costBudgets.length"
         v-show="currIndex === index"  
        v-for="(cost,index) in costBudgets"
        :key="index"
      >
        <div 
          class="single-item"
        >
          <p class="title">
            <span class="text">
              <span class="name">{{cost.user}}</span> 预算总额：
            </span>
            <span class="total">¥{{cost.myTotal}}</span>
          </p>
          <ul class="budget-list">
            <li class="budget-item" v-for="(item,index) in cost.budgets">
              <div class="item">
                <div class="icon">
                  <span class="num">{{index+1}}</span>
                </div>
                <div class="text">{{item.budgetName}}</div>
                <div class="money">
                  <span class="rmb">¥</span>
                  <input class="num" type="tel" readonly v-model="item.budgetMoney">
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="money">
        预算总额
        <span class="total">¥{{totalMoney}}</span> (共{{costBudgets.length}}人)
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import { getBudgets } from "./api.js";
import bus from "common/js/bus.js";
import { objDeepCopy } from "common/js/utils.js";
import detailsLi from "./detailsLi.js";
const COST_LEN = 7;
export default {
  name: "tripCostBudget",
  components: {
    HeaderTitle
  },
  data() {
    return {
      querData: null,
      costBudgets:[],
      currIndex:0,
      users:[],
      singleCost:[],
      totalList:[],
    };
  },
  computed: {
    totalMoney(){
      let sum = 0;
      this.totalList.forEach(item => {
        sum += item;
      })
      return sum;
    }
  },
  created() {
    const tripDetail = this.$route.query;
    console.log(tripDetail)
    this._getUsers(tripDetail)
    this._getSingleCost(JSON.parse(tripDetail.tmcItineraryBudgets));
    this._getTotalList();
    this._getCostBudgets();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    showPepoleCost(index){
      this.currIndex = index;
    },
    //  得到行程的所有人员
    _getUsers(data){
      const users = [data.applyUserRealName];
      const others = data.othersRealName && data.othersRealName.split(',');
      this.users = users.concat(others);
    },
    //获得每个人的预算数组
    _getSingleCost(data){
      let len = data.length/COST_LEN;
      let costArr = [];
      let costList = [];
      for(let i = 0;i < COST_LEN;i++){
        let costArrItem =data.splice(0,len)
        costArr.push(costArrItem);
      }
      for(let k = 0;k<len;k++){
        let costListitem = [];
        for(let j = 0;j<COST_LEN;j++){
          costListitem.push(costArr[j][k])
        }
        costList.push(costListitem)
      }
      this.singleCost = costList;

    },
    // 获得每个人的总预算
    _getTotalList(){
      const totalList = [];
      this.singleCost.forEach(item => {
        let sum = 0;
        item.forEach(budget => {
          sum += budget.budgetMoney
        })
        totalList.push(sum)
      })
      this.totalList = totalList;
    },
    // 获得最终的页面数据
    _getCostBudgets(){
      console.log(this.totalList)
      const LEN = this.totalList.length;
      for(let i = 0;i<LEN;i++){
        this.costBudgets.push({
          user:this.users[i],
          myTotal:this.totalList[i],
          budgets:this.singleCost[i]
        })
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.cost-budget {
  y-view();

  .container {
    flex: 1;
    display: flex;
    overflow :hidden;

    .content {
      box-sizing: border-box;
    }

    .pepole {
      width: 30%;
      padding: 0 0.2rem;
      padding-top: 0.2rem;
      scrolling();
      border-1px-right($color-solid);
      .name {
        padding-bottom: 0.2rem;
        color: #536480;
        font-size: 0.24rem;
        font-weight: 700;
        &.active{
        color:$color-text-active;
      }
      }
    }

    .money-single {
      flex: 1;
      padding: 0 0.2rem;
      scrolling();

      .single-item {
        font-size: 0.24rem;

        .title {
          padding: 0.2rem 0;
          color: $color-text-active;

          .name {
            font-weight: 700;
          }

          .total {
            color: #f95c79;
          }
        }

        .budget-list {
          .budget-item {
            margin-bottom: 0.2rem;

            .item {
              x-middle();
              padding: 0.1rem;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 5px #d8d8d8;

              .icon {
                flex: 1;

                .num {
                  display: inline-block;
                  width: 0.36rem;
                  height: 0.36rem;
                  line-height: 0.36rem;
                  color: #fff;
                  background-color: #5a8fff;
                  border: 3px solid #cfe0fe;
                  border-radius: 50%;
                  text-align: center;
                }
              }

              .text {
                flex: 2;
                color: #536480;
              }

              .money {
                flex: 3;
                x-middle();
                color: $color-text-active;

                .rmb {
                  margin-right: 0.2rem;
                }

                .num {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
  }

  .footer {
    x-middle();

    .money {
      flex: 1;
      padding: 0.2rem;
      background-color: #fff;

      .total {
        color: #f95c79;
      }
    }

    .order {
      padding: 0.2rem 0.3rem;
      color: #fff;
      background-color: $color-text-active;
    }
  }
}
</style>


