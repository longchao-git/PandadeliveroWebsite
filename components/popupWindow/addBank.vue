<template>
  <div v-if='type===9' class='login-window' v-loading='loading'>
    <div class='login-tan-card' :class="type===9?'login-class':''">
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(5)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png'
               alt='' />
        </div>
        <p>{{ $t(`添加银行卡`) }}</p>
        <div class='loginClass'>

          <div class='login_input'>
            <div>{{ $t(`银行卡名称`) }}</div>
            <input
              v-model='card_name'
              placeholder='请输入'
              class='c-input' />
          </div>

          <div id='card' class=''>
            <div class='login_input'>
              <div>{{ $t(`银行卡卡号`) }}</div>
              <div class='card-input gotham' id='card-number-element'></div>
            </div>
            <div class='login_input'>
              <div>{{ $t(`银行卡到期时间`) }}</div>
              <div class='card-input gotham' id='card-expiry-element'></div>
            </div>
            <div class='login_input'>
              <div>{{ $t(`银行卡安全码`) }}</div>
              <div class='card-input gotham' id='card-cvc-element'></div>
            </div>

            <!--            <div class="card-input gotham" id="card-cvc-element"></div>-->
          </div>
          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='createPaymentMethod()'>{{ $t(`保存`) }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type'],
  data() {
    return {
      card_name: '',
      cvc: '',
      card_number: '',
      year: '',
      month: '',
      card: null,
      cardElement: null,
      stripe: null,
      payment_method_id: '',
      loading: false
    };
  },
  mounted() {
  },
  watch: {
    type(newVal, oldVal) {
      if (newVal === 9) {
        this.elements();
      }
    }
  },
  methods: {
    elements() {
      // pk_live_51N6ZB2EXrtl05xVO2ptAxLtE5Thx8MAh4lLpui3dLNVEwG8amXBjq8AYCk48hMHBqVezIrlc1YwZANnDgXgwB1sm00MJrBfzOp
      // 'pk_test_51N6ZB2EXrtl05xVOkEOmanXteVdNjaN6zdjcyzCKuEUbkMkRob6O1GRZ75xSKMEnTGJvnrPCkmeAUziBLybNxeAR00IyIhtQES'
      this.stripe = Stripe(
        'pk_live_51N6ZB2EXrtl05xVO2ptAxLtE5Thx8MAh4lLpui3dLNVEwG8amXBjq8AYCk48hMHBqVezIrlc1YwZANnDgXgwB1sm00MJrBfzOp'
      );
      this.stripe.elements({
        locale: 'en',
        style: {
          base: {
            iconColor: '#8e40ff',
            color: '#32325d',
            fontWeight: '500',
            fontFamily: 'Helvetica Neue',
            fontSize: '15px',
            '::placeholder': {
              color: '#aab7c4'
            }
          }
        }
      });

      let elements = this.stripe.elements();
      let style = {};
      const element = elements.create('cardNumber', {
        style: style,
        showIcon: true,
        placeholder: this.$t(`请输入`)
      });

      const cardExpiryElement = elements.create('cardExpiry', {
        style: style,
        showIcon: true,
        placeholder: this.$t(`请输入`)
      });

      const cardCvcElement = elements.create('cardCvc', {
        style: style,
        showIcon: true,
        placeholder: this.$t(`请输入`)
      });

      this.$nextTick(() => {
        element.mount('#card-number-element');
        cardExpiryElement.mount('#card-expiry-element');
        cardCvcElement.mount('#card-cvc-element');
        this.cardElement = element;
        element.on('change', this.setValidationError);
        cardExpiryElement.on('change', this.setValidationError);
        cardCvcElement.on('change', this.setValidationError);
      });

    },
    setValidationError(e) {
      console.log(e);
    },

    /** 处理呼叫父级 - 设置type状态 */
    handleChangeType(value) {
      this.$emit('handleCloseLoginDialog', value);
    },

    async createPaymentMethod() {

      if (!this.card_name) {
        this.$message.info(this.$t(`请输入`));
        return;
      }
      const params = {
        data: {
          'card_name': this.card_name,
          'card_type': 1,
          'cvc': '****',
          'card_number': '**********',
          'year': '****',
          'month': '**'
        }
      };
      this.loading = true;
      this.$axios.post('/client/member/card/setup_intent', params).then(res => {
        this.stripe.confirmCardSetup(res.client_secret, {
          payment_method: {
            card: this.cardElement
          }
        }).then(result => {
          console.log(result);
          if (result.setupIntent && result.setupIntent.payment_method) {
            params.data.payment_method_id = result.setupIntent.payment_method;
            this.$axios.post('/client/member/card/bind', params).then(async res => {
              this.loading = false;
              this.$message.success(this.$t(`保存成功`));
              this.handleChangeType(-9);
            }).catch(err => {
              this.loading = false;
              if (err.error == 210) {
                this.$message.info(this.$t(`保存失败`));
              } else {
                this.$message.info(err.message);
              }

            });
          } else {
            this.loading = false;
            this.$message.info(result.error && result.error.message ? result.error.message : this.$t(`保存失败`));
          }
        }).catch(err => {
          this.loading = false;
          this.$message.info(err.message);
        });
      }).catch(err => {
        this.loading = false;
        this.$message.info(err.message);
      });
    }
  }
};
</script>
<style lang='scss'>
.card-input {
  border: 1px solid #eee !important;
  padding: 16px 12px !important;
  width: 312px !important;
  border-radius: 8px !important;
  //margin-top: 10px !important;
}

