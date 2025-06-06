<template>
  <div class="points-mall">
    <!-- 头部横幅 -->
    <div class="banner-section">
      <div class="banner-content">
        <div class="banner-left">
          <h1 class="banner-title">积分商城新功能上线</h1>
          <p class="banner-subtitle">更简单的兑换，更丰富的收益</p>
        </div>
        <div class="banner-right">
          <div class="points-badge">
            <span class="points-label">积分</span>
            <div class="decorative-elements">
              <div class="coin"></div>
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div class="nav-container">
        <div class="nav-items-wrapper">
          <div class="nav-item" v-for="category in categories" :key="category.id">
            <div class="nav-icon" :class="category.iconClass">
              <i :class="category.icon"></i>
            </div>
            <span class="nav-label">{{ category.name }}</span>
          </div>
        </div>
        <div class="points-balance">
          <div class="balance-card">
            <span class="balance-label">我的积分</span>
            <span class="balance-amount">12000</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门产品 -->
    <div class="products-section">
      <h2 class="section-title">🔥热门产品</h2>
      <div class="products-grid">
        <div class="product-card" v-for="product in products" :key="product.id">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span class="price-label">积分</span>
              <span class="price-amount">{{ product.points }}</span>
            </div>
            <button class="exchange-btn">
              <i class="cart-icon">🛒</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PointsMall',
  data() {
    return {
      categories: [
        { id: 1, name: '全部商品', icon: 'category-icon', iconClass: 'category-all' },
        { id: 2, name: '营养美食', icon: 'food-icon', iconClass: 'category-food' },
        { id: 3, name: '美妆护肤', icon: 'beauty-icon', iconClass: 'category-beauty' },
        { id: 4, name: '厨房用品', icon: 'kitchen-icon', iconClass: 'category-kitchen' },
        { id: 5, name: 'hand礼', icon: 'gift-icon', iconClass: 'category-gift' },
        { id: 6, name: '生活', icon: 'life-icon', iconClass: 'category-life' }
      ],
      products: [
        { 
          id: 1, 
          name: 'club Vuitton Beautiful PM', 
          points: '3000',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TFYgQmFnPC90ZXh0Pjwvc3ZnPg=='
        },
        { 
          id: 2, 
          name: 'club Vuitton Beautiful PM', 
          points: '3500',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VmZjZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29zbWV0aWNzPC90ZXh0Pjwvc3ZnPg=='
        },
        { 
          id: 3, 
          name: 'club Vuitton Beautiful PM', 
          points: '4500',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZlZjNlMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TmF0dXJhbDwvdGV4dD48L3N2Zz4='
        },
        { 
          id: 4, 
          name: 'club Vuitton Beautiful PM', 
          points: '3600',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjBmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2FkZ2V0PC90ZXh0Pjwvc3ZnPg=='
        }
      ]
    }
  },
  methods: {
    exchangeProduct(product) {
      console.log('兑换商品:', product);
      // 实现兑换逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
.points-mall {
    padding: 100px 0;
  min-height: 100vh;
  background-color: #f5f5f5; 
}

// 头部横幅样式
.banner-section {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9500 50%, #FFB84D 100%);
  padding: 40px 20px 60px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="60" cy="70" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
  }
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.banner-left {
  flex: 1;
  
  .banner-title {
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 10px 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .banner-subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
}

.banner-right {
  position: relative;
}

.points-badge {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  
  .points-label {
    font-size: 24px;
    font-weight: 700;
    color: #FFB84D;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}

.decorative-elements {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  pointer-events: none;
}

.coin {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border-radius: 50%;
  top: -20px;
  right: -20px;
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
  animation: float 3s ease-in-out infinite;
}

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  animation: twinkle 2s ease-in-out infinite;
  
  &.sparkle-1 {
    top: 10px;
    left: -10px;
    animation-delay: 0s;
  }
  
  &.sparkle-2 {
    bottom: 10px;
    right: -10px;
    animation-delay: 0.5s;
  }
  
  &.sparkle-3 {
    bottom: -10px;
    left: 20px;
    animation-delay: 1s;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

// 分类导航样式
.category-nav {
  background: #fff;
  padding: 20px;
  margin-top: -30px;
  border-radius: 20px 20px 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-items-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 40px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.nav-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 24px;
  transition: all 0.3s ease;
  
  &.category-all {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    &::before { content: '📦'; }
  }
  
  &.category-food {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    &::before { content: '🍎'; }
  }
  
  &.category-beauty {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    &::before { content: '💄'; }
  }
  
  &.category-kitchen {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    &::before { content: '🍽️'; }
  }
  
  &.category-gift {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    &::before { content: '🎁'; }
  }
  
  &.category-life {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    &::before { content: '🏠'; }
  }
}

.nav-label {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.points-balance {
  /* margin-left: auto; - 移除这行，因为父容器已经使用space-between布局 */
}

.balance-card {
  background: linear-gradient(135deg, #FFB84D, #FF9500);
  padding: 15px 25px;
  border-radius: 25px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 15px rgba(255, 148, 0, 0.3);
  
  .balance-label {
    font-size: 12px;
    opacity: 0.9;
    margin-bottom: 2px;
  }
  
  .balance-amount {
    font-size: 18px;
    font-weight: 700;
  }
}

// 产品部分样式
.products-section {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
}

.product-image {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.product-info {
  padding: 15px;
  position: relative;
}

.product-name {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  font-weight: 400;
  line-height: 1.4;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  
  .price-label {
    font-size: 12px;
    color: #FFB84D;
    font-weight: 500;
  }
  
  .price-amount {
    font-size: 16px;
    font-weight: 700;
    color: #FFB84D;
  }
}

.exchange-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #FFB84D, #FF9500);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 148, 0, 0.3);
  
  .cart-icon {
    font-size: 16px;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(255, 148, 0, 0.4);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .banner-title {
    font-size: 28px;
  }
  
  .nav-container {
    flex-direction: column;
    gap: 20px;
    padding: 0 10px;
  }
  
  .nav-items-wrapper {
    gap: 25px;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .balance-card {
    margin-top: 0;
  }
}

@media (max-width: 480px) {
  .banner-title {
    font-size: 24px;
  }
  
  .products-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .nav-items-wrapper {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}
</style> 