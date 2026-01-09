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
            <td><img src="~/assets/images/iconYuan.png" alt="product" class="order-img" /></td>
            <td>{{ order.name }}</td>
            <td>{{ order.quantity }}</td>
            <td class="order-amount">€{{ order.amount }}</td>
            <td class="order-points">
              <div class="order-points-box">
                <img src="~/assets/images/icon_jfien.png" :alt="$t('iconPoints')" class="price-icon" />
                {{ order.points }}
              </div>
             
            </td>
            <td :class="['order-status', order.statusClass]">{{ $t(order.status) }}</td>
            <td>{{ order.date }}</td>
            <td>
              <div class="order-actions">
                <span v-if="order.action === 'payNow'" class="order-pay">{{ $t('payNow') }}</span>
                <span v-if="order.action === 'invoiceOrder'" class="order-invoice">{{ $t('invoiceOrder') }}</span>
                <span class="order-detail">{{ $t('details') }}</span>
                <span v-if="order.canDelete" class="order-delete">{{ $t('delete') }}</span>
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
        { key: 'all', label: 'allOrders' },
        { key: 'pending', label: 'pendingPayment' },
        { key: 'to_confirm', label: 'toConfirm' },
        { key: 'to_ship', label: 'toShip' },
        { key: 'to_receive', label: 'toReceive' },
        { key: 'after_sale', label: 'afterSale' },
        { key: 'completed', label: 'completed' },
        { key: 'cancelled', label: 'cancelled' }
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
          status: 'toOrder',
          statusClass: 'status-pending',
          date: '2024-04-29 15:00:00',
          action: 'payNow',
          canDelete: false,
          checked: false
        },
        {
          id: 2,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: 'toConfirm',
          statusClass: 'status-confirm',
          date: '2024-04-29 15:00:00',
          action: 'invoiceOrder',
          canDelete: false,
          checked: false
        },
        {
          id: 3,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: 'received',
          statusClass: 'status-received',
          date: '2024-04-29 15:00:00',
          action: '',
          canDelete: true,
          checked: false
        },
        {
          id: 4,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: 'received',
          statusClass: 'status-received',
          date: '2024-04-29 15:00:00',
          action: '',
          canDelete: true,
          checked: false
        },
        {
          id: 5,
          code: 'D123456789',
          image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          name: 'Louis Vuitton Neverfull PM',
          quantity: 1,
          amount: '12.00',
          points: 1800,
          status: 'received',
          statusClass: 'status-received',
          date: '2024-04-29 15:00:00',
          action: '',
          canDelete: true,
          checked: false
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
  methods: {
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
.orders-tabs {
  display: flex;
  gap: 40px;
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
</style> 