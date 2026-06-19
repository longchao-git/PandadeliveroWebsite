<template>
  <div class="cart-page">
    <div class="cart-title">
      <img src="~/assets/images/iconYuan.png" :alt="$t('iconCircle')" class="section-icon" />
      <span class="cart-title-text">{{ $t('allProducts') }}</span>
    </div>
    <div class="cart-list" v-if="!loading && shops.length > 0">
      <div v-for="(shop, sidx) in shops" :key="sidx" class="cart-shop-block">
        <div class="cart-shop-header">
          <div class="custom-checkbox" @click="toggleShop(sidx)">
            <img :src="shop.checked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
                 :alt="shop.checked ? selectedText : notSelectedText" 
                 class="checkbox-icon" />
          </div>
          <img :src="shop.avatar" class="shop-avatar" />
          <span class="shop-name">{{ shop.name }}</span>
        </div>
        <div v-for="(item, idx) in shop.items" :key="idx" class="cart-item-row">
          <div class="cart-item-left">
            <div class="custom-checkbox" @click="toggleItem(sidx, idx)">
              <img :src="item.checked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
                   :alt="item.checked ? selectedText : notSelectedText" 
                   class="checkbox-icon" />
            </div>
            <img :src="item.image" class="item-img" />
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-size">{{ $t('specification') }}</div>
            </div>
          </div>
         
          <div class="cart-item-qty">
            <button class="qty-btn" @click="decreaseQty(sidx, idx)" :disabled="item.qty <= 1">-</button>
            <span class="qty-num">{{ item.qty }}</span>
            <button class="qty-btn" @click="increaseQty(sidx, idx)">+</button>
          </div>
          <div>
            <div class="cart-item-mid" v-if="item.price>0">€{{ item.price }}</div>
            <div class="cart-item-points">
              <img src="~/assets/images/icon_jfien.png" :alt="$t('iconPoints')" class="price-icon" />
              {{ item.points * item.qty }}
            </div>
          </div>
      
          <div class="cart-item-delete" @click="deleteItem(sidx, idx)">{{ $t('delete') }}</div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="cart-loading">
      <div class="loading-text">{{ $t('loading') }}</div>
    </div>
    <div v-if="!loading && shops.length === 0" class="cart-empty">
      <div class="empty-text">{{ $t('cartEmpty') || '购物车为空' }}</div>
    </div>
    <div class="cart-footer" v-if="!loading && shops.length > 0">
      <div class="cart-footer-left">
        <div class="custom-checkbox" @click="toggleAll">
          <img :src="allChecked ? require('~/assets/images/icon_fuxuan.png') : require('~/assets/images/icon_nofuxuan.png')" 
               :alt="allChecked ? selectedText : notSelectedText" 
               class="checkbox-icon" />
        </div>
        <span>{{ $t('selectAll') }}</span>
        <button class="footer-delete-btn" @click="deleteSelected">{{ $t('deleteSelectedItems') }}</button>
      </div>
      <div class="cart-footer-right">
        <div class="footer-summary-box">
          <div class="footer-summary">{{ selectedText }}<span class="footer-price">{{ selectedItemsCount }}</span>{{ $t('itemsTotalExclShipping') }}<span class="footer-price footer-points"><img src="~/assets/images/icon_jfien.png" :alt="$t('iconPoints')" class="points-icon-small" />{{ totalSelectedPoints }}</span></div>
          <div class="footer-total-price" v-if="totalSelectedPrice > 0">
            {{ $t('totalPrice') || '总价' }}：<span class="footer-price-value">€{{ totalSelectedPrice.toFixed(2) }}</span>
          </div>
          <div class="footer-freight" v-if="freight > 0">
            {{ $t('shippingFee') || '运费' }}：<span class="footer-price-value">€{{ freight.toFixed(2) }}</span>
          </div>
        </div>
       
        <button class="footer-checkout-btn" @click="goToOrderPage">{{ $t('checkoutNow') }}</button>
      </div>
    </div>
    
    <!-- 下单弹窗 -->
    <submit-order-popup
      :visible="showOrderDialog"
      :product-ids="selectedProductIds"
      :selected-items="selectedItemsData"
      @update:visible="showOrderDialog = $event"
      @close="handleOrderDialogClose"
    />
  </div>
</template>

<script>
import config from '~/config/index'
import SubmitOrderPopup from '@/components/popupWindow/submitOrder.vue'

