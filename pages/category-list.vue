<template>
  <div class="category-list-page">
    <div class="category-list-container">
      <!-- 左侧分类导航 -->
      <div class="category-side">
        <div
          v-for="cat in categories"
          :key="cat.id"
          :class="['side-category', { active: cat.id === activeCategoryId }]"
          @click="selectCategory(cat.id)"
        >
          <img :src="cat.icon" class="side-category-icon" />
          <span>{{ $t(cat.name) }}</span>
        </div>
      </div>
      <!-- 右侧商品列表 -->
      <div class="category-products" ref="productScroll" @scroll="onProductScroll">
        <div
          v-for="cat in categories"
          :key="cat.id"
          :ref="'catSection' + cat.id"
          class="product-section"
        >
          <div class="product-section-title">{{ $t(cat.name) }}</div>
          <div class="product-list">
            <div class="product-card" v-for="product in cat.products" :key="product.id">
              <img :src="product.image" class="product-img" />
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-desc">
                  <div class="product-desc-box">
                    <div class="product-price">
                      <span class="price-label">€</span>
                      <span class="price-amount">{{ product.price }}</span>
                    </div>
                    <div class="product-points">
                      <img src="~/assets/images/icon_jfien.png" class="price-icon" />
                      {{ product.points }}
                    </div>
                  </div>
                  <button class="exchange-btn">
                    <img src="~/assets/images/icon_gouwuche.png" alt="购物车图标" class="cart-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryListPage',
  data() {
    return {
      categories: [
        {
          id: 1,
          name: '全部商品',
          icon: require('~/assets/images/iconYuan.png'),
          products: [
            { id: 1, name: 'LV包', price: '120.00', points: 1800, image: require('~/assets/images/iconYuan.png') },
            { id: 2, name: '美妆套装', price: '80.00', points: 1200, image: require('~/assets/images/iconYuan.png') }
          ]
        },
        {
          id: 2,
          name: '营养美食',
          icon: require('~/assets/images/iconYuan.png'),
          products: [
            { id: 3, name: '营养早餐', price: '30.00', points: 300, image: require('~/assets/images/iconYuan.png') }
          ]
        },
        {
          id: 3,
          name: '美妆护肤',
          icon: require('~/assets/images/iconYuan.png'),
          products: [
            { id: 4, name: '护肤水', price: '50.00', points: 500, image: require('~/assets/images/iconYuan.png') }
          ]
        },
        {
          id: 4,
          name: '厨房用品',
          icon: require('~/assets/images/iconYuan.png'),
          products: [
            { id: 5, name: '锅具', price: '60.00', points: 600, image: require('~/assets/images/iconYuan.png') }
          ]
        },
        {
          id: 5,
          name: 'hand礼',
          icon: require('~/assets/images/iconYuan.png'),
          products: [
            { id: 6, name: '手工礼品', price: '40.00', points: 400, image: require('~/assets/images/iconYuan.png') }
          ]
        },
        {
          id: 6,
          name: '生活',
          icon: require('~/assets/images/iconYuan.png'),
          products: [
            { id: 7, name: '生活用品', price: '20.00', points: 200, image: require('~/assets/images/iconYuan.png') }
          ]
        }
      ],
      activeCategoryId: 1
    }
  },
  mounted() {
    // 如果有query参数，自动滚动到对应分类
    const catId = parseInt(this.$route.query.category)
    if (catId) {
      this.activeCategoryId = catId
      this.$nextTick(() => {
        this.scrollToCategory(catId)
      })
    }
  },
  methods: {
    selectCategory(id) {
      this.activeCategoryId = id
      this.scrollToCategory(id)
    },
    scrollToCategory(id) {
      const section = this.$refs['catSection' + id]
      const container = this.$refs.productScroll
      if (section && container) {
        const el = Array.isArray(section) ? section[0] : section
        container.scrollTop = el.offsetTop
      }
    },
    onProductScroll() {
      // 监听滚动，自动高亮左侧分类
      const container = this.$refs.productScroll
      let found = false
      for (const cat of this.categories) {
        const section = this.$refs['catSection' + cat.id]
        if (section) {
          const el = Array.isArray(section) ? section[0] : section
          const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top
          if (top >= 0 && !found) {
            this.activeCategoryId = cat.id
            found = true
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.category-list-page {
  background: #fff;
  // min-height: 100vh;
  padding: 160px 0;
}
.exchange-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .cart-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
}
.category-list-container {
  display: flex;
  width: 70%;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}
.category-side {
  width: 180px;
  background: #fafafa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 24px 0;
}
.side-category {
  padding: 18px 0 18px 24px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s, color 0.2s;
}
.side-category.active {
  background: #fff8e2;
  color: #f9c13e;
  font-weight: 700;
}
.side-category-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.category-products {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
}
.product-section {
  margin-bottom: 32px;
}
.product-section-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
}
.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px 20px;
  margin-top: 40px;
}
.product-card {
  overflow: hidden;
  position: relative;
}
.product-img {
  width: 100%;
  height: 172px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0;
}
.product-info {
  padding: 10px 0;
  position: relative;
  text-align: left;
}
.product-name {
  font-size: 18px;
  color: #181818;
  font-weight: 400;
  margin-bottom: 0;
}
.product-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-desc-box{
  display: flex;
  align-items: center;
}
.product-price {
  display: flex;
  align-items: center;
}
.product-price .price-label {
  font-size: 14px;
  color: #FFB84D;
  font-weight: 500;
}
.product-price .price-amount {
  margin-right: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #FBB400;
  display: flex;
  align-items: center;
}
.product-price .price-amount .price-icon {
  width: 18px;
  height: 18px;
}
.product-points {
  color: #7AC554;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.product-points .price-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  margin-right: 4px;
}
</style> 