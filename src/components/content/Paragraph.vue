<template>
  <div class="md-paragraph" v-html="html"></div>
</template>

<script>
import { getSelectionText } from "../../js/selection/selection.js";

export default {
  props: ["html", "highlight"],
  created() {
    //console.log("rendering html: ", this.html);
  },
  mounted() {
    let lines = this.$el.getElementsByClassName("line");
    for (let line of lines) {
      // 在每行内容之前添加一个统计块。TODO：是不是放到PoemContent里更好
      this.addStatsSpan(line);
      // 给每句话添加一个选中事件
      this.addClickListener(line);
    }
  },
  methods: {
    addStatsSpan(line) {
      let stat = document.createElement("span");
      stat.classList.add("line-stat");
      let parent = line.parentNode;
      if (parent.lastChild == line) {
        parent.appendChild(stat);
      } else {
        parent.insertBefore(stat, line.nextSibling);
      }
    },
    getWordSelection() {
      let sel = window.getSelection();
      let startspan = sel.anchorNode;
      let endspan = sel.focusNode;
      if (startspan == endspan) {
        let line = this.findParentSent(startspan);
        // 正好在同一个span中
        let senttext = line.textContent;
        let seltext = sel.toString();
        let startpos = senttext.indexOf(seltext);
        return {
          el: line,
          startpos: startpos,
          endpos: startpos + seltext.length,
          text: seltext
        };
      } else {
        // 需要找寻共同的祖先节点。
        let startSent = this.findParentSent(startspan);
        let endSent = this.findParentSent(endspan);
        console.log("parents:", startSent, endSent);
        if (startSent == null || endSent == null || startSent != endSent) {
          // TODO: 用更合适的形式来避免跨句选择。
          console.log("暂不支持跨句笔记！请重新选择一句话之内的词语！");
          return {
            el: sel.anchorNode,
            startpos: 0,
            endpos: 0,
            text: ""
          };
        } else {
          let line = startSent.textContent;
          let seltext = sel.toString();
          let startpos = line.indexOf(seltext);
          return {
            el: line,
            startpos: startpos,
            endpos: startpos + seltext.length,
            text: seltext
          };
        }
      }
    },
    findParentSent(span) {
      if (span.nodeType == 3) {
        span = span.parentNode;
      }
      if (span.classList.contains("line")) {
        return span;
      } else {
        let parent = span.parentNode;
        while (!parent.classList.contains("line")) {
          parent = parent.parentNode;
        }
        return parent;
      }
    },
    addClickListener(line) {
      let linenum = line.getAttribute("num");
      let self = this;
      line.onclick = event => {
        // TODO: 应当遍历所有父节点，直到找到一个class="para"的节点
        let para = event.target.parentNode;
        let paraid = para.id;
        // TODO：处理跨句选择转化为多个完整句子的情形。
        let selectedText = getSelectionText();
        let sel = {};
        if (selectedText) {
          let wordsel = this.getWordSelection();
          // 如果是选择一段文字，这里只支持单句之内的选择，如单词、单字等，跨句的情况不作考虑，当跨句时，应当转化为多句选择。
          sel = {
            type: "word",
            content: wordsel.text,
            el: line,
            event: event,
            location: {
              paraid: paraid,
              linenum: linenum,
              startpos: wordsel.startpos,
              endpos: wordsel.endpos
            }
          };
        } else {
          // 如果只是单选一行
          sel = {
            type: "line",
            id: line.id,
            content: line.textContent,
            el: line,
            event: event,
            location: {
              paraid: paraid,
              lineid: line.id,
              linenum: linenum
            }
          };
        }
        //console.log("selected:", JSON.stringify(sel));
        self.$emit("select", sel);
      };
    }
  }
};
</script>

<style lang="stylus" scoped></style>