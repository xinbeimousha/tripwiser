<template>
  <div id="app">
    <keep-alive :include="includes">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "App",
  computed:{
    ...mapGetters([
      'includePageNames'
    ]),
    includes(){
      return this.includePageNames.join(',');
    }
  },
};
</script>

<style lang="stylus" scoped>
#app {
  height: 100%;
}
</style>


