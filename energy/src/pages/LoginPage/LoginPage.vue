<template>
    <div class="login">
        <div class="logo">
            <img src="./index_logoGQ.png" alt="">
        </div>
        <div class="main">
            <div class="username">
                <div class="icon">
                    <img src="./index_nameGQ.png" alt="">
                </div>
                <input type="text" class="text" v-model="username">
                <div class="icon"></div>
            </div>
            <div class="password">
                <div class="icon">
                    <img src="./index_pswGQ.png" alt="">
                </div>
                <input  type="password" class="psd" v-model="password">
                <div class="icon"></div>
            </div>
            <div class="save-psd">
                <label for="saved">
                    <input id="saved" type="checkbox" v-model="savedUser" class="saved">
                    <span class="content">记住密码</span>
                </label>
            </div>
            <div class="button-login" @click="handleLogin()">
                登录
            </div>
        </div>
        <div class="footer">
            <p>©2018 广东机场白云信息科技有限公司</p>
            <p>广东白云国际机场商旅服务有限公司</p>
        </div>
    </div>
</template>

<script>
import { Toast, Dialog} from "vant";
import { login } from "./api.js";
import  verformLogin  from "api/verformLogin.js";
import {
  setLocal,
  getLocal,
  removeLocal
} from "common/js/storage.js";

export default {
  created() {
    // 判断是否自动填充用户名和密码
    if (JSON.parse(getLocal("savedUser"))) {
      this._writeUserInfo();
    }
    this.code = this.getQueryString("code"); //是否暂停
  },
  data() {
    return {
      username: "",
      password: "",
      savedUser: false,
      code:'',
    //   广汽新能源需要账户前面加A14
       newName:'',
    };
  },
  methods: {
    handleLogin() {
      const loginFlag = this._handleLoginInfo();
      if (!loginFlag) {
        return;
      } else {
        this._login();
      }
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      return null;
    },
    // 修复安卓会遮住键盘的问题
    fixAndroid(e) {
      setTimeout(() => {
        e.target.scrollIntoViewIfNeeded();
      }, 300);
    },
    // 自动填写用户名和密码
    // 处理登录后的数据
    _login() {
       // 广汽新能源的要在账号前面加A14
       this.newName='A14'+this.username
       // console.log(this.newName, this.password)
      login(this.newName, this.password).then(res => {
        if (res.success) {
          this._saveUserLoginInfo();
          this._setTokentoLocal(res.obj);
          setLocal('userInfo',JSON.stringify(res.obj))
          this.$router.push("/main");
        } else {
          Toast(res.msg);
        }
      });
    },
    // 判断用户是否了输入账号和密码
    _handleLoginInfo() {
      if (!this.username || !this.password) {
        Toast("用户名或密码不正确");
        return false;
      }
      return true;
    },
    // 记录用户的账号密码和是否选择记住密码
    _saveUserLoginInfo() {
      const obj = {
        username: this.username,
        password: this.password,
        savedUser: this.savedUser
      };
      for (const key in obj) {
        setLocal(key, obj[key]);
      }
    },
    // 自动填充储存在本地的用户名和密码
    _writeUserInfo() {
      const username = getLocal("username");
      const password = getLocal("password");
      this.username = username;
      this.password = password;
      this.savedUser = true;
    },
    // 所有的用户信息保存在本地
    _setTokentoLocal(obj) {
      setLocal("token", obj.ticket);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.login {
    y-view();
    full-fixed(2);
    background: url('./index_footerGQ.png') no-repeat bottom;
    //background-color: $color-bg-high;
    background-color: rgb(90,186,187);
    background-size: 100%;

    .logo {
        width: 1.28rem;
        padding: 1rem 0;
        margin: 0 auto;
        img{
            height:1.5rem;
        }
    }

    .main {
        flex: 1;
        padding: 0 0.2rem;

        input[type='text'], input[type='password'] {
            height: 0.5rem;
            text-align: center;
        }

        .username, .password {
            position:relative;
            x-middle();
            border-radius: 5px;
            margin-bottom: 0.2rem;
            background-color: $color-white;

            .text {
                flex: 1;
            }

            .psd {
                flex: 1;
            }

            .icon {
                width: 0.5rem;
                height: 0.5rem;
                padding: 0.2rem;
            }
        }

        .save-psd {
            .saved {
                vertical-align: middle;
                padding: 0.1rem;
            }

            .content {
                font-size: 16px;
                color: $color-white;
                vertical-align: middle;
            }
        }

        .button-login {
            padding: 0.25rem;
            border-radius: 5px;
            margin-top: 0.2rem;
            font-size: 0.32rem;
            color: $color-white;
            text-align: center;
            //background-color: $color-text-active;
            background-color:rgb(54,162,161);

        }
    }

    .footer {
        margin-bottom: 0.1rem;
        color: $color-white;
        text-align: center;
        font-size: 0.18rem;
    }
}
</style>


