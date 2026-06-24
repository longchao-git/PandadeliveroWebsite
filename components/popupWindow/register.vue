<template>
  <div v-if='loginType === 1' :class='type === 0?"login-window":""'>
    <div class='login-window-card newVaeea'>
      <div>
        <div class='loginView' v-if='type === 0'>
          <img @click='handleChangeType(1)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png' alt='' />
        </div>
        <p>{{ $t('applyToBecomeRider') }}</p>
        <div class='divContent'>{{ $t('fillOutFormBelowToStart') }}</div>
        <div class='loginClass'>
          <div class='flex ' style='width: 100%;'>
            <div class='login_input leftview'>
<!--              <div>{{ $t(`名字`) }}</div>-->
              <el-input :placeholder='$t("firstName")' style='height: 48px;margin-top: 8px;flex: 1;' v-model='uname'>
              </el-input>
            </div>
            <div class='login_input rightview'>
<!--              <div>{{ $t(`姓`) }}</div>-->
              <el-input :placeholder='$t("lastName")' style='height: 48px;margin-top: 8px;flex: 1;' v-model='last_name'>
              </el-input>
            </div>
          </div>
          <div class='login_input'>
<!--            <div>{{ $t(`联系邮箱`) }}</div>-->
            <el-input :placeholder='$t("contactEmail")' style='margin-top: 8px;height: 48px;border-radius: 48px' v-model='email'>
            </el-input>
          </div>
          <div class='login_input rightview'>
<!--            <div>{{ $t(`手机号`) }}</div>-->
            <el-input :placeholder='$t("mobileNumber")' style='margin-top: 8px;height: 48px' v-model='mobile'>
              <template slot='prepend'>+34
                <!--                <el-select v-model="value" placeholder="请选择" style="width: 80px">-->
                <!--                  <el-option-->
                <!--                    v-for="item in options"-->
                <!--                    :key="item.value"-->
                <!--                    :label="item.label"-->
                <!--                    :value="item.value">-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
              </template>
            </el-input>
          </div>
          <div style='width: 100%;margin-top: 16px' class='flex'>
            <el-radio-group v-model='contact_type'>
              <el-radio label='sms'>{{ $t('sms') }}</el-radio>
              <el-radio label='whatsapp'>whatsapp</el-radio>
            </el-radio-group>
          </div>

          <div class='login_input'>
<!--            <div>{{ $t(`密码`) }}</div>-->
            <el-input :placeholder='$t("password")' type='password' show-password
                      style='margin-top: 8px;height: 48px' v-model='passwd'>
            </el-input>
          </div>
          <!--          <div class='login_input'>-->
          <!--            <div>{{$t(`身份证号码`)}}</div>-->
          <!--            <el-input :placeholder="$t(`请输入`)"  style='margin-top: 8px;height: 48px' v-model="id_number">-->
          <!--            </el-input>-->
          <!--          </div>-->
          <div class='flex' style='width: 100%;'>
            <div class='login_input leftview'>
<!--              <div>{{ $t(`国家`) }}</div>-->
              <el-select v-model='country' :placeholder='$t("pleaseSelect")' style='flex: 1;width: 100%'>
                <el-option
                  :label='$t("spain")'
                  :value="$t('spain')">
                </el-option>
              </el-select>
            </div>
            <div class='login_input rightview'>
<!--              <div>{{ $t(`城市`) }}</div>-->

              <el-select v-model='city_id' :placeholder='$t("pleaseSelect")' style='flex: 1;width: 100%'>
                <el-option
                  :label='$t("madrid")'
                  :value='2'>
                </el-option>
                <el-option
                  :label='$t("barcelona")'
                  :value='3'>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class='login_input'>
<!--            <div>{{ $t(`交通工具`) }}</div>-->

            <el-select v-model='staff_type_new' :placeholder='$t("pleaseSelect")' style='flex: 1;'>
              <el-option
                :label='$t("car")'
                :value="$t('car')">
              </el-option>
              <el-option
                :label='$t("motorcycle")'
                :value="$t('motorcycle')">
              </el-option>
              <el-option
                :label='$t("electricBicycle")'
                :value="$t('electricBicycle')">
              </el-option>
              <el-option
                :label='$t("bicycle")'
                :value="$t('bicycle')">
              </el-option>
            </el-select>
          </div>
          <div class='login_input'>
