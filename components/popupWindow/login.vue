<template>
  <div v-if='loginType === 1' class='login-window'>
    <div class='login-window-card'>
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(1)' src='@/assets/images/cloudSales/popupWindow/icon_delet.png' alt='' />
        </div>
        <div class='flex' style='justify-content: center;margin-top: 36px'>
          <img src='@/static/favicon.png' alt='' style='width: 70px;height: 70px' />
          <p>Pandadelivero</p>
        </div>
        <div class='center choneChone'>{{ $t(`欢迎回来`) }}!</div>
        <div class='loginClass'>
          <div class='login_input p-relative'>
            <div style='margin-bottom: 8px'>{{ $t(`您将如何使用我们的服务`) }}？</div>
            <el-radio-group v-model='isType'>
              <el-radio :label='1'>{{ $t(`个人使用`) }}</el-radio>
              <el-radio :label='2'>{{ $t(`我是快递员`) }}</el-radio>
              <el-radio :label='3'>{{ $t(`我是商家`) }}</el-radio>
            </el-radio-group>
          </div>
          <div class='login_input p-relative'>
            <div>{{ $t(`手机号`) }}</div>
            <el-input :placeholder='$t(`请输入`)' @mousewheel.native.prevent type='number'
                      style='width: 380px;margin-top: 8px; height: 48px'
                      v-model='mobile'>
              <template slot='prepend'>
                <el-select v-model='phoneNumber' placeholder='请选择' style='width: 80px'>
                  <el-option
                    v-for='item in options'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'>
                  </el-option>
                </el-select>
              </template>
            </el-input>
            <div class='button' style='cursor: pointer' @click='bindSendCode()' v-if='!isHaTrue&&isType===1'>{{
                isGetCode ? $t(`获取验证码`) : `${countdown}s` + $t(`重新获取`)
              }}</div>
          </div>
          <div class='login_input' v-if='!isHaTrue&&isType===1'>
            <div>{{ $t(`验证码`) }}</div>
            <el-input :placeholder='$t(`请输入`)' type='password' show-password style='width: 380px;margin-top: 8px;height: 48px' v-model='smsCode'>
            </el-input>
          </div>
          <div class='login_input' v-if='isHaTrue||isType===2||isType===3'>
            <div>{{ $t(`密码`) }}</div>
            <el-input  :placeholder='$t(`请输入`)' type='password' show-password style='width: 380px;margin-top: 8px;height: 48px' v-model='passwd'>
            </el-input>
          </div>
          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'
                 style='font-weight: bold'>
            {{ $t(`登录`) }}
          </v-btn>
          <div class='mt2' @click='isHaTrue=!isHaTrue' style='cursor: pointer;color: #F9C13E;' v-if='isType===1'>
            {{ isHaTrue ? $t(`验证码登录`) : $t(`密码登录`) }}
          </div>
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
      mobile: '',
      passwd: '',
      isHaTrue: false,
      countdown: 0,
      isGetCode: true,
      isType: 2,
      smsCode: '',
      isAddClickFalse: true,
      phoneNumber: 34,
      options:[{
        label : '+1',
        value: 1
      }, {
        label: '+44',
        value: 44
      }, {
        label: '+33',
        value: 33
      }, {
        label: '+61',
        value: 61
      },  {
        label: '+34',
        value: 34
      }, {
        label: '+86',
        value: 86
      }, {
        label: '+81',
        value: 81
      }, {
        label: '+39',
        value: 39
      }]
    };
  },
  methods: {
    bindSendCode() {
      console.log(123213231)
      if (this.countdown || !this.isAddClickFalse) {
        return;
      }
      this.isAddClickFalse = false;
      if (!this.mobile) {
        this.$message.error(this.$t(`请输入手机号码`));
        this.isAddClickFalse = true;
        return;
      } else {
        let data = {
          country_code: this.phoneNumber,
          mobile: this.mobile
        };
        this.$axios.post('/magic/sendsms', data).then(res => {
          this.countdown = 60;
          const interval = setInterval(() => {
            this.countdown--
            if (this.countdown === 0) {
              this.countdown = 0;
              this.isAddClickFalse = true
              clearInterval(interval);
            }
          }, 1000);
        }).catch(err => {
          this.$message.info(err.message);
        });
      }
    },
    handleChangeType(type) {
      if (type === 1) {
        this.$emit('handleCloseLoginDialog', -1);
      } else if (type === 2) {
        if (this.isType === 1) {
          if ((!this.passwd || !this.mobile) && (!this.mobile || !this.smsCode)) {
            this.$message.error(this.$t(`请输入内容`));
            return;
          }
          let data = {
            mobile: this.mobile
          };
          if (this.isHaTrue) {
            data.passwd = this.passwd;
          } else {
            data.sms_code = this.smsCode;
            data.country_code = this.phoneNumber;
          }
          this.$axios.post('/client/passport/login', data).then(res => {
            localStorage.setItem('token', res.token);
            this.$axios.post('/client/member/member/index', data).then(res => {
              localStorage.setItem('userInfo', JSON.stringify(res));
              this.$store.commit('SET_USERINFO', res);
              this.$message.success(this.$t(`登录成功`));
              setTimeout(()=>{
                window.location.href = '/';
              },1500)
              this.$emit('handleCloseLoginDialog', -2);
            }).catch(err => {
              this.$message.info(err.message);
            });
          }).catch(err => {
            this.$message.info(err.message);
          });
        } else {
          if (!this.mobile) {
            this.$message.error(this.$t(`请输入手机号`));
            return;
          }
          if (!this.passwd) {
            this.$message.error(this.$t(`请输入密码`));
            return;
          }
          let params = {
            mobile: this.mobile,
            passwd: this.passwd
          };
          if(this.isType === 2){
            this.$axios.post('/staff/entry/login', params).then(res => {
              localStorage.setItem('token', res.token);
              localStorage.setItem('userInfo', JSON.stringify(res));
              this.$store.commit('SET_USERINFO', res);
              this.$message.success(this.$t(`登录成功`));
              setTimeout(()=>{
                window.location.href = '/';
              },1500)
              this.$emit('handleCloseLoginDialog', -2);

            }).catch(err => {
              this.$message.info(err.message);
            });
          }else {
            params.country_code =  this.phoneNumber

            this.$axios.post('/biz/account/login', params).then(res => {
              localStorage.setItem('token', res.token);
              localStorage.setItem('userInfo', JSON.stringify(res));
              this.$store.commit('SET_USERINFO', res);
              this.$message.success(this.$t(`登录成功`));
              setTimeout(()=>{
                window.location.href = '/';
              },1500)
              this.$emit('handleCloseLoginDialog', -2);

            }).catch(err => {
              this.$message.info(err.message);
            });
          }

        }

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
  height: 580px;
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
          width: 100%;
          text-align: right;
          color: #0a98fe;
          font-size: 14px;
          height: 24px;
          //position: absolute;
          //top: 32px;
          //right: 16px;
          line-height: 24px;
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


