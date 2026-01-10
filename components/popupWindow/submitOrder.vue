<template>
  <div v-if="visible" class="submit-order-window">
    <div class="order-tan-card">
      <div>
        <div class="close-view">
          <img @click="handleClose" src="../../assets/images/cloudSales/popupWindow/icon_delet.png" alt="" />
        </div>
        <p>{{ $t('placeOrder') || '立即下单' }}</p>
        <div class="order-class">
          <!-- 如果没有地址，显示提示 -->
          <div v-if="addresses.length === 0" class="no-address-tip">
            <p class="tip-text">{{ $t('noAddressTip') || '您还没有添加收货地址' }}</p>
            <v-btn width="100%" height="48px" class="try-out-bt mt3" @click="goToMyAddresses">
              {{ $t('goToMyAddresses') || '去我的地址添加' }}
            </v-btn>
          </div>
          
          <!-- 如果有地址，显示地址选择 -->
          <template v-else>
            <div class="order_input">
              <div>{{ $t('selectAddress') || '选择地址' }}</div>
              <el-select
                v-model="selectedAddrId"
                :placeholder="$t('pleaseSelectAddress') || '请选择地址'"
                style="width: 330px"
                filterable
              >
                <el-option
                  v-for="addr in addresses"
                  :key="addr.addr_id"
                  :label="getAddressLabel(addr)"
                  :value="addr.addr_id"
                >
                  <div class="address-option">
                    <div class="address-option-name">{{ addr.contact }} {{ addr.mobile }}</div>
                    <div class="address-option-addr">{{ addr.addr }}{{ addr.house ? '，' + addr.house : '' }}</div>
                  </div>
                </el-option>
              </el-select>
            </div>
            
            <v-btn width="100%" height="48px" class="try-out-bt mt3" @click="handleSubmitOrder">
              {{ $t('placeOrder') || '立即下单' }}
            </v-btn>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubmitOrderPopup',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    productIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      addresses: [],
      selectedAddrId: null,
      loading: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.fetchAddresses()
      } else {
        this.selectedAddrId = null
      }
    }
  },
  methods: {
    /* 获取地址列表 */
    async fetchAddresses() {
      try {
        const res = await this.$axios.post('/staff/jifen/addr/index', {})
        // 接口返回的地址列表
        this.addresses = res.items || res || []
        
        // 如果有默认地址，自动选中
        const defaultAddr = this.addresses.find(addr => addr.is_default === 1 || addr.is_default === '1')
        if (defaultAddr) {
          this.selectedAddrId = defaultAddr.addr_id
        } else if (this.addresses.length > 0) {
          // 如果没有默认地址，选中第一个
          this.selectedAddrId = this.addresses[0].addr_id
        }
      } catch (e) {
        console.error('Fetch addresses error:', e)
        this.$message.error(e.msg || this.$t('loadAddressesError') || '加载地址失败')
      }
    },
    /* 获取地址显示标签 */
    getAddressLabel(addr) {
      return `${addr.contact} ${addr.mobile} - ${addr.addr}${addr.house ? '，' + addr.house : ''}`
    },
    /* 提交订单 */
    async handleSubmitOrder() {
      if (!this.selectedAddrId) {
        this.$message.info(this.$t('pleaseSelectAddress') || '请选择地址')
        return
      }
      
      if (!this.productIds || this.productIds.length === 0) {
        this.$message.error(this.$t('productIdRequired') || '商品ID不能为空')
        return
      }
      
      this.loading = true
      try {
        // 将商品ID数组转换为逗号分隔的字符串
        const productIdsStr = this.productIds.join(',')
        
        await this.$axios.post('/staff/jifen/order/create', {
          product_ids: productIdsStr,
          addr_id: this.selectedAddrId
        })
        
        this.$message.success(this.$t('orderSuccess') || '下单成功')
        this.handleClose()
        
        // 跳转到订单列表页面
        this.$router.push('/my-orders')
      } catch (e) {
        console.error('Submit order error:', e)
        this.$message.error(e.msg || this.$t('orderError') || '下单失败')
      } finally {
        this.loading = false
      }
    },
    /* 跳转到我的地址页面 */
    goToMyAddresses() {
      this.handleClose()
      this.$router.push('/my-addresses')
    },
    /* 关闭弹窗 */
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-order-window {
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  right: 0;
  bottom: 0;
  min-width: 100vw;
  width: 100%;
  z-index: 5;
  display: flex;
}

.order-tan-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(249, 193, 62, 0.2) 0%, rgba(10, 218, 254, 0) 100%), #fff;
  margin: auto;
  width: 540px;
  height: 400px;
  position: relative;

  > div {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    height: 100%;

    > .close-view {
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

    .order-class {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      padding: 0 48px;

      .order_input {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 12px;

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

      .address-option {
        text-align: left;
        
        .address-option-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
      .address-option-addr {
        font-size: 12px;
        color: #666;
      }
    }
    
    .no-address-tip {
      width: 100%;
      text-align: center;
      padding: 20px 0;
      
      .tip-text {
        font-size: 16px;
        color: #666;
        margin-bottom: 24px;
      }
    }
  }
}
}

/* 中屏幕 */
@media screen and (max-width: $big-pc-width) {
  .order-tan-card {
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
    }
  }
}

/* 手机屏幕 */
@media screen and (max-width: $phone-max-width) {
  .order-tan-card {
    width: 300px;
    height: 350px;

    > div {
      p {
        font-size: 16px;
        padding: 16px 0;
        margin-bottom: 0 !important;
      }

      .order-class {
        margin-top: 0px;
        padding: 0 16px;

        .order_input {
          margin-top: 6px;

          > div {
            width: 72px;
            text-align: right;
            color: #2C2C2C;
            font-size: 12px;
            padding-right: 12px;
            padding-top: 8px;
          }
        }
      }
    }
  }
}
</style>

