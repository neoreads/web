<template>
  <el-container>
    <el-header class="reader-header" height="30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/home">
          <faicon icon="stream" class="breadcrum-icon"></faicon>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="'/book/' + bookid">{{book.title}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{chapter.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-container>
      <el-aside v-show="showTOC" class="reader-aside" width="250px">
        <toc-tree :tocdata="toc"></toc-tree>
      </el-aside>
      <el-main class="reader-main">
        <el-row>
          <el-col :span="12">
            <div class="reader-content-wrap">
              <reader-toolbar @is-ruby="isRuby = $event"></reader-toolbar>
              <div class="reader-content-div">
                <chapter-content
                  :bookid="bookid"
                  :chapid="chapid"
                  @content-loaded="contentLoaded"
                  @select="select"
                ></chapter-content>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <interactive v-bind="idata" dftTab="translations"></interactive>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TocTree from "./TocTree";
import ChapterContent from "../content/ChapterContent.vue";
import ReaderToolbar from "./reader/toolbar/ReaderToolbar";
import ReaderContent from "./reader/ReaderContent";
import Interactive from "./reader/Interactive";
import { EVENT_BUS } from "src/eventbus.js";
import { NOTES } from "src/js/note/note.js";

export default {
  components: {
    TocTree,
    ReaderToolbar,
    ReaderContent,
    Interactive,
    ChapterContent
  },
  data() {
    return {
      bookid: this.$route.params.bookid || "",
      book: {
        id: this.$route.params.bookid || "",
        title: "Dummy书名"
      },
      chapid: this.$route.params.chapid || "",
      chapter: {
        title: "Dummy章节名"
      },
      isRuby: false,
      idata: {
        dict: {}
      },
      toc: [],
      showTOC: false
    };
  },
  created() {
    // init singletons:
    console.log("INITING NOTES");
    NOTES.init(this.$store, this.$axios, this.bookid, this.chapid);

    this.$store.dispatch("setActiveMenuIndex", "/library");

    EVENT_BUS.$emit("HIDE_NAVMENU");

    // get book info
    let url = `api/v1/book/${this.bookid}`;
    this.$axios
      .get(url)
      .then(res => {
        this.book = res.data;
      })
      .catch(error => {
        console.log("err requesting:" + url, error);
      });

    // get toc and chapter id
    let tocUrl = `/api/v1/book/${this.bookid}/toc`;
    let self = this;
    this.$axios.get(tocUrl).then(res => {
      let toc = res.data;
      for (let ch of toc) {
        if (ch.id == this.chapid) {
          this.chapter = ch;
        }
      }
      let chap1 = toc[0];
      if (!self.chapid) {
        self.$router.push(`/reader/${self.bookid}/${chap1.id}`);
        self.chapid = chap1.id;
        NOTES.relocate(self.bookid, self.chapid);
      }
      self.toc = toc;
    });

    EVENT_BUS.$on("TOGGLE_TOC", () => (this.showTOC = !this.showTOC));
    EVENT_BUS.$on("HIDE_TOC", () => (this.showTOC = false));
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  beforeRouteUpdate(to, from, next) {
    this.bookid = to.params.bookid;
    this.chapid = to.params.chapid;
    NOTES.relocate(this.bookid, this.chapid);
    next();
  },
  methods: {
    goBack() {},
    contentLoaded(content) {
      console.log("loaded content:", content);
    },
    select(sent) {
      EVENT_BUS.$emit("SELECT_CONTENT", sent);
    }
  }
};
</script>


<style lang="stylus" scoped>
.reader-header
  height 36px
  line-height 36px

.reader-aside
  border 1px solid #DCDFE6
  text-align left
  height 913px
  box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04)
  overflow hidden

.reader-main
  // border 1px solid #eee
  padding 0px 10px
  height 930px
  overflow hidden

.reader-content-wrap
  box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04)

.reader-toolbar
  border 1px solid #DCDFE6
  border-bottom 0px
  text-align left

.reader-content-div
  height 860px
  padding 0px
  overflow-y hidden
  border 1px solid #DCDFE6
  text-align left

.reader-content-pane.ruby
  font-size 24px

.breadcrum-icon
  margin-right 10px
</style>