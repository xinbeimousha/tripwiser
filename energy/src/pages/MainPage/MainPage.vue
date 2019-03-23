<template>
    <div class="main">
        <keep-alive include="trip">
          <router-view/>
        </keep-alive>
        <div class="footer-tab" v-if="footshow">
            <router-link tag="div" class="tab-item" to="/main/apply"  replace>
               <div class="item">
                   <span class="icon apply"></span>
                   <div class="content">申请</div>
               </div>
             </router-link>
            <router-link tag="div" class="tab-item" to="/main/book" replace>
                <div class="item">
                    <span class="icon book"></span>
                    <div class="content">预订</div>
                </div>
            </router-link>
            <router-link tag="div" class="tab-item" to="/main/trip" replace>
                <div class="item">
                    <span class="icon trip"></span>
                    <div class="content">行程</div>
                </div>
            </router-link>
             <router-link tag="div" class="tab-item" to="/main/me" replace>
                <div class="item">
                    <span class="icon me"></span>
                    <div class="content">我</div>
                </div>
             </router-link>
        </div>
    </div>
</template>

<script>
import { Toast } from "vant";
import { login } from "../LoginPage/api.js";
import { setLocal, getLocal, removeLocal } from "common/js/storage.js";
import { mapActions,mapGetters,mapMutations } from 'vuex';
export default {
  name: "mainPage",
  data() {
    return {
      username: "",
      password: "",
      footshow: true
    };
  },
  computed:{
    ...mapGetters(['messageNotice'])
  },
  created() {
    this.getNotReadMsg();
    if (this.$route.query.username) {
      this.username = this.$route.query.username;
      this.password = this.$route.query.password;
      this.footshow = false;
      this._login();
    }
  },
  methods: {
    ...mapActions([
        'getNotReadMsg'
    ]),
    _login() {
      login(this.username, this.password).then(res => {
        if (res.success) {
          setLocal("token", res.obj.ticket);
          setLocal("userInfo", JSON.stringify(res.obj));
        } else {
          Toast(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.main {
    y-view();
    full-fixed(1);

    .footer-tab {
        x-middle();

        .tab-item {
            flex: 1;
            padding: 0.15rem;
            text-align: center;
            color: $color-text;

            .item {
                line-height: 1;

                .icon {
                    display: inline-block;
                    width: 0.5rem;
                    height: 0.5rem;
                    background-size: cover;
                    background-repeat: no-repeat;

                    &.apply {
                        background-image: url('./main_apply.png');
                    }

                    &.book {
                        background-image: url('./main_book.png');
                    }

                    &.trip {
                        background-image: url('./main_trip.png');
                    }

                    &.me {
                        background-image: url('./main_me.png');
                    }
                }
            }

            &.router-link-active {
                color: $color-text-active;

                .icon {
                    &.apply {
                        background-image: url('./main_apply_ed.png');
                    }

                    &.book {
                        background-image: url('./main_book_ed.png');
                    }

                    &.trip {
                        background-image: url('./main_trip_ed.png');
                    }

                    &.me {
                        background-image: url('./main_me_ed.png');
                    }
                }
            }
        }
    }
}
</style>


