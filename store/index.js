import config from '../config';

export const state = () => ({
  locales: ['zh', 'es'],
  locale: 'es',
  userInfo: {},
  searchKeywords: '',
});

export const getters = {
  //语言
  getLocale: state => {
    return state.locale;
  },
  getUserInfo: state => {
    return state.userInfo;
  }
};

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  },
  SET_KEYWORDS(state, keywords) {
    console.log(keywords)
    state.searchKeywords = keywords;
  },
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
};

export const actions = {};
