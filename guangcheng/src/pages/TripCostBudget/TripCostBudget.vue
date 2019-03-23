<template>
  <div class="cost-budget">
    <HeaderTitle
      :btnLeft="true"
      title="费用预算"
      @back="goBack"
    />
    <div class="container">
      <div
        class="content pepole border-1px-right"
        v-if="costBudgets.length"
      >
        <p
          class="name"
          :class="{active:index === currIndex}"
          v-if="users.length"
          v-for="(item,index) in users"
          @click="showPepoleCost(index)"
        >
          {{item.name}}
        </p>
      </div>
      <div
        class="content money-single"
        v-if="costBudgets.length"
      >
        <div
          class="single-item"
          v-if="users[currIndex]&&(item.userName==users[currIndex].code)"
          v-for="(item,index) in costBudgets"
        >
          <p class="title">
            <span class="text">
              <span class="name">{{users[currIndex].name}}</span> 预算总额：
            </span>
            <span class="total">¥{{myTotalList[index]}}</span>
          </p>
          <ul class="budget-list">
            <li
              class="budget-item"
              v-for="(item,index) in item.detailsLi"
            >
              <div class="item">
                <div class="icon">
                  <span class="num">{{index+1}}</span>
                </div>
                <div class="text">{{item.type}}</div>
                <div class="money">
                  <span class="rmb">¥</span>
                  <input
                    class="num"
                    type="tel"
                    v-model.number="item.inpNum"
                    placeholder="0"
                    @input="maxMoney(item)"
                  >
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
        <span class="total">¥ {{totalCost}}</span> (共{{totalPepole}}人)
      </div>
      <div
        class="order"
        @click="confirmCost"
      >
        确定预算
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import { getBudgets } from "./api.js";
import bus from "common/js/bus.js";
import { getLocal } from "common/js/storage";
import { objDeepCopy } from "common/js/utils.js";
import detailsLi from "./detailsLi.js";
import { Toast } from "vant";
export default {
  name: "tripCostBudget",
  components: {
    HeaderTitle
  },
  data() {
    return {
      querData: null,
      costBudgets: [],
      currIndex: 0,
      users: [],
      budgetFlag: true
    };
  },
  computed: {
    // 每个人的预算
    myTotalList() {
      const myTotalList = [];
      this.costBudgets.forEach(costBudget => {
        const detailsLi = costBudget.detailsLi;
        let sum = 0;
        for (let i = 0; i < detailsLi.length; i++) {
          sum += Number(detailsLi[i].inpNum);
        }
        myTotalList.push(sum);
      });
      return myTotalList;
    },
    // 总预算
    totalCost() {
      if (this.myTotalList.length) {
        let newMyTotal = this.myTotalList.reduce((x, y) => {
          return x + y;
        });
        if (newMyTotal > 1000000) {
          Toast("预算金额不能大于100万");
          this.budgetFlag = false;
          return;
        }
        this.budgetFlag = true;
        return newMyTotal;
      }
    },
    // 总人数
    totalPepole() {
      const num = this.costBudgets.length && this.costBudgets.length;
      return num;
    }
  },
  created() {
    // 获取用户信息判断用户是否有在行程申请页面搜索机票的权限
    const needQuery = JSON.parse(getLocal("userInfo")).needQuery;
    this.needQuery = needQuery;
    // 判断是否是从未提交页面而来
    // 如果是从编辑页面来，且bugetFlag为true的时候不用重新渲染
    if (this.$route.params.edit && this.$route.query.budgetFlag) {
      const users = [];
      const budgetDetail = this.$route.params.budgetDetail;
      budgetDetail.forEach(item => {
        users.push({
          code: item.code,
          name: item.name
        });
        item.userName = item.code;
      });
      this.users = users;
      // 初始化预算费用
      this._initBudgetData();
      this.costBudgets = budgetDetail;
    } else {
      const querData = this.$route.query;
      this.users = JSON.parse(querData.users);
      // 初始化预算
      this._initBudgetData();
      // 如果是有查询机票权限的，不需要请求后台预算接口
      if (!this.needQuery) {
        this._getBudgets(querData);
      } else {
        // 如果是有查询机票权限的，把机票价格赋值给费用预算
        this.budgetList = JSON.parse(querData.budgetList);
        this._setTicketPriceToBudget();
      }
    }
  },
  watch: {
    // 关注路由变化，确定是否重新请求预算
    $route(to, from) {
      if (from.name === "tripAdd" && to.name === "tripCostBudget") {
        if (!this.$route.query.budgetFlag) {
          // 防止keepAlive缓存了已经删除的同行人的信息的下标，将currIndex设为0，
          // 但不是最优的解决方法
          this.currIndex = 0;
          const querData = this.$route.query;
          this.users = JSON.parse(querData.users);
          this._initBudgetData();
          if (!this.needQuery) {
            this._getBudgets(querData);
          }else{
            // 如果是有查询机票权限的，把机票价格赋值给费用预算
           this.budgetList = JSON.parse(querData.budgetList);
           console.log(this.budgetList)
           this._setTicketPriceToBudget();
          }
        }
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 查询费用预算
    async _getBudgets(obj) {
      const result = await getBudgets(obj);
      if (result.success) {
        const resultObj = result.obj;
        for (let i = 0; i < resultObj.length; i++) {
          // 如果userName相同,且有配预算，就需要给预算赋值
          for (let k = 0; k < this.users.length; k++) {
            if (
              resultObj[i].userName == this.users[k].code &&
              resultObj[i].budget
            ) {
              this._getBudgetData(i, resultObj[i].budget);
            }
          }
        }
        const obj = result.obj;
      }
    },
    // 如果是有查询机票权限的，把机票价格赋值给费用预算
    _setTicketPriceToBudget() {
      console.log(this.budgetList)
      for (let k = 0; k < this.costBudgets.length; k++) {
        let detail = this.costBudgets[k].detailsLi;
        for (let i = 0; i < detail.length; i++) {
          switch (detail[i].type) {
            case "机票":
              detail[i].inpNum = this.budgetList[k];
              detail[i].max = this.budgetList[k];
              break;
          }
        }
      }
    },
    showPepoleCost(index) {
      this.currIndex = index;
    },
    // 确认预算
    confirmCost() {
      if (!this.budgetFlag) {
        Toast("请填写正确的预算价格");
        return;
      }
      bus.$emit("confirmCost", this.myTotalList, this.costBudgets);
      this.goBack();
    },
    // 初始化费用预算的数据
    _initBudgetData() {
      const initBudgetData = [];
      this.users.forEach(user => {
        initBudgetData.push({
          userName: user.code,
          detailsLi: objDeepCopy(detailsLi)
        });
      });
      this.costBudgets = initBudgetData;
    },
    // 把后台获取的数据，注入到已有的数据,
    _getBudgetData(index, budget) {
      let detail = this.costBudgets[index].detailsLi;
      for (let i = 0; i < detail.length; i++) {
        switch (detail[i].type) {
          case "机票":
            detail[i].inpNum = budget.flightBudget ? budget.flightBudget : 0;
            detail[i].max = budget.flightBudget ? budget.flightBudget : 0;
            break;
          case "火车票":
            detail[i].inpNum = budget.train ? budget.train : 0;
            detail[i].max = budget.train ? budget.train : 0;
            break;
          case "住宿":
            detail[i].inpNum = budget.hotelBudget ? budget.hotelBudget : 0;
            detail[i].max = budget.hotelBudget ? budget.hotelBudget : 0;
            break;
          case "交通":
            detail[i].inpNum = budget.taxBudget ? budget.taxBudget : 0;
            detail[i].max = budget.taxBudget ? budget.taxBudget : 0;
            break;
          case "餐饮":
            detail[i].inpNum = budget.foodBudget ? budget.foodBudget : 0;
            detail[i].max = budget.foodBudget ? budget.foodBudget : 0;
            break;
          case "其他":
            detail[i].inpNum = budget.otherBudget ? budget.otherBudget : 0;
            detail[i].max = budget.otherBudget ? budget.otherBudget : 0;
            break;
        }
      }
    },
    _getSingleTotal(costBudget) {
      let sum = 0;
      costBudget.detailsLi.forEach(item => {
        sum += Number(item.inpNum);
      });
      return sum;
    },
    maxMoney(m) {
      if (m.inpNum > m.max && m.max != 0) {
        m.inpNum = m.max;
      }
    }
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
    overflow: hidden;

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

        &.active {
          color: $color-text-active;
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


