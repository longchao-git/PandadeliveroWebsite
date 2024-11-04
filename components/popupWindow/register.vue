
<template>
  <div v-if='loginType === 1' class='login-window'>
    <div class='login-window-card'>
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(1)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png' alt='' />
        </div>
        <p>申请成为快递员</p>
        <div class='loginClass'>
          <div class='login_input'>
            <div>姓名</div>
            <el-input  :placeholder="$t('loginOrRegister.placeholder')[0]"  style='width: 350px;height: 48px' v-model="uname">
            </el-input>
          </div>
          <div class='login_input'>
            <div>手机号</div>
            <el-input  :placeholder="$t('loginOrRegister.placeholder')[0]"  style='width: 350px;height: 48px' v-model="mobile">
            </el-input>
          </div>
          <div class='login_input'>
            <div>密码</div>
            <el-input  :placeholder="$t('loginOrRegister.placeholder')[0]"  style='width: 350px;height: 48px' v-model="passwd">
            </el-input>
          </div>
          <div class='login_input'>
            <div>身份证号码</div>
            <el-input  :placeholder="$t('loginOrRegister.placeholder')[0]"  style='width: 350px;height: 48px' v-model="id_number">
            </el-input>
          </div>
          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'
                 style='font-weight: bold'>
            立即申请
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
      mobile: '',
      passwd: '',
      uname: '',
      id_number: ''
    };
  },


  methods: {


    handleChangeType(type) {
      if (type === 1) {
        this.$emit('handleCloseLoginDialog', -1);
      } else if (type === 2) {
        if (!this.mobile) {
          this.$message.error('请输入手机号');
          return;
        }
        if (!this.passwd) {
          this.$message.error('请输入密码');
          return;
        }
        if (!this.uname) {
          this.$message.error('请输入姓名');
          return;
        }
        if (!this.id_number) {
          this.$message.error('请输入身份证号');
          return;
        }
        let params = {
          uname: this.uname,
          id_number: this.id_number,
          mobile: this.phmobileone,
          passwd: this.passwd
        };

        this.$axios.post('/staff/entry/register', params).then(res => {
          localStorage.setItem('token', res.token);
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


/** 登录卡片样式 */
.login-window-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(238, 128, 128, 0.20) 0%, rgba(10, 218, 254, 0.00) 100%), #FFF;
  margin: auto;
  width: 540px;
  height: 500px;
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
      padding: 24px 0;
    }

    .loginClass {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      padding: 0 48px;

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
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 12px;

        .button {
          color: #0a98fe;
          font-size: 14px;
          position: absolute;
          right: 24px;
          line-height: 48px;
        }

        .v-input__slot {
          border-radius: 6px;
          border: 1px solid #dcdcdc;
          height: 48px;
        }

        > div {
          width: 100px;
          flex-shrink: 0;
          text-align: right;
          color: #2c2c2c;
          font-size: 16px;
          padding-right: 12px;
          padding-top: 8px;
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
