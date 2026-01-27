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
      <!-- <div class="order-summary-box">
        <div class="font18" v-if="orderDetail.totalWeight">{{ $t('totalWeight') }}：{{ orderDetail.totalWeight }}</div>
        <div class="order-summary-right">
          <div class="font18">{{ $t('actualPrice') }}：{{ orderDetail.actualPrice || orderDetail.total_amount }}€</div>
          <div class="font18" v-if="orderDetail.shippingFee">{{ $t('shippingFee') }}：{{ orderDetail.shippingFee }}€</div>
          <div class="font18">{{ $t('payablePrice') }}：<span class="order-summary-pay font20">{{ orderDetail.payablePrice || orderDetail.total_amount }}€</span></div>
        </div>
      </div> -->
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
        console.log(res)
        // 处理返回数据：{ order: {...}, order_product: {...}, wuliu: "" }
        const orderData = res.order || res.data?.order || res.data || res || {}
        const orderProductData = res.order_product || res.data?.order_product || {}
        const currentLocale = this.$store.getters.getLocale || 'es'
        
        // 处理地址信息：从 order 对象中获取
        const addr = orderData.addr || ''
        const contact = orderData.contact || ''
        const mobile = orderData.mobile || ''
        const house = orderData.house || ''
        const addressText = addr 
          ? `${contact} ${mobile} ${addr}${house ? '，' + house : ''}`.trim()
          : (this.$t('noAddress') || '暂无地址')
        
        // 处理订单状态：从 order.order_status 获取
        const statusValue = parseInt(orderData.order_status || orderData.status || '0')
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
        
        // 处理商品列表：从 order_product 对象中获取
        // order_product 是一个对象，键可能是 "1", "2" 等，值是商品对象
        const items = []
        if (orderProductData && typeof orderProductData === 'object') {
          // 遍历 order_product 对象的所有键
          Object.keys(orderProductData).forEach(key => {
            const product = orderProductData[key]
            if (product && typeof product === 'object') {
              // 根据当前语言选择商品名称
              let productName = product.product_name || product.title || product.name || ''
              // 如果接口返回的是中文，尝试使用多语言字段
              if (currentLocale === 'es' && product.product_name_es) {
                productName = product.product_name_es
              } else if (currentLocale === 'en' && product.product_name_en) {
                productName = product.product_name_en
              } else if (currentLocale === 'zh' && product.product_name) {
                productName = product.product_name
              }
              
              // 处理图片URL
              let imageUrl = product.photo || product.image || ''
              if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = config.URl + imageUrl
              } else if (!imageUrl) {
                imageUrl = require('~/assets/images/iconYuan.png')
              }
              
              items.push({
                name: productName,
                image: imageUrl,
                quantity: parseInt(product.product_number || product.quantity || product.num || 1),
                amount: product.product_price || product.amount || product.price || '0.00',
                points: parseInt(product.product_jifen || product.jifen || product.integral || 0)
              })
            }
          })
        }
        
        // 处理日期：将时间戳转换为日期格式
        let dateStr = ''
        if (orderData.dateline || orderData.lasttime || orderData.create_time || orderData.created_at) {
          const timestamp = parseInt(orderData.dateline || orderData.lasttime || orderData.create_time || orderData.created_at)
          if (timestamp) {
            const date = new Date(timestamp * 1000)
            dateStr = date.toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : currentLocale === 'es' ? 'es-ES' : 'en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
          }
        }
        if (!dateStr) {
          dateStr = orderData.date || ''
        }
        
        // 生成订单号
        const orderNo = orderData.order_id ? `D${orderData.order_id}` : ''
        
        this.orderDetail = {
          order_no: orderNo,
          code: orderNo,
          addressText: addressText,
          supplier: orderData.supplier || '',
          statusText: statusText,
          date: dateStr,
          items: items,
          totalWeight: orderData.total_weight || orderData.weight || '',
          actualPrice: orderData.amount || orderData.total_price || orderData.product_price || '0.00',
          shippingFee: orderData.freight || orderData.shipping_fee || orderData.shipping || '0.00',
          payablePrice: orderData.total_price || orderData.amount || '0.00',
          total_amount: orderData.total_price || orderData.amount || '0.00'
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