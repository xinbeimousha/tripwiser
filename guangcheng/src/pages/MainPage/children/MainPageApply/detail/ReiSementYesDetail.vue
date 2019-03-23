<template>
    <div class="TripDetail">
        <HeaderTitle title="报销详情" @back="goback" :btnLeft="true" :btnRight="true">
            <span v-if="showEdit" @click="editApply">提交</span>
        </HeaderTitle>


        <div class="msgbody" v-if="itinerary">
            <div class="section-list" v-if="spjdBool">
                <div class="flowstatus" :class="flowstatus">{{status}}</div>
                <div class="next-user" v-if="nowHandle">当前处理人：{{nowHandle}}</div>

                <!--历史审批意见-->
                <div v-if="commentList.length > 0">
                    <div class="flowcontent" v-show="!showApproval">
                        <div class="row" v-for="(item,index) in commentList" :key="index">
                            <div class="row-data">
                                <p>{{item.time|changeTimeMounth}}</p>
                                <p>{{item.time|changeTimeMin}}</p>
                                <div class="line"></div>
                            </div>
                            <div class="row-option">
                                <div class="option-name">{{item.messageParts[0]}}</div>
                                <div class="option-content">
                                    <div>处理内容：</div>
                                    <div class="option-msg">{{item.messageParts[1]}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flowtitle" v-show="showApproval" @click="showList">查看详情</div>
                    <div class="flowtitle icon" v-show="!showApproval" @click="hideList">
                        <i class='fa fa-angle-up'></i>
                    </div>
                </div>
            </div>
            <!--历史审批意见-->


            <div class="section-list">
                <div class="listcom">
                    <div class="traval">
                        <div class="traval-title">出行人</div>
                        <div class="traval-name">{{itinerary.applyUserRealName}}</div>
                    </div>

                    <!--并没有找到associate这个数据-->
                    <div class="travalpartner" v-if="itinerary.associate && itinerary.othersUserName">
                        <div class="partner-title">同行人</div>
                        <div class="partner-name-list">
                            <div class="partner-name" v-for="(a,index) in itinerary.associate" :key="index">{{a.name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="section-list">
                <div class="listcom">
                    <div class="tripreason">
                        <div class="reason-title">出差事由</div>
                        <div class="reason-content">{{itinerary.itinerWorkType}}</div>
                    </div>
                    <div class="workinfo">{{itinerary.workInfo}}</div>
                </div>
            </div>


            <div class="section-list">
                <div class="listcom">
                    <!--title-->
                    <div class="addresshead">{{Ticket}}</div>
                    <div class="addresscontent" v-for="(list,index) in itinerary.tmcItineraryTrips" :key="index"
                         v-if="itinerary.tripType==1"
                    >
                        <div v-show="index<1">
                            <div class="addresstop">
                                <div class="left">{{list.itinerFrom}}</div>
                                <div class="center">
                                    <img src="./trip_apply_two_way.png" v-if="itinerary.tripType==1">
                                    <img src="./trip_apply_one_way.png" v-else>
                                </div>
                                <div class="right">{{list.itinerTo}}</div>
                            </div>
                            <div class="addressbottom">
                                <div class="addressleft">{{list.itinerBegin|weekChange}}</div>
                                <div class="addressright" v-if="itinerary.tripType==1">{{list.itinerEnd|weekChange}}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="addresscontent" v-for="(list,index) in itinerary.tmcItineraryTrips" :key="index"
                         v-if="itinerary.tripType!=1">
                        <div class="addresstop">
                            <div class="left">{{list.itinerFrom}}</div>
                            <div class="center">
                                <img src="./trip_apply_two_way.png" v-if="itinerary.tripType==1">
                                <img src="./trip_apply_one_way.png" v-else>
                            </div>
                            <div class="right">{{list.itinerTo}}</div>
                        </div>
                        <div class="addressbottom">
                            <div class="addressleft">{{list.itinerBegin|weekChange}}</div>
                            <div class="addressright" v-if="itinerary.tripType==1">{{list.itinerEnd|weekChange}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!--报销分项-->
            <div class="section-list">
                <div class="listcom">
                    <div class="cost" style="display: flex;">
                        <div class="budgettitle" style="flex: 1;">报销分项</div>
                        <span class="budgetmoney" style="color: rgb(101,153,255);"
                              v-show="addReim"
                        @click="showDate=true">新增报销分项</span>
                    </div>

                        <!--新增数额-->
                        <div class="addAmounts cost"
                             v-show="datalist"
                             v-for="value,index in datalist"
                             :key="index"
                        style="margin-top: 0">
                            <div style="display: flex;justify-content: space-between;
                                    "
                            class="amoucost1 van-clearfix">
                                <div class="fa fa-check"
                                     @click="addCancel(index)"
                                     style="float: left;"
                                     v-show="!value.id"
                                >
                                </div>
                                <div class="fa fa-check"
                                     style="float: left;background-color:rgb(212,212,212);color: white;"
                                     v-show="value.id"
                                >
                                </div>
                                <div style="float: left;">{{value.name}}</div>
                            </div>

                            <div
                                 class="amoucost2"
                                 style="margin-left: -1rem;"
                            >x {{value.num}}</div>
                            <div class="amoucost3">￥{{value.price}}</div>

                        </div>

                    <!--@click="tripBudget"下面的要用点击事件-->
                    <div class="cost" style="display: flex;">
                        <div class="budgettitle" style="flex: 3;">费用预算总金额</div>
                        <!--itinerary.tmcItineraryBudgets[0].budgetMoney-->
                        <span class="budgetmoney" style="color: rgb(65,91,156);">￥{{CostBudget}}</span>

                    </div>
                </div>

            </div>
            <!--行程感悟-->
            <div class="section-list">
                <div class="listcom">
                    <div class="cost" style="display: flex">
                        <div class="budgettitle" style="flex: 1;">行程感悟</div>

                    </div>
                    <!--@click="tripBudget"下面的要用点击事件-->
                    <div class="cost">
                        <textarea v-if="bianji"
                                name=""
                                  placeholder="请填写差旅行程是否达到目的"
                                  v-model="content"
                        style="resize: none;display: block;height: 100%;width: 100%;"
                                  ></textarea>
                        <textarea v-if="!bianji"
                                  name=""
                                  placeholder="请填写差旅行程是否达到目的"
                                  v-model="content"
                                  style="resize: none;display: block;height: 100%;width: 100%;"
                                  readonly></textarea>

                    </div>
                </div>

            </div>

            <div class="TripBtn" v-if="showBtn">
                <div class="successBtn" @click="AppPass">通过</div>
                <div class="failBtn" @click="AppReject">驳回</div>
            </div>
        </div>



        <!--新增报销模块
        -->
        <van-popup v-model="showDate" position="bottom">
            <div class="remBox">
            <div class="remBoxTitle">新增报销项</div>
            <div class="popLine"></div>
            <select name="sop"
                    id="sop"
                    class="remBoxSelect"
                    v-model="couponSelected"
                    @change="getCouponSelected"
            >
                <option value="0">机票</option>
                <option value="1">火车票</option>
                <option value="2">酒店</option>
                <option value="3">交通</option>
                <option value="4">会议</option>
                <option value="5">餐饮</option>
                <option value="6">其他</option>
            </select>
            <div class="remBoxInput1">
                <div>数量：</div>
                <input type="text" v-model="remNum" placeholder="请填写数量">
                <div class="fa fa-check"
                @click="addSure"></div>
            </div>
            <div class="remBoxInput1">
                <div>单价：</div>
                <input type="text" v-model="remPrice" placeholder="请填写单价">
                <div class="fa fa-trash"
                @click="addDel"></div>
            </div>
            <div class="popLine"></div>

                <!--新增数额-->
                <div class="addAmount"
                v-show="!value.id"
                v-for="value,index in datalist"
                :key="index">
                <div>{{value.name}}</div>
                <div>x {{value.num}}</div>
                <div>￥{{value.price}}</div>
                <div class="fa fa-check"
                @click="addCancel(index)"></div>
                </div>
            </div>

        </van-popup>

    </div>

</template>

<script>

   import HeaderTitle from 'components/HeaderTitle/HeaderTitle';
   //三个接口
   import {getSementYesDetail, getHistory, RejectSubmit,firstSubmit,ApprovalButton} from './api.js'
   import {
      Toast,
      Dialog} from 'vant';

   export default {
      components: {
         HeaderTitle,
      },
      data() {
         return {
            showEdit: false,
            //   存放reimburse审批数据
            //   存放itinerary形成数据
            itinerary: {},
            reimburse: {},
            //   历史数据
            commentList: [],
            //   显示审批流程
            showApproval: true,

            showBtn: false,
            showBtn1: true,
            isChecker: false,
            //   费用预算总金额
            budget: '',
            //   当前处理人
            nowHandle: '',
            // 行程感悟内容
            content: '',
         //   控制新增报销模块
            addReim:false,
            bianji:false,
            //判断是否有审批历史节点
            spjd:'',
            spjdBool:false,
         //   新增的报销资金
            addReimbursement:0,
            //是否推出新增报销分项
            showDate:false,
         //   报销新增的数量和单价
            remNum:'',
            remPrice:'',
         //   是否出现新增中的取消
            remAddCancel:false,
         //   换算以后的数值
            datalist:[],
         //   select数据
            couponSelected:'0',
         //   select对应的中文数据
            SelectedName:'机票',
            clickFlag:0, //限制点击提交按钮的次数
            //接收默认报销数组数据
            reimburseDetailList:[],
         //   计算费用总金额
            sumNum:0,
            currentProcessors:[]


         }
      },
      mounted() {
         console.log(this.$route.query.itineraryId);
         console.log(this.$route.query.reimburseId);
         this.spjd=this.$route.query.reimburseId



            if (this.spjd) {
            this.spjdBool=true
               //获取页面详情信息
               getSementYesDetail(this.$route.query.itineraryId, this.$route.query.reimburseId).then(res => {
                  // console.log(res);
                  // console.log(res.obj.itinerary);
                  // console.log(res.obj.reimburse);
                  if (res.success) {
                     console.log(res);
                     //报销传过来的价格数据（数组中是对象）
                     this.reimburseDetailList=res.obj.reimburseDetailList
                     //itinerary数据
                     this.itinerary = res.obj.itinerary
                     //   reimburse数据
                     this.reimburse = res.obj.reimburse
                     //行程感悟信息
                     this.content=res.obj.reimburse.understanding
                     console.log('reimburse', this.reimburse);
                     console.log('itinerary', this.itinerary);

                        if (this.itinerary.reimburseStatus==='0'){
                           this.showEdit = true;
                           this.addReim=true;
                           this.bianji=true
                           console.log(123);
                        }

                     let sum = 0
                     if (this.reimburseDetailList) {

                        this.reimburseDetailList.forEach((value, index) => {
                           sum += value.itemFee
                           this.datalist.push({
                              name:value.itemName,
                              num:value.itemNum,
                              price:value.itemFee,
                              id:value.id,
                              manual:0
                           })
                        })

                     }
                     console.log(sum);
                     this.budget = sum+this.addReimbursement
                     this.sumNum=sum

                     //获取历史审批节点信息
                     //有异步问题所有嵌套调用接口或者以后用.all语法
                     getHistory(this.spjd).then(res => {
                        // console.log(res);
                        // console.log(res.obj.commentList);
                        if (res.success) {
                           this.currentProcessors=res.obj.currentProcessors
                           this.commentList = res.obj.commentList
                           console.log('commentList', this.commentList);
                           //当前处理人
                           this.nowHandle = res.obj.currentProcessors[0].realName

                           console.log(res);

                           if (res.obj.currentProcessors) {
                              //获取当前账号ucode
                              let ucode=JSON.parse(localStorage.getItem('userInfo')).ucode
                              console.log(ucode);
                              //获取当前审批人的ucode
                              console.log(res.obj.currentProcessors[0].userName);

                              //"88829497"

                              //判断是否是需要开启审批按钮
                              if (ucode==res.obj.currentProcessors[0].userName&&this.itinerary.reimburseStatus=='1'){
                                 console.log('可以提交');
                                 this.showBtn=true
                              }
                           }

                        }
                     })
                  }
               })

            }else{//说明是初次提交（未提交）
               //获取页面详情信息
               getSementYesDetail(this.$route.query.itineraryId,'').then(res => {
                  // console.log(res);
                  // console.log(res.obj.itinerary);
                  // console.log(res.obj.reimburse);

                  if (res.success) {
                     //itinerary数据
                     this.itinerary = res.obj.itinerary
                     //   reimburse数据
                     this.reimburse = res.obj.reimburse
                     //行程感悟信息
                     if (!(this.itinerary.reimburseStatus==='0')) {
                        this.content=res.obj.reimburse.understanding
                     }

                     console.log('reimburse', this.reimburse);
                     console.log('itinerary', this.itinerary);

                     if (this.itinerary.reimburseStatus==='0'){
                        this.showEdit = true;
                        this.addReim=true;
                        this.bianji=true
                        console.log(123);
                     }

                     let sum = 0
                     if (this.reimburseDetailList) {

                        this.reimburseDetailList.forEach((value, index) => {
                           sum += value.itemFee
                           this.datalist.push({
                              name:value.itemName,
                              num:value.itemNum,
                              price:value.itemFee,
                              id:value.id,
                              manual:0
                           })
                        })

                     }
                     console.log(sum);
                     this.budget = sum+this.addReimbursement
                     this.sumNum=sum+this.addReimbursement

                  }
               })
            }





      },
      methods: {
         //通过和驳回按钮触发的函数
         AppPass(){
           console.log('pass');
            Dialog.confirm({
               title: '提示',
               message: '您确定通过这个审批吗？'
            }).then(() => {
               console.log(this.reimburse.id);
               ApprovalButton(this.reimburse.id,1,'').then(res=>{
               console.log(res);
               if (res.success){
                  Toast('成功')
                  console.log(this.reimburse.id);
                  setTimeout(()=>{
                     this.$router.push({path:'/reiApproval'})
                  },1000)
               }
            })
            }).catch(() => {
            });


         },
         AppReject(){
            console.log('驳回');
            this.$router.push({
               path: "/reiOpinion",
               query: { reimburseId: this.reimburse.id }
            });
         },
         //改变select
         getCouponSelected(){
            console.log(this.couponSelected);
            switch (this.couponSelected){
               case '0':
                  this.SelectedName='机票'
                  break;
               case '1':
                  this.SelectedName='火车票'
                  break;
               case '2':
                  this.SelectedName='酒店'
                  break;
               case '3':
                  this.SelectedName='交通'
                  break;
               case '4':
                  this.SelectedName='会议'
                  break;
               case '5':
                  this.SelectedName='餐饮'
                  break;
               case '6':
                  this.SelectedName='其他'
                  break;
            }
         },
         //新增报销项中的确定
         addSure(){
            console.log('确定');
            console.log(this.remNum*this.remPrice);

            var zhengze=/[^\d]/g;
            ///[^\d]/g
            if (this.remNum===''){
               Toast('请填写数量');
               return;
            }
            if (zhengze.test(this.remNum)) {
               Toast('请填写数字');
               return;
            }
            if (this.remPrice===''){
               Toast('请填写数量');
               return;
            }
            if (zhengze.test(this.remPrice)) {
               Toast('请填写数字');
               return;
            }
            // this.remAddCancel=true;
            this.datalist.push({
               name:this.SelectedName,
               num:this.remNum,
               price:this.remNum*this.remPrice,
               manual:1//手动还是自动 0是自动，1是后来手动添加的
            })
           this.addReimbursement+=this.remNum*this.remPrice
            this.remPrice='';
            this.remNum='';

         },
         //新增报销项中的删除
         addDel(){
            console.log('删除');
            this.remPrice='';
            this.remNum='';
         },
         //新增报销项中的取消
         addCancel(index){
            console.log('取消');
            this.addReimbursement-=this.datalist[index].price
            this.datalist.splice(index,1)

         },
         // 返回
         goback() {
            this.$router.go(-1)
         },
         //   提交
         editApply() {
            if (this.content==''){
               Toast('请填写行程感悟')
               return false;
            }
            this.clickFlag++
            if (this.clickFlag>1){
               Toast('请不要重复提交')
               return false;
            }
            //设置需要提交的参数
            //报销明细的数组
            let tmcReimburseDetailList=[]
            this.datalist.forEach((value,index)=>{
               let obj={
                  itemName: value.name,//名称（机票，火车票）
                  itemFee: value.price,//单项总费用
                  itemNum: value.num,//数量 2  3
                  manual: value.manual,//0 1手动
               }
               tmcReimburseDetailList.push(obj)
            })

            console.log(tmcReimburseDetailList);
            console.log(this.itinerary.id);
            console.log(this.content);
            console.log(this.itinerary.reimburseId);



            //未提交（第一次提交）
            //list,itineraryId,itineraryContent
            if (this.itinerary.reimburseStatus==='0'){
               console.log('未提交');
               firstSubmit(tmcReimburseDetailList,this.itinerary.id,this.content).then(res=>{
                  console.log(res);
                  if (res.success){
                     Toast('行程提交成功')
                     setTimeout( ()=> {
                        this.$router.push({name:'ReiSement'})
                     },1000)
                  } else{
                     this.clickFlag=0
                  }
               })
            } else if (this.itinerary.reimburseStatus==='3') {
               console.log('重新提交');
            //   未通过（重新提交）
               //list,itineraryId,itineraryContent,id
               RejectSubmit(tmcReimburseDetailList,this.itinerary.id,this.content,this.itinerary.reimburseId).then(res=>{
                  console.log(res);
                  if (res.success){
                     Toast('行程提交成功')
                     setTimeout( ()=> {
                        //不能用function，this指向错了
                        this.$router.push({name:'ReiSement'})
                     },1000)
                  }else{
                     this.clickFlag=0
                  }
               })
            }

         },
         //   隐藏和显示历史审批
         showList() {
            this.showApproval = false;
         },
         hideList() {
            this.showApproval = true;
         },

      },

      computed: {
         status() {
            // console.log(this.tripData.flowState);
            // return approvalStatus[this.tripData.tripType*1];
            //只有未通过和未提交是可以编辑提交的，在未通过的提交中由于审批人和申请者
            //都可以看到，所以要判断是否是当前处理人的账号
            switch (this.itinerary.reimburseStatus) {
               case '0':
                  this.showEdit = true;
                  this.addReim=true;
                  this.bianji=true
                  return '未提交';
               case '1':
                  return '审核中';
               case '2':
                  return '已通过';
               case '3':

                  if (this.currentProcessors) {
                     //获取当前账号ucode
                     let ucode=JSON.parse(localStorage.getItem('userInfo')).ucode
                     console.log(ucode);
                     //获取当前审批人的ucode
                     this.currentProcessors.forEach((value,index)=>{
                        console.log(value.userName);
                        //"88829497"
                        //判断是否是需要开启审批按钮
                        if (ucode==value.userName){
                           console.log('表示是当前账号');
                           this.showEdit = true;
                           this.addReim=true;
                           this.bianji=true
                        }
                     })



                  }

                  return '未通过';
               case '4':
                  return '已过期';

            }
         },
         //机票行程
         Ticket() {
            switch (this.itinerary.tripType) {
               case 0:
                  return "单程出行";
               case 1:
                  return "往返出行";
               case 2:
                  return "多程出行";
               default:
                  break;
            }
         },
         //   状态颜色
         flowstatus() {
            if (this.itinerary.reimburseStatus==='1'){
               return `status-3`
            }
            if (this.itinerary.reimburseStatus==='4'){
               return `status-3`
            }
            return `status-${this.itinerary.reimburseStatus}`
         },
         //   费用预算总金额
         CostBudget() {
               return this.sumNum+this.addReimbursement
         }

      },
      //   过滤器
      filters: {
         changeTimeMounth(value) {
            let array = value.split(' ')
            let array2 = array[0].split('-')
            let time = array2[1] + '-' + array2[2]
            return time
         },
         changeTimeMin(value) {
            let array = value.split(' ')
            let array2 = array[1].split(':')
            let time = array2[1] + ':' + array2[2]
            return time
         },
         weekChange(value) {
            let arr1 = value.split(' ')
            let arr2 = arr1[0]
            let time = new Date(arr2)
            let monArr = arr2.split('/')
            let day = +time.getDay()
            let day2 = ''
            switch (day) {
               case 0:
                  day2 = ' 星期日';
                  break;
               case 1:
                  day2 = ' 星期一';
                  break;
               case 2:
                  day2 = ' 星期二';
                  break;
               case 3:
                  day2 = ' 星期三';
                  break;
               case 4:
                  day2 = ' 星期四';
                  break;
               case 5:
                  day2 = ' 星期五';
                  break;
               case 6:
                  day2 = ' 星期六';
                  break;
            }
            let month = monArr[1] + '月' + monArr[2] + '日'
            return month + day2
         }
         //   会议下方的
      }

   }
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
                margin: 1em 0;
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

                    &.status-0 {
                        color: rgb(166, 166, 166)
                    }
                    &.status-1 {
                        /*color: #88d632;*/
                        color: rgb(102, 154, 255);
                    }
                    &.status-2 {
                        color: #88d632;
                    }
                    &.status-3 {
                        color: #fe3c0f;

                    }
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



    .remBox{
        padding:0.4rem
        .remBoxTitle{

        }
        .popLine{
            width: 100%;
            border 1px solid #ccc;
            margin-top 0.3rem;
        }
        .remBoxSelect{
            font-size 0.32rem;
            border 1px solid rgb(128,128,128);
            margin-top 0.3rem
            background-color: white;
            padding-bottom 0.1rem;
            width:80%
        }
        .remBoxInput1{
            margin-top:0.3rem;
            display:flex;

            align-items:center;
            div:nth-of-type(1){
                flex:1
            }
            input{
                flex:3
                border-bottom 1px solid #ccc;
            }
            div:nth-of-type(2){
                flex:1
                text-align center
            }
        }


        .addAmount{
            display flex;
            /*justify-content space-between;*/
            align-items:center
            margin-top:0.3rem;
            div:nth-child(1){
                flex:1
            }
            div:nth-child(2){
                width: 30%
            }
            div:nth-child(3){
                width: 30%
            }
            div:nth-child(4){

                background-color: rgb(115,200,98);
                color: white;
                border-radius 4px;
                font-size 0.35rem;
                padding 2px
            }
        }

    }


    .addAmounts{
          display flex;
          align-items:center
          margin-top:0.3rem;
        justify-content:space-between;
        .amoucost1{
                width:20%;

            .fa{
                background-color: rgb(115,200,98);
                color: white;
                border-radius 4px;
                font-size 0.35rem;
                padding 2px

            }
        }
        .amoucost2{
            width:25%;
        }
        .amoucost3{
            width:25%;
            text-align right
        }



      }

</style>