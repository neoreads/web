'use strict';

/**
 * 将形如 [#abcd] 形式的句子ID转换为 <span class="sent"id="abcd"></span>
 * @param {*} md 
 */

module.exports = function ins_plugin(md) {
  // Insert each marker as a separate text token, and add it to delimiter list
  //
  function tokenize(state, silent) {
    var token,
      start = state.pos,
      marker = state.src.charCodeAt(start);

    if (silent) { return false; }

    if (marker !== 0x5B/* [ */) { return false; }
    if (state.src.charCodeAt(state.pos + 1) !== 0x23 /* # */) { return false; }

    if (state.src.charCodeAt(state.pos + 6) !== 0x5D /* ] */) {
      return false;
    } else {
      let sentid = state.src.substr(start + 2, 4)
      token = state.push('sentence', '', 0);
      token.content = sentid;
      state.pos += 7;
      return true;
    }
  }

  function applyid(state) {

    let tks = []
    let tokens = state.tokens;
    for (var i = 0; i < tokens.length; ++i) {
      let token = tokens[i]
      if (token.type === 'paragraph_open' || token.type === 'heading_open') {
        tks.push(token)
      } else if (token.type === 'inline') {
        let children = token.children;
        if (!children) continue;
        for (var j = 0; j < children.length; ++j) {
          let child = children[j]
          if (child.type === 'sentence') {
            tks.push(child)
          }
        }
      }
    }

    for (var k = 0; k < tks.length - 1; ++k) {
      let tk = tks[k]
      let ntk = tks[k + 1]
      if (ntk.type === 'sentence') {
        if (tk.meta === null) {
          tk.meta = {}
        }
        tk.meta.sentid = ntk.content
      }
    }

  }

  md.inline.ruler.before('emphasis', '', tokenize);
  md.core.ruler.before('linkify', '', applyid);

  md.renderer.rules.heading_open = function (tokens, idx) {
    let token = tokens[idx]
    let tag = token.tag;
    let span = '<span class="sent">';
    if (token.meta && token.meta.sentid) {
      span = `<span class="sent" id="${token.meta.sentid}">`
    }
    if (tokens[idx].hidden) {
      return span;
    } else {
      if (token.attrs && token.attrs.length > 0) {
        let attr = token.attrs[0];
        if (attr.length > 0 && attr[0] === 'id') {
          return `<${tag} class="para" id="${attr[1]}">${span}`;
        } else {
          return `<${tag}>${span}`;
        }
      } else {
        return `<${tag}>${span}`;
      }
    }
  }

  md.renderer.rules.heading_close = function (tokens, idx) {
    let tag = tokens[idx].tag;
    if (tokens[idx].hidden) {
      return "</span>";
    } else {
      return `</span></${tag}>`;
    }
  };

  md.renderer.rules.paragraph_open = function (tokens, idx) {
    let token = tokens[idx]
    let tag = token.tag;
    let span = '<span class="sent">';
    if (token.meta && token.meta.sentid) {
      span = `<span class="sent" id="${token.meta.sentid}">`
    }
    if (tokens[idx].hidden) {
      return span;
    } else {
      if (token.attrs && token.attrs.length > 0) {
        let attr = token.attrs[0];
        if (attr.length > 0 && attr[0] === 'id') {
          return `<${tag} class="para" id="${attr[1]}">${span}`;
        } else {
          return `<${tag}>${span}`;
        }
      } else {
        return `<${tag}>${span}`;
      }
    }
  };

  md.renderer.rules.paragraph_close = function (tokens, idx) {
    if (tokens[idx].hidden) {
      return "</span>";
    } else {
      return "</span></p>";
    }
  };

  md.renderer.rules.sentence = function (tokens, idx) {
    let token = tokens[idx]
    if (token.meta && token.meta.sentid) {
      return `</span><span class="sent" id="${token.meta.sentid}">`
    } else {
      return "";
    }
  }
};