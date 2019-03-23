<template>
    <div style="height: 100%;display: flex;flex-direction: column;"
    >
        <HeaderTitle title="产品采购额"
                     :btnLeft="true"
                     @back="fanhTap"
                     class="headerTitle"/>
        <!--选择器-->
        <div style="flex: 1;overflow: hidden" ref="wrapper">
            <div>
                <div class="selected van-clearfix" @click="selectedTap">
            <div class="selected-left">年份选择:</div>
            <div class="selected-right van-clearfix">
                <div class="selected-search">{{searchDate}}</div>
                <div class="fa fa-angle-right ico iconn">
                </div>
            </div>
        </div>
                <div id="container" style="width:100%;"></div>
                <div style="background-color: white">
            <div id="container2" style=""></div>
        </div>
                <div id="container3" style="width:100%; "></div>

                <div id="container4" style="width:100%; "></div>
            </div>
        </div>
        <!--推出的时间选择器-->
        <van-popup v-model="showDate" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columns"
                    @cancel="showDate=!showDate"
                    @confirm="onConfirm"
                    @change="onChange">

            </van-picker>


        </van-popup>
    </div>
</template>

<script>
import HeaderTitle from "components/HeaderTitle/HeaderTitle.vue";

//引入后台数据接口
import { getMeProduct } from "api/getMeApi";
//引入highCharts
import Highcharts from "highcharts";
//引入better滚动
import BScroll from "better-scroll";

