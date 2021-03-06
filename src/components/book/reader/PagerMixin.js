export default {
  data: function () {
    return {
      pages: [],
      curPage: 0,
      endChapter: false
    }
  },
  methods: {
    renderPage(paras) {
      let container = document.getElementById("reader-content-panel");
      // clear container
      while (container.lastChild) {
        container.lastChild.remove();
      }
      container.style.removeProperty("height")

      // get current page's start index
      let page = this.curPage;
      var lastIdx = 0;
      if (page >= this.pages.length) {
        // a new page
        if (this.pages.length == 0) {
          lastIdx = 0;
        } else {
          lastIdx = this.pages[this.pages.length - 1][1];
        }
      } else {
        lastIdx = this.pages[page][0];
      }

      container.style.removeProperty("margin-top")
      // render page one paragraph at a time
      let start = lastIdx;
      let topHeight = 0;

      // get last pages fitrows
      if (page > 0) {
        let n = page <= 0 ? 0 : page - 1;
        let lastPageConf = this.pages[n];
        let lastFitRows = lastPageConf ? lastPageConf[2] : 0
        // console.log("lastFitRows:", lastFitRows)
        topHeight = - lastFitRows * 36;
        if (topHeight < 0) {
          container.style.marginTop = topHeight + "px"
        }
      }
      let heightLimit = 860 - topHeight;

      var i = 0;
      var lastHeight = 0;
      var height = 0;
      // console.log("topHeight:", topHeight)
      for (i = lastIdx; i < paras.length; i++) {
        let d = document.createElement("div");
        d.innerHTML = paras[i];
        container.appendChild(d);
        // check current height
        lastHeight = height;
        height = container.clientHeight;

        // when the container grows over max height, stop rendering
        if (height > heightLimit) {
          break;
        }
      }

      // count how many rows the last paragraph could fit into this page.
      // each line has a height of 36
      // TODO: retrieve these heights from the store, where user could change setting.
      let diff = height - lastHeight - 20;
      let remain = heightLimit - lastHeight - 20;
      let fitCount = remain / 36;
      let fitRows = Math.floor(fitCount)
      let needCount = diff / 36;
      // console.log("Height:", height, "; LastHeight:", lastHeight)
      // console.log("Height DIFF:", height - lastHeight)
      // console.log("FitCount:", fitCount, "; NeedCount:", needCount)
      //this.$message(""+fitCount)
      if (fitCount > 0) {
        let maxHeight = lastHeight + fitRows * 36;
        // console.log("Seting maxheight:", maxHeight)
        container.style.height = maxHeight + "px";
      }
      if (fitRows < 0) fitRows = 0;


      if (i >= paras.length) {
        this.endChapter = true;
      }

      let end = i;

      // record the paragrphs this page has consumed
      if (page >= this.pages.length) {
        this.pages.push([start, end, fitRows]);
      }
    },
    prevPage(paras) {
      this.curPage = this.curPage - 1;
      if (this.curPage < 0) this.curPage = 0;
      else {
        this.endChapter = false;
        this.renderPage(paras);
        this.rebind();
      }
    },
    nextPage(paras) {
      if (!this.endChapter) {
        this.curPage = this.curPage + 1;
        this.renderPage(paras);
        this.rebind();
      }
    },
    // enable page turning with mousewheel
    registerWheel() {
      let self = this;
      let panel = document.getElementById("reader-content-panel");

      panel.onwheel = function (event) {
        event.preventDefault();

        if (event.deltaY < 0) {
          // wheel up
          self.prevPage(self.paras);
        } else {
          // wheel down
          self.nextPage(self.paras);
        }
      };
    },
    // enable page turning with PgUp, PgDown, Left and Right
    registerKeys() {
      let self = this;
      window.onkeydown = function (event) {
        if (event.srcElement.tagName == "BODY") {
          let k = event.keyCode;
          if (k == 33 || k == 37) {
            // 33: page up; 37: left
            event.preventDefault();
            self.prevPage(self.paras);
          } else if (k == 34 || k == 39) {
            // 34: page down; 39: right
            event.preventDefault();
            self.nextPage(self.paras);
          }
        }
      };
    }
  }
}