<template>
  <div class="md-paragraph" v-html="html"></div>
</template>

<script>
import { getSelectionText } from "../../js/selection/selection.js";
import { getPinyins } from "src/js/pinyin.js";
import FanggePinyin from "../tools/charbox/FanggePinyin.vue";
const P = Vue.extend(FanggePinyin);
import Vue from "vue";

export default {
  props: ["html", "highlight"],
  components: {
    FanggePinyin,
  },
  created() {},
  mounted() {
    let sents = this.$el.getElementsByClassName("sent");
    for (let sent of sents) {
      this.addPhonetics(sent);
    }
  },
  methods: {
    addPhonetics(sent) {
      let para = sent.parentNode;
      let paraid = para.id;
      let sentid = sent.id;
      let chars = Array.from(sent.textContent);
      console.log("chars:[", chars, "]");
      // TODO: 找到更优雅的方法将文本内容替换为注音
      sent.innerHTML = "";
      for (let i in chars) {
        // 判断是否需要添加注音
        let ch = chars[i];
        let pys = getPinyins(ch);
        if (pys.length > 0 && pys[0] != "" && pys[0] != ch) {
          let pbox = this.makePhoneticBox(ch, pys, i, paraid, sentid);
          sent.appendChild(pbox);
        } else {
          let txt = document.createTextNode(ch);
          sent.appendChild(txt);
        }
      }
    },
    makePhoneticBox(ch, pys, i, paraid, sentid) {
      const instance = new P({
        parent: this,
        propsData: {
          pinyins: pys,
          char: ch,
          i: i,
          paraid: paraid,
          sentid: sentid
        },
      });
      instance.$on("select", this.onSelect);
      // 创建一个虚拟dom对象
      let vcomponent = instance.$mount();
      return vcomponent.$el;
    },
    onSelect(e) {
      console.log("click", e);
      this.$emit("select", e);
    },
    addClickListener(sent) {
      let self = this;
      sent.onclick = (event) => {
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
            el: sent,
            event: event,
            location: {
              paraid: paraid,
              sentid: sent.id,
              startpos: wordsel.startpos,
              endpos: wordsel.endpos,
            },
          };
        } else {
          // 如果只是单选一行
          sel = {
            type: "sent",
            id: sent.id,
            content: sent.textContent,
            el: sent,
            event: event,
            location: {
              paraid: paraid,
              sentid: sent.id,
            },
          };
        }
        self.$emit("select", sel);
      };
    },
  },
};
</script>

<style lang="stylus">
.md-paragraph
  text-align left
</style>