<template>
  <div class="cart-page">
    <div class="cart-title">
      <img src="~/assets/images/iconYuan.png" alt="圆形图标" class="section-icon" />
      <span class="cart-title-text">{{ $t('全部产品') }}</span>
    </div>
    <div class="cart-list">
      <div v-for="(shop, sidx) in shops" :key="sidx" class="cart-shop-block">
        <div class="cart-shop-header">
          <div class="custom-checkbox" @click="toggleShop(sidx)">
            <img :src="shop.checked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
                 :alt="shop.checked ? '已选中' : '未选中'" 
                 class="checkbox-icon" />
          </div>
          <img src="~/assets/images/iconYuan.png" class="shop-avatar" />
          <span class="shop-name">{{ shop.name }}</span>
        </div>
        <div v-for="(item, idx) in shop.items" :key="idx" class="cart-item-row">
          <div class="cart-item-left">
            <div class="custom-checkbox" @click="toggleItem(sidx, idx)">
              <img :src="item.checked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
                   :alt="item.checked ? '已选中' : '未选中'" 
                   class="checkbox-icon" />
            </div>
            <img src="~/assets/images/iconYuan.png" class="item-img" />
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
          <div class="cart-item-points">
            <img src="~/assets/images/icon_jfien.png" alt="积分图标" class="price-icon" />
            {{ item.points }}
          </div>
          <div class="cart-item-delete">{{ $t('删除') }}</div>
        </div>
      </div>
    </div>
    <div class="cart-footer">
      <div class="cart-footer-left">
        <div class="custom-checkbox" @click="toggleAll">
          <img :src="allChecked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
               :alt="allChecked ? '已选中' : '未选中'" 
               class="checkbox-icon" />
        </div>
        <span>{{ $t('全选') }}</span>
        <button class="footer-delete-btn">{{ $t('删除选中的商品') }}</button>
      </div>
      <div class="cart-footer-right">
        <div class="footer-summary-box">
          <div class="footer-summary">{{ $t('已选择') }}<span class="footer-price">2</span>{{ $t('件商品，总价(不含运费)：') }}<span class="footer-price">€12.00</span></div>
          <div class="footer-tip">{{ $t('以优惠：') }}€1</div>
        </div>
       
        <button class="footer-checkout-btn" @click="goToOrderPage">{{ $t('立即结算') }}</button>
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
    toggleShop(sidx) {
      const checked = !this.shops[sidx].checked;
      this.shops[sidx].checked = checked;
      this.shops[sidx].items.forEach((item, idx) => {
        this.$set(this.shops[sidx].items, idx, { ...item, checked });
      });
    },
    toggleItem(sidx, idx) {
      const checked = !this.shops[sidx].items[idx].checked;
      this.$set(this.shops[sidx].items, idx, { ...this.shops[sidx].items[idx], checked });
      // 如果所有商品都选中，则店铺选中，否则取消店铺选中
      const allChecked = this.shops[sidx].items.every(item => item.checked);
      this.$set(this.shops, sidx, { ...this.shops[sidx], checked: allChecked });
    },
    toggleAll() {
      const checked = !this.allChecked;
      this.shops.forEach((shop, sidx) => {
        this.$set(this.shops, sidx, { ...shop, checked });
        shop.items.forEach((item, idx) => {
          this.$set(this.shops[sidx].items, idx, { ...item, checked });
        });
      });
    },
    goToOrderPage() {
      this.$router.push('/submit-order');
    }
  }
}
</script>

<style scoped lang="scss">
.cart-page {
  background: #fff;
  min-height: 100vh;
  padding: 100px 300px 40px 300px;
}
.cart-title {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dedede;
  margin-top: 60px;
  .section-icon{
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}

.cart-title-text {
  font-size: 28px;
  font-weight: 700;
  margin-left: -20px;
}
.cart-list {
  margin-bottom: 32px;
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
  color: #383838;
}
.cart-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.cart-item-left {
  display: flex;
  align-items: center;
  // flex: 1 1 400px;
  min-width: 300px;
}
.item-img {
  width: 78px;
  height: 78px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 16px;
  margin-left: 16px;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.item-name {
  color: #13161B;
  font-size: 16px;
  font-weight: 500;
}
.item-size {
  font-size: 14px;
  color: #4B4B4B;
}
.cart-item-mid {
  flex: 0 0 120px;
  text-align: center;
  font-size: 16px;
  color: #333;
}
.cart-item-qty {
  flex: 0 0 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #BCC4D0;
 
}
.qty-btn {
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: #888;
  cursor: pointer;
}
.qty-num {
  width: 72px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-left: 1px solid #BCC4D0;
  border-right: 1px solid #BCC4D0;
  font-size: 16px;
}
.cart-item-points {
  display: flex;
  align-items: center;
  flex: 0 0 100px;
  color: #7AC554;
  text-align: center;
  font-size: 16px;
  .price-icon{
    width: 18px;
    height: 18px;
    object-fit: contain;
    margin-right: 4px;
  }
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
  margin-top: 40px;
}
.cart-footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.footer-delete-btn {
  border: 1px solid #D6D6D6;
  border-radius: 4px;
  color: #4B4B4B;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
}
.cart-footer-right {
  .footer-summary-box{
    display: flex;
    flex-direction: column;
    align-items: flex-end;

  }
  display: flex;
  align-items: center;
  gap: 18px;
}
.footer-summary {
  line-height: 21px;
  font-size: 14px;
  color: #4B4B4B;
}
.footer-price {
  color: #FDB100;
  font-weight: 500;
  font-size: 18px;
}
.footer-tip {
  color: #333;
  margin-top: 4px;
  font-size: 16px;
}
.footer-checkout-btn {
  background: #F9C13E;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 16px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.footer-checkout-btn:hover {
  background: #ffa726;
}

.custom-checkbox {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .checkbox-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
}
</style> 