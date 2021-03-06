
import { getSelectedNodes } from "src/js/selection/selection";

export default {
  methods: {
    getSelectionText() {
      var text = "";
      var activeEl = document.activeElement;
      var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
      if (
        activeElTagName == "textarea" ||
        (activeElTagName == "input" &&
          /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
          typeof activeEl.selectionStart == "number")
      ) {
        text = activeEl.value.slice(
          activeEl.selectionStart,
          activeEl.selectionEnd
        );
      } else if (window.getSelection) {
        text = window.getSelection().toString();
      }
      return text;
    },
    // TODO: this function is not working properly
    // need to rewrite it when we have noted text in the backend
    // what we need is mark by sentence, not mark where ever you want.
    markSelection() {
      let sel = window.getSelection();
      if (sel.toString().length == 0) {
        console.log("selected nothing.");
        return;
      }
      let r = getSelectedNodes();
      console.log(r);
      let range = sel.getRangeAt(0);
      let sc = range.startContainer;
      let so = range.startOffset;
      let ec = range.endContainer;
      let eo = range.endOffset;
      // same container
      if (sc === ec) {
        let p = sc;
        if (p.parentNode.tagName.toLowerCase() != "mark") {
          let t0 = p.textContent.slice(0, so);
          console.log("t0:", t0);
          let t1 = p.textContent.slice(eo, p.textContent.length);
          console.log("t1:", t1);
          let ts = sel.toString();
          console.log("ts:", ts);
          var m0 = document.createTextNode(t0);
          p.parentNode.insertBefore(m0, p);
          var ms = document.createElement("mark");
          ms.innerHTML = ts;
          p.parentNode.insertBefore(ms, p);
          var m1 = document.createTextNode(t1);
          p.parentNode.insertBefore(m1, p);
          p.parentNode.removeChild(p);
        }
      } else {
        console.log("init: ", r);
        for (let n of r) {
          if (
            n.nodeType != Node.TEXT_NODE &&
            n.tagName.toLowerCase() == "mark"
          ) {
            n.replaceWith(document.createTextNode(n.textContent));
          }
        }
        r = getSelectedNodes();
        console.log("cleand:", r);
        for (let n of r) {
          if (n && n.parentNode) n.parentNode.normalize();
        }
        r = getSelectedNodes();
        console.log("cleand:", r);
        for (let n of r) {
          if (
            n.nodeType != Node.TEXT_NODE &&
            n.tagName.toLowerCase() == "mark"
          ) {
            continue;
          }
          if (n.parentNode.tagName.toLowerCase() == "mark") {
            continue;
          }
          if (n == sc.parentNode || n == ec.parentNode) {
            console.log("ignore start and end parents");
          } else if (n == sc && n.textContent.length != so) {
            // start text node
            console.log("text:", n.textContent, ":", n.textContent.length);
            console.log("so:", so);
            let text = n.textContent;
            let t0 = text.slice(0, so);
            let ts = text.slice(so, text.length);
            if (ts.length == 0) continue;
            n.textContent = t0;
            var ms = document.createElement("mark");
            ms.innerHTML = ts;
            n.parentNode.insertBefore(ms, n.nextSibling);
            console.log("tt0:", t0);
            console.log("tts:", ts);
          } else if (n == ec && eo != 0) {
            console.log("eo:", eo);
            let text = n.textContent;
            let t1 = text.slice(eo, text.length);
            let ts = text.slice(0, eo);
            n.textContent = t1;
            var ms = document.createElement("mark");
            ms.innerHTML = ts;
            n.parentNode.insertBefore(ms, n);
            // end text node
          } else {
            // middle node
            if (n.nodeType == Node.TEXT_NODE) {
              console.log("text node");
              console.log("next sibling:", n.nextSibling);
              let ms = document.createElement("mark");
              ms.innerHTML = n.textContent;
              n.parentNode.insertBefore(ms, n);

              n.parentNode.removeChild(n);
            } else if (n.tagName == "mark") {
              console.log("mark:", n);
            }
          }
        }
      }
    },
  }
}