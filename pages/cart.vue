<template>
  <div class="cart-page">
    <div class="cart-title">
      <span class="cart-title-icon">🌙</span>
      <span class="cart-title-text">{{ $t('全部产品') }}</span>
    </div>
    <div class="cart-list">
      <div v-for="(shop, sidx) in shops" :key="sidx" class="cart-shop-block">
        <div class="cart-shop-header">
          <input type="checkbox" :checked="shop.checked" @change="toggleShop(sidx, $event)" />
          <img :src="shop.avatar" class="shop-avatar" />
          <span class="shop-name">{{ shop.name }}</span>
        </div>
        <div v-for="(item, idx) in shop.items" :key="idx" class="cart-item-row">
          <div class="cart-item-left">
            <input type="checkbox" :checked="item.checked" @change="toggleItem(sidx, idx, $event)" />
            <img :src="item.image" class="item-img" />
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-size">{{ $t('规格尺寸') }}</div>
            </div>
          </div>
          <div class="cart-item-mid">€{{ item.price }}</div>
          <div class="cart-item-qty">
            <button class="qty-btn">-</button>
            <span class="qty-num">{{ item.qty }}</span>
            <button class="qty-btn">+</button>
          </div>
          <div class="cart-item-points"><span class="points-icon">🟢</span>{{ item.points }}</div>
          <div class="cart-item-delete">{{ $t('删除') }}</div>
        </div>
      </div>
    </div>
    <div class="cart-footer">
      <div class="cart-footer-left">
        <input type="checkbox" :checked="allChecked" @change="toggleAll($event)" />
        <span>{{ $t('全选') }}</span>
        <button class="footer-delete-btn">{{ $t('删除选中的商品') }}</button>
      </div>
      <div class="cart-footer-right">
        <span class="footer-summary">{{ $t('已选择') }}2{{ $t('件商品，总价(不含运费)：') }}<span class="footer-price">€12.00</span></span>
        <span class="footer-tip">{{ $t('以优惠：') }}€1</span>
        <button class="footer-checkout-btn">{{ $t('立即结算') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartPage',
  data() {
    return {
      shops: [
        {
          name: '店铺名字',
          avatar: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          checked: false,
          items: [
            {
              name: 'ouis Vuitton Neverfull PM',
              image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
              price: '12.00',
              qty: 1,
              points: 1800,
              checked: false
            }
          ]
        },
        {
          name: '店铺名字',
          avatar: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          checked: false,
          items: [
            {
              name: 'ouis Vuitton Neverfull PM',
              image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
              price: '12.00',
              qty: 1,
              points: 1800,
              checked: false
            }
          ]
        },
        {
          name: '店铺名字',
          avatar: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
          checked: false,
          items: [
            {
              name: 'ouis Vuitton Neverfull PM',
              image: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.2048/texture_00.png',
              price: '12.00',
              qty: 1,
              points: 1800,
              checked: false
            }
          ]
        }
      ]
    }
  },
  computed: {
    allChecked() {
      // 只要所有商品都 checked 就返回 true
      return this.shops.length > 0 && this.shops.every(shop => shop.items.length > 0 && shop.items.every(item => item.checked));
    }
  },
  methods: {
    toggleShop(sidx, e) {
      const checked = e.target.checked;
      this.shops[sidx].checked = checked;
      this.shops[sidx].items.forEach((item, idx) => {
        this.$set(this.shops[sidx].items, idx, { ...item, checked });
      });
    },
    toggleItem(sidx, idx, e) {
      const checked = e.target.checked;
      this.$set(this.shops[sidx].items, idx, { ...this.shops[sidx].items[idx], checked });
      // 如果所有商品都选中，则店铺选中，否则取消店铺选中
      const allChecked = this.shops[sidx].items.every(item => item.checked);
      this.$set(this.shops, sidx, { ...this.shops[sidx], checked: allChecked });
    },
    toggleAll(e) {
      const checked = e.target.checked;
      this.shops.forEach((shop, sidx) => {
        this.$set(this.shops, sidx, { ...shop, checked });
        shop.items.forEach((item, idx) => {
          this.$set(this.shops[sidx].items, idx, { ...item, checked });
        });
      });
    }
  }
}
</script>

<style scoped>
.cart-page {
  background: #fff;
  min-height: 100vh;
  padding: 100px 300px 40px 300px;
}
.cart-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  margin-top: 0;
  margin-top: 30px;
}
.cart-title-icon {
  font-size: 32px;
  margin-right: 8px;
  color: #FFB84D;
}
.cart-title-text {
  font-size: 22px;
  font-weight: 700;
}
.cart-list {
  margin-bottom: 32px;
}
.cart-shop-block {
  margin-bottom: 24px;
}
.cart-shop-header {
  background: #f5f5f5;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px 6px 0 0;
  font-size: 16px;
  font-weight: 500;
}
.shop-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 4px;
}
.shop-name {
  font-size: 16px;
  font-weight: 500;
}
.cart-item-row {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 18px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.cart-item-left {
  display: flex;
  align-items: center;
  flex: 1 1 400px;
  min-width: 300px;
}
.item-img {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 16px;
  border: 1px solid #eee;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.item-name {
  font-size: 16px;
  font-weight: 500;
}
.item-size {
  font-size: 13px;
  color: #888;
}
.cart-item-mid {
  flex: 0 0 120px;
  text-align: center;
  font-size: 16px;
  color: #222;
}
.cart-item-qty {
  flex: 0 0 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #eee;
  background: #fafafa;
  border-radius: 4px;
  font-size: 18px;
  color: #888;
  cursor: pointer;
}
.qty-num {
  width: 24px;
  text-align: center;
  font-size: 15px;
}
.cart-item-points {
  flex: 0 0 100px;
  color: #4CAF50;
  font-weight: 600;
  text-align: center;
  font-size: 15px;
}
.points-icon {
  margin-right: 2px;
}
.cart-item-delete {
  flex: 0 0 60px;
  color: #f44336;
  cursor: pointer;
  text-align: right;
  font-size: 15px;
}
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 18px 24px;
  margin-top: 32px;
}
.cart-footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.footer-delete-btn {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 4px;
  color: #888;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
}
.cart-footer-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.footer-summary {
  font-size: 14px;
  color: #222;
}
.footer-price {
  color: #FFB84D;
  font-weight: 700;
  margin: 0 2px;
}
.footer-tip {
  color: #888;
  font-size: 13px;
}
.footer-checkout-btn {
  background: #FFB84D;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 28px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.footer-checkout-btn:hover {
  background: #ffa726;
}
</style> 