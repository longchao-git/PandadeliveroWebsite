<template>
  <div class="points-mall">
    <!-- 头部横幅 -->
    <div class='p-relative head-bg'>
      <div class='h-content'>
        <div class='h-conte'>
          <div class='_left'>
            <div class='Services'> {{$t('pointsMallNewFeaturesLaunched')}}</div>

            <div class='Potential'>
              {{$t('simplerRulesRicherBenefits')}}
            </div>
            
          </div>
          <div class='_right ml32'>

          </div>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div class="nav-container">
        <div class="nav-items-wrapper">
          <div class="nav-item" v-for="category in categories" :key="category.id" @click="goToCategory(category)" :class="{ 'active': activeCid === category.id }">
            <div class="nav-icon" :class="category.iconClass">
              <img v-if="category.icon" :src="category.icon" :alt="category.name" class="category-icon-img" />
              <i v-else :class="category.icon"></i>
            </div>
            <span class="nav-label">{{ category.name }}</span>
          </div>
        </div>
        <div class="points-balance">
          <div class="balance-card">
            <span class="balance-label">
              <img src="~/assets/images/icon_jifen.png" :alt="$t('iconPoints')" class="balance-icon" />
              {{ $t('myPoints') }}
            </span>
            <span class="balance-amount">{{ balance }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门产品 -->
    <div class="products-section">
      <h2 class="section-title">
        <img src="~/assets/images/iconYuan.png" :alt="$t('iconCircle')" class="section-icon" />
        <div>{{ $t('hotProducts') }}</div>
      </h2>
      <div class="products-grid">
        <div class="product-card" v-for="product in products" :key="product.id" @click="goToProductDetail(product)">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-desc">
              <div class="product-price">
                <span class="price-label" v-if="product.price>0">€{{ product.price }}</span>
                <div class="price-amount">
                  <img src="~/assets/images/icon_jfien.png" :alt="$t('iconPoints')" class="price-icon" />
                  {{ product.points }}
                </div>
              </div>
              <button class="exchange-btn" @click.stop="exchangeProduct(product)">
                <img src="~/assets/images/icon_gouwuche.png" :alt="$t('iconCart')" class="cart-icon" />
              </button>
            </div>  
          </div>
        </div>
      </div>
      <!-- 加载更多按钮 -->
      <div v-if="hasNext && !loading" class="load-more-wrapper">
        <button class="load-more-btn" @click="loadMoreProducts">
          {{ $t('loadMore') || '加载更多' }}
        </button>
      </div>
      <!-- 加载中提示 -->
      <div v-if="loading && products.length > 0" class="loading-more-wrapper">
        <div class="loading-more-text">{{ $t('loading') || '加载中...' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '~/config/index'

export default {
  name: 'PointsMall',
  data() {
    return {
      balance: 0,
      page: 1,
      hasNext: true,
      loading: false,
      activeCid: 0, // 0 表示全部分类
      categories: [], // 从接口获取分类
      products: [] // 初始为空，接口拉取
    }
  },
  async mounted() {
    await this.fetchBalance()
    await this.fetchCategories() // 先获取分类
    await this.fetchProducts()
  },
  methods: {
    /* 获取分类列表 */
    async fetchCategories() {
      try {
        const res = await this.$axios.post('/staff/jifen/index/index', {})
        // 处理接口返回的 cate_list 字段
        if (res && res.cate_list && Array.isArray(res.cate_list)) {
          // 获取当前语言
          const currentLocale = this.$store.getters.getLocale || 'es'
          
          // 过滤出顶级分类（parent_id === "0"），并根据 orderby 排序
          const topCategories = res.cate_list
            .filter(cat => cat.parent_id === '0' || cat.parent_id === 0)
            .sort((a, b) => {
              const orderA = parseInt(a.orderby || 0)
              const orderB = parseInt(b.orderby || 0)
              return orderA - orderB
            })
            .map(cat => {
              // 根据当前语言选择标题
              let name = cat.title || ''
              if (currentLocale === 'es' && cat.title_es) {
                name = cat.title_es
              } else if (currentLocale === 'en' && cat.title_en) {
                name = cat.title_en
              } else if (currentLocale === 'zh' && cat.title) {
                name = cat.title
              }
              
              return {
                id: parseInt(cat.cate_id) || 0,
                name: name,
                icon: cat.icon || '', // 图标URL
                iconClass: 'category-custom' // 自定义图标类
              }
            })
          
          // 确保有"全部"分类在第一位
          const allCategory = topCategories.find(cat => cat.id === 0)
          if (!allCategory) {
            topCategories.unshift({ 
              id: 0, 
              name: this.$t('allProducts'), 
              icon: '', 
              iconClass: 'category-all' 
            })
          } else {
            // 如果存在 id 为 0 的分类，将其名称设置为"全部"
            allCategory.name = this.$t('allProducts')
            allCategory.iconClass = 'category-all'
          }
          
          this.categories = topCategories
        } else {
          // 如果接口返回格式不符合预期，使用默认分类
          this.categories = [
            { id: 0, name: this.$t('allProducts'), icon: '', iconClass: 'category-all' }
          ]
        }
      } catch (e) {
        console.error('Fetch categories error:', e)
        // 出错时使用默认分类
        this.categories = [
          { id: 0, name: this.$t('allProducts'), icon: '', iconClass: 'category-all' }
        ]
        this.$message.error(e.msg || 'Load categories error')
      }
    },

    /* 获取积分余额 */
    async fetchBalance() {
      try {
        const res = await this.$axios.post('/staff/account/profile', {})
        this.balance = res.integral || 0
      } catch (e) {
        this.$message.error(e.msg || 'Balance error')
      }
    },
    /* 拉取商品列表（分页） */
    async fetchProducts(loadMore = false) {
      if (this.loading || (!this.hasNext && loadMore)) return
      this.loading = true
      try {
        const res = await this.$axios.post('/staff/jifen/index/loaditems', {
          page: this.page,
          cate_id: this.activeCid === 0 ? '' : this.activeCid,
          cat_id: this.activeCid === 0 ? '' : this.activeCid,
        })
        const rawItems = (res.items || [])
        const list = rawItems.map(it => ({
          id: it.product_id,
          price: it.price,
          product_id: it.product_id, // 保存原始 product_id
          name: it.title,
          points: it.jifen,
          image: config.URl + it.photo // 拼出完整图片地址
        }))
        // pager.is_last_page: "0" 表示还有下一页, "1" 表示最后一页
        const isLastPage = res.pager ? res.pager.is_last_page === '1' : true
        this.products = loadMore ? [...this.products, ...list] : list
        this.hasNext = !isLastPage
        if (this.hasNext) this.page += 1
      } catch (e) {
        this.$message.error(e.msg || 'Load items error')
      } finally {
        this.loading = false
      }
    },
    /* 点击分类 - 跳转到分类列表页面 */
    goToCategory(category) {
      // 跳转到分类列表页面，传递分类ID
      const categoryId = category.id || 0
      this.$router.push({
        path: '/category-list',
        query: {
          cate_id: categoryId
        }
      })
    },
    /* 跳转到商品详情页面 */
    goToProductDetail(product) {
      this.$router.push({
        path: '/product-detail',
        query: {
          product_id: product.product_id || product.id
        }
      })
    },
    /* 添加到购物车 */
    async exchangeProduct(product) {
      try {
        await this.$axios.post('/staff/jifen/cart/add_cart', {
          product_id: product.product_id || product.id,
          product_num: 1
        })
        this.$message.success(this.$t('addToCartSuccess') || '已添加到购物车')
      } catch (e) {
        this.$message.error(e.msg || this.$t('addToCartError') || '添加到购物车失败')
      }
    },
    /* 加载更多商品 */
    async loadMoreProducts() {
      if (this.hasNext && !this.loading) {
        await this.fetchProducts(true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.points-mall {
    padding: 100px 0;
  min-height: 100vh;
  background-color: #fff; 
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
.head-bg {
  @extend .tran-300ms;
  padding: 120px 0;
  height: 727px;
  background-image: url('@/assets/images/points-mall.png');
  background-size: cover;
  background-position: center;


  .h-content {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;

    .h-conte {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      flex: 1;

      ._left {
        width: 35%;

        .Business {
          color: #FFF;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 22px;
          background-color: #254969;
          padding: 4px 16px;
          border-radius: 30px;
          display: inline-block;
        }

        .Services {
          color: #000;
          font-size: 72px;
          font-style: normal;
          font-weight: 700;
          line-height: 107px;
          letter-spacing: -1.12px;
          text-transform: capitalize;
        }

        .Potential {
          color: #3A3509;
          font-size: 36px;
          font-style: normal;
          font-weight: 500;
          line-height: 26px;
          margin-top: 12px;
        }

        .button-view {
          margin-top: 20px;
          display: flex;

          .v-btn {
            border-radius: 35px !important;
          }
        }
      }

      ._right {
        width: 600px;

      }
    }
  }
}
/*中屏幕*/
@media screen and(max-width: $big-pc-width) {
  .head-bg .h-content {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

@media screen and (max-width: $pad-max-width) {
  .customer-collection_footer-close {
    display: none;
  }
  .head-bg {
    margin-top: 120px;
    height: 570px;

    .h-content {
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      .h-conte {
        ._left {
          width: 65%;
          margin-left: 5%;

          .Services {
            font-size: 32px;
          }

          .button-view {
            margin-top: 20px;

            .v-btn {
              border-radius: 35px !important;
            }
          }
        }
      }
    }
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
  padding: 60px;
  position: relative;
  z-index: 2;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 40px;
}

.nav-items-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 40px;
  padding: 0 20px;
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
  
  &.active {
    .nav-icon {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transform: scale(1.05);
    }
    .nav-label {
      color: #FFB84D;
      font-weight: 600;
    }
  }
}

.nav-icon {
  width: 104px;
  height: 104px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 28px;
  transition: all 0.3s ease;
  overflow: hidden;
  background: #f5f5f5;
  
  &.category-all {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    &::before { content: '📦'; }
  }
  
  &.category-custom {
    background: #fff;
    border: 1px solid #e0e0e0;
  }
  
  .category-icon-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  // 保留原有的emoji图标样式作为备用
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
  font-size: 16px;
  color: #000;
  font-weight: 500;
}

.points-balance {
  width: 180px;
  height: 120px;
  display: flex;
  justify-content: flex-end;
}

.balance-card {
  background: linear-gradient(135deg, #FFB84D, #FF9500);
  padding: 16px;
  border-radius: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 4px 15px rgba(255, 148, 0, 0.3);
  width: 100%;
  
  .balance-label {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    .balance-icon {
      width: 24px;
      height: 24px;
      object-fit: contain;
      margin-right: 10px;
    }
  }
  
  .balance-amount {
    font-size: 28px;
    font-weight: 500;
    color: #0D0D0D;
    margin-top: 6px;
  }
}

// 产品部分样式
.products-section {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  
  color: #000;
  line-height: 42px;
  padding-bottom: 10px;
  border-bottom: 1px solid #DEDEDE;
  display: flex;
  align-items: center;
  gap: 10px;
  div{
    margin-left: -20px;
    font-size: 28px;
  font-weight: 500;
  }
}

.section-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px 20px;
  margin-top: 40px;
}

.product-card {
  // background: #fff;
  // border-radius: 12px;
  overflow: hidden;
  // box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
}

.product-image {
  width: 100%;
  height: 172px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  // &:hover img {
  //   transform: scale(1.05);
  // }
}

.product-info {
  padding: 10px 0;
  position: relative;
}

.product-name {
  font-size: 18px;
  color: #181818;
  font-weight: 400;
}

.product-desc{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  display: flex;
  align-items: center;
  
  .price-label {
    font-size: 14px;
    color: #FFB84D;
    font-weight: 500;
  }
  
  .price-amount {
    font-size: 14px;
    font-weight: 500;
    color: #7AC554;
    display: flex;
    align-items: center;
    .price-icon{
      width: 18px;
      height: 18px;
    }
  }
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
    width: 120px;
    height: 120px;
    font-size: 20px;
  }
}
</style> 