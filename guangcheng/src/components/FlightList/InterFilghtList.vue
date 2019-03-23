<template>
    <div class="flight-list">
        <ul class="flight-list-container" v-if="flightData.length > 0">
            <li v-for="(flight,index) in flightData" @click="clickShowSeat(index,flight)" class="flight-list-item" :key="index">
                <div class="flight-detail border-1px">
                    <AirLine :flight="flight" />
                </div>
                <ul class="seat-detail" v-if="currentIndex === index && interSeats">
                    <li class="seat-item border-1px" v-for="(seat,index) in interSeats">
                        <div class="seat-cabin">
                            <span class="shipping">{{seat.classname}}</span>
                            <!--<span class="sales global-blue" v-if="seats.fareBase!==100">{{seats.fareBase}}折</span>-->
                            <span class="ticket global-blue" v-if="seat.remainTicket < 9">剩余
                <span class="num">{{seat.remainTicket}}</span> 张</span>
                            <span class="ticket global-blue" v-else>余量充足</span>
                        </div>
                        <div class="seat-book">
                            <!--这里直接加了燃油费什么的-->
                            <span class="price global-blue">¥{{seat.totalFare}}</span>
                            <div class="book" @click.stop="book(flight,seat)">预订</div>
                        </div>
                    </li>
                </ul>

            </li>
        </ul>
    </div>
</template>

<script>
   import AirLine from "components/AirlineItem/InterAirlineItem";
   import {interGetSeatsList} from "./InterFilghtsList"
   export default {
      components: {
         AirLine
      },
      props: {
         flightData: {
            type: Array,
            default() {
               return [];
            }
         }
      },
      data() {
         return {
            currentIndex: -1,
            seats: '',
            classCodePair: {
               'F': '头等舱',
               'A': '头等舱',
               'C': '公务舱',
               'D': '公务舱',
               'Y': '经济舱',
               'S': '经济舱',//特殊经济舱
               'B': '经济舱',
               'H': '经济舱',
               'K': '经济舱',
               'L': '经济舱',
               'M': '经济舱',
               'N': '经济舱',
               'Q': '经济舱',
               'T': '经济舱',
               'X': '经济舱',
               'U': '经济舱',
               'E': '经济舱',
               'W': '高级经济舱',
               'R': '经济舱',
               'O': '经济舱',
               'Z': '经济舱',//共享经济舱
               'V': '经济舱',//常旅客经济舱
               'J': '公务舱',
               'G': '经济舱'//普通舱免折和常旅客免票经济舱
            },
         };
      },
      methods: {
         clickShowSeat(index, flight) {
            interGetSeatsList(index, flight).then(res => {
               console.log(res);
               if (res.success) {
                  this.seats = res.obj.prices

                  let classCodePair=this.classCodePair
                  for(var i = 0; i <this.seats.length ; i++) {
                     if (classCodePair[this.seats[i].seatCode]) {
                        this.seats[i].classname=classCodePair[this.seats[i].seatCode]
                     }
                  }

                  
                  
                  this.$emit("show", index, this.currentIndex);
                  this.currentIndex = index;
               }
            })

         },
         //点击预订按钮
         book(flight, seat) {
            this.$emit("book", flight, seat);
         }
      },
      computed: {
         interSeats() {
            return this.seats
         },

      },
      // filters: {
      //    classNames(value) {
      //      
      //       return 123
      //    },
      // }
   }
</script>

<style lang="stylus" scoped>
    @import '~common/style/variable.styl';
    @import '~common/style/mixin.styl';

    .flight-list {
        .flight-list-container {
            .flight-list-item {
                background-color: $color-white;

                .global-blue {
                    color: $color-text-active;
                }

                .flight-detail {
                    padding: 0 0.2rem;
                    border-1px($color-solid);
                }

                .seat-detail {
                    padding-left: 0.3rem;
                    margin-bottom: 0.1rem;

                    .seat-item {
                        x-middle();
                        padding: 0.1rem 0;
                        padding-right: 0.3rem;

                        &:not(:last-child) {
                            border-1px($color-solid);
                        }

                        .seat-cabin {
                            flex: 1;
                            font-size: 0.24rem;

                            .shipping {
                                font-size: 0.3rem;
                            }

                            .sales {
                                padding: 0 0.1rem;
                            }

                            .ticket {
                                .num {
                                    color: red;
                                }
                            }
                        }

                        .seat-book {
                            .book {
                                display: inline-block;
                                padding: 0.1rem 0.2rem;
                                margin-left: 0.1rem;
                                border-radius: 5px;
                                color: $color-white;
                                background-color: $color-bg-high;
                            }
                        }
                    }
                }
            }
        }
    }
</style>


