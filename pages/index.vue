<template>
  <div>
    <!--整屏滚动插件-->
    <div class='p-relative head-bg'>
      <div class='h-content'>
        <div class='h-conte'>
          <div class='_left'>
            <div class='Services'>pandadelivero</div>

            <div class='Potential'>
              pandadelivero{{$t(`是您值得信赖的合作伙伴，在您的城市快速和安全的快递`)}}
            </div>
            <div class='button-view flex-a-c' style='display: flex; width: 100%'>
              <div class=' indexBob' style='cursor: pointer' @click='handleClick(3)'>
                <div>{{$t(`加入我们`)}}</div>
                <img src='../assets/images/icon_iconVIew.png'
                     style='width: 24px;height: 24px;margin-left:8px '
                     alt='' />
              </div>
              <div style='margin-left: 40px;color: #FFFFFF;cursor: pointer' class='font18'  @click='handleClick(3)'>{{$t(`立即申请`)}}</div>

            </div>
          </div>
          <div class='_right ml32'>

          </div>
        </div>
      </div>
    </div>
    <addAddr :type='loginType'></addAddr>
  </div>
</template>

<script>

import collaborationMechanism from '../components/cloudSales/collaborationMechanism.vue';
import believeCooperation from '../components/cloudSales/believeCooperation.vue';
import addAddr from '../components/popupWindow/addAddr.vue';

export default {

  components: {
    believeCooperation,
    collaborationMechanism,
    addAddr
  },
  data() {
    return {
      loginType: 1,
      // 是否显示底部内容

      page: 1
    };
  },

  methods: {
    handleClick(type) {
      if (type === 3) {
        window.location.href = '/creation'
      }
    },

    shoplist() {
      const params = {};
      this.$axios.post('/client/adv/paotuiadv', params).then(res => {

      }).catch(err => {
        this.$message.info(err.message);
      });
    }
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

    // this.$nextTick(() => {
    //   this.loginType = 4
    // })
    // this.shoplist();
  }
};
</script>
<style lang='scss'>
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
.indexBob{
  border-radius: 39px;
  border: 1px solid rgba(255, 255, 255, 0.30);
  background: #FFF;
  padding: 0 20px;
  height: 54px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: flex;

  div{
    color:  #FABE1D;
    font-size: 18px;
    line-height: 54px;
    font-weight: 500;
  }
}
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
  min-height: 800px;
  background-image: url('@/assets/images/backIndexIcon.png');
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
        width: 600px;

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
    margin-top: $small-app-bar-height;
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