<!--            <div>{{ $t(`上级邀请码`) }}</div>-->
            <el-input :placeholder='$t("superiorInvitationCode")' style='margin-top: 8px;height: 48px' v-model='share_code'>
            </el-input>
          </div>

          <div class='flex flex-a-c' style='margin-top: 16px'>
            <img v-if='checked' src='../../assets/images/cloudSales/home/checked.png' alt='' class='icon24'
                 @click='checked=!checked'>
            <img v-if='!checked' src='../../assets/images/cloudSales/home/default.png' alt='' class='icon24'
                 @click='checked=!checked'>
            <div style='color: #1D2129;text-align: left' class='font14'>
              {{ $t('weCollectDataToProcessApplication') }} <span style='color: #4787F0'>{{ $t('privacyPolicy') }}</span>
            </div>
          </div>
          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'
                 style='font-weight: bold'>
            {{ $t('applyNow') }}
          </v-btn>
        </div>
      </div>
    </div>
    <invite-download :loginType='isType' @handleCloseLoginDialog='handleCloseLoginDialog'></invite-download>
  </div>
</template>

<script>

import inviteDownload from '@/components/popupWindow/inviteDownload';


export default {
  components: {
    inviteDownload
  },
  props: {
    loginType: {
      type: Number,
      default: -1
    },
    //0 弹窗样式 1 不是弹窗
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isType: -1,
      mobile: '',
      passwd: '',
      uname: '',
      last_name: '',
      id_number: '',
      email: '',
      city_id: 2,
      staff_type_new: '',
      country: '',
      contact_type: 'whatsapp',
      share_code: '',
      checked: false,
      value: 34,
      options: [{
        label: '+1',
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
      }, {
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

    handleCloseLoginDialog() {
      this.isType = -1;
    },
    handleChangeType(type) {

      if (type === 1) {
        this.$emit('handleCloseLoginDialog', -1);
      } else if (type === 2) {
        if (!this.checked) {
          this.$message.error(this.$t('pleaseReadAndUnderstandPrivacyPolicy'));
          return;
        }
        if (!this.uname) {
          this.$message.error(this.$t('pleaseEnterFirstName'));
          return;
        }
        if (!this.last_name) {
          this.$message.error(this.$t('pleaseEnterLastName'));
          return;
        }
        if (!this.mobile) {
          this.$message.error(this.$t('pleaseEnterMobileNumber'));
          return;
        }
        if (!this.passwd) {
          this.$message.error(this.$t('pleaseEnterPassword'));
          return;
        }

        // if (!this.id_number) {
        //   this.$message.error(this.$t(`请输入身份证号`));
        //   return;
        // }
        if (!this.email) {
          this.$message.error(this.$t('pleaseEnterContactEmail'));
          return;
        }
        let params = {
          uname: this.uname,
          last_name: this.last_name,
          id_number: this.id_number,
          email: this.email,
          city_id: this.city_id,
          staff_type_new: this.staff_type_new,
          country: this.country,
          contact_type: this.contact_type,
          share_code: this.share_code,
          mobile: this.mobile,
          passwd: this.passwd
        };

        this.$axios.post('/staff/entry/register', params).then(res => {

          this.$message.success(this.$t('submittedSuccessfullyDataUnderReview'));
          this.isType = 3;
          this.id_number = '';
          this.email = '';
          this.city_id = 2;
          this.staff_type_new = this.$t('car');
          this.contact_type = 'whatsapp';
          this.share_code = '';
          this.uname = '';
          this.last_name = '';
          this.mobile = '';
          this.passwd = '';
          // setTimeout(()=>{
          //   window.location.href = '/';
          // },1500)
          // this.$emit('handleCloseLoginDialog', -2);
        }).catch(err => {
          this.$message.info(err.message);
        });
      }
    }

  }
};
</script>
<style lang='scss'>

  .leftview{
    .el-input__inner{
      border-radius: 16px 0 0 16px !important;

    }
  }
  .rightview{
    .el-input__inner{
      border-radius: 0 16px  16px  0 !important;

    }
  }
.newVaeea{
  .el-input__inner{
    border-radius: 16px;
    background: #fff8e2;
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
  z-index: 200;
  display: flex;
}

.icon24 {
  width: 24px;
  height: 24px;
}

/** 登录卡片样式 */
.login-window-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(249, 193, 62, 0.20) 0%, rgba(10, 218, 254, 0.00) 100%), #FFF;
  margin: auto;
  width: 540px;
  height: 780px;
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
      margin-top: 28px;
      margin-bottom: 0;
      color: #181818;
      font-size: 30px;
      font-weight: 500;
    }

    .divContent {
      color: #777;
      font-size: 14px;
    }

    .loginClass {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      padding: 0 28px;

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
          right: 24px;
          line-height: 48px;
        }

        .v-input__slot {
          border-radius: 6px;
          border: 1px solid #dcdcdc;
          height: 48px;
        }

        > div {
          width: 100%;
          text-align: left;
          flex-shrink: 0;

          color: #2c2c2c;
          font-size: 16px;
          padding-right: 12px;

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
    height: 600px;

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
