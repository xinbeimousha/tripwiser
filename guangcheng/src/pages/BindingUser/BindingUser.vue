<template>
  <div class="bind">
    <HeaderTitle title="绑定企业微信" />
    <van-cell-group>
      <van-field
        v-model="username"
        required
        clearable
        label="员工号"
        icon="question"
        placeholder="请输入员工号"
        @click-icon="$toast('question')"
      />

      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
      />
    </van-cell-group>
    <van-button class="submit-btn" size="large" type="primary" @click.native="submit">绑定</van-button>
  </div>
</template>

<script>
  import HeaderTitle from "components/HeaderTitle/HeaderTitle.vue";
  import { Toast } from "vant";
  import  verformLogin  from "api/verformLogin.js";
  import { setLocal } from "common/js/storage.js";
    export default {
      components: {
        HeaderTitle
      },
      data() {
        return {
          username: "",
          password: "",
          corpId:'',
          userId:''
        };
      },
      created() {
        this.corpId=this.$route.query.corpId
        this.userId=this.$route.query.userId
      },
      methods: {
        submit(){
          if(!this.verifyPrame()){
            return false;
          }
          let that=this;
          verformLogin.bindingUser(this.corpId,this.userId,this.username,this.password).then(res => {
            console.log(res);
            if (res.success) {
              Toast(res.msg);
              setLocal('userInfo',JSON.stringify(res.obj))
              setTimeout(function(){
                that.$router.push("/main");
              },2000)
            } else {
              Toast(res.msg);
            }
          });

        },
        verifyPrame(){
          if(!this.username || !this.password){
            Toast("员工号或密码不正确");
            return false;
          }
          return true;
        }
      }


    }
</script>

<style lang="stylus" scoped>
.submit-btn.van-button--primary{
  background-color :#3b5999;
  border-color:#3b5999;
}
</style>

