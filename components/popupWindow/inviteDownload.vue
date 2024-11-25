<template>
  <div v-if='loginType === 3' class='login-window'>
    <div class='login-window-card'>
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(1)' src='@/assets/images/cloudSales/popupWindow/icon_delet.png' alt='' />
        </div>
        <div class='flex' style='justify-content: center;margin-top: 36px'>
          <p>{{ $t(`下载app进行使用`) }}</p>
        </div>

        <div class='loginClass'>
          <img class='footer_app' @click='bingtapCilck(2)' src='~/assets/images/app_store.png' alt=''
               style='cursor: pointer' />
          <img class='footer_app' @click='bingtapCilck(3)' src='~/assets/images/google_play.png' alt=''
               style='cursor: pointer;margin-top: 16px' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  props: {
    loginType: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      code: ''
    };
  },
  methods: {
    handleChangeType(type) {
      if (type === 1) {
        this.$emit('handleCloseLoginDialog', -1);
      }
    },
    bingtapCilck(type) {
      if (type === 2) {
        window.location.href = 'https://apps.apple.com/es/app/pandadelivero-rapartidor/id6505077190';
      } else if (type === 3) {
        window.location.href = 'https://play.google.com/store/apps/details?id=net.pandadelivero.staff&pcampaignid=web_share';
      }

    }
  }
};
</script>

<style lang='scss' scoped>
.login-window {
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  right: 0;
  bottom: 0;

  min-width: 100vw;
  width: 100%;
  z-index: 100;
  display: flex;
}

.footer_app {
  width: 190px;
  height: 60px;
}

/** 登录卡片样式 */
.login-window-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(249, 196, 70, 0.20) 0%, rgba(10, 218, 254, 0.00) 100%), #FFF;
  margin: auto;
  width: 540px;
  height: 300px;
  position: relative;

  > div {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    height: 100%;

    > .loginView {
      cursor: pointer;
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

    p {
      font-size: 24px;

    }

    .loginClass {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      padding: 0 80px;


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
    height: 540px;

    > div {
      p {
        font-size: 16px;
        padding: 16px 0;
        margin-bottom: 0 !important;
      }

      .loginClass {
        margin-top: 0px;
        padding: 0 16px;

      }
    }
  }
}
</style>


