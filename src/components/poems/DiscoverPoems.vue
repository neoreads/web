<template>
  <div>
    <div class="center-pane">
      <el-container>
        <el-aside width="250px" class="poems-sidebar"><poem-nav></poem-nav></el-aside>
        <el-main class="poems-main">
          <poem-list></poem-list>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import PoemNav from "../poems/PoemNav.vue"
import PoemList from "../poems/PoemList.vue"

export default {
  components: {
    PoemNav,
    PoemList
  },
  created() {
    this.$store.dispatch("setActiveMenuIndex", "/poems");
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
.poems-sidebar
  padding 20px 20px 0px 0
  border-right 1px solid #eee
  min-height 500px

.poems-main
  padding 0px 20px
.poems-header
  padding 5px
  border-bottom 1px solid #eee
</style>