export default {
  name: 'CartPage',
  components: {
    SubmitOrderPopup
  },
  data() {
    return {
      shops: [],
      loading: false,
      showOrderDialog: false,
      selectedProductIds: [],
      selectedItemsData: [], // 选中商品的数据
      freight: 0 // 运费
    }
  },
  async mounted() {
    await this.fetchCart()
  },
  computed: {
    allChecked() {
      // 只要所有商品都 checked 就返回 true
      return this.shops.length > 0 && this.shops.every(shop => shop.items.length > 0 && shop.items.every(item => item.checked));
    },
    selectedText() {
      return this.$t('selected')
    },
    notSelectedText() {
      return this.$t('notSelected')
    },
    // 计算选中的商品数量
    selectedItemsCount() {
      let count = 0
      this.shops.forEach(shop => {
        shop.items.forEach(item => {
          if (item.checked) {
            count += item.qty || 1
          }
        })
      })
      return count
    },
    // 计算选中商品的总积分
    totalSelectedPoints() {
      let totalPoints = 0
      this.shops.forEach(shop => {
        shop.items.forEach(item => {
          if (item.checked) {
            const points = parseInt(item.points || 0)
            const qty = parseInt(item.qty || 1)
            totalPoints += points * qty
          }
        })
      })
      return totalPoints
    },
    // 计算选中商品的总价格
    totalSelectedPrice() {
      let totalPrice = 0
      this.shops.forEach(shop => {
        shop.items.forEach(item => {
          if (item.checked) {
            const price = parseFloat(item.price || 0)
            const qty = parseInt(item.qty || 1)
            totalPrice += price * qty
          }
        })
      })
      return totalPrice
    }
  },
  methods: {
    /* 获取购物车数据 */
    async fetchCart() {
      this.loading = true
      try {
        const res = await this.$axios.post('/staff/jifen/cart/get_cart', {})
        
        // 接口返回数据结构：{ data: [...] }，data 是商品数组
        const cartItems = res.data || res || []
        const currentLocale = this.$store.getters.getLocale || 'es'
        
        if (cartItems.length === 0) {
          this.shops = []
          return
        }
        
        // 按分类（cate_id）分组商品，如果没有分类则使用默认店铺
        const shopsMap = new Map()
        
        cartItems.forEach(item => {
          const cateId = item.cate_id || '0'
          const cateTitle = item.cate_title || this.$t('defaultShop') || '默认店铺'
          
          // 根据当前语言选择商品名称
          let productName = item.title || ''
          if (currentLocale === 'es' && item.title_es) {
            productName = item.title_es
          } else if (currentLocale === 'en' && item.title_en) {
            productName = item.title_en
          } else if (currentLocale === 'zh' && item.title) {
            productName = item.title
          }
          
          // 处理图片URL（photo可能是完整URL或相对路径）
          let imageUrl = item.photo || ''
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = config.URl + imageUrl
          } else if (!imageUrl) {
            imageUrl = require('~/assets/images/iconYuan.png')
          }
          
          // 获取或创建店铺
          if (!shopsMap.has(cateId)) {
            shopsMap.set(cateId, {
              id: cateId,
              name: cateTitle,
              avatar: require('~/assets/images/iconYuan.png'),
              checked: false,
              items: []
            })
          }
          
          const shop = shopsMap.get(cateId)
          shop.items.push({
            id: item.product_id || item.id,
            product_id: item.product_id || item.id,
            name: productName,
            image: imageUrl,
            price: item.price || '0.00',
            qty: parseInt(item.num),
            points: parseInt(item.jifen || item.points || 0),
            checked: false
          })
        })
        
        // 转换为数组
        this.shops = Array.from(shopsMap.values())
      } catch (e) {
        console.error('Fetch cart error:', e)
        this.$message.error(e.msg || this.$t('loadCartError') || '加载购物车失败')
        this.shops = []
      } finally {
        this.loading = false
      }
    },
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
    // 减少数量（至少保留1个）
    async decreaseQty(sidx, idx) {
      const item = this.shops[sidx].items[idx]
      if (item.qty <= 1) {
        return // 至少保留1个
      }
      const newQty = item.qty - 1
      await this.updateCartQty(item, newQty, sidx, idx)
    },
    // 增加数量
    async increaseQty(sidx, idx) {
      const item = this.shops[sidx].items[idx]
      const newQty = item.qty + 1
      await this.updateCartQty(item, newQty, sidx, idx)
    },
    // 更新购物车数量
    async updateCartQty(item, newQty, sidx, idx) {
      try {
        // 调用API更新购物车数量
        await this.$axios.post('/staff/jifen/cart/update', {
          product_id: item.product_id || item.id,
          qty: newQty
        })
        // 更新本地数据
        this.$set(this.shops[sidx].items, idx, { ...item, qty: newQty })
      } catch (e) {
        console.error('Update cart qty error:', e)
        this.$message.error(e.msg || '更新数量失败')
      }
    },
    // 删除单个商品（qty 设为 0）
    async deleteItem(sidx, idx) {
      const item = this.shops[sidx].items[idx]
      try {
        await this.$axios.post('/staff/jifen/cart/update', {
          product_id: item.product_id || item.id,
          qty: 0
        })
        // 从本地移除
        this.shops[sidx].items.splice(idx, 1)
        // 若店铺商品空了则移除店铺
        if (this.shops[sidx].items.length === 0) {
          this.shops.splice(sidx, 1)
        }
      } catch (e) {
        console.error('Delete cart item error:', e)
        this.$message.error(e.msg || '删除失败')
      }
    },
    // 删除选中的商品
    async deleteSelected() {
      const selectedItems = []
      this.shops.forEach((shop, sidx) => {
        shop.items.forEach((item, idx) => {
          if (item.checked) {
            selectedItems.push({ sidx, idx, item })
          }
        })
      })
      if (selectedItems.length === 0) {
        this.$message.info(this.$t('pleaseSelectProducts') || '请选择商品')
        return
      }
      try {
        await Promise.all(selectedItems.map(({ item }) =>
          this.$axios.post('/staff/jifen/cart/update', {
            product_id: item.product_id || item.id,
            qty: 0
          })
        ))
        // 逆序 splice 避免索引偏移
        selectedItems.reverse().forEach(({ sidx, idx }) => {
          this.shops[sidx].items.splice(idx, 1)
          if (this.shops[sidx] && this.shops[sidx].items.length === 0) {
            this.shops.splice(sidx, 1)
          }
        })
      } catch (e) {
        console.error('Delete selected items error:', e)
        this.$message.error(e.msg || '删除选中商品失败')
      }
    },
    goToOrderPage() {
      // 获取选中的商品ID列表和商品数据
      const selectedProductIds = []
      const selectedItems = []
      this.shops.forEach(shop => {
        shop.items.forEach(item => {
          if (item.checked) {
            selectedProductIds.push(item.product_id || item.id)
            selectedItems.push({
              product_id: item.product_id || item.id,
              price: parseFloat(item.price || 0),
              points: parseInt(item.points || 0),
              qty: parseInt(item.qty || 1)
            })
          }
        })
      })
      
      if (selectedProductIds.length === 0) {
        this.$message.info(this.$t('pleaseSelectProducts') || '请选择商品')
        return
      }
      
      // 显示下单弹窗
      this.selectedProductIds = selectedProductIds
      this.selectedItemsData = selectedItems
      this.showOrderDialog = true
      
      // 获取运费信息
      this.fetchFreight()
    },
    /* 获取运费信息 */
    async fetchFreight() {
      try {
        // 调用接口获取运费
        const res = await this.$axios.post('/staff/jifen/order/get_freight', {
          product_ids: this.selectedProductIds.join(',')
        })
        this.freight = parseFloat(res.freight || res.shipping_fee || res.shipping || 0)
      } catch (e) {
        console.error('Fetch freight error:', e)
        // 如果接口不存在，设置为0
        this.freight = 0
      }
    },
    handleOrderDialogClose() {
      this.showOrderDialog = false
      this.selectedProductIds = []
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
  display: grid;
  grid-template-columns: 1fr 160px 140px 80px;
  align-items: center;
  background: #fff;
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  column-gap: 16px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
//  border: 1px solid #BCC4D0;
  max-width: 120px;
  margin: 0 auto;
}
.qty-btn {
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: #888;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: color 0.2s;
}
.qty-btn:hover:not(:disabled) {
  color: #333;
}
.qty-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}
.qty-num {
  width: 72px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  // border-left: 1px solid #BCC4D0;
  // border-right: 1px solid #BCC4D0;
  font-size: 16px;
}
.cart-item-points {
  display: flex;
  align-items: center;
  color: #7AC554;
  text-align: center;
  font-size: 16px;
  justify-content: center;
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
  color: #f44336;
  cursor: pointer;
  text-align: center;
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
.footer-points {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.points-icon-small {
  width: 16px;
  height: 16px;
  object-fit: contain;
  vertical-align: middle;
}
.footer-tip {
  color: #333;
  margin-top: 4px;
  font-size: 16px;
}
.footer-total-price {
  margin-top: 8px;
  font-size: 16px;
  color: #333;
  text-align: right;
}
.footer-price-value {
  color: #FDB100;
  font-weight: 600;
  font-size: 18px;
}
.footer-freight {
  margin-top: 8px;
  font-size: 16px;
  color: #333;
  text-align: right;
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
.cart-loading,
.cart-empty {
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
.loading-text,
.empty-text {
  margin-top: 20px;
}
</style> 