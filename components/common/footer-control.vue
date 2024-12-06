<template>
  <div class='footer-box disflex al-center max-width f-column'>
    <div class='disflex p-relative contact-box'>
      <div class='asy-box'>
        <div class='f-title ' style='display: flex;flex-direction: column;align-items: flex-start;' @click='bingtapCilck(1)'>
          <img class='footer_icon' src='~/assets/images/footIConLogin.png' alt='' />
          <div class='footer_buttom'>{{ $t(`成为快递员`) }}</div>
        </div>

      </div>
      <div class='asy-box'>
        <div class='f-title'>
          <div class='isViewTxet'>{{ $t(`业务解决方案`) }}</div>
        </div>

        <div class='asy-phone'>
          <div class='service_title'>{{ $t(`商家`) }}</div>
          <!--          <div class='service_title'>{{ $t('footer.Company.desc') }}</div>-->
        </div>
      </div>
      <div class='asy-box'>
        <div class='f-title '>
          <div class='isViewTxet'>{{ $t(`新闻`) }}</div>
        </div>

        <div class='asy-phone'>
          <div class='service_title'>{{ $t(`本月精选`) }}</div>
          <div class='service_title'>{{ $t(`全部新闻`) }}</div>

        </div>
      </div>
      <div class='asy-box'>
        <div class='f-title '>
          <div class='isViewTxet'>{{ $t(`关于我们`) }}</div>
        </div>
        <div class='asy-phone'>
          <div class='service_title'>{{ $t(`联系我们`) }}</div>
          <div class='service_title'>{{ $t(`人才招牌`) }}</div>
        </div>
      </div>
      <div class='asy-box'>
        <img class='footer_app' @click='bingtapCilck(2)' src='~/assets/images/app_store.png' alt=''
             style='cursor: pointer' />
        <img class='footer_app' @click='bingtapCilck(3)' src='~/assets/images/google_play.png' alt=''
             style='cursor: pointer' />
        <div class='f-title '>
          <div class='isViewTxet' style='border: none'>{{ $t(`下载我们的应用程序`) }}</div>
        </div>

      </div>
    </div>
    <div class='disflex al-center copyright-box ju-center font12'>
      <div><a target='_blank' :href="'//' ">Copyright © 2024.Pandadelivero All rights reserved. </a>&nbsp;</div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'footer-control',
  data() {
    return {
      isShowDialog: false // 是否展示弹窗
    };
  },
  computed: {},
  methods: {

    bingtapCilck(type) {
      if (type === 1) {
        window.location.href = '/creation';
      } else if (type === 2) {
        window.location.href = 'https://apps.apple.com/es/app/pandadelivero-rapartidor/id6505077190';
      } else if (type === 3) {
        window.location.href = 'https://play.google.com/store/apps/details?id=net.pandadelivero.staff&pcampaignid=web_share';
      }

    }

  }
};
</script>

<style scoped lang='scss'>

.footer-box {
  background-color: #222;
  background-image: url("@/assets/images/footICon.png");
  background-size: cover;
  background-position: center;
  padding: 32px 0 0;

  a {
    color: inherit;
  }

  .footer_app {
    width: 190px;
    height: 60px;
  }

  .f-title {
    @extend .tran-300ms;
    font-size: 18px;
    color: #616976;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;

    .footer_icon {
      width: 239px;
      height: 70px;
      margin-bottom: 20px;
    }

    .footer_buttom {
      cursor: pointer;
      border-radius: 30px;
      background: #F9C13E;

      height: 58px;
      padding: 0px 16px;
      justify-content: center;
      align-items: center;
      color: #FFF;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 58px;
      text-align: center;
    }

    .isViewTxet {
      font-size: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.22);
      font-style: normal;
      font-weight: 500;
      color: #FFFFFF;
      padding-bottom: 10px;
    }
  }

  .f-divider {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
  }

  .asy-box {
    width: 174px;
    height: 141px;
    margin: 0 72px 8px 72px;
    //display: flex;
    //flex-direction: column;
    //align-items: center;

    .asy-phone {
      color: rgba(255, 255, 255, 0.70);
      font-weight: 400;
      margin-bottom: 20px;
      position: relative;
      top: -5px;

      > div {
        font-size: 14px;
      }


    }
  }

  .copyright-box {
    display: flex;
    text-align: center;
    padding-bottom: 16px;
    color: #616976;
    margin-top: 32px;

    span {
      display: block;
      overflow: hidden;
      width: 0;
      height: 0;
    }
  }

  .wm-title {
  }

  .footer-nav {
    color: #8993a0;
    cursor: pointer;
    margin-bottom: 15px;

    &:hover {
      color: #467fff;
    }
  }

  .contact-box {
    .related-product-box {
      > div {
        margin-right: 60px;
      }
    }
  }
}

/*中屏幕*/
@media screen and(max-width: $big-pc-width) {
  body .footer-box {
    padding: 48px 0 0;

    .f-title {
      font-size: 14px;
      margin-bottom: 12px;
    }

    .asy-box {
      height: 141px;
      margin: 0;
      padding-bottom: 8px;
      width: 100%;
    }

    .contact-box {
      .related-product-box {
        > div {
          margin-right: 30px;
        }
      }
    }
  }
}

/*小屏幕*/
@media screen and (max-width: $pad-max-width) {
  body .footer-box {
    padding: 32px 48px;
    //margin-bottom: 88px;

    .f-title {
      font-size: 12px;
      margin-bottom: 8px;
    }

    .footer-nav {
      margin-right: 0;
      font-size: 12px;

      a {
        font-size: inherit;
      }
    }

    .contact-box {
      width: 100%;

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .asy-box {

        padding-bottom: 8px;

        margin: 50px 0 0 0;
        width: 50%;
          .isViewTxet{
            border: none;
          }
        .asy-phone {
          margin-top: 0;
          line-height: inherit;
          margin-bottom: 16px;

          > div {
            font-size: 12px !important;
          }

          span {
            display: block;
          }
        }
      }

      .related-product-box {
        padding-bottom: 17px;

        > div {
          margin-right: auto;
        }
      }
    }

    .copyright-box {
      display: block;
      text-align: center;

      span {
        display: block;
        overflow: hidden;
        width: 0;
        height: 0;
      }
    }
  }
}

/** 手机屏幕 */
@media screen and (max-width: $phone-max-width) {
  body .footer-box {
    .contact-box {
    }
  }
}
</style>

<style lang='scss'>
/*小屏幕*/
@media screen and (max-width: $pad-max-width) {
  .wechat-contact-dialog {
    margin: auto 18%;

    .wechat-contact-box {
      padding: 36px 34px;

      .close-bt {
        top: 6px;
        right: 6px;
      }

      .w-title {
        font-size: 12px;
        color: #8993a0;
        line-height: 18px;
        margin-top: 10px;
      }
    }
  }
  .footer_buttom{
    font-size: 14px;
  }
}
</style>
