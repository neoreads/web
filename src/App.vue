<template>
  <div id="app">
    <el-container>
      <el-header v-show="isNavShow" class="top-header" height="62px">
        <div id="nav">
          <el-row>
            <el-col :span="4">
              <div id="logo">
                <router-link to="/library" id="logo-link">
                  <span class="theme">{{$t('logo-neo')}}</span>
                  <span class="black">{{$t('logo-reads')}}</span>
                </router-link>
                <span id="logo-version">v0.3.5</span>
              </div>
            </el-col>
            <el-col :span="12">
              <el-menu
                :default-active="activeIndex"
                class="el-menu top-menu"
                id="top-menu"
                mode="horizontal"
                router
              >
                <el-menu-item index="/classroom">
                  <span class="theme">{{$t('menu.classroom')}}</span>
                </el-menu-item>
                <el-menu-item index="/library">
                  <span class="theme">{{$t('menu.library')}}</span>
                </el-menu-item>
                <el-menu-item index="/works">
                  <span class="theme">{{$t('menu.works')}}</span>
                </el-menu-item>
                <el-menu-item index="/poems">
                  <span class="theme">{{$t('menu.poems')}}</span>
                </el-menu-item>
                <el-menu-item index="/news">
                  <span class="theme">{{$t('menu.news')}}</span>
                </el-menu-item>
                <el-menu-item index="/people">
                  <span class="theme">{{$t('menu.people')}}</span>
                </el-menu-item>
                <el-menu-item index="/coding">
                  <span class="theme">{{$t('menu.coding')}}</span>
                </el-menu-item>
                <el-menu-item index="/dev">
                  <span class="theme">{{$t('menu.dev')}}</span>
                </el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="4">
              <search />
            </el-col>
            <el-col :span="2">
              <div class="lang">
                <locale @locale="changeLocale" />
              </div>
            </el-col>
            <el-col :span="2">
              <div class="options">
                <div v-show="!isAuthed">
                  <router-link to="/user/login">
                    <faicon icon="user" size="2x" class="user login" @click="login"></faicon>
                  </router-link>
                </div>
                <div v-show="isAuthed">
                  <user-options></user-options>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-header>
      <el-main id="main-pane">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Search from "./components/tools/Search.vue";
import Locale from "./components/tools/Locale.vue";
import UserOptions from "./components/user/UserOptions.vue";
import { EVENT_BUS } from "./eventbus.js";

export default {
  name: "app",
  components: {
    Search,
    Locale,
    UserOptions
  },
  data() {
    return {
      isNavShow: true
    };
  },
  computed: {
    isAuthed() {
      return this.$store.getters.isAuth;
    },
    activeIndex() {
      return this.$store.getters.activeMenuIndex;
    }
  },
  created() {
    let sitename = this.$t("sitename");
    document.title = sitename;

    EVENT_BUS.$on("HIDE_NAVMENU", this.hideNavMenu);

    // hide menubar in reader
    let self = this;
    this.$router.beforeEach((to, from, next) => {
      if (to.path.startsWith("/reader")) {
        self.isNavShow = false;
      } else {
        self.isNavShow = true;
      }
      next();
    });

    // check token
    this.checkToken();
  },
  mounted() {
    console.log("locale:", this.$i18n.locale);
  },
  methods: {
    login() {
      console.log("login");
    },
    changeLocale(loc) {
      this.$i18n.locale = loc;

    },
    userOptions() {
      console.log("show options");
    },
    hideNavMenu() {
      this.isNavShow = false;
    },
    checkToken() {
      console.log("chekcing token:");
      let tokenSince = this.$store.getters.tokenSince;
      let expireIn = this.$store.getters.expireIn;
      let minute = 1000 * 60;
      console.log("token expire:", this.$store.getters.expire);
      console.log("expire in ", expireIn / minute, " minutes");
      if (expireIn / minute < 30) {
        this.refreshToken();
      }
    },
    refreshToken() {
      console.log("refreshing token...");
      let refreshUrl = "/api/v1/token/refresh";
      let self = this;
      this.authGet(refreshUrl)
        .then(res => {
          let token = res.data.token;
          let expire = res.data.expire;
          let user = {
            token: token,
            expire: expire
          };
          self.$store.dispatch("refreshToken", user);
        })
        .catch(err => {
          console.log("refresh failed!", err);
          self.$message("用户登录过期，请重新登录！");
          this.$store.dispatch("logout");
          self.$router.push("/user/login");
        });
    }
  }
};
</script>

<style lang="stylus">

*
  margin 0
  padding 0

a
  text-decoration none
  cursor pointer
  color #999
  &:hover
    color #409EFF
</style>

<style lang="stylus">
#app
  font-family "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  min-width 1600px
  min-height 980px
  height 100%

#main-pane
  padding 20px
  padding-bottom 0

#nav
  padding 0 20px

  .el-col
    height 60px
    line-height 60px

#logo
  span
    font-size 1.8em
    text-align left

  span.black
    color black

  #logo-version
    margin-left 5px
    font-size 0.9em
    color #999

#logo-link
  outline none
  text-decoration none

#top-menu
  border-bottom 0

  span
    font-size 1.4em
    font-weight bold
    margin-left 5px

.top-header
  border-bottom 1px solid #eee

  .search
    position relative
    float right
    bottom -12px

  .options
    line-height 76px
    height 60px
    text-align left

    .user
      cursor pointer

    .user.login
      color gray

div.center-pane
  text-align center
  margin 0px auto
  width 1268px
  border 1px solid #eee
  border-radius 4px
  padding 20px
  min-height 850px
</style>