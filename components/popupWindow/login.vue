<template>
  <div v-if='loginType === 1' class='login-window'>
    <div class='login-window-card'>
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(1)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png' alt='' />
        </div>
        <p>{{ $t('loginOrRegister.title') }}</p>
        <div class='loginClass'>

          <div class='login_input'>
            <div>{{ $t('loginOrRegister.formLabel')[0] }}</div>
            <el-select v-model='conPhone' filterable :placeholder="$t('loginOrRegister.placeholder')[1]"
                       style='flex: 1'>
              <el-option v-for='(item, index) in companyTypeList' :key='index' :label='item.name'
                         :value='item.value'></el-option>
            </el-select>
          </div>

          <div class='login_input p-relative'>
            <div>{{ $t('loginOrRegister.formLabel')[1] }}</div>

            <el-input  :placeholder="$t('loginOrRegister.placeholder')[0]" @mousewheel.native.prevent type='number' style='width: 350px;height: 40px' v-model="phone">
              <template slot="prepend">+34</template>
            </el-input>
            <span class='button' style='cursor: pointer' @click='bindSendCode()'>{{
                isGetCode ? $t('loginOrRegister.btnText')[1] : `${countdown}s${$t('loginOrRegister.btnText')[2]}`
              }}</span>
          </div>

          <div class='login_input p-relative'>
            <div>{{ $t('loginOrRegister.formLabel')[3] }}</div>
            <input v-model='img_code' :placeholder="$t('loginOrRegister.placeholder')[0]" class='c-input' />
            <el-image @click='getVerifyCode'
              style='width: 80px; height: 30px'
              :src='imgCode'
            >
            </el-image>
          </div>
          <div class='login_input'>
            <div>{{ $t('loginOrRegister.formLabel')[2] }}</div>
            <input v-model='code' :placeholder="$t('loginOrRegister.placeholder')[0]" class='c-input' />
          </div>

          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'
                 style='font-weight: bold'>{{
              $t('loginOrRegister.btnText')[0]
            }}
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
      companyTypeList: [{
        name: 'USA',
        value: 1
      }, {
        name: 'Great Britain',
        value: 44
      }, {
        name: 'France',
        value: 33
      }, {
        name: 'Australia',
        value: 61
      }, {
        name: 'Canada',
        value: 1
      }, {
        name: 'Spain',
        value: 34
      }, {
        name: 'China',
        value: 86
      }, {
        name: 'Japan',
        value: 81
      }, {
        name: 'Italia',
        value: 39
      }],
      tradeTypeId: '',
      conPhone: 34,
      isGetCode: true,
      phone: '',
      countdown: 60,
      code: '',
      imgCode: '',
      img_code: ''
    };
  },
  watch: {
    loginType() {
      this.getVerifyCode();
    }

  },

  methods: {
    getVerifyCode() {
      const params = {

      };
      this.$axios.post('/magic/image', params).then(res => {
        this.imgCode = res.img;
        // this.imgCode = 'data:image/png;base64,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'
      }).catch(err => {
        this.$message.info(err.message);
      });

    },

    handleChangeType(type) {
      if (type === 1) {
        this.$emit('handleCloseLoginDialog', -1);
      } else if (type === 2) {
        if (!this.conPhone) {
          this.$message.error(this.$t(`loginOrRegister.placeholder`)[1]);
          return;
        }
        if (!this.phone) {
          this.$message.error(this.$t(`loginOrRegister.placeholder`)[0]);
          return;
        }
        if (!this.code) {
          this.$message.error(this.$t(`loginOrRegister.placeholder`)[0]);
          return;
        }
        let params = {
          data: {
            mobile: this.conPhone + '-' + this.phone,
            sms_code: this.code
          }
        };

        this.$axios.post('/client/passport/login', params).then(res => {
          localStorage.setItem('token', res.token);
          this.$emit('handleCloseLoginDialog', -2);
        }).catch(err => {
          this.$message.info(err.message);
        });
      }
    },

    bindSendCode(type) {
      if (this.isGetCode) {
        if (!this.conPhone) {
          this.$message.error(this.$t(`loginOrRegister.placeholder`)[1]);
          return;
        }
        if (!this.phone) {
          this.$message.error(this.$t(`loginOrRegister.placeholder`)[0]);
          return;
        }
        if (!this.img_code) {
          this.$message.error(this.$t(`loginOrRegister.placeholder`)[0]);
          return;
        }
        // this.conPhone + '-' +
        const params = {
          data: {
            mobile:  this.phone,
            img_code: this.img_code
          }
        };

        this.$axios.post('/magic/sendsms', params, ).then(res => {
          this.isGetCode = false;
          const interval = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) {
              this.countdown = 60;
              this.isGetCode = true;
              clearInterval(interval);
            }
          }, 1000);
        }).catch(err => {
          this.$message.info(err.message);
        });
      }
    }
  }
};
</script>
<style lang='scss'>
.loginClass {
  .login_input {
    .v-input__slot {
      border-radius: 6px;
      border: 1px solid #dcdcdc !important;
      height: 48px;

      margin-bottom: 0;
    }

    .c-input {
      border-radius: 6px;
      border: 1px solid #dcdcdc !important;
      height: 48px;
      margin-bottom: 0;
      flex: 1;
      padding-left: 12px;
      margin-right: 12px;
    }

    .v-text-field__details {
      display: none;
    }
  }
}
</style>
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
