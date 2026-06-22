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
      
      <!-- 加载更多按钮 -->
      <div v-if="hasNext && !loading && orders.length > 0" class="load-more-wrapper">
        <button class="load-more-btn" @click="loadMoreOrders">
          {{ $t('loadMore') || '加载更多' }}
        </button>
      </div>
      <!-- 加载中提示 -->
      <div v-if="loading && orders.length > 0" class="loading-more-wrapper">
        <div class="loading-more-text">{{ $t('loading') || '加载中...' }}</div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1 && !hasNext" class="orders-pagination">
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
      loading: false,
      page: 1, // 用于加载更多的页码
      hasNext: false // 是否还有下一页
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
      // 如果使用传统分页器，重置数据并重新加载
      if (!this.hasNext) {
        this.page = this.currentPage
        this.fetchOrders(false)
      }
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    /* 获取订单列表 */
    async fetchOrders(loadMore = false) {
      // 如果正在加载或没有下一页且是加载更多，则返回
      if (this.loading || (!this.hasNext && loadMore)) return
      
      // 如果不是加载更多，重置页码
      if (!loadMore) {
        this.page = 1
        this.orders = []
      }
      
      this.loading = true
      try {
        const res = await this.$axios.post('/staff/jifen/order/loadorder', {
          page: this.page
        })
        console.log(res)
        // 处理返回数据，兼容多种返回格式
        let dataList = []
        let totalCount = 0
        
        // 处理接口返回的数据结构：{ pager: {...}, items: [...] } 或 { data: { pager: {...}, items: [...] } }
        // 优先处理直接返回的结构
        if (res && res.items && Array.isArray(res.items)) {
          dataList = res.items
          // 从 pager 获取总数和判断是否还有下一页
          if (res.pager) {
            const limit = parseInt(res.pager.limit || '10')
            const page = parseInt(res.pager.page || '1')
            const isLastPage = res.pager.is_last_page === '1'
            // is_last_page: "0" 表示还有下一页, "1" 表示最后一页
            this.hasNext = !isLastPage
            
            // 如果是最后一页，总数 = (page - 1) * limit + items.length
            // 否则，总数至少是 page * limit
            if (isLastPage) {
              totalCount = (page - 1) * limit + dataList.length
            } else {
              totalCount = page * limit + 1 // 至少还有一页
            }
          } else {
            totalCount = dataList.length
            this.hasNext = false
          }
        } 
        
        const currentLocale = this.$store.getters.getLocale || 'es'
        
        // 转换数据格式
        const mappedOrders = dataList.map((item, index) => {
          // 处理商品信息：从 product_list 数组中获取第一个商品
          let productName = ''
          let productImage = ''
          let productPoints = 0
          
          if (item.product_list && Array.isArray(item.product_list) && item.product_list.length > 0) {
            const firstProduct = item.product_list[0]
            // 商品名称：优先使用多语言字段
            productName = firstProduct.product_name || firstProduct.title || ''
            if (currentLocale === 'es' && firstProduct.product_name_es) {
              productName = firstProduct.product_name_es
            } else if (currentLocale === 'en' && firstProduct.product_name_en) {
              productName = firstProduct.product_name_en
            } else if (currentLocale === 'zh' && firstProduct.product_name) {
              productName = firstProduct.product_name
            }
            
            // 商品图片
            if (firstProduct.photo || firstProduct.image) {
              productImage = firstProduct.photo || firstProduct.image
            }
            
            // 商品积分
            productPoints = parseInt(firstProduct.product_jifen || firstProduct.jifen || 0)
          } else {
            // 如果没有 product_list，尝试从 item 本身获取
            productName = item.title || item.name || item.product_name || ''
            if (currentLocale === 'es' && item.title_es) {
              productName = item.title_es
            } else if (currentLocale === 'en' && item.title_en) {
              productName = item.title_en
            } else if (currentLocale === 'zh' && item.title) {
              productName = item.title
            }
            productImage = item.photo || item.image || ''
            productPoints = parseInt(item.product_jifen || item.jifen || item.integral || 0)
          }
          
          // 处理图片URL
          let imageUrl = productImage
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = config.URl + imageUrl
          } else if (!imageUrl) {
            imageUrl = require('~/assets/images/iconYuan.png')
          }
          
          // 处理订单状态：0 待发货，1 已发货，8 确认收货
          // 不使用接口返回的 order_status_label（可能是中文），而是根据 order_status 值进行翻译
          const statusValue = parseInt(item.order_status || item.status || '0')
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
          
          // 处理日期：将时间戳转换为日期格式
          let dateStr = ''
          if (item.dateline || item.lasttime || item.create_time || item.created_at) {
            const timestamp = parseInt(item.dateline || item.lasttime || item.create_time || item.created_at)
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
            dateStr = item.date || ''
          }
          
          return {
            id: item.id || item.order_id || index + 1,
            order_id: item.order_id || item.id || index + 1, // 保存 order_id 用于接口调用
            code: item.code || item.order_no || item.order_number || `D${item.order_id || item.id || index + 1}`,
            image: imageUrl,
            name: productName,
            quantity: item.product_number || item.quantity || item.num || 1,
            amount: item.amount || item.product_price || item.price || item.total_price || '0.00',
            points: productPoints || parseInt(item.product_jifen || item.jifen || item.integral || 0),
            statusValue: statusValue,
            statusText: statusText,
            statusClass: statusClass,
            date: dateStr,
            checked: false
          }
        })
        
        // 如果是加载更多，追加数据；否则替换数据
        this.orders = loadMore ? [...this.orders, ...mappedOrders] : mappedOrders
        
        // 如果还有下一页，页码自增
        if (this.hasNext) {
          this.page += 1
        }
        
        this.total = totalCount
      } catch (error) {
        console.error('获取订单列表失败:', error)
        if (!loadMore) {
          this.orders = []
        }
        this.total = 0
        this.hasNext = false
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
        // 刷新订单列表（重置分页）
        await this.fetchOrders(false)
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
        // 刷新订单列表（重置分页）
        await this.fetchOrders(false)
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
    },
    /* 加载更多订单 */
    async loadMoreOrders() {
      if (this.hasNext && !this.loading) {
        await this.fetchOrders(true)
      }
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
// 加载更多按钮
.load-more-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  padding: 20px 0;
}

.load-more-btn {
  background: linear-gradient(135deg, #FFB84D, #FF9500);
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 148, 0, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 148, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// 加载中提示
.loading-more-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  padding: 20px 0;
}

.loading-more-text {
  color: #888;
  font-size: 16px;
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

@media (max-width: 1200px) {
  .my-orders { padding: 120px 100px; }
}
@media (max-width: 768px) {
  .my-orders { padding: 130px 20px; }
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