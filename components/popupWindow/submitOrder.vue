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
                @change="handleAddressChange"
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
            
            <!-- 订单信息显示 -->
            <div v-if="orderPreview" class="order-preview-info">
              <div class="preview-item">
                <span class="preview-label">{{ $t('points') || '积分' }}：</span>
                <span class="preview-value preview-points">
                  <img src="~/assets/images/icon_jfien.png" :alt="$t('iconPoints')" class="preview-icon" />
                  {{ orderPreview.totalPoints || 0 }}
                </span>
              </div>
              <div class="preview-item">
                <span class="preview-label">{{ $t('totalPrice') || '总价' }}：</span>
                <span class="preview-value preview-price">€{{ (orderPreview.totalPrice || 0).toFixed(2) }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">{{ $t('shippingFee') || '运费' }}：</span>
                <span class="preview-value preview-freight">€{{ (orderPreview.freight || 0).toFixed(2) }}</span>
              </div>
            </div>
            
            <v-btn width="100%" height="48px" class="try-out-bt mt3" @click="handleSubmitOrder" :loading="loading">
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
    },
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      addresses: [],
      selectedAddrId: null,
      loading: false,
      orderPreview: null // 订单预览信息
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.fetchAddresses()
        // 先尝试从购物车数据计算，如果有地址再获取运费
        this.calculateOrderPreview()
      } else {
        this.selectedAddrId = null
        this.orderPreview = null
      }
    },
    selectedAddrId(newVal) {
      if (newVal && this.visible) {
        // 地址改变时，重新获取预览信息（包括运费）
        this.fetchOrderPreview()
        if (!this.orderPreview) {
          this.calculateOrderPreview()
        }
      }
    },
    selectedItems: {
      handler() {
        if (this.visible) {
          this.calculateOrderPreview()
        }
      },
      deep: true
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
    /* 获取订单预览信息 */
    async fetchOrderPreview() {
      if (!this.productIds || this.productIds.length === 0) {
        return
      }
      
      try {
        // 调用订单预览接口，获取积分、价格、运费信息
        const productIdsStr = this.productIds.join(',')
        const res = await this.$axios.post('/staff/jifen/cart/preview_order', {
          product_ids: productIdsStr,
          addr_id: this.selectedAddrId || ''
        })
        
        // 处理返回的数据
        this.orderPreview = {
          totalPoints: res.total.jifen,
          totalPrice: parseFloat(res.total.price),
          freight: parseFloat(res.total.freight)
        }
      } catch (e) {
        console.error('Fetch order preview error:', e)
        // 如果接口不存在或失败，使用购物车数据计算
        this.calculateOrderPreview()
      }
    },
    /* 从购物车数据计算订单预览信息 */
    calculateOrderPreview() {
      // 如果没有预览接口，从父组件传递的数据计算
      if (this.selectedItems && this.selectedItems.length > 0) {
        let totalPoints = 0
        let totalPrice = 0
        
        this.selectedItems.forEach(item => {
          const points = parseInt(item.points || 0)
          const price = parseFloat(item.price || 0)
          const qty = parseInt(item.qty || 1)
          totalPoints += points * qty
          totalPrice += price * qty
        })
        
        this.orderPreview = {
          totalPoints: totalPoints,
          totalPrice: totalPrice,
          freight: 0 // 运费需要从接口获取
        }
        
        // 如果有地址，获取运费
        if (this.selectedAddrId) {
          this.fetchFreight()
        }
      }
    },
    /* 获取运费 */
    async fetchFreight() {
      if (!this.productIds || this.productIds.length === 0 || !this.selectedAddrId) {
        return
      }
      
      try {
        const productIdsStr = this.productIds.join(',')
        const res = await this.$axios.post('/staff/jifen/order/get_freight', {
          product_ids: productIdsStr,
          addr_id: this.selectedAddrId
        })
        
        if (this.orderPreview) {
          this.orderPreview.freight = parseFloat(res.freight || res.shipping_fee || res.shipping || 0)
        }
      } catch (e) {
        console.error('Fetch freight error:', e)
        if (this.orderPreview) {
          this.orderPreview.freight = 0
        }
      }
    },
    /* 地址改变时重新获取预览信息 */
    handleAddressChange() {
      this.fetchOrderPreview()
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
        this.$message.error(e.message || this.$t('orderError') || '下单失败')
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
  height: 430px;
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
    
    .order-preview-info {
      width: 100%;
      margin-top: 20px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      
      .preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .preview-label {
          font-size: 14px;
          color: #666;
        }
        
        .preview-value {
          font-size: 16px;
          font-weight: 600;
          
          &.preview-points {
            color: #7AC554;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            
            .preview-icon {
              width: 18px;
              height: 18px;
              object-fit: contain;
            }
          }
          
          &.preview-price {
            color: #FDB100;
          }
          
          &.preview-freight {
            color: #333;
          }
        }
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

