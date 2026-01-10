<template>
  <div class="my-orders">

    <!-- Table -->
    <div class="orders-table-wrapper">
      <div v-if="loading" class="orders-loading">
        <div class="loading-text">{{ $t('loading') || '加载中...' }}</div>
      </div>
      <div v-else-if="!loading && orders.length === 0" class="orders-empty">
        <div class="empty-text">{{ $t('noOrders') || '暂无订单' }}</div>
      </div>
      <table v-else class="orders-table">
        <thead>
          <tr>
            <th>
              <div class="custom-checkbox" @click="toggleAllOrders">
                <img :src="allOrdersChecked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
                     :alt="allOrdersChecked ? selectedText : notSelectedText" 
                     class="checkbox-icon" />
              </div>
            </th>
            <th>{{ $t('orderNumber') }}</th>
            <th>{{ $t('image') }}</th>
            <th>{{ $t('productName') }}</th>
            <th>{{ $t('quantity') }}</th>
            <th>{{ $t('amount') }}</th>
            <th>{{ $t('points') }}</th>
            <th>{{ $t('status') }}</th>
            <th>{{ $t('orderDate') }}</th>
            <th>{{ $t('action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in pagedOrders" :key="order.id">
            <td>
              <div class="custom-checkbox" @click="toggleOrder(order.id)">
                <img :src="order.checked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
                     :alt="order.checked ? selectedText : notSelectedText" 
                     class="checkbox-icon" />
              </div>
            </td>
            <td>{{ order.code }}</td>
            <td><img :src="order.image" alt="product" class="order-img" /></td>
            <td>{{ order.name }}</td>
            <td>{{ order.quantity }}</td>
            <td class="order-amount">€{{ order.amount }}</td>
            <td class="order-points">
              <div class="order-points-box">
                <img src="~/assets/images/icon_jfien.png" :alt="$t('iconPoints')" class="price-icon" />
                {{ order.points }}
              </div>
             
            </td>
            <td :class="['order-status', order.statusClass]">{{ order.statusText }}</td>
            <td>{{ order.date }}</td>
            <td>
              <div class="order-actions">
                <!-- 状态 0（待发货）：显示取消订单按钮 -->
                <span v-if="order.statusValue === 0" class="order-cancel" @click="cancelOrder(order.id)">{{ $t('cancelOrder') }}</span>
                <!-- 状态 8（确认收货）：显示确认订单按钮 -->
                <span v-if="order.statusValue === 8" class="order-confirm" @click="confirmOrder(order.id)">{{ $t('confirmOrder') }}</span>
                <!-- 所有订单都显示详情按钮 -->
                <span class="order-detail" @click="goToOrderDetail(order.id)">{{ $t('details') }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="orders-pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
      <template v-for="(page, index) in visiblePages">
        <button
          v-if="page !== '...'"
          :key="`page-${page}-${index}`"
          :class="['page-btn', { active: currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <span v-else :key="`ellipsis-${index}`">...</span>
      </template>
      <button :disabled="currentPage === totalPages" @click="currentPage++">&gt;</button>
    </div>
  </div>
</template>

<script>
import config from '~/config/index'

export default {
  name: 'MyOrders',
  data() {
    return {
      orders: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize) || 1
    },
    pagedOrders() {
      return this.orders
    },
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage
      
      if (total <= 7) {
        // 如果总页数小于等于7，显示所有页码
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // 如果总页数大于7，显示当前页附近的页码
        if (current <= 4) {
          // 当前页在前4页
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          // 当前页在后4页
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          // 当前页在中间
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    },
    allOrdersChecked() {
      return this.orders.length > 0 && this.orders.every(order => order.checked);
    },
    selectedText() {
      return this.$t('selected')
    },
    notSelectedText() {
      return this.$t('notSelected')
    }
  },
  watch: {
    currentPage() {
      this.fetchOrders()
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    /* 获取订单列表 */
    async fetchOrders() {
      this.loading = true
      try {
        const res = await this.$axios.post('/staff/jifen/cart/preview_order', {
          page: this.currentPage
        })
        
        // 处理返回数据，兼容多种返回格式
        let dataList = []
        let totalCount = 0
        
        if (Array.isArray(res)) {
          dataList = res
          totalCount = res.length
        } else if (res && res.data) {
          if (Array.isArray(res.data)) {
            dataList = res.data
            totalCount = res.total || res.count || res.data.length
          } else if (res.data.list && Array.isArray(res.data.list)) {
            dataList = res.data.list
            totalCount = res.data.total || res.data.count || res.data.list.length
          }
        } else if (res && res.list && Array.isArray(res.list)) {
          dataList = res.list
          totalCount = res.total || res.count || res.list.length
        }
        
        const currentLocale = this.$store.getters.getLocale || 'es'
        
        // 转换数据格式
        this.orders = dataList.map((item, index) => {
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
          
          // 处理订单状态：0 待发货，1 已发货，8 确认收货
          const statusValue = parseInt(item.status || item.order_status || '0')
          let statusClass = 'status-pending'
          let statusText = ''
          
          if (statusValue === 0) {
            statusClass = 'status-pending'
            statusText = this.$t('pendingShipment') || '待发货'
          } else if (statusValue === 1) {
            statusClass = 'status-shipped'
            statusText = this.$t('shipped') || '已发货'
          } else if (statusValue === 8) {
            statusClass = 'status-received'
            statusText = this.$t('confirmReceipt') || '确认收货'
          } else {
            statusClass = 'status-pending'
            statusText = this.$t('pendingShipment') || '待发货'
          }
          
          return {
            id: item.id || item.order_id || index + 1,
            order_id: item.order_id || item.id || index + 1, // 保存 order_id 用于接口调用
            code: item.code || item.order_no || item.order_number || `D${item.id || index + 1}`,
            image: imageUrl,
            name: productName,
            quantity: item.quantity || item.num || 1,
            amount: item.amount || item.price || item.total_price || '0.00',
            points: item.points || item.jifen || item.integral || 0,
            statusValue: statusValue,
            statusText: statusText,
            statusClass: statusClass,
            date: item.date || item.create_time || item.created_at || '',
            checked: false
          }
        })
        
        this.total = totalCount
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.orders = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    toggleOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.checked = !order.checked;
      }
    },
    toggleAllOrders() {
      const checked = !this.allOrdersChecked;
      this.orders.forEach(order => {
        order.checked = checked;
      });
    },
    /* 取消订单 */
    async cancelOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (!order) return
      
      try {
        await this.$axios.post('/staff/jifen/order/cancel', {
          order_id: order.order_id
        })
        this.$message.success(this.$t('cancelOrderSuccess') || '取消订单成功')
        // 刷新订单列表
        await this.fetchOrders()
      } catch (e) {
        console.error('Cancel order error:', e)
        this.$message.error(e.msg || this.$t('cancelOrderError') || '取消订单失败')
      }
    },
    /* 确认收货 */
    async confirmOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (!order) return
      
      try {
        await this.$axios.post('/staff/jifen/order/setreceipt', {
          order_id: order.order_id
        })
        this.$message.success(this.$t('confirmOrderSuccess') || '确认收货成功')
        // 刷新订单列表
        await this.fetchOrders()
      } catch (e) {
        console.error('Confirm order error:', e)
        this.$message.error(e.msg || this.$t('confirmOrderError') || '确认收货失败')
      }
    },
    /* 跳转到订单详情页面 */
    goToOrderDetail(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (!order) return
      
      this.$router.push({
        path: '/submit-order',
        query: {
          order_id: order.order_id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.my-orders {
  background: #fff;
  padding: 100px 300px;
  min-height: 100vh;
}
.orders-table-wrapper {
  padding: 0;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  margin-bottom: 32px;
}
.orders-table th, .orders-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  font-size: 18px;
}
.orders-table th {
  background: #fafafa;
  font-weight: 600;
  color: #383838;
}
.order-img {
  width: 78px;
  height: 78px;
  object-fit: cover;
  border-radius: 8px;
}
.order-amount {
  color: #FFB84D;
  font-weight: 600;
}
.order-points {
  .order-points-box{
    .price-icon{
      width: 18px;
      height: 18px;
      object-fit: contain;
      margin-right: 4px;
    }
    display: flex;
    align-items: center;
    color: #7AC554;
  font-weight: 600;
justify-content: center;
  }
 
}
.points-icon {
  margin-right: 2px;
}
.order-status.status-pending {
  color: #FFB84D;
}
.order-status.status-shipped {
  color: #2196F3;
}
.order-status.status-received {
  color: #4CAF50;
}
.order-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}
.order-cancel {
  color: #f44336;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border: 1px solid #f44336;
  border-radius: 4px;
  transition: all 0.2s;
}
.order-cancel:hover {
  background: #f44336;
  color: #fff;
}
.order-confirm {
  color: #4CAF50;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  transition: all 0.2s;
}
.order-confirm:hover {
  background: #4CAF50;
  color: #fff;
}
.order-detail {
  color: #888;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}
.order-detail:hover {
  background: #f5f5f5;
  color: #333;
}
.orders-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}
.page-btn {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  color: #888;
  font-size: 14px;
}
.page-btn.active {
  background: #FFB84D;
  color: #fff;
  border-color: #FFB84D;
}

.custom-checkbox {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-checkbox .checkbox-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.orders-loading,
.orders-empty {
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