export default {
  components: {
    HeaderTitle
  },
  data() {
    return {
      showDate: false,
      columns: ["2018", "2017"],
      comId: "",
      startDate: "2018-01-01",
      endDate: "2019-01-01",
      searchDate: "选择年份进行查询",
      value: "2018"
    };
  },
  methods: {
    onChange(picker, value, index) {
      console.log(value);
      this.value = value;
      this.startDate = value + "-01-01";
      this.endDate = parseInt(value) + 1 + "-01-01";

      console.log(this.startDate, this.endDate);
    },
    //确定选择时间
    onConfirm() {
      getMeProduct(this.startDate, this.endDate, this.comId).then(res => {
        this.searchDate = this.value + " 年产品采购额";
        this.drawLine(res);
      });
      this.showDate = false;
    },
    //点击弹出时间选项
    selectedTap() {
      this.showDate = true;
    },
    fanhTap() {
      this.$router.push({ name: "Expenses" });
    },
    //第一个图表
    drawLine(result) {
      var model = {};
      model.xAxis = result.obj.xAxis;
      model.flight = result.obj.flight;
      model.hotel = result.obj.hotel;
      model.train = result.obj.train;
      model.car = result.obj.car;
      model.spaceroom = result.obj.spaceroom;
      model.flightNumber = result.obj.flightNumber;
      model.quarterResult = result.obj.quarterResult;
      // 基于准备好的dom，初始化echarts实例
      var chart = Highcharts.chart("container", {
        chart: {
          type: "column"
        },
        title: {
          text: "各产品采购额"
        },

        xAxis: {
          categories: result.obj.xAxis
        },
        yAxis: {
          labels: {
            align: "left"
          },
          min: 0,
          title: {
            text: "各产品采购总量",
            x: -10
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color: (Highcharts.theme && Highcharts.theme.textColor) || "gray"
            }
          }
        },
        credits: {
          enabled: false
        },
        legend: {
          align: "center",
          x: 0,
          verticalAlign: "top",
          y: 0,
          // width: 350,
          floating: false,
          backgroundColor:
            (Highcharts.theme && Highcharts.theme.background2) || "white",
          borderColor: "#CCC",
          borderWidth: 1,
          shadow: false
        },
        tooltip: {
          // head + 每个 point + footer 拼接成完整的 table
          formatter: function() {
            return (
              "<b>" +
              this.x +
              "</b><br/>" +
              this.series.name +
              ": " +
              this.y +
              "<br/>"
            );
            //总量堆叠：      +'总量: ' + this.point.stackTotal;
          }
        },
        // plotOptions: {
        //    column: {
        //       stacking: 'normal',
        //       dataLabels: {
        //          enabled: true,
        //          color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
        //          style: {
        //             textShadow: '0 0 3px black'
        //          }
        //       }
        //    }
        // },
        series: [
          {
            name: "休息室",
            data: result.obj.spaceroom
          },
          {
            name: "专车",
            data: result.obj.car
          },
          {
            name: "火车",
            data: result.obj.train
          },
          {
            name: "酒店",
            data: result.obj.hotel
          },
          {
            name: "机票",
            data: result.obj.flight
          }
        ]
      });
      // 绘制图表
      this.Dcontainer2(model);
      this.Dcontainer3(model);
      this.Dcontainer4(model);

      //开启滚动
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {
          startX: 0,
          click: true,
          // scrollX:true,
          scrollY: true
        });
      });
    },
    //   第二个图表
    Dcontainer2(model) {
      console.log(model);
      var chart = {
        renderTo: "chart"
      };
      var title = {
        text: "各项产品采购占比"
      };
      var subtitle = {
        //                text: 'Source: ' + r.companyName
      };
      var credits = {
        enabled: false
      };
      var tooltip = {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:10px">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:,.2f}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true
      };

      var plotOptions = {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                "black"
            }
          }
        }
      };
      var credits = {
        enabled: false
      };
      var flightData = model.flight;
      var hotelData = model.hotel;
      var train = model.train;
      var car = model.car;
      var spaceroom = model.spaceroom;
      var f = 0;
      var h = 0;
      var t = 0;
      var c = 0;
      var s = 0;
      for (var i = 0; i < flightData.length; i++) {
        f += flightData[i];
      }
      for (var i = 0; i < hotelData.length; i++) {
        h += hotelData[i];
      }
      for (var i = 0; i < train.length; i++) {
        t += train[i];
      }
      for (var i = 0; i < car.length; i++) {
        c += car[i];
      }
      for (var i = 0; i < spaceroom.length; i++) {
        s += spaceroom[i];
      }
      console.log(h);

      var flightSeries = [
        {
          type: "pie",
          name: "各项产品累计采购额占比",
          data: [
            ["机票", f],
            ["酒店", h],
            ["火车票", t],
            ["专车", c],
            ["休息室", s]
          ]
          //                data : exdata
        }
      ];
      var flightJson = {};
      flightJson.credits = credits;
      flightJson.chart = chart;
      flightJson.title = title;
      flightJson.subtitle = subtitle;
      flightJson.tooltip = tooltip;
      flightJson.series = flightSeries;
      flightJson.plotOptions = plotOptions;
      flightJson.credits = credits;

      Highcharts.chart("container2", flightJson);
    },
    Dcontainer3(model) {
      Highcharts.chart("container3", {
        chart: {
          type: "bar"
        },
        credits: {
          enabled: false
        },
        title: {
          text: "各季度各项目消费占比"
        },
        xAxis: {
          categories: ["第一季度", "第二季度", "第三季度", "第四季度"]
        },
        yAxis: {
          min: 0,
          title: {
            text: ""
          }
        },
        legend: {
          align: "center",
          x: 0,
          verticalAlign: "top",
          y: 0,
          // width: 350,
          floating: false,
          backgroundColor:
            (Highcharts.theme && Highcharts.theme.background2) || "white",
          borderColor: "#CCC",
          borderWidth: 1,
          shadow: false
        },
        plotOptions: {
          series: {
            stacking: "normal"
          }
        },
        series: [
          {
            name: "机票",
            data: model.quarterResult.flightQuarter
          },
          {
            name: "酒店",
            data: model.quarterResult.hotelQuarter
          },
          {
            name: "火车票",
            data: model.quarterResult.trainQuarter
          },
          {
            name: "专车",
            data: model.quarterResult.carQuarter
          },
          {
            name: "休息室",
            data: model.quarterResult.spaceroomQuarter
          }
        ]
      });
    },
    Dcontainer4(model) {
      var chart = {
        zoomType: "xy"
      };
      var title = {
        text: "机票价格及票量"
      };
      var subtitle = {
        //          text: '数据来源: WorldClimate.com'
      };
      var credits = {
        enabled: false
      };
      var xAxis = [
        {
          categories: model.xAxis,
          crosshair: true
        }
      ];
      var yAxis = [
        {
          // Primary yAxis
          min: 0,
          labels: {
            align: "left",
            format: "{value}",
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          title: {
            x: -10,
            text: "票量",
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          }
        },
        {
          // Secondary yAxis
          title: {
            x: 5,
            text: "票价",
            margin: 0,
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          labels: {
            x: 0,
            align: "right",
            format: "{value}",
            reserveSpace: true,
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          opposite: true
        }
      ];
      var tooltip = {
        shared: true
      };
      var legend = {
        // layout: 'vertical',
        align: "center",
        // x: 120,
        verticalAlign: "top",
        // y: 100,
        floating: false,
        backgroundColor:
          (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
          "#FFFFFF"
      };
      var series = [
        {
          name: "票价(元)",
          type: "column",
          yAxis: 1,
          data: model.flight
          // tooltip: {
          //     valueSuffix: '（元）'
          // }
        },
        {
          name: "票量(张)",
          type: "spline",
          data: model.flightNumber
          // tooltip: {
          //     valueSuffix: '（张）'
          // }
        }
      ];
      var xyJson = {};
      xyJson.credits = credits;
      xyJson.chart = chart;
      xyJson.title = title;
      xyJson.subtitle = subtitle;
      xyJson.xAxis = xAxis;
      xyJson.yAxis = yAxis;
      xyJson.tooltip = tooltip;
      xyJson.legend = legend;
      xyJson.series = series;
      Highcharts.chart("container4", xyJson);
    }
  },
  mounted() {
    this.comId = JSON.parse(localStorage.getItem("userInfo")).comId;
    console.log(this.comId);
    getMeProduct(this.startDate, this.endDate, this.comId).then(res => {
      if (res) {
        this.drawLine(res);
      }
    });
  }
};
</script>

<style scoped lang="stylus">
.headerTitle {
    // 头部样式
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
}

// 选择器
.selected {
    padding: 1.15rem 0.2rem 0.2rem;
    background-color: white;
    border-bottom: 1px solid rgb(229, 229, 229);
    font-size: 0.26rem;

    .selected-left {
        /* width:60% */
        float: left;
    }

    .selected-right {
        float: right;
        width: 70%;

        .selected-search {
            float: left;
        }

        .iconn {
            transform: rotate(90deg);
            float: right;
            /* display flex */
            /* align-items center */
            font-size: 0.38rem;
        }
    }
}

.conten2Style {
    width: 100%;
}
</style>