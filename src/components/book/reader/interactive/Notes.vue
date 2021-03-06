<template>
  <div id="note-tab-panel" class="note tab-pane" v-show="isShow">
    <div class="note-section">
      <div class="note-section-title">
        <span class="right">
          <el-rate :value="4.5" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
        </span>
        <span class="right"></span>
        当前句子
        <faicon v-if="isFav" title="取消收藏" icon="heart" class="red" @click="removeFav"></faicon>
        <faicon v-if="!isFav" title="收藏" :icon="['far', 'heart']" @click="addFav"></faicon>
      </div>
      <div class="note-ref">{{ctx.text}}</div>
    </div>
    <div class="note-section my-note">
      <div class="note-section-title">
        我的笔记
        <faicon icon="pen" title="编辑" @click="editNote"></faicon>
        <faicon icon="trash" title="删除" class="right" @click="removeNote"></faicon>
      </div>
      <div class="note-pane">
        <div v-show="!isEdit" class="note-content">
          <span v-html="noteContent"></span>
        </div>
        <div v-show="isEdit" class="note-editor">
          <mavon-editor v-model="note.content"></mavon-editor>
          <br />
          <el-button type="primary" @click="saveNote">保存</el-button>
          <el-button @click="cancel()">取消</el-button>
        </div>
      </div>
    </div>
    <div class="note-section friends-notes">
      <div class="note-section-title">
        <span class="right">
          <label class="sort-by">按评价</label>
          <faicon icon="sort" title="排序" @click="sortFriendNotes"></faicon>
        </span>
        好友笔记
      </div>
    </div>
    <div class="note-section all-notes">
      <div class="note-section-title">
        <span class="right">
          <label class="sort-by">按评价</label>
          <faicon icon="sort" title="排序" @click="sortAllNotes"></faicon>
        </span>
        全部笔记
      </div>
    </div>
  </div>
</template>

<script>
import { EVENT_BUS } from "src/eventbus.js";
import { NOTES } from "src/js/note/note.js";
var mdi = require("markdown-it")({
  html: true
});

export default {
  data() {
    return {
      isEdit: false,
      note: {
        content: ""
      }
    };
  },
  computed: {
    ctx: function() {
      return NOTES.ctx;
    },
    isShow: function() {
      return this.ctx.text != undefined && this.ctx.text != "";
    },
    needEdit: function() {
      return this.getNote() == "" || this.isEdit;
    },
    isFav: function() {
      return this.ctx.isFav;
    },
    noteContent() {
      let n = this.getNote();
      return mdi.render(n)
    }
  },
  created() {
    EVENT_BUS.$on("CONTEXT_UPDATED", this.updateContext);
  },
  methods: {
    updateContext() {
      this.isEdit = false;
      this.note.content = this.getNote();
    },
    getNote() {
      let ctx = this.ctx;
      if (!ctx) {
        return "";
      }
      if (!ctx.note) {
        return "";
      }
      if (!ctx.note.content) {
        return "";
      }
      return ctx.note.content;
    },
    openNotes() {
      this.tab = "notes";
    },
    editNote() {
      this.isEdit = true;
    },
    saveNote() {
      this.$message("saving note: " + this.note.content);
      NOTES.saveNote(this.note.content);
      this.isEdit = false;
    },
    removeNote() {
      //console.log("current note:", this.ctx.note)
      let noteid = this.ctx.note.id;
      NOTES.removeNote(noteid);
      this.isEdit = false;
    },
    addFav() {
      EVENT_BUS.$emit("fav", true);
    },
    removeFav() {
      EVENT_BUS.$emit("fav", false);
    },
    sortFriendNotes() {},
    sortAllNotes() {}
  }
};
</script>

<style lang="stylus" scoped>
#note-tab-panel
  .note-section
    padding 10px
    margin-bottom 10px

    .note-ref
      border 1px solid #D9ECFF
      border-radius 2px
      box-shadow 0 2px 6px 0 #D9ECFF
      background-color #F7FBFF
      padding 10px 20px
      font-weight bold
      font-size 1.2em
      color #080400

    .note-section-title
      padding 10px 0
      margin-bottom 20px
      border-bottom 1px solid #D9ECFF
      font-weight bold
      color #666

      svg
        margin-left 6px
        color #409EFF
        cursor pointer

      svg.red
        color #F66

      .right
        float right

      .sort-by
        font-weight normal
        color #999

    .note-content
      border 2px dashed #D9ECFF
      background-color #F7FBFF
      border-radius 2px
      padding 10px 20px
      font-size 1em
      line-height 1.5em
</style>
