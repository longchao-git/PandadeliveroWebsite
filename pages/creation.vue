<template>
  <div>
    <!--整屏滚动插件-->
    <div class='p-relative head-bg' style='margin-top: 100px'>
      <div class='h-content'>
        <div class='h-conte'>
          <div class='_right ml32'>
          </div>
          <div class='_left'>
              <register :loginType='1' :type='1' @handleCloseLoginDialog="handleCloseLoginDialog"></register>
          </div>
        </div>
      </div>
    </div>

    <collaborationMechanism></collaborationMechanism>
    <believeCooperation></believeCooperation>
    <takesRider></takesRider>
    <startEarning :type="0"></startEarning>
  </div>
</template>

<script>

import collaborationMechanism from '../components/cloudSales/collaborationMechanism.vue';
import believeCooperation from '../components/cloudSales/believeCooperation.vue';
import takesRider from '../components/cloudSales/takesRider.vue';
import startEarning from '../components/cloudSales/startEarning.vue';
import register from '../components/popupWindow/register.vue';
export default {

  components: {
    believeCooperation,
    collaborationMechanism,
    takesRider,
    startEarning,
    register
  },
  data() {
    return {
      loginType: 1,

      // 是否显示底部内容
      isShowFooterContent: 0,
      context: '',
      page: 1
    };
  },

  methods: {
    // 滚动事件
    scrollEvent() {
      const oTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (oTop + 50 >= window.screen.height && this.isShowFooterContent === 0) {
        this.isShowFooterContent = 1;
      } else if (oTop + 50 < window.screen.height) {
        this.isShowFooterContent = 0;
      }
    },
    handleCloseLoginDialog(){
      // window.location.href = '/';
    },



  },

  mounted() {
    //获取用户经纬度
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     res => {
    //       console.log(res);
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
    // } else {
    //   console.log('Geolocation is not supported by this browser.');
    // }
    window.addEventListener('scroll', this.scrollEvent.bind(this));
    // this.$nextTick(() => {
    //   this.loginType = 4
    // })

  }
};
</script>
<style lang='scss'>
.v-application--wrap{
  max-width: 200% !important;
}
.login-input {
  width: 100%;
  height: 52px;
  margin: 30px 0;
  border-radius: 60px;
  background: #f9c13e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  color: white !important;

  .el-input__inner {
    background: transparent;
    border: none;
    color: #FFFFFF;
  }

  .el-input__inner::-webkit-input-placeholder {
    color: #FFFFFF;
  }
}
</style>
<style scoped lang='scss'>
.customer-collection_footer-close {
  position: fixed;
  right: 5px;
  bottom: 75px;
  z-index: 3;
  width: 24px;
  height: 24px;
}

.detail_container {
  width: 90%;
  margin: 0 auto;
  padding: 24px 0;

}

.head-bg {
  @extend .tran-300ms;
  padding: 120px 0;
  min-height: 840px;
  background-image: url('@/assets/images/creaTionIcon.png');
  background-size: cover;
  background-position: center;


  .h-content {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;

    .h-conte {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      flex: 1;

      ._left {
        width: 35%;

        .Business {
          color: #FFF;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 22px;
          background-color: #254969;
          padding: 4px 16px;
          border-radius: 30px;
          display: inline-block;
        }

        .Services {
          color: #000;
          font-size: 72px;
          font-style: normal;
          font-weight: 700;
          line-height: 107px;
          letter-spacing: -1.12px;
          text-transform: capitalize;
          margin-top: .3em;
        }

        .Potential {
          color: #3A3509;
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          line-height: 26px;
          margin-top: 12px;
        }

        .button-view {
          margin-top: 20px;
          display: flex;

          .v-btn {
            border-radius: 35px !important;
          }
        }
      }

      ._right {
        width: 860px;

      }
    }
  }
}

/*中屏幕*/
@media screen and(max-width: $big-pc-width) {
  .head-bg .h-content {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    .h-conte {

    }
  }
}

@media screen and (max-width: $pad-max-width) {
  .customer-collection_footer-close {
    display: none;
  }
  .head-bg {
    margin-top: 120px;
    height: 300px;

    .h-content {
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      .h-conte {
        ._left {
          width: 35%;


          .Services {
            font-size: 32px;
          }

          .button-view {
            margin-top: 20px;

            .v-btn {
              border-radius: 35px !important;
            }
          }
        }
      }
    }
  }
}


@media screen and (max-width: $pad-max-width) {

}
</style>
