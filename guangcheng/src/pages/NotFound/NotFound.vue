<template>
  <div class="not-found">
    <div class="wrapper">
      <van-icon name="warn" size="1.6rem" color="#e1e1e1" />
      <p class="content">404页面未找到~</p>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="stylus" scoped>
.not-found {
  position:relative;
  height :100%;

  .wrapper{
    position :absolute;
    left:0;
    right:0;
    top:20%;
    text-align: center;
  }
}
</style>


