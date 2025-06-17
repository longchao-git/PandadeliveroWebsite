<template>
  <div class="my-orders">
    <!-- Tabs -->
    <div class="orders-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ $t(tab.label) }}
      </div>
    </div>

    <!-- Table -->
    <div class="orders-table-wrapper">
      <table class="orders-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>{{ $t('订单编号') }}</th>
            <th>{{ $t('图片') }}</th>
            <th>{{ $t('名称') }}</th>
            <th>{{ $t('数量') }}</th>
            <th>{{ $t('金额') }}</th>
            <th>{{ $t('积分') }}</th>
            <th>{{ $t('状态') }}</th>
            <th>{{ $t('下单日期') }}</th>
            <th>{{ $t('操作') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in pagedOrders" :key="order.id">
            <td><input type="checkbox" /></td>
            <td>{{ order.code }}</td>
            <td><img :src="order.image" alt="product" class="order-img" /></td>
            <td>{{ order.name }}</td>
            <td>{{ order.quantity }}</td>
            <td class="order-amount">€{{ order.amount }}</td>
            <td class="order-points"><span class="points-icon">🟢</span>{{ order.points }}</td>
            <td :class="['order-status', order.statusClass]">{{ $t(order.status) }}</td>
            <td>{{ order.date }}</td>
            <td>
              <div class="order-actions">
                <span v-if="order.action === '去支付'" class="order-pay">{{ $t('去支付') }}</span>
                <span v-if="order.action === '发票/提单'" class="order-invoice">{{ $t('发票/提单') }}</span>
                <span class="order-detail">{{ $t('详情') }}</span>
                <span v-if="order.canDelete" class="order-delete">{{ $t('删除') }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="orders-pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="['page-btn', { active: currentPage === page }]"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <span v-if="totalPages > 5">...</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyOrders',
  data() {
    return {
      tabs: [
        { key: 'all', label: '全部订单' },
        { key: 'pending', label: '待付款' },
        { key: 'to_confirm', label: '待确认' },
        { key: 'to_ship', label: '待发货' },
        { key: 'to_receive', label: '待收货' },
        { key: 'after_sale', label: '售后' },
        { key: 'completed', label: '已完成' },
        { key: 'cancelled', label: '已取消' }
      ],
      activeTab: 'all',
      orders: [
        {
          id: 1,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: '待下单',
          statusClass: 'status-pending',
          date: '2024-04-29 15:00:00',
          action: '去支付',
          canDelete: false
        },
        {
          id: 2,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: '待确认',
          statusClass: 'status-confirm',
          date: '2024-04-29 15:00:00',
          action: '发票/提单',
          canDelete: false
        },
        {
          id: 3,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: '已收货',
          statusClass: 'status-received',
          date: '2024-04-29 15:00:00',
          action: '',
          canDelete: true
        },
        {
          id: 4,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: '已收货',
          statusClass: 'status-received',
          date: '2024-04-29 15:00:00',
          action: '',
          canDelete: true
        },
        {
          id: 5,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: '已收货',
          statusClass: 'status-received',
          date: '2024-04-29 15:00:00',
          action: '',
          canDelete: true
        }
      ],
      currentPage: 2,
      pageSize: 5
    }
  },
  computed: {
    totalPages() {
      return 10
    },
    pagedOrders() {
      // For mock, always return all 5
      return this.orders
    }
  }
}
</script>

<style scoped>
.my-orders {
  background: #fff;
  padding: 100px 300px;
  min-height: 100vh;
}
.orders-tabs {
  display: flex;
  gap: 32px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 2px solid #f5f5f5;
  margin-bottom: 40px;
  margin-top: 60px;
  padding: 0;
}
.tab-item {
  padding: 12px 0;
  cursor: pointer;
  color: #888;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.tab-item.active {
  color: #FFB84D;
  border-bottom: 2px solid #FFB84D;
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
  font-size: 14px;
}
.orders-table th {
  background: #fafafa;
  font-weight: 600;
  color: #888;
}
.order-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}
.order-amount {
  color: #FFB84D;
  font-weight: 600;
}
.order-points {
  color: #4CAF50;
  font-weight: 600;
}
.points-icon {
  margin-right: 2px;
}
.order-status.status-pending {
  color: #FFB84D;
}
.order-status.status-confirm {
  color: #FFB84D;
}
.order-status.status-received {
  color: #4CAF50;
}
.order-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
}
.order-pay {
  color: #FFB84D;
  cursor: pointer;
}
.order-invoice {
  color: #888;
  cursor: pointer;
}
.order-detail {
  color: #888;
  cursor: pointer;
}
.order-delete {
  color: #f44336;
  cursor: pointer;
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
</style> 