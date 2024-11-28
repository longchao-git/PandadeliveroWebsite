
<template>
  <div v-if='loginType === 1' :class='type === 0?"login-window":""'>
    <div class='login-window-card'>
      <div>
        <div class='loginView' v-if='type === 0'>
          <img @click='handleChangeType(1)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png' alt='' />
        </div>
        <p>{{$t(`申请成为快递员`)}}</p>
        <div class='divContent'>{{$t(`填写下面的表格以开始使用`)}}</div>
        <div class='loginClass'>
          <div class='login_input'>
            <div>{{$t(`姓名`)}}</div>
            <el-input :placeholder="$t(`请输入`)"  style='height: 48px;margin-top: 8px' v-model="uname">
            </el-input>
          </div>
          <div class='login_input'>
            <div>{{$t(`手机号`)}}</div>
            <el-input  :placeholder="$t(`请输入`)"  style='margin-top: 8px;height: 48px' v-model="mobile">
              <template slot='prepend' >+34
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
          <div class='login_input'>
            <div>{{$t(`密码`)}}</div>
            <el-input  :placeholder="$t(`请输入`)" type='password' show-password
                       style='margin-top: 8px;height: 48px' v-model="passwd">
            </el-input>
          </div>
          <div class='login_input'>
            <div>{{$t(`身份证号码`)}}</div>
            <el-input :placeholder="$t(`请输入`)"  style='margin-top: 8px;height: 48px' v-model="id_number">
            </el-input>
          </div>
          <div class='login_input'>
            <div>{{$t(`联系邮箱`)}}</div>
            <el-input :placeholder="$t(`请输入`)"  style='margin-top: 8px;height: 48px' v-model="email">
            </el-input>
          </div>
          <div class='login_input'>
            <div>{{$t(`城市`)}}</div>
            <el-radio-group v-model="city_id">
              <el-radio :label="2">{{$t(`马德里`)}}</el-radio>
              <el-radio :label="3">{{$t(`巴塞罗那`)}}</el-radio>
            </el-radio-group>
          </div>
          <div class='login_input'>
            <div>{{$t(`上级邀请码`)}}</div>
            <el-input :placeholder="$t(`请输入`)"  style='margin-top: 8px;height: 48px' v-model="share_code">
            </el-input>
          </div>

          <div class='flex flex-a-c' style='margin-top: 16px'>
            <img v-if='checked' src='../../assets/images/cloudSales/home/checked.png' alt='' class='icon24' @click='checked=!checked'>
            <img v-if='!checked' src='../../assets/images/cloudSales/home/default.png' alt='' class='icon24'  @click='checked=!checked'>
            <div style='color: #1D2129;text-align: left' class='font14'>{{$t(`我们收集这些数据是为了处理您成为快递员的申请。点击此框，即表示您确认已阅读并理解`)}} <span  style='color: #4787F0'>{{$t(`隐私政策`)}}</span> </div>
          </div>
          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'
                 style='font-weight: bold'>
            {{$t(`立即申请`)}}
          </v-btn>
        </div>
      </div>
    </div>
    <invite-download :loginType='isType' @handleCloseLoginDialog='handleCloseLoginDialog'></invite-download>
  </div>
</template>

<script>

import inviteDownload  from '@/components/popupWindow/inviteDownload';


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
    type:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isType:-1,
      mobile: '',
      passwd: '',
      uname: '',
      id_number: '',
      email:'',
      city_id:2,
      share_code:'',
      checked:false,
      value:34,
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

    handleCloseLoginDialog(){
      this.isType = -1
    },
    handleChangeType(type) {

      if (type === 1) {
        this.$emit('handleCloseLoginDialog', -1);
      } else if (type === 2) {
        if(!this.checked){
          this.$message.error(this.$t(`请阅读并理解隐私政策`));
          return;
        }
        if (!this.uname) {
          this.$message.error(this.$t(`请输入姓名`));
          return;
        }
        if (!this.mobile) {
          this.$message.error(this.$t(`请输入手机号`));
          return;
        }
        if (!this.passwd) {
          this.$message.error(this.$t(`请输入密码`));
          return;
        }

        if (!this.id_number) {
          this.$message.error(this.$t(`请输入身份证号`));
          return;
        }
        if(!this.email){
          this.$message.error(this.$t(`请输入联系邮箱`));
          return;
        }
        let params = {
          uname: this.uname,
          id_number: this.id_number,
          email:this.email,
          city_id:this.city_id,
          share_code:this.share_code,
          mobile:  this.mobile,
          passwd: this.passwd
        };

        this.$axios.post('/staff/entry/register', params).then(res => {

          this.$message.success(this.$t(`已提交成功，资料正在审核中，等待管理员联系`));
          this.isType = 3
          this.id_number = ''
          this.email = ''
          this.city_id = 2
          this.share_code = ''
          this.mobile = ''
          this.passwd = ''
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
.icon24{
  width: 24px;
  height: 24px;
}

/** 登录卡片样式 */
.login-window-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(249, 193, 62, 0.20) 0%, rgba(10, 218, 254, 0.00) 100%), #FFF;
  margin: auto;
  width: 540px;
  height: 900px;
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
    .divContent{
      color:#777;
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
