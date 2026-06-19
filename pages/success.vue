<template>
  <div class="success-page">
    <div class="success-card">
      <!-- 成功图标 -->
      <div class="success-icon-wrap">
        <svg class="success-icon" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#F0FDF4" stroke="#2DC15C" stroke-width="3"/>
          <path d="M24 40L35 51L56 30" stroke="#2DC15C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- 标题 -->
      <h1 class="success-title">{{ $t('applicationSubmitted') }}</h1>

      <!-- 申请编号 -->
      <div v-if="applicationId" class="success-app-id">
        {{ $t('applicationNumber') }}<span class="app-id-value">{{ applicationId }}</span>
      </div>

      <!-- 描述 -->
      <p class="success-desc">{{ $t('applicationReceivedDesc') }}</p>

      <!-- 申请摘要 -->
      <div v-if="formSummary" class="summary-card">
        <div class="summary-row">
          <span class="summary-label">{{ $t('name') }}</span>
          <span class="summary-value">{{ formSummary.uname }} {{ formSummary.last_name }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">{{ $t('city') }}</span>
          <span class="summary-value">{{ getCityName(formSummary.city_id) }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">{{ $t('vehicleType') }}</span>
          <span class="summary-value">{{ $t(getVehicleLabel(formSummary.vehicle_type)) }}</span>
        </div>
      </div>

      <!-- 两个按钮 -->
      <div class="success-actions">
        <button class="btn-primary" @click="openChat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
          </svg>
          {{ $t('openChat') }}
        </button>
        <button class="btn-secondary" @click="goHome">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ $t('backToHome') }}
        </button>
      </div>

      <!-- 提示 -->
      <p class="success-tip">{{ $t('chatIntroDesc') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'success-page',
  layout: 'default',
  data() {
    return {
      applicationId: '',
      formSummary: null
    };
  },
  mounted() {
    this.applicationId = sessionStorage.getItem('rider_application_id') || '';
    try {
      const summary = sessionStorage.getItem('rider_form_summary');
      this.formSummary = summary ? JSON.parse(summary) : null;
    } catch (e) {
      this.formSummary = null;
    }

    if (!this.applicationId && !this.formSummary) {
      window.location.href = '/';
    }
  },
  methods: {
    getCityName(cityId) {
      const lang = this.$i18n.locale;
      const cityNames = {
        1: { es: 'Valencia', zh: '瓦伦西亚', en: 'Valencia' },
        2: { es: 'Madrid', zh: '马德里', en: 'Madrid' },
        3: { es: 'Barcelona', zh: '巴塞罗那', en: 'Barcelona' },
        4: { es: 'Otra ciudad', zh: '其他城市', en: 'Other city' }
      };
      return cityNames[cityId]?.[lang] || cityId;
    },
    getVehicleLabel(type) {
      const MAP = { moto: 'moto', bici_electrica: 'biciElectrica', bici: 'bici', coche: 'coche' };
      return MAP[type] || type || '';
    },
        openChat() {
          if (!this.applicationId) {
            this.$message.error(this.$t('noApplicationId'));
            return;
          }
          window.open(`/chat?app_id=${encodeURIComponent(this.applicationId)}`, '_blank');
    },
    goHome() {
      window.location.href = '/';
    }
  }
};
</script>

<style lang="scss" scoped>
.success-page {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff 0%, #FFF5D8 52%, #FFE7A0 100%);
  padding: 40px 20px;
}

.success-card {
  background: #FFFFFF;
  border-radius: 28px;
  padding: 60px 48px;
  max-width: 540px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  border: 1.5px solid #F0E8C0;
}

.success-icon-wrap {
  margin-bottom: 28px;
}

.success-icon {
  width: 80px;
  height: 80px;
}

.success-title {
  font-size: 32px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.success-app-id {
  font-size: 15px;
  color: #757575;
  margin-bottom: 16px;
}

.app-id-value {
  font-weight: 700;
  color: #FABE1D;
  margin-left: 6px;
  font-size: 16px;
}

.success-desc {
  font-size: 16px;
  color: #616161;
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

/* 摘要卡片 */
.summary-card {
  background: #FAFAFA;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 32px;
  text-align: left;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #EEEEEE;

  &:last-child {
    border-bottom: none;
  }
}

.summary-label {
  font-size: 13px;
  color: #9E9E9E;
  font-weight: 500;
}

.summary-value {
  font-size: 14px;
  color: #424242;
  font-weight: 600;
}

/* 按钮组 */
.success-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  background: #FABE1D;
  border: none;
  border-radius: 28px;
  font-size: 17px;
  font-weight: 700;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(250, 190, 29, 0.4);

  &:hover {
    background: #E5A60C;
    box-shadow: 0 6px 20px rgba(250, 190, 29, 0.5);
    transform: translateY(-1px);
  }
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  background: #FFFFFF;
  border: 2px solid #FABE1D;
  border-radius: 26px;
  font-size: 16px;
  font-weight: 600;
  color: #8A6A10;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background: #FFFBEB;
    border-color: #E5A60C;
  }
}

.success-tip {
  font-size: 13px;
  color: #9E9E9E;
  line-height: 1.6;
}

@media screen and (max-width: $phone-max-width) {
  .success-card {
    padding: 40px 24px;
  }

  .success-title {
    font-size: 26px;
  }
}
</style>
