<template>
  <div class="city-list">
    <div class="title">
      <span class="back" @click="goBack">
        <i class="fa fa-angle-left"></i>
        返回
      </span>
      <div class="search">
        <van-search placeholder="请输入城市搜索" background='#3B5999' v-model="searchText" />
      </div>
    </div>
    <div class="container">
      <div class="normal-content" v-show="!searchText">
        <van-tabs class="city"
          @click="chooseCityType()"
          v-model="currentIndex"
        >
          <van-tab title="国内城市">
          </van-tab>
          <!--添加国际航程-->
          <van-tab title="国际城市/港澳台">
          </van-tab>
        </van-tabs>
        <Scroll class="content" ref="scroll" :data="citys">
            <div class="scroll-container">
              <header class="scroll-headertitle">热门城市</header>
              <ul class="scroll-celllist">
                <li class="scroll-cellitem" v-for="(item,index) in hotCitys" :key="index" @click="chooseCity(item)">
                  <div class="scroll-cell">{{item.n}}</div>
                </li>
              </ul>
              <div class="scroll-main">
                <div class="scroll-panel" ref="panel" v-for="(city,index) in citys" :key="index">
                  <header class="scroll-tittle">{{city.title}}</header>
                  <ul class="scroll-list">
                    <li class="scroll-item" v-for="(item,i) in city.items" :key="i" @click="chooseCity(item)">
                      <p class="scroll-row">{{item.n}}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="list-shortcut" v-show="currentIndex==0">
              <ul v-for="(item,index) in shortcutList" :key="index">
                <li class="list-item" @touchstart="scrolling(index)">{{item}}</li>
              </ul>
            </div>
          </Scroll>
      </div>
      <div class="search-content" v-show="searchText">
        <div class="search" v-if="searchList.length > 0">
          <ul class="search-list">
            <li class="search-item" v-for="(item,index) in searchList" :key="index" @click="chooseCity(item)">
              {{item.n}}
            </li>
          </ul>
        </div>
        <div class="no-result" v-if="hasNoOne">没有查到该城市</div>
      </div>
    </div>
  </div>
</template>

<script>
import { domehotCity, domeCity, cityList, interCity , interhotCity} from "common/js/cityData.js";
import bus from "common/js/bus.js";
import { debounce } from "common/js/utils.js";
import Scroll from "components/Scroll/Scroll";
export default {
  components: {
    Scroll
  },
  props: ["id"],
  data() {
    return {
      currentIndex:0,//当前的城市类型索引
      citys: domeCity,
      hotCitys: domehotCity,
      cityList: cityList,
      searchList: [],
      searchText: "",
      hasNoOne: false,
    //   国际城市数据
       interCity:interCity,
       //国际热门城市
       interhotCity:interhotCity,
       interCityList:[],

    };
  },
  computed: {
    shortcutList() {
      return this.citys.map(item => {
        return item.title;
      });
    },
    index() {
      return Number(this.id);
    }
  },
  watch: {
    searchText(value) {
      this.hasNoOne = false;
      this.searchList = [];
      value = value.trim();
      this._searchDebounce(value)
    }
  },
  created(){
    this._searchDebounce = debounce(this._seachCity, 500);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 选择城市类型
    chooseCityType(){
     if(this.currentIndex == 0){
       this.citys = domeCity;
       this.hotCitys = domehotCity
     }
     if(this.currentIndex == 1){
       this.citys = interCity;
       this.hotCitys = interhotCity;
     }
    },
    chooseCity(item) {
      bus.$emit("city", item, this.index);
      this.goBack();
    },
    scrolling(index) {
      const scrollTo = this.$refs.panel[index].offsetTop + "px";
      this.$refs.scroll.scrollToElement(this.$refs.panel[index], 0);
    },
    // 搜索城市列表
    _seachCity(searchText){
      const [isCh,isEn] = [/^[\u4E00-\u9FFF]+$/g,/^[a-zA-Z]+$/ig];
      const [chFlag,enFlag] = [isCh.test(searchText),isEn.test(searchText)]
      if(!chFlag && !enFlag){
        this.hasNoOne = true;
        return;
      }
      if(chFlag){
        this.cityList.forEach((item) => {

          if(item.n.indexOf(searchText) > -1){
            this.searchList.push(item)
          }
        })
      }
      //判断是在国内机票还是国际机票，enFlag是国际机票
      if(enFlag){
        searchText = searchText.toLowerCase();
        this.cityList.forEach((item,index) => {
           if(index === 0){
              console.log(item)
           }
          if((item.py.indexOf(searchText) > -1) || (item.sx.indexOf(searchText) > -1)){
            this.searchList.push(item)
          }
        })
      }
      (this.searchList.length < 1) && (this.hasNoOne = true);
    },
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.city-list {
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

    .city >>> .van-tab--active {
      color: $color-text-active;
    }

    .city >>> .van-tabs__line {
      background-color: $color-text-active;
    }

    .normal-content {
      y-view();
    }

    .content {
      flex: 1;
      overflow: hidden;
      position: relative;

      .scroll-container {
        .scroll-headertitle {
          padding-left: 12px;
          padding-right: 12px;
          line-height: 0.48rem;
          font-size: 12px;
          color: $color-text-h;
        }

        .scroll-celllist {
          overflow: hidden;
          padding: 0 32px 6px 9px;

          .scroll-cellitem {
            float: left;
            width: 33.33333%;
            padding: 3px;
            box-sizing: border-box;

            .scroll-cell {
              font-size: 13px;
              line-height: 30px;
              border: 1px solid #e0e0e0;
              border-width: 0.5px !important;
              background-color: #fff;
              text-align: center;
            }
          }
        }

        .scroll-main {
          .scroll-panel {
            .scroll-tittle {
              padding: 0 10px;
              height: 24px;
              border-top: 1px solid #e1e1e1;
              border-bottom: 1px solid #e1e1e1;
              borer-width: 0.5px;
              background-color: #fbfbfb;
              color: rgba(32, 37, 37, 0.4);
              font-size: 12px;
              line-height: 24px;
            }

            .scroll-list {
              background-color: #fff;

              .scroll-item {
                padding-left: 12px;

                .scroll-row {
                  padding-right: 30px;
                  border-bottom: 1px solid rgba(32, 35, 37, 0.15);
                  line-height: 45px;
                  color: #3d3d3d;
                  font-size: 16px;
                }

                &:last-child .scroll-row {
                  border: 0;
                }
              }
            }
          }
        }
      }

      .list-shortcut {
        position: absolute;
        top: 10%;
        right: 0;
        z-index: 30;

        .list-item {
          cursor: pointer;
          width: 30px;
          height: 16px;
          font-size: 9px;
          color: rgba(32, 35, 37, 0.6);
          text-align: center;
        }
      }
    }

    .search-content {
      .search-list{
          padding:5px 0;
        .search-item{
          padding:0 12px 5px 12px;
        }
      }
      .no-result {
        margin-top: 0.2rem;
        color: $color-text-h;
        text-align: center;
      }
    }
  }
}
</style>



