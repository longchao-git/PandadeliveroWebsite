<template>
  <div v-if='loginType === 2' class='login-window'>
    <div class='login-window-card'>
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(1)' src='@/assets/images/cloudSales/popupWindow/icon_delet.png' alt='' />
        </div>
        <div class='flex' style='justify-content: center;margin-top: 36px'>
          <p>{{ $t(`邀请码兑换`) }}</p>
        </div>

        <div class='loginClass'>
          <div class='login_input'>
            <div>{{ $t(`邀请码`) }}</div>
            <el-input :placeholder='$t(`请输入`)' style='width: 380px;margin-top: 8px;height: 48px' v-model='passwd'>
            </el-input>
          </div>

          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'
                 style='font-weight: bold'>
            {{ $t(`领取`) }}
          </v-btn>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapState, mapMutations } from 'vuex';

export default {
  props: {
    loginType: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      passwd: ''
    };
  },
  methods: {
    handleChangeType(type) {
      if (type === 1) {
        this.$emit('handleCloseLoginDialog', -1);
      } else if (type === 2) {
        if (!this.passwd) {
          this.$message.error(this.$t(`请输入邀请码`));
          return;
        }
        let params = {
          passwd: this.passwd
        };
        this.$axios.post('/staff/entry/login', params).then(res => {
          this.$message.success(this.$t(`兑换成功，请下载客户端app使用`));
          this.$emit('handleCloseLoginDialog', -2);
        }).catch(err => {
          this.$message.info(err.message);
        });
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

.choneChone {
  color: #ECAC00;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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

      .logoCard {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 50%;
      }

      .name {
        margin-top: 12px;
        font-size: 24px;
        color: #2c2c2c;
        font-weight: 500;
        margin-bottom: 12px;
      }

      .login_input {
        width: 100%;


        margin-top: 12px;

        .button {
          color: #0a98fe;
          font-size: 14px;
          position: absolute;
          top: 32px;
          right: 16px;
          line-height: 48px;
        }

        .v-input__slot {
          border-radius: 6px;
          border: 1px solid #dcdcdc;
          height: 48px;
        }

        > div {
          width: 100%;
          flex-shrink: 0;
          text-align: left;
          color: #4B4B4B;
          font-size: 16px;

          //padding-top: 8px;
        }
      }

      .viewSetTion {
        margin-top: 16px;
        display: flex;
        flex-direction: row;

        > img {
          margin: 5px;
          height: 24px;
          width: 24px;
        }

        > div {
          line-height: 22px;
          font-size: 14px;
          color: #1d2129;
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          width: 100%;

          > span {
            color: #0a98fe;
          }
        }
      }

      .viewXian {
        padding: 16px 0;
        width: 100%;
        display: flex;
        align-items: center;

        > div {
          flex: 1;
          border-top: 1px #c5c5c5 dashed;
        }

        span {
          color: #4b4b4b;
          flex-shrink: 0;
          padding: 0 8px;
        }
      }

      .email_icon {
        width: 24px;
        height: 24px;
      }
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

        .logoCard {
          width: 48px;
          height: 48px;
        }

        .name {
          font-size: 16px;
          margin-bottom: 6px;
        }

        .login_input {
          margin-top: 6px;

          .v-input__slot {
            border-radius: 6px;
            border: 1px solid #dcdcdc;
            height: 48px;
          }

          > div {
            width: 72px;
            text-align: right;
            color: #2c2c2c;
            font-size: 12px;
            padding-right: 12px;
            padding-top: 8px;
          }
        }

        .viewSetTion {
          margin-top: 16px;
          display: flex;
          flex-direction: row;

          > img {
            margin: 2px;
            height: 18px;
            width: 18px;
          }

          > div {
            line-height: 16px;
            font-size: 12px;
            color: #1d2129;

            > span {
              font-size: 12px;
              color: #0a98fe;
            }
          }
        }

        .viewXian {
          padding: 4px 0;
          width: 100%;
          display: flex;
          align-items: center;

          > div {
            flex: 1;
            border-top: 1px #c5c5c5 dashed;
          }

          span {
            color: #4b4b4b;
            flex-shrink: 0;
            padding: 0 8px;
          }
        }
      }
    }
  }
}
</style>


