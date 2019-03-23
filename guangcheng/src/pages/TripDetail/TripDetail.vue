<template>
    <div class="TripDetail">
        <HeaderTitle title="行程详情" @back="goback" :btnLeft="true" :btnRight="true" >
            <span v-if="showEdit" @click="editApply">编辑</span>
        </HeaderTitle>
        <div class="msgbody" v-if="items">
            <div class="section-list">
                <div class="flowstatus">{{items.statusText}}</div>
                <div class="next-user" v-if="nextUser">当前审批人：{{nextUser}}</div>
                <div v-if="records.length > 0">
                    <div class="flowcontent"  v-show="!showApproval">
                        <div class="row" v-for="(item,index) in records" :key="index">
                            <div class="row-data">
                                <p>{{getDt(item.approval_time)}}</p>
                                <p>{{gettm(item.approval_time)}}</p>
                                <div class="line"></div>
                            </div>
                            <div class="row-option">
                                <div class="option-name">{{item.operate_user_name}}</div>
                                <div class="option-content">
                                    <div>审批意见：</div>
                                    <div class="option-msg">{{item.comment}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flowtitle" v-show="showApproval" @click="showList">查看审批流程</div>
                    <div class="flowtitle icon" v-show="!showApproval" @click="hideList">
                        <i class='fa fa-angle-up'></i>
                    </div>
                </div>
            </div>
            <div class="section-list">
                <div class="listcom">
                    <div class="traval">
                        <div class="traval-title">出行人</div>
                        <div class="traval-name">{{items.applyUserRealName}}</div>
                    </div>
                    <div class="travalpartner" v-if="items.associate && items.othersUserName">
                        <div class="partner-title">同行人</div>
                        <div class="partner-name-list">
                            <div class="partner-name" v-for="(a,index) in items.associate" :key="index">{{a.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-list">
                <div class="listcom">
                    <div class="tripreason">
                        <div class="reason-title">出差事由</div>
                        <div class="reason-content">{{items.itinerWorkType}}</div>
                    </div>
                    <div class="workinfo">{{items.workInfo}}</div>
                </div>
            </div>
            <div class="section-list">
                <div class="listcom">
                    <div class="addresshead">{{items.tripTypeText}}</div>
                        <div class="addresscontent" v-for="(list,index) in items.tripDetail" :key="index" v-if="items.tripType==1">
                          <div v-show="index<1">
                            <div class="addresstop">
                                <div class="left">{{list.from}}</div>
                                <div class="center">
                                  <img src="./trip_apply_two_way.png"  v-if="items.tripType==1">
                                  <img src="./trip_apply_one_way.png" v-else>
                                </div>
                                <div class="right">{{list.to}}</div>
                            </div>
                            <div class="addressbottom">
                                <div class="addressleft">{{getDetailDate(list.begin)}}</div>
                                <div class="addressright" v-if="items.tripType==1">{{getDetailDate(list.end)}}</div>
                            </div>
                          </div>
                        </div>
                      <div class="addresscontent" v-for="(list,index) in items.tripDetail" :key="index" v-if="items.tripType!=1">
                          <div class="addresstop">
                            <div class="left">{{list.from}}</div>
                            <div class="center">
                              <img src="./trip_apply_two_way.png"  v-if="items.tripType==1">
                              <img src="./trip_apply_one_way.png" v-else>
                            </div>
                            <div class="right">{{list.to}}</div>
                          </div>
                          <div class="addressbottom">
                            <div class="addressleft">{{getDetailDate(list.begin)}}</div>
                            <div class="addressright" v-if="items.tripType==1">{{getDetailDate(list.end)}}</div>
                          </div>
                      </div>
                </div>
            </div>
            <div class="section-list">
                <div class="listcom">
                    <!--添加的机票预订理由-->
                    <div class="costs" v-show="meReason">
                        <div class="attribution budget border-1px"
                        >超出航班预定规则原因：
                        </div>
                        <div class="attribution budget border-1px"
                             style="color: red;">{{meReason}}
                        </div>

                    </div>
                    <div class="cost" @click="tripBudget">
                        <div class="budgettitle">费用预算</div>
                        <div class="budgetcontent">
                            <span class="budgetmoney">￥{{items.budgetTotal}}</span>
                            <i class="fa fa-angle-right"></i>
                        </div>
                    </div>

                    <div class="pay">
                        <div class="paytitle">费用归属</div>
                        <div class="paycontent" v-if="items.tmcItineraryCost">{{items.tmcItineraryCost.departName}}</div>
                    </div>
                </div>
            </div>
            <div class="TripBtn" v-if="isChecker && items.state === 0 && showBtn && showBtn1">
                <div class="successBtn" @click="pass">通过</div>
                <div class="failBtn" @click="reject">驳回</div>
            </div>
        </div>
    </div>
</template>
<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle";
import { gobackMixin } from "common/js/mixins.js";
import { getTripDetail } from "api/getTripDetail";
import { passTrip } from "api/passTrip";
import { approvalStatus } from "common/js/data.js";
import { getLocal } from "common/js/storage.js";
import { getDate3, getTime, getDetailDate3 } from "common/js/day.js";
import { mapMutations, mapGetters } from "vuex";
import { Dialog, Toast } from "vant";
export default {
  mixins: [gobackMixin],
  components: {
    HeaderTitle
  },
  data() {
    return {
      items: null,
      records: [], //审批流程
      nextUser: [], //当前审批人
      orderState: "", //订单状态
      showApproval: true, //显示审批流程
      TripBtnShow: true,
      isChecker: false,
      showEdit: false,
      showBtn:true,
      showBtn1:true,
      belongId:'',//
        meReason:'',//判断是否需要理由
    };
  },
  computed: {
    ...mapGetters({
      includes: "includePageNames"
    })
  },
  created() {
    this.isChecker = JSON.parse(getLocal("userInfo")).isChecker;
    this.getData();
  },
  methods: {
    ...mapMutations({
      setPage: "SET_ALIVEPAGE",
      deletePage: "DELETE_ALIVEPAGE"
    }),
    getDt(time) {
      return getDate3(time);
    },
    gettm(time) {
      return getTime(time);
    },
    getDetailDate(time) {
      return getDetailDate3(time);
    },
    getData() {
      let ucode = JSON.parse(getLocal("userInfo")).ucode;
      let TripId = this.$route.query.tripId;
      getTripDetail(TripId, true).then(res => {
         
        let dataObj = res.obj.tmcItinerary;


         // 新加判断是否需要添加超出航班预订价格规则的理由
         if (dataObj.remark){
            this.meReason=dataObj.remark
         }
        
        
        this.belongId=dataObj.tmcItineraryCost.id;
        dataObj.state = dataObj.flowState * 1; //订单状态
        dataObj.tripDetail = JSON.parse(dataObj.tripDetail); //行程数据
        dataObj.budgetDetail = JSON.parse(dataObj.budgetDetail); //费用预算数据
        //时间比较 判断 当前行程 状态
        if (new Date(dataObj.itinerEnd) < new Date() && dataObj.state != 1) {
          dataObj.state = 4;
          this.showBtn = false
        } 
        //else if (dataObj.isSubmit * 1 == 0) {
        //   dataObj.state = 3;
        // }
        dataObj.statusText = approvalStatus[dataObj.state]; //订单状态转换
        //拼接 同行人所需数据
        if (dataObj.othersUserName) {
          let othersUserName = dataObj.othersUserName.split(",");
          let othersRealName = dataObj.othersRealName.split(",");
          let associate = [];
          for (let i = 0; i < othersUserName.length; i++) {
            associate.push({
              code: othersUserName[i],
              name: othersRealName[i]
            });
          }
          dataObj.associate = associate;
        }
        //机票行程
        switch (dataObj.tripType) {
          case 0:
            dataObj.tripTypeText = "单程";
            break;
          case 1:
            dataObj.tripTypeText = "往返";
            break;
          case 2:
            dataObj.tripTypeText = "多程";
            break;
          default:
            break;
        }
        this.items = dataObj;
        console.log(res.obj)
        this.records = res.obj.records;
        this.orderState = dataObj.state;
        const itinerEnd = new Date(this.items.itinerEnd);
        // 如果状态是未通过或者已提交
        // 而且需要是在行程申请模块
        // 还需要行程结束时间大于当前时间才会显示编辑按钮
        if(
            (this.orderState===2 || this.orderState===1)&&
            this.$route.query.role&&
            itinerEnd > new Date()
        ){
          this.showEdit = true
        }
        this.nextUser = res.obj.nextUser;
        //下一审批人
        if (dataObj.applyUserRealName == res.obj.nextUser) {
          this.nextUser = "";
        }
        if (this.records && this.records.length > 0) {
          for (let i = 0; i < this.records.length; i++) {
            if (ucode == this.records[i].operate_user) {
              this.showBtn = false//当前登录人 审批结束是否当前操作人
            }
          }
        }
        if(this.items.applyUserName == ucode){
            this.showBtn1 = false
        };
      });
    },
    showList() {
      this.showApproval = false;
    },
    hideList() {
      this.showApproval = true;
    },
    // 编辑
    editApply() {
      const params = {
        edit: true,
        tmcItinerary: this.items,
        tripId:this.$route.query.tripId,
        belongId:this.belongId
      }
      if(this.orderState === 1){
          params.status = 1
      }
      this.$router.push({
        params,
        name: "tripAdd"
      });
    },
    tripBudget() {
      this.items.tmcItineraryBudgets = JSON.stringify(
        this.items.tmcItineraryBudgets
      );
      this.$router.push({
        name: "tripCostBudgetStatic",
        query: this.items
      });
    },
    pass() {
      Dialog.confirm({
        title: "提示",
        message: "您确定要通过这个行程吗？"
      })
        .then(() => {
          this._passTrip();
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    _passTrip() {
      let tripData = {
        id: this.items.id,
        taskId: this.items.taskId
      };
      passTrip(tripData, true).then(res => {
        Toast({
          duration: 2000,
          message: res.msg
        });
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      });
    },
    reject() {
      let tripData = {
        id: this.items.id,
        taskId: this.items.taskId
      };
      this.$router.push({
        path: "/tripopinion",
        query: { tripData: tripData }
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "tripAdd") {
      this.setPage(to.name);
    }
    next();
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.TripDetail {
    flex: 1;
    y-view();

    .msgbody {
        flex: 1;
        y-view();
        scrolling();

        .TripBtn {
            margin: 2em 0;
            padding: 1em;

            .successBtn {
                border-radius: 0.5em;
                padding: 0.6em 0;
                text-align: center;
                background-color: #3b5999;
                color: #fff;
                font-size: 1em;
            }

            .failBtn {
                border-radius: 0.5em;
                padding: 0.6em 0;
                text-align: center;
                color: #fff;
                font-size: 1em;
                background-color: #fe3c0f;
                margin-top: 0.5em;
            }
        }

        .section-list {
            background-color: $color-white;
            font-size: 1em;
            color: #000;
            border-bottom: 1px solid $color-solid;
            border-top: 1px solid $color-solid;
            margin-bottom: 0.6em;

            .hide {
                display: none;
            }

            .flowcontent {
                overflow: hidden;
                background-color: #f6f7f9;
                border-bottom: 1px solid $color-dashed;

                .row {
                    x-middle();
                    padding: 0.7em;

                    .row-data {
                        font-size: 0.8em;
                        color: $color-text-h;
                        margin-right: 2.5em;
                        padding-top: 0.4em;
                        position: relative;

                        &:before {
                            width: 0.8em;
                            height: 0.8em;
                            content: '';
                            position: absolute;
                            border: 1px solid $color-dashed;
                            background-color: $color-white;
                            border-radius: 50%;
                            left: 3.8em;
                            top: -0.3em;
                        }

                        .line {
                            position: absolute;
                            top: 0.6em;
                            bottom: -2.3em;
                            width: 3px;
                            background-color: #d8d8d8;
                            left: 4.16em;
                            border-bottom: 1px solid #979797;
                            margin: 0.5em 3px 0 0;

                            &:before {
                                content: '';
                                display: inline-block;
                                position: absolute;
                                top: -1.5px;
                                left: -3px;
                                width: 5px;
                                height: 5px;
                                box-sizing: border-box;
                                border-radius: 2px;
                                background-color: #d8d8d8;
                                border: 1px solid #979797;
                            }

                            &:after {
                                content: '';
                                display: inline-block;
                                position: absolute;
                                top: -1.5px;
                                right: -3px;
                                width: 5px;
                                height: 5px;
                                box-sizing: border-box;
                                border-radius: 2px;
                                background-color: #d8d8d8;
                                border: 1px solid #979797;
                            }
                        }

                        &:after {
                            width: 0.3em;
                            height: 0.3em;
                            content: '';
                            position: absolute;
                            background-color: $color-text-h;
                            border-radius: 50%;
                            left: 4.15em;
                            top: 0.05em;
                        }
                    }

                    .row-option {
                        flex: 1;
                        border-radius: 0.3em;
                        border: 1px solid $color-dashed;
                        padding: 0.6em 1em;
                        font-size: 0.9em;
                        color: #333;
                        background-color: $color-white;

                        .option-name {
                            width: auto;
                        }

                        .option-content {
                            x-middle();
                            font-size: 0.8em;
                            color: #999;

                            .option-msg {
                                flex: 1;
                            }
                        }
                    }
                }
            }

            .flowstatus {
                padding: 0.8em 0;
                padding-left: 1em;
                border-bottom: 1px solid $color-dashed;
                color: #FE3C0F;
            }

            .next-user {
                font-size: 0.8em;
                padding: 0.8em 1em;
                border-bottom: 1px solid $color-dashed;
            }

            .flowtitle {
                text-align: center;
                padding: 0.8em 0;
                color: $color-text-active;
            }

            .listcom {
                padding-left: 1em;
                //新加的用来给存放理由html
                .costs {
                    /*padding-left: 0.2rem;*/
                    background-color: #fff;

                    .budget {
                        x-middle();
                        padding: 0.2rem 0.3rem 0.2rem 0;
                        border-1px($color-solid);

                        .title {
                            width: 1.5rem;
                        }

                        .money {
                            flex: 1;
                            color: $color-text-active;
                        }
                    }

                    .attribution {
                        x-middle();
                        padding: 0.2rem 0.3rem 0.2rem 0;

                        .title {
                            width: 1.5rem;
                        }

                        .text {
                            flex: 1;
                        }
                    }
                }

                .cost {



                    x-middle();
                    padding: 0.8em 1em 0.8em 0;
                    border-bottom: 1px solid #ddd;

                    .budgettitle {
                        width: 5em;
                    }

                    .budgetcontent {
                        x-middle();
                        flex: 1;

                        .budgetmoney {
                            color: $color-bg-high;
                            flex: 1;
                        }
                    }
                }

                .pay {
                    x-middle();
                    padding: 0.8em 1em 0.8em 0;

                    .paytitle {
                        width: 5em;
                    }

                    .paycontent {
                        flex: 1;
                    }
                }

                .addresshead {
                    padding: 0.8em 0;
                    border-bottom: 1px solid #ddd;
                }

                .addresscontent {
                    .addresstop {
                        x-middle();
                        padding: 0.3em 0;
                        border-bottom: 1px dashed #ddd;

                        .left {
                            flex: 1;
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
                            padding-right: 1em;
                        }
                    }

                    .addressbottom {
                        x-middle();
                        padding: 0.8em 0;

                        .addressleft {
                            flex: 1;
                        }

                        .addressright {
                            flex: 1;
                            padding-right: 1em;
                            text-align: right;
                        }
                    }
                }

                .tripreason {
                    x-middle();
                    padding: 0.8em 1em 0.8em 0;
                    border-bottom: 1px solid #ddd;

                    .reason-title {
                        width: 5em;
                    }

                    .reason-content {
                        flex: 1;
                    }
                }

                .workinfo {
                    padding: 0.8em 1em 0.8em 0;
                    word-break: break-all;
                    word-wrap: break-word;
                }

                .traval {
                    x-middle();
                    padding: 0.8em 1em 0.8em 0;
                    border-bottom: 1px solid #ddd;

                    .traval-title {
                        width: 5em;
                    }

                    .traval-name {
                        flex: 1;
                    }
                }

                .travalpartner {
                    display: flex;

                    .partner-title {
                        width: 5em;
                        padding-top: 0.8em;
                    }

                    .partner-name-list {
                        flex: 1;

                        .partner-name {
                            border-bottom: 1px solid #ddd;
                            padding: 0.8em 1em 0.8em 0;

                            &:last-child {
                                border: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}



</style>
