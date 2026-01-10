<template>
  <div class="submit-order-page">
    <div v-if="loading" class="order-loading">
      <div class="loading-text">{{ $t('loading') || '加载中...' }}</div>
    </div>
    <div v-else-if="!loading && !orderDetail" class="order-empty">
      <div class="empty-text">{{ $t('orderNotFound') || '订单不存在' }}</div>
    </div>
    <template v-else>
      <div class="order-info-box">
        <div class="order-info-title">{{ $t('orderInfo') }}</div>
        <div class="order-info-list">
          <div>{{ $t('deliveryAddress') }}：{{ orderDetail.addressText }}</div>
          <div>{{ $t('orderNumber') }}：{{ orderDetail.order_no || orderDetail.code }}</div>
          <div v-if="orderDetail.supplier">{{ $t('supplierInfo') }}：{{ orderDetail.supplier }}</div>
        </div>
      </div>
      <div class="order-table-box">
        <table class="order-table">
          <thead>
            <tr>
              <th>{{ $t('orderNumber') }}</th>
              <th>{{ $t('image') }}</th>
              <th>{{ $t('productName') }}</th>
              <th>{{ $t('quantity') }}</th>
              <th>{{ $t('amount') }}</th>
              <th>{{ $t('points') }}</th>
              <th>{{ $t('status') }}</th>
              <th>{{ $t('orderDate') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in orderDetail.items" :key="index">
              <td>{{ orderDetail.order_no || orderDetail.code }}</td>
              <td><img :src="item.image" alt="product" class="order-img" /></td>
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td class="order-amount">€{{ item.amount }}</td>
              <td class="order-points">
                <div class="order-points-box">
                  <img src="~/assets/images/icon_jfien.png" class="price-icon" />
                  {{ item.points }}
                </div>
              </td>
              <td>{{ orderDetail.statusText }}</td>
              <td>{{ orderDetail.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>  
      <div class="order-summary-box">
        <div class="font18" v-if="orderDetail.totalWeight">{{ $t('totalWeight') }}：{{ orderDetail.totalWeight }}</div>
        <div class="order-summary-right">
          <div class="font18">{{ $t('actualPrice') }}：{{ orderDetail.actualPrice || orderDetail.total_amount }}€</div>
          <div class="font18" v-if="orderDetail.shippingFee">{{ $t('shippingFee') }}：{{ orderDetail.shippingFee }}€</div>
          <div class="font18">{{ $t('payablePrice') }}：<span class="order-summary-pay font20">{{ orderDetail.payablePrice || orderDetail.total_amount }}€</span></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import config from '~/config/index'

export default {
  name: 'SubmitOrderPage',
  data() {
    return {
      orderDetail: null,
      loading: false
    }
  },
  mounted() {
    const orderId = this.$route.query.order_id
    if (orderId) {
      this.fetchOrderDetail(orderId)
    }
  },
  methods: {
    /* 获取订单详情 */
    async fetchOrderDetail(orderId) {
      this.loading = true
      try {
        const res = await this.$axios.post('/staff/jifen/order/detail', {
          order_id: orderId
        })
        
        // 处理返回数据
        const data = res.data || res || {}
        const currentLocale = this.$store.getters.getLocale || 'es'
        
        // 处理地址信息
        const addr = data.addr || data.address || {}
        const addressText = addr.addr 
          ? `${addr.contact || ''} ${addr.mobile || ''} ${addr.addr}${addr.house ? '，' + addr.house : ''}`
          : (this.$t('noAddress') || '暂无地址')
        
        // 处理订单状态
        const statusValue = parseInt(data.status || data.order_status || '0')
        let statusText = ''
        if (statusValue === 0) {
          statusText = this.$t('pendingShipment') || '待发货'
        } else if (statusValue === 1) {
          statusText = this.$t('shipped') || '已发货'
        } else if (statusValue === 8) {
          statusText = this.$t('confirmReceipt') || '确认收货'
        } else {
          statusText = this.$t('pendingShipment') || '待发货'
        }
        
        // 处理商品列表
        const items = (data.items || data.products || []).map(item => {
          // 根据当前语言选择商品名称
          let productName = item.title || item.name || ''
          if (currentLocale === 'es' && item.title_es) {
            productName = item.title_es
          } else if (currentLocale === 'en' && item.title_en) {
            productName = item.title_en
          } else if (currentLocale === 'zh' && item.title) {
            productName = item.title
          }
          
          // 处理图片URL
          let imageUrl = item.photo || item.image || ''
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = config.URl + imageUrl
          } else if (!imageUrl) {
            imageUrl = require('~/assets/images/iconYuan.png')
          }
          
          return {
            name: productName,
            image: imageUrl,
            quantity: item.quantity || item.num || 1,
            amount: item.amount || item.price || '0.00',
            points: item.points || item.jifen || item.integral || 0
          }
        })
        
        this.orderDetail = {
          order_no: data.order_no || data.code || data.order_number || '',
          code: data.code || data.order_no || '',
          addressText: addressText,
          supplier: data.supplier || '',
          statusText: statusText,
          date: data.create_time || data.created_at || data.date || '',
          items: items,
          totalWeight: data.total_weight || data.weight || '',
          actualPrice: data.actual_price || data.total_amount || '0.00',
          shippingFee: data.shipping_fee || data.shipping || '',
          payablePrice: data.payable_price || data.total_amount || '0.00',
          total_amount: data.total_amount || '0.00'
        }
      } catch (e) {
        console.error('Fetch order detail error:', e)
        this.$message.error(e.msg || this.$t('loadOrderDetailError') || '加载订单详情失败')
        this.orderDetail = null
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.submit-order-page {
  background: #fff;
  min-height: 100vh;
  padding: 160px 0;
}
.order-info-box {
  background: #fdf7ee;
  padding: 32px 40px;
  margin: 32px auto 0 auto;
  width: 80%;
  border-radius: 4px;
}
.order-info-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 18px;
}
.order-info-list > div {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}
.order-table-box {
  margin: 32px auto 0 auto;
  width: 80%;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}
.order-table th, .order-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
}
.order-table th {
  background: #fafafa;
  font-weight: 600;
  color: #383838;
}
.order-img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}
.order-amount {
  color: #FFB84D;
  font-weight: 600;
}
.order-points-box {
  color: #7AC554;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  .price-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    margin-right: 4px;
  }
}
.order-delete {
  color: #f44336;
  cursor: pointer;
  margin-right: 8px;
}
.order-detail {
  color: #888;
  cursor: pointer;
}
.custom-checkbox {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
.order-summary-box {
  margin: 32px auto 0 auto;
  width: 80%;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  font-size: 18px !important;
  color: #222;
}
.order-summary-right > div {
  margin-bottom: 6px;
  text-align: right;
}
.order-summary-pay {
  color: #f57c00;
  font-weight: 700;
}
.order-loading,
.order-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  min-height: 300px;
}
.loading-text,
.empty-text {
  font-size: 16px;
  color: #888;
}
</style> 