.loginClass {
  .login_input {

    .v-input__slot {
      border-radius: 6px;
      border: 1px solid #DCDCDC !important;
      height: 48px;

      margin-bottom: 0;
    }

    .c-input {
      border-radius: 6px;
      border: 1px solid #DCDCDC !important;
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
  background: rgba(0, 0, 0, .4);
  top: 0;
  right: 0;
  bottom: 0;

  min-width: 100vw;
  width: 100%;
  z-index: 5;
  display: flex;
}

.login-class {
  height: 480px !important;
}

/** 登录卡片样式 */
.login-tan-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(238, 128, 128, 0.20) 0%, rgba(10, 218, 254, 0.00) 100%), #FFF;
  margin: auto;
  width: 540px;
  height: 740px;
  position: relative;

  > div {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    height: 100%;

    > .loginView {
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
      }

      .name {
        margin-top: 12px;
        font-size: 24px;
        color: #2C2C2C;
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
          color: #f9c13e;
          font-size: 14px;
          position: absolute;
          right: 24px;
        }

        .v-input__slot {
          border-radius: 6px;
          border: 1px solid #DCDCDC;
          height: 48px;
        }

        > div {
          width: 120px;
          flex-shrink: 0;
          text-align: right;
          color: #2C2C2C;
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
          color: #1D2129;
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          width: 100%;

          > span {
            color: #f9c13e;
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
          border-top: 1px #C5C5C5 dashed;
        }

        span {
          color: #4B4B4B;
          flex-shrink: 0;
          padding: 0 8px;
        }
      }
    }

  }

}

/* 中屏幕*/
@media screen and(max-width: $big-pc-width) {

  /** 登录卡片样式 */
  .login-tan-card {
    width: 600px;

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
  .login-class {
    height: 560px !important;
  }
  /** 登录卡片样式 */
  .login-tan-card {
    width: 300px;
    height: 540px !important;

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
            border: 1px solid #DCDCDC;
            height: 48px;
          }

          > div {
            width: 72px;
            text-align: right;
            color: #2C2C2C;
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
            color: #1D2129;

            > span {
              font-size: 12px;
              color: #f9c13e;
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
            border-top: 1px #C5C5C5 dashed;
          }

          span {
            color: #4B4B4B;
            flex-shrink: 0;
            padding: 0 8px;
          }
        }
      }

    }

  }
}
</style>
