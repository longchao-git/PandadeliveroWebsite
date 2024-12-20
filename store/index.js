import config from '../config';

export const state = () => ({
  locales: ['zh', 'es','en'],
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
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
};

export const actions = {};
