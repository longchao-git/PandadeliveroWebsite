<template>
  <div v-if='type === 3' class='login-window'>
    <div class='login-window-card'>
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(-1)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png'
               alt='' />
        </div>
        <img :src='posterUrl' style='width: 100%'
             alt='' />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type', 'posterUrl'],
  data() {
    return {
      companyTypeList: [],
      tradeTypeId: '',
      context: '',
      isshow: false
    };
  },
  methods: {
    /** 处理呼叫父级 - 设置type状态 */
    handleChangeType(value) {
      this.$emit('handleCloseLoginDialog', value);
    }
  }
};
</script>

<style lang='scss' scoped>
.login-window {
  position: fixed;
  background: rgba(0, 0, 0, .4);
  top: 0;
  right: 0;
  bottom: 0;
  min-width: 100vw;
  width: 100%;
  z-index: 5;
  display: flex;
}


/** 登录卡片样式 */
.login-window-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(238, 128, 128, 0.20) 0%, rgba(10, 218, 254, 0.00) 100%), #FFF;
  margin: auto;
  width: 264px;
  //height: 320px;
  position: relative;

  > div {
    //position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    height: 100%;

    > .loginView {
      position: absolute;
      width: 55px;
      height: 55px;
      text-align: right;
      right: 0;
      top: 0;

      img {
        width: 55px;
        height: 55px;
        cursor: pointer;
      }
    }

    .loginClass {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      padding: 0 48px;

      .name {
        margin-top: 100px;
        font-size: 24px;
        color: #2C2C2C;
        font-weight: 500;
        margin-bottom: 12px;
      }

    }

    .flex_center {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin: 32px 0;
    }

    .button_info {
      width: 304px;
      height: 53px;
      background: #0c266e;
      border-radius: 4px 4px 4px 4px;
      text-align: center;
      line-height: 53px;
      color: #ffffff;
      font-size: 17px;
      font-weight: bold;
    }
  }

}

/* 中屏幕*/
@media screen and(max-width: $big-pc-width) {

  /** 登录卡片样式 */
  .login-window-card {
    width: 500px;

    > div {
      > div {
        img {
          width: 45px;
          height: 45px;
        }
      }

      p {
        font-size: 20px;
      }

      span {
        font-size: 14px;
      }
    }

  }
}

/** 平板屏幕 */
@media screen and (max-width: $pad-max-width) {

}

/** 手机屏幕 */
@media screen and (max-width: $phone-max-width) {

  /** 登录卡片样式 */
  .login-window-card {
    width: 300px;
    height: 280px;

    > div {
      p {
        font-size: 16px;
        padding: 16px 0;
        margin-bottom: 0 !important;
      }

      .loginClass {
        margin-top: 0px;
        padding: 0 16px;

        .name {
          margin-top: 90px;
          font-size: 16px;
          margin-bottom: 6px;
        }
      }
    }

    .button_info {
      width: 200px !important;
    }
  }
}
</style>
