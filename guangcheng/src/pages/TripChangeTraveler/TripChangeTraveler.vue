<template>
  <div class="change-pepole">
    <div class="title">
      <span class="back" @click="goBack">
        <i class="fa fa-angle-left"></i>
        返回
      </span>
      <div class="search">
        <van-search placeholder="请输员工姓名搜索" background='#3B5999' v-model="searchText" />
      </div>
    </div>
    <div class="container">
      <div class="normal-content" v-show="!searchText">
        <van-radio-group v-model="choosedItem" v-if="normalList.length > 0">
          <van-radio class="list-item border-1px" v-for="(item,index) in normalList" :key="index" :name="item">
            {{item.realname}}({{item.username}})
          </van-radio>
        </van-radio-group>
      </div>
      <div class="search-content" v-show="searchText">
        <div class="search" v-if="searchList.length > 0">
          <van-list>
            <van-radio-group v-model="choosedItem">
              <van-radio class="list-item border-1px" v-for="(item,index) in searchList" :key="index" :name="item">
                {{item.realname}}({{item.username}})
              </van-radio>
            </van-radio-group>
          </van-list>
        </div>
        <div class="no-result" v-if="hasNoOne">没有查到该人员</div>
      </div>
    </div>
    <FooterBtn v-show="showFooter" @cancel="cancel" @sure="sure" />
  </div>
</template>

<script>
import { getDepartsAndNames, searchOthers } from "api/getDepartsAndNames.js";
import { getLocal } from "common/js/storage.js";
import { debounce } from "common/js/utils.js";
import bus from "common/js/bus.js";
import FooterBtn from "components/FooterBtn/FooterBtn";

export default {
  name: "tripChangeTraveler",
  components: {
    FooterBtn
  },
  data() {
    return {
      choosedItem: null,
      normalList: [],
      searchList: [],
      searchText: "",
      hasNoOne: false,
      page: 1,
      showFooter: true
    };
  },
  watch: {
    searchText(value) {
      this.hasNoOne = false;
      this.searchList = [];
      value = value.trim();
      this._searchDebounce(value);
    }
  },
  created() {
    this.userInfo = JSON.parse(getLocal("userInfo"));
    this.selfId = this.userInfo.departId;
    this._getDepartsAndNames(this.selfId);
    this._searchDebounce = debounce(this._searchOthers, 500);
    window.onresize = () => {
      this.showFooter = !this.showFooter;
    };
  }, 
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    cancel() {
      this.goBack();
    },
    sure() {
      if (!this.choosedItem) {
        Toast("请选择申请人");
      } else {
        bus.$emit("choosedItem", this.choosedItem);
        this.$router.go(-1);
      }
    },
    async _getDepartsAndNames(selfId) {
      const obj = {
        selfId
      };
      const result = await getDepartsAndNames(obj);
      if (result.success) {
        this.normalList = result.obj.users;
      }
    },
    async _searchOthers(keyWord) {
      this.hasNoOne = false;
      const result = await searchOthers(keyWord, this.page, this.selfId);
      if ((!result.success || !result.obj) && this.page === 1) {
        this.hasNoOne = true;
        return;
      }
      this.searchList = result.obj;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.change-pepole >>> .van-radio__input {
  height: 0.5rem;
}

.change-pepole {
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

  .container {
    flex: 1;
    scrolling();

    .list-item {
      padding: 0.1rem 0.2rem;
      border-1px($color-solid);
    }

    .search-content {
      .no-result {
        margin-top: 0.2rem;
        color: $color-text-h;
        text-align: center;
      }
    }
  }
}
</style>


