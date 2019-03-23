<template>
  <div class="footer-btn">
    <div class="btn btn-cancel" @click="cancel">
      取消
    </div>
    <div class="btn btn-sure" @click="sure">
      确定
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    sure() {
      this.$emit("sure");
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/style/variable.styl';
@import '~common/style/mixin.styl';

.footer-btn {
  x-middle();

  .btn {
    flex: 1;
    padding: 0.2rem 0;
    text-align: center;
  }

  .btn-cancel {
    color: $color-text-active;
    background-color: #f2f2f2;
  }

  .btn-sure {
    color: #fff;
    background-color: $color-text-active;
  }
}
</style>


