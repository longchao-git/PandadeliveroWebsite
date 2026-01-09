<template>
  <div class="my-addresses">
    <div class="addresses-header">
      <h1 class="page-title">{{ $t('myAddresses') }}</h1>
      <button class="add-btn" @click="showAddDialog = true">
        <span>+</span> {{ $t('addAddress') }}
      </button>
    </div>

    <div class="addresses-list" v-if="addresses.length > 0">
      <div 
        v-for="address in addresses" 
        :key="address.id" 
        class="address-card"
        :class="{ 'default': address.is_default === 1 }"
      >
        <div class="address-content">
          <div class="address-header">
            <div class="address-info">
              <span class="contact-name">{{ address.contact }}</span>
              <span class="contact-phone">{{ address.mobile }}</span>
              <span v-if="address.is_default === 1" class="default-badge">{{ $t('defaultAddress') }}</span>
            </div>
            <div class="address-actions">
              <button 
                v-if="address.is_default !== 1" 
                class="action-btn default-btn" 
                @click="setDefaultAddress(address.id)"
              >
                {{ $t('setDefault') }}
              </button>
              <button class="action-btn delete-btn" @click="deleteAddress(address.id)">{{ $t('delete') }}</button>
            </div>
          </div>
          <div class="address-details">
            <div class="address-text">
              {{ address.addr }}{{ address.house ? '，' + address.house : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">📍</div>
      <div class="empty-text">{{ $t('myAddresses') }}</div>
      <button class="add-btn" @click="showAddDialog = true">
        <span>+</span> {{ $t('addAddress') }}
      </button>
    </div>

    <!-- 添加地址弹窗 -->
    <add-addr 
      v-if="showAddDialog" 
      :type="4"
      @handleCloseLoginDialog="handleCloseDialog"
    />
  </div>
</template>

<script>
import AddAddr from '@/components/popupWindow/addAddr'

export default {
  name: 'MyAddresses',
  components: {
    AddAddr
  },
  data() {
    return {
      addresses: [],
      showAddDialog: false,
      loading: false
    }
  },
  async mounted() {
    await this.fetchAddresses()
  },
  methods: {
    /* 获取地址列表 */
    async fetchAddresses() {
      this.loading = true
      try {
        const res = await this.$axios.post('/client/member/addr/index', {
          page: 1,
          type: 0
        })
        this.addresses = res.list || []
      } catch (e) {
        this.$message.error(e.msg || 'Load addresses error')
      } finally {
        this.loading = false
      }
    },
    /* 设为默认地址 */
    async setDefaultAddress(addressId) {
      try {
        await this.$axios.post('/client/member/addr/setDefault', {
          id: addressId
        })
        this.$message.success(this.$t('saveSuccess'))
        await this.fetchAddresses()
      } catch (e) {
        this.$message.error(e.msg || 'Set default error')
      }
    },
    /* 删除地址 */
    async deleteAddress(addressId) {
      try {
        await this.$confirm(this.$t('confirm') + ' ' + this.$t('delete') + '?', this.$t('prompt'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        })
        await this.$axios.post('/client/member/addr/delete', {
          id: addressId
        })
        this.$message.success(this.$t('delete') + ' ' + this.$t('saveSuccess'))
        await this.fetchAddresses()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.msg || 'Delete error')
        }
      }
    },
    /* 关闭弹窗 */
    handleCloseDialog(value) {
      this.showAddDialog = false
      if (value === -2) {
        // 保存成功，刷新列表
        this.fetchAddresses()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.my-addresses {
  background: #fff;
  min-height: 100vh;
  padding: 120px 300px 80px;
}

.addresses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f5f5f5;

  .page-title {
    font-size: 32px;
    font-weight: 600;
    color: #181818;
    margin: 0;
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #f9c13e;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    span {
      font-size: 20px;
      font-weight: bold;
    }

    &:hover {
      background: #e6b035;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249, 193, 62, 0.3);
    }
  }
}

.addresses-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.address-card {
  background: #fff;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #f9c13e;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &.default {
    border-color: #f9c13e;
    background: #fffdf5;
  }

  .address-content {
    .address-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .address-info {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        .contact-name {
          font-size: 18px;
          font-weight: 600;
          color: #181818;
        }

        .contact-phone {
          font-size: 16px;
          color: #666;
        }

        .default-badge {
          padding: 4px 12px;
          background: #f9c13e;
          color: #fff;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
      }

      .address-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .action-btn {
          padding: 6px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;

          &.default-btn {
            color: #f9c13e;
            border-color: #f9c13e;
            &:hover {
              background: #f9c13e;
              color: #fff;
            }
          }

          &.delete-btn {
            color: #f44336;
            border-color: #f44336;
            &:hover {
              background: #f44336;
              color: #fff;
            }
          }
        }
      }
    }

    .address-details {
      .address-text {
        font-size: 16px;
        color: #333;
        line-height: 1.6;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;

  .empty-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  .empty-text {
    font-size: 18px;
    color: #999;
    margin-bottom: 32px;
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #f9c13e;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    span {
      font-size: 20px;
      font-weight: bold;
    }

    &:hover {
      background: #e6b035;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249, 193, 62, 0.3);
    }
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .my-addresses {
    padding: 120px 100px 80px;
  }
}

@media (max-width: 768px) {
  .my-addresses {
    padding: 100px 20px 60px;
  }

  .addresses-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;

    .page-title {
      font-size: 24px;
    }
  }

  .address-card {
    .address-content {
      .address-header {
        flex-direction: column;
        gap: 16px;

        .address-actions {
          width: 100%;
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>

