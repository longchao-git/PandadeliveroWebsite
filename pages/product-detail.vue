<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading-container">
      <div class="loading-text">{{ $t('loading') }}</div>
    </div>
    <div v-else-if="product" class="product-detail-container">
      <!-- 商品图片 -->
      <div class="product-image-section">
        <img :src="product.image" :alt="product.name" class="product-main-image" />
      </div>
      
      <!-- 商品信息 -->
      <div class="product-info-section">
        <h1 class="product-title">{{ product.name }}</h1>
        <div class="product-meta">
          <div class="product-price-section">
            <span class="price-label">{{ $t('price') || '价格' }}：</span>
            <span class="price-value">€{{ product.price }}</span>
          </div>
          <div class="product-points-section">
            <img src="~/assets/images/icon_jfien.png" class="points-icon" />
            <span class="points-value">{{ product.points }}</span>
            <span class="points-label">{{ $t('points') }}</span>
          </div>
        </div>
        
        <!-- 商品描述 -->
        <div v-if="product.info" class="product-description">
          <h3 class="section-title">{{ $t('productDescription') || '商品描述' }}</h3>
          <div class="description-content" v-html="product.info"></div>
        </div>
        
        <!-- 下单按钮 -->
        <div class="order-actions">
          <button class="order-btn" @click="showOrderDialog = true">
            {{ $t('placeOrder') || '立即下单' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-container">
      <div class="empty-text">{{ $t('productNotFound') || '商品不存在' }}</div>
    </div>
    
    <!-- 下单弹窗 -->
    <submit-order-popup
      :visible="showOrderDialog"
      :product-ids="productIds"
      @update:visible="showOrderDialog = $event"
      @close="showOrderDialog = false"
    />
  </div>
</template>

<script>
import config from '~/config/index'
import SubmitOrderPopup from '@/components/popupWindow/submitOrder.vue'

export default {
  name: 'ProductDetailPage',
  components: {
    SubmitOrderPopup
  },
  data() {
    return {
      product: null,
      loading: false,
      showOrderDialog: false
    }
  },
  computed: {
    productIds() {
      // 返回当前商品的ID数组
      if (this.product && this.product.product_id) {
        return [this.product.product_id]
      }
      return []
    }
  },
  async mounted() {
    await this.fetchProductDetail()
  },
  methods: {
    /* 获取商品详情 */
    async fetchProductDetail() {
      const productId = this.$route.query.product_id
      if (!productId) {
        this.$message.error(this.$t('productIdRequired') || '商品ID不能为空')
        return
      }
      
      this.loading = true
      try {
        const res = await this.$axios.post('/staff/jifen/index/detail', {
          product_id: productId
        })
        
        // 处理接口返回的商品数据
        const productData = res.data || res || {}
        const currentLocale = this.$store.getters.getLocale || 'es'
        
        // 根据当前语言选择商品名称
        let productName = productData.title || ''
        if (currentLocale === 'es' && productData.title_es) {
          productName = productData.title_es
        } else if (currentLocale === 'en' && productData.title_en) {
          productName = productData.title_en
        } else if (currentLocale === 'zh' && productData.title) {
          productName = productData.title
        }
        
        // 处理商品描述
        let productInfo = productData.info || ''
        if (currentLocale === 'es' && productData.info_es) {
          productInfo = productData.info_es
        } else if (currentLocale === 'en' && productData.info_en) {
          productInfo = productData.info_en
        } else if (currentLocale === 'zh' && productData.info) {
          productInfo = productData.info
        }
        
        // 处理图片URL
        let imageUrl = productData.photo || ''
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = config.URl + imageUrl
        } else if (!imageUrl) {
          imageUrl = require('~/assets/images/iconYuan.png')
        }
        
        this.product = {
          id: productData.product_id || productData.id,
          product_id: productData.product_id || productData.id,
          name: productName,
          price: productData.price || '0.00',
          points: parseInt(productData.jifen || productData.points || 0),
          image: imageUrl,
          info: productInfo,
          cate_id: productData.cate_id,
          cate_title: productData.cate_title || ''
        }
      } catch (e) {
        console.error('Fetch product detail error:', e)
        this.$message.error(e.msg || this.$t('loadProductDetailError') || '加载商品详情失败')
      } finally {
        this.loading = false
      }
    },
  }
}
</script>

<style scoped lang="scss">
.product-detail-page {
  background: #fff;
  min-height: 100vh;
  padding: 120px 0 80px;
}

.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 40px;
}

.product-image-section {
  flex: 0 0 500px;
  
  .product-main-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

.product-info-section {
  flex: 1;
  
  .product-title {
    font-size: 32px;
    font-weight: 700;
    color: #181818;
    margin-bottom: 24px;
    line-height: 1.4;
  }
  
  .product-meta {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .product-price-section {
    display: flex;
    align-items: baseline;
    gap: 8px;
    
    .price-label {
      font-size: 18px;
      color: #666;
    }
    
    .price-value {
      font-size: 32px;
      font-weight: 700;
      color: #FFB84D;
    }
  }
  
  .product-points-section {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .points-icon {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    
    .points-value {
      font-size: 24px;
      font-weight: 600;
      color: #7AC554;
    }
    
    .points-label {
      font-size: 16px;
      color: #666;
    }
  }
  
  .product-description {
    margin-bottom: 40px;
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #181818;
      margin-bottom: 16px;
    }
    
    .description-content {
      font-size: 16px;
      color: #333;
      line-height: 1.8;
      
      ::v-deep p {
        margin-bottom: 12px;
      }
    }
  }
  
  .order-actions {
    margin-top: 40px;
    
    .order-btn {
      width: 100%;
      max-width: 400px;
      height: 56px;
      background: #F9C13E;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: #e6b035;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(249, 193, 62, 0.3);
      }
    }
  }
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  
  .loading-text,
  .empty-text {
    font-size: 18px;
    color: #999;
  }
}

/* 响应式设计 */
@media (max-width: 968px) {
  .product-detail-container {
    flex-direction: column;
  }
  
  .product-image-section {
    flex: 1;
  }
  
  .product-info-section {
    .product-title {
      font-size: 24px;
    }
    
    .product-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 100px 0 60px;
  }
  
  .product-detail-container {
    padding: 0 16px;
  }
  
  .product-image-section {
    .product-main-image {
      border-radius: 8px;
    }
  }
  
  .product-info-section {
    .product-title {
      font-size: 20px;
    }
    
    .product-price-section .price-value {
      font-size: 24px;
    }
    
    .product-points-section .points-value {
      font-size: 20px;
    }
  }
}
</style>

