<template>
    <div class="Tripopinion">
        <HeaderTitle title="审批意见"  @back="goback" :btnLeft="true" :btnRight="true">
            <span @click="submit">提交</span>
        </HeaderTitle>
        <div class="content">
            <div class="title">行程申请驳回</div>
            <div class="opinion">
                <textarea  id="opinion"  placeholder="请回复审批意见或建议" v-model="comment"></textarea>
            </div>
        </div>
    </div>
</template>
<script>
   import HeaderTitle from "components/HeaderTitle/HeaderTitle";
   import { gobackMixin } from "common/js/mixins.js";
   import { uploadOpinion } from "api/uploadOpinion";
   import { Dialog, Toast } from "vant";
   import {ApprovalButton} from './api'
   export default {
      mixins: [gobackMixin],
      data() {
         return {
            comment: ""
         };
      },
      components: {
         HeaderTitle
      },
      methods: {
         goback(){
           this.$router.go(-1)
         },
         submit() {
            let Tripopinion = this.$route.query.reimburseId;
            let tripData = {
               id: Tripopinion,
               taskId: 0,
               comment: this.comment
            };
            console.log(tripData.id,tripData.taskId,tripData.comment);
            if (!this.comment) {
               Toast("请回复审批意见或建议");
               return;
            }
            Dialog.confirm({
               title: "提示",
               message: "你确定要驳回这个行程吗?"
            })
                .then(() => {
                   ApprovalButton(tripData.id,tripData.taskId,tripData.comment).then(res => {
                      Toast({
                         duration: 2000,
                         message: '成功'
                      });
                      setTimeout(() => {
                         this.$router.go(-2);
                      }, 2000);
                   });
                   // on confirm
                })
                .catch(() => {
                   // on cancel
                });
         }
      }
   };
</script>
<style lang="stylus" scoped>
    @import '~common/style/variable.styl';
    @import '~common/style/mixin.styl';

    .Tripopinion {
        y-view();
        flex: 1;

        .content {
            margin-top: 0.5em;
            border-top: 1px solid $color-dashed;
            background-color: $color-white;
            padding-left: 1em;
            font-size: 1em;

            .title {
                padding: 0.8em 0;
                border-bottom: 1px solid $color-dashed;
            }

            .opinion {
                padding: 0.8em 0.8em 0.8em 0;

                textarea {
                    min-height: 8em;
                    width: 100%;
                    font-size: 1em;
                    resize: none;
                    border: 0;
                }
            }
        }
    }
</style>
