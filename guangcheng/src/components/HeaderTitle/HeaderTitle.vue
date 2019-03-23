<template>
  <div class="header-title">
    <div class="btn-left">
      <div class="back" v-if="btnLeft" @click="goBack">
        <van-icon name="arrow-left"/>
      </div>
    </div>
    <div class="title" v-html="title"></div>
    <div class="btn-right">
      <div class="info" v-if="btnRight">
        <i :class="['fa',className]" @click="handleClick"></i>
        <span class="icon-msg" v-if="showMsg" @click="linkToMsg">
          <span class="msg-hint" v-if="messageNotice.allMessage > 0">{{messageNotice.allMessage}}</span>
        </span>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import {readMsg} from 'api/getMessageNotice.js';
import { mapMutations,mapGetters } from 'vuex';
export default {
  props:{
    title:{
      type:String,
      default:''
    },
    btnLeft:{
      type:Boolean,
      default:false,
    },
    btnRight:{
      type:Boolean,
      default:false
    },
    className:{
      type:String,
      default:''
    },
    showMsg:{
      type:Boolean,
      default:false
    }
  },
  computed:{
    ...mapGetters(['messageNotice'])
  },
  methods:{
    ...mapMutations({
      setPage: "SET_ALIVEPAGE",
      getAllMessage:'GET_ALLMESSAGE',
      getApplyMessage:'GET_APPLYMESSAGE',
      getApproveMessage:'GET_APPROVEMESSAGE'
    }),
    goBack(){
      this.$emit('back');
    },
    handleClick(){
      this.$emit('click');
    },
    // 组件内独享的事件
    linkToMsg(){
      // 如果有消息通知，清空消息提示
      if(this.messageNotice.allMessage > 0){
        readMsg();
        this.getAllMessage(0);
        this.getApplyMessage(0);
        this.getApproveMessage(0);
      }

      this.setPage('MainPageMeMessage');
      this.$router.push({
        name:'Message'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/style/mixin.styl';
  @import '~common/style/variable.styl';

  .header-title { 
    x-middle();
    padding:0.2rem;
    color :$color-white;
    text-align :center;
    background-color :$color-bg-high;  
    
    .btn-left {
      flex:1;
      text-align :left;

      .van-icon-arrow-left {
        vertical-align :middle;
      }
    }
    .title {
      flex:3;
    }
    .btn-right {
      flex:1;
      
      .info{
        padding-right:0.1rem;
        text-align :right;
        
        .icon-msg {
          position :relative;
          display:inline-block;
          vertical-align :middle;
          width:0.6rem;
          height:0.5rem;

          background-image :url(./com_message.png);
          background-size :0.6rem 0.5rem;

          .msg-hint{
            position: absolute;
            top:0;
            right:-0.1rem;
            width: 0.35rem;
	          height: 0.35rem;
            font-size:0.2rem;
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
</style>


