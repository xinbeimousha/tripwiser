<template>
  <div class="attribution">
    <div class="title">
      <span class="back" @click="goBack">
        <i class="fa fa-angle-left"></i>
        返回
      </span>
      <div class="search">
        <van-search placeholder="请输入部门搜索" v-model="searchText" background='#3B5999' />
      </div>
    </div>
    <div class="container">
      <div class="normal-content" v-show="!searchText">
        <van-radio-group v-model="choosedDepart">
          <div class="company-item border-1px">
            <van-radio :name="company">
              <span class="company-name">{{company.name}}</span>
            </van-radio>
          </div>
          <div class="depart" v-if="departs.length">
            <van-radio class="border-1px" v-for="(item,index) in departs" :key="index" :name="item">
              {{item.name}}
            </van-radio>
          </div>
        </van-radio-group>
      </div>
      <div class="search-content" v-show="searchText">
        <div class="search" v-if="searchList.length > 0">
          <van-radio-group v-model="choosedDepart">
              <van-radio class="list-item"   v-for="(item,index) in searchList" :key="index" :name="item">
                {{item.departname}}
              </van-radio>
          </van-radio-group>
        </div>
        <div class="no-result" v-if="hasNoOne">没有查到该部门</div>
      </div>
    </div>
    <FooterBtn v-show="showFooter" @cancel="cancel" @sure="sure" />
  </div>
</template>

<script>
import FooterBtn from "components/FooterBtn/FooterBtn";
import bus from "common/js/bus.js";
import { debounce } from "common/js/utils.js";
import { getProject, searchDeparts } from "./api.js";
import { getLocal } from "common/js/storage.js";
import { Toast } from "vant";

export default {
  components: {
    FooterBtn
  },
  data() {
    return {
      departs: [],
      searchText: "",
      searchList: [],
      choosedDepart: null,
      hasNoOne: false,
      showFooter:true
    };
  },
  watch: {
    searchText(value) {
      this.hasNoOne = false;
      this.searchList = [];
      value = value.trim();
      console.log(value);

      this._searchDebounce(value);
    }
  },
  created() {
    const userInfo = JSON.parse(getLocal("userInfo"));
    this.company = {
      id: userInfo.companyId,
      comId: userInfo.comId,
      name: userInfo.comName
    };
    this._getProject();
    this._searchDebounce = debounce(this._searchDeparts, 500);
    window.onresize = () => {
      this.showFooter = !this.showFooter
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
      console.log(this.choosedDepart);
      if (!this.choosedDepart) {
        Toast("请选择部门");
      } else {
        if(this.choosedDepart.hasOwnProperty('departname')){
          let copyChoosed;
          if(this.choosedDepart.preDeptName==''){
              copyChoosed={
              name:this.choosedDepart.departname,
              id:this.choosedDepart.id,
              comId:this.choosedDepart.orgcode
            }
          }else{
            copyChoosed={
              name:this.choosedDepart.departname,
              id:this.choosedDepart.id,
              orgCode:this.choosedDepart.orgcode,
              type:this.choosedDepart.type,
              childNodeCount:this.choosedDepart.childNodeCount
            }
          }
          this.choosedDepart=copyChoosed;
          console.log(this.choosedDepart);
        }
        bus.$emit("choosedDepart", this.choosedDepart);
        this.$router.go(-1);
      }
    },
    async _getProject() {
      const result = await getProject();
      if (result.datas && result.datas.length) {
        this.departs = result.datas;
      }
    },
    async _searchDeparts(keyWord) {
      this.hasNoOne = false;
      const result = await searchDeparts(keyWord);
      console.log(this.searchText);
      if (!result.success) {

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

.attribution >>> .van-radio__input {
  height: 0.5rem;
}

.attribution {
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
    .normal-content {
      background-color: #fff;
    }

    .list-item {
      padding: 0.1rem 0.2rem;
    }

    .company-item {
      padding: 0.1rem 0.2rem;
      border-1px($color-solid);
      .fa {
        color: #999;
      }
    }

    .depart {
      margin-left: 0.8rem;

      .border-1px {
        padding: 0.1rem 0;
        border-1px($color-solid);
      }
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


