import { SELECT_CONTEXT, SET_CHAPID, SET_CHAPTER, ADD_FAV, REMOVE_FAV, ADD_NOTE, REMOVE_NOTE, SET_ACTIVE_WORKS_MENU, SET_ACTIVE_NEWS_MENU } from './types';


export default {
  [SELECT_CONTEXT](state, param) {
    state.selectContext = param;
  },
  [SET_CHAPID](state, param) {
    console.log("param:", param)
    state.selectContext.pos.bookid = param.bookid;
    state.selectContext.pos.chapid = param.chapid;
    console.log("state:", state.selectContext)
  },
  [SET_CHAPTER](state, param) {
    state.chapter = param;
    console.log("current chapter: ", state.chapter); 
  },
  [ADD_FAV](state, param) {
    state.selectContext.isFav = true;
  },
  [REMOVE_FAV](state, param) {
    state.selectContext.isFav = false;
  },
  [ADD_NOTE](state, note) {
    state.selectContext.note = note;
  },
  [REMOVE_NOTE](state, param) {
    state.selectContext.note = {};
  },
  // Works
  [SET_ACTIVE_WORKS_MENU](state, param) {
    state.works.activeMenu = param;
  },
  // News
  [SET_ACTIVE_NEWS_MENU](state, param) {
    state.news.activeMenu = param;
  },
}