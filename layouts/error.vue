<template>
  <div class="error-main-box">
    <div class="errorBox">
      <img :src="require('~/assets/images/error/404_img@2x.png')" alt=""  class="errorImg">
      <p>咦~页面迷失太空，找不到诶，快试试返回首页吧</p>
      <a href="/" class="disflex al-center">
        <div class="goIndex"><span style="font-size: 25px">←</span>回首页</div>
      </a>
<!--      <p class="errorPhone">客服电话:{{ciHotline}}</p>-->
<!--      <p class="errorEmail">联系邮箱:{{ciEmail}}</p>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'error',
	props: ['error'],
	layout: 'no-content',

}
</script>

<style scoped lang="scss">
  .error-main-box {
    .errorBox {
      width: 100vw;
      height: 100vh;
      background: url("~/assets/images/error/404_bg.png") no-repeat;
      background-size: 100% 100%;
    }

    .errorImg {
      padding-top: 20vh;
      display: block;
      width: 25%;
      margin: 0 auto;
    }

    .errorBox p {
      text-align: center;
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      margin: 10px 0;
      letter-spacing: 3px;
    }

    .goIndex {
      text-align: center;
      padding: 8px 0;
      font-size: 24px;
      margin: 0 auto;
      width: 180px;
      border: 2px solid rgba(255, 255, 255, 1);
      border-radius: 24px;
      color: #fff;
    }

    .errorPhone {
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      padding-top: 100px;
    }

    .errorEmail {
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      text-align: center;
    }
  }

  @media screen and (max-width: $pad-max-width) {
    body .error-main-box {
      .errorImg {
        width: 60%;
      }
    }
  }
</style>
