<template>
  <div class="peer-add">
    <div class="title">
      <span class="back" @click="goBack">
        <i class="fa fa-angle-left"></i>
        返回
      </span>
      <div class="search">
        <van-search placeholder="请输员工姓名搜索" v-model="searchText" background='#3B5999' />
      </div>
    </div>
    <div class="container" ref="container">
      <div class="normal-content" v-show="!searchText">

        <div class="list-item border-1px" v-for="(item,index) in departs" :key="index" ref="list" @click="hangleClickDepart(item,index)">
          <i class="fa" :class="item.show?'fa-angle-down':'fa-angle-right'">
          </i>
          <span class="depart-name">{{item.departname}}</span>
          <div class="users" @click.stop>
            <van-checkbox-group class="user-group border-1px-top" v-if="item.show && item.users.length" v-model="item.choosedPeer">
              <van-checkbox :disabled="item.choosed" class="user-item" v-for="(item,index) in item.users" :key="index" :name="item">
                {{item.realname}}({{item.username}})
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>

      </div>

      <div class="search-content" v-show="searchText">
        <div class="search" v-if="searchUsers.length ">
          <van-list>
            <van-checkbox-group v-model="searchChoosedPeer">
              <van-checkbox class="list-item border-1px" :disabled="item.choosed" v-for="(item,index) in searchUsers" :key="index" :name="item">
                {{item.realname}}({{item.username}})
              </van-checkbox>
            </van-checkbox-group>
          </van-list>
        </div>
        <div class="no-result" v-if="hasNoOne">没有查到该人员</div>
      </div>
    </div>


    <div class="footer" v-show="showFooter">
      <div class="peer-name">
        已选择的同行人:{{choosedName}}
      </div>
      <FooterBtn @cancel="cancel" @sure="sure" />
    </div>
  </div>
</template>

<script>
import { getLocal } from "common/js/storage.js";
import bus from "common/js/bus";
import { getDepartsAndNames, searchOthers } from "api/getDepartsAndNames.js";
import { debounce } from "common/js/utils.js";
import FooterBtn from "components/FooterBtn/FooterBtn";
import { Toast } from "vant";

export default {
  components: {
    FooterBtn
  },
  data() {
    return {
      departs: [],
      users: [],
      searchUsers: [],
      searchChoosedPeer: [],
      activeName: "",
      searchText: "",
      hasNoOne: false,
      page:1,
      showFooter:true
    };
  },
  computed: {
    // 计算已选的人员
    choosedPeer() {
      let choosedPeer = [];
      if (!this.departs.length) {
        return [];
      }
      this.departs.forEach(item => {
        item.choosedPeer.length &&
          item.choosedPeer.forEach(peer => {
            choosedPeer.push(peer);
          });
      });
      choosedPeer = choosedPeer.concat(this.searchChoosedPeer);
      return choosedPeer;
    },
    choosedName() {
      if (!this.choosedPeer.length) {
        return "无";
      }
      let choosedNameArr = [];
      this.choosedPeer.forEach(item => {
        choosedNameArr.push(item.realname);
      });
      return choosedNameArr.join(",");
    }
  },
    watch: {
    searchText(value) {
      this.hasNoOne = false;
      this.searchUsers = [];
      value = value.trim();
      this._searchDebounce(value);
    }
  },
  created() {
    this.userInfo = JSON.parse(getLocal("userInfo"));
    this.comId = this.userInfo.comId;
    this.users = this.$route.params.users;
    this._getDepartsByParentId(this.comId);
    this._searchDebounce = debounce(this._searchOthers, 500);
    window.onresize = () => {
      this.showFooter = !this.showFooter;
    }

  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    cancel() {
      this.goBack();
    },
    sure() {
      if (!this.choosedPeer.length) {
        Toast("请选择申请人");
      } else {
        bus.$emit("choosedPeer", this.choosedPeer);
        console.log(this.choosedPeer);
        this.$router.go(-1);
      }
    },
    // 处理点击部门列表的事件
    hangleClickDepart(item, index) {
      this._getUsersByorgCode(item, index);
      item.show = !item.show;
      if (!item.load && item.show) {
        this.$nextTick(() => {
          this._scrolling(index);
        });
      }
    },
    // 获取部门的名称
    async _getDepartsByParentId(comId) {
      const obj = {
        parentId: comId
      };
      let result = await getDepartsAndNames(obj);
      if (result.success) {
        result.obj.departs.forEach(item => {
          item.users = [];
          item.choosedPeer = [];
          item.show = false;
          item.load = true;
        });
        this.departs = result.obj.departs;
        // console.log(result);
      }
    },
    // 获取部门的人员信息
    async _getUsersByorgCode(item, index) {
      if (!item.load) {
        return;
      }
      const obj = {
        parentId: item.orgCode
      };
      let result = await getDepartsAndNames(obj);
      if (result.success) {
        item.load = false;
        result.obj.users.forEach(item => {
          item.choosed = false;
        })
        item.users = result.obj.users;
        // 过滤已经在申请页面显示的同行人
        item.users.forEach(user => {
          this.users.forEach(val => {
            if(user.username === val.code){
              user.choosed = true;
            }
          })
        })
        this.$nextTick(() => {
          this._scrolling(index);
        });
      }
    },
    // 滚动到对应的部门
    _scrolling(index) {
      const scrolling = this.$refs.list[index].offsetTop;
      this.$refs.container.scrollTop = scrolling;
    },
    // 搜索人员
    async _searchOthers(keyWord) {
      this.hasNoOne = false;
      const result = await searchOthers(keyWord, this.page);
      if ((!result.success || !result.obj) && this.page === 1) {
        this.hasNoOne = true;
        return;
      }
      result.obj.forEach(item => {
          item.choosed = false;
        })
      this.searchUsers = result.obj;
        this.searchUsers.forEach(user => {
          // 过滤已经在申请页面显示的同行人
          this.users.forEach(val => {
            if(user.username === val.code){
              user.choosed = true;
            }
          })
          // 过滤已经搜索且选择过的同行人
          this.searchChoosedPeer.forEach((peer,index,arr) => {
            if(user.username === peer.username){
               const oldPeerIndex = arr.findIndex(item => {
                   return item.username === user.username
               })
              arr.splice(oldPeerIndex,1,user) 
            }
          })
        })
    }
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.peer-add {
  y-view();

  .title {
    x-middle();
    padding-left: 0.2rem;
    background-color: $color-bg-high;

    .back {
      color: #fff;

      .fa {
        vertical-align: top;
        font-size: 0.4rem;
      }
    }

    .search {
      flex: 1;
    }
  }

  .container >>> .van-cell {
    padding: 0.1rem 0.2rem;
  }

  .container {
    position: relative;
    flex: 1;
    scrolling();

    .normal-content {
      .list-item {
        padding: 0.2rem 0 0.2rem 0.2rem;
        background-color: #fff;
        border-1px($color-solid);

        .fa {
          color: #999;
        }

        .depart-name {
          padding-bottom: 0.2rem;
        }

        .users {
          padding-left: 0.2rem;

          .user-group {
            border-1px-top(#eee);
          }

          .user-item {
            padding: 0.1rem 0;
          }
        }
      }
    }

    .search-content {
      .list-item {
        padding: 0.1rem 0.2rem;
        border-1px($color-solid);
      }
      .no-result {
        margin-top: 0.2rem;
        color: $color-text-h;
        text-align: center;
      }
    }
  }

  .footer {
    .peer-name {
      padding: 0.1rem 0.2rem;
      color: $color-text-active;
      background-color: #fff;
    }
  }
}
</style>


