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
          <img v-if="cat.icon" :src="cat.icon" class="side-category-icon" />
          <img v-else src="~/assets/images/iconYuan.png" class="side-category-icon" />
          <span>{{ cat.name }}</span>
        </div>
      </div>
      <!-- 右侧商品列表 -->
      <div class="category-products" ref="productScroll" @scroll="onProductScroll">
        <div v-if="categoryProducts.length > 0">
          <div
            v-for="category in categoryProducts"
            :key="category.id"
            :ref="'catSection' + category.id"
            class="product-section"
          >
            <div class="product-section-title">{{ category.name }}</div>
            <div class="product-list">
              <div class="product-card" v-for="product in category.products" :key="product.id" @click="goToProductDetail(product)">
                <img :src="product.image || require('~/assets/images/iconYuan.png')" class="product-img" />
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-desc">
                    <div class="product-desc-box">
 
                      <div class="product-points">
                        <img src="~/assets/images/icon_jfien.png" class="price-icon" />
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
          </div>
        </div>
        <div v-else-if="!loading" class="empty-products">
          <div class="empty-text">{{ $t('noProducts') }}</div>
        </div>
        <div v-if="loading" class="loading-products">
          <div class="loading-text">{{ $t('loading') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '~/config/index'

export default {
  name: 'CategoryListPage',
  data() {
    return {
      categories: [], // 左侧分类导航列表
      categoryProducts: [], // 右侧分类及其商品列表（从接口获取的完整数据）
      activeCategoryId: 0, // 当前选中的分类ID
      loading: false
    }
  },
  async mounted() {
    // 获取分类ID（从路由参数）
    const cateId = parseInt(this.$route.query.cate_id)
    
    // 获取所有分类及其商品列表（同时会更新左侧分类导航）
    await this.fetchProductsByCategory()
    
    // 如果有分类ID且分类存在，滚动到对应分类并高亮
    if (cateId && this.categoryProducts.find(cat => cat.id === cateId)) {
      this.activeCategoryId = cateId
      this.$nextTick(() => {
        this.scrollToCategory(cateId)
      })
    } else if (this.categoryProducts.length > 0) {
      // 如果没有指定分类或分类不存在，默认选中第一个分类
      this.activeCategoryId = this.categoryProducts[0].id
    }
  },
  methods: {
    /* 获取所有分类及其商品列表（同时更新左侧分类导航） */
    async fetchProductsByCategory() {
      this.loading = true
      try {
        const params = {}
        const res = await this.$axios.post('/staff/jifen/index/prodcut_list_by_category', params)
        
        // 接口返回数据结构：{ data: [...], error: "0", message: "success" }
        // 兼容多种返回格式
        let dataList = []
        if (Array.isArray(res)) {
          dataList = res
        } else if (res && res.data && Array.isArray(res.data)) {
          dataList = res.data
        } else if (res && Array.isArray(res.list)) {
          dataList = res.list
        }
        
        const currentLocale = this.$store.getters.getLocale || 'es'
        
        // 处理返回的数据，每个分类包含其商品列表
        this.categoryProducts = dataList
          .filter(item => item.parent_id === '0' || item.parent_id === 0) // 只显示顶级分类
          .sort((a, b) => {
            const orderA = parseInt(a.orderby || 0)
            const orderB = parseInt(b.orderby || 0)
            return orderA - orderB
          })
          .map(category => {
            // 根据当前语言选择分类名称
            let categoryName = category.title || ''
            if (currentLocale === 'es' && category.title_es) {
              categoryName = category.title_es
            } else if (currentLocale === 'en' && category.title_en) {
              categoryName = category.title_en
            } else if (currentLocale === 'zh' && category.title) {
              categoryName = category.title
            }
            
            // 处理该分类下的商品列表
            const products = (category.product_list || []).map(product => ({
              id: product.product_id || product.id,
              product_id: product.product_id || product.id, // 保存原始 product_id
              name: product.title || product.name || '',
              price: product.price || '0.00',
              points: product.jifen || product.points || 0,
              image: product.photo ? (config.URl + product.photo) : (product.image || require('~/assets/images/iconYuan.png'))
            }))
            
            return {
              id: parseInt(category.cate_id) || 0,
              name: categoryName,
              icon: category.icon || '',
              products: products
            }
          })
        
        // 过滤掉ID为0的"全部"分类
        this.categoryProducts = this.categoryProducts.filter(cat => cat.id !== 0)
        
        // 同时更新左侧分类导航列表（使用相同的分类数据）
        this.categories = this.categoryProducts.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon
        }))
      } catch (e) {
        console.error('Fetch products error:', e)
        this.$message.error(e.msg || this.$t('loadProductsError'))
      } finally {
        this.loading = false
      }
    },
    /* 选择分类 - 滚动到对应区域 */
    selectCategory(id) {
      this.activeCategoryId = id
      this.scrollToCategory(id)
    },
    /* 滚动到指定分类区域 */
    scrollToCategory(id) {
      this.$nextTick(() => {
        const section = this.$refs['catSection' + id]
        const container = this.$refs.productScroll
        if (section && container) {
          const el = Array.isArray(section) ? section[0] : section
          if (el) {
            // 使用 offsetTop 获取元素相对于容器的位置
            const elementTop = el.offsetTop
            container.scrollTo({
              top: elementTop - 20, // 减去一些偏移量，让标题更明显
              behavior: 'smooth'
            })
          }
        }
      })
    },
    /* 监听滚动，自动高亮左侧分类 */
    onProductScroll() {
      const container = this.$refs.productScroll
      if (!container || this.categoryProducts.length === 0) return
      
      const scrollTop = container.scrollTop
      let activeId = this.activeCategoryId
      
      // 从后往前遍历，找到当前滚动位置所在的分类
      for (let i = this.categoryProducts.length - 1; i >= 0; i--) {
        const category = this.categoryProducts[i]
        const section = this.$refs['catSection' + category.id]
        if (section) {
          const el = Array.isArray(section) ? section[0] : section
          if (el) {
            // 获取元素距离容器顶部的距离
            const elementTop = el.offsetTop
            
            // 如果滚动位置超过了这个分类的起始位置，则高亮该分类
            if (scrollTop + 150 >= elementTop) {
              activeId = category.id
              break
            }
          }
        }
      }
      
      // 如果滚动到最顶部，高亮第一个分类
      if (scrollTop < 50 && this.categoryProducts.length > 0) {
        activeId = this.categoryProducts[0].id
      }
      
      // 更新高亮的分类
      if (activeId !== this.activeCategoryId) {
        this.activeCategoryId = activeId
      }
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
}
.product-card {
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
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
  padding: 0 4px;
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
.empty-products,
.loading-products {
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
.empty-text {
  margin-top: 20px;
}

@media (max-width: 1200px) {
  .category-list-page { padding: 130px 0; }
}
@media (max-width: 768px) {
  .category-list-page { padding: 130px 0; }
}
</style>