<template>
  <div class="rider-page">
    <!-- 顶部 Hero 区域 -->
    <div class="rider-hero">
      <div class="rider-hero-inner">
        <div class="rider-hero-left">
          <div class="rider-hero-eyebrow">{{ $t('riderEyebrow') }}</div>
          <h1 class="rider-hero-title">{{ $t('riderPageTitle') }}</h1>
          <p class="rider-hero-sub">{{ $t('riderPageSubtitle') }}</p>
          <div class="rider-hero-badges">
            <span class="rider-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FABE1D"/></svg>
              {{ $t('noExclusivity') }}
            </span>
            <span class="rider-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#2DC15C"/></svg>
              {{ $t('qualityPriority') }}
            </span>
          </div>
        </div>
        <div class="rider-hero-right">
          <img src="@/assets/images/creaTionIcon.png" alt="" class="rider-hero-img" />
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="rider-content">
      <div class="rider-content-inner">

        <!-- 左侧：表单 -->
        <div class="rider-form-section">
          <div class="rider-form-card">
            <div class="rider-form-header">
              <h2 class="rider-form-title">{{ $t('applicationForm') }}</h2>
              <p class="rider-form-sub">{{ $t('fillOutFormBelowToStart') }}</p>
            </div>

            <el-form
              ref="riderForm"
              :model="form"
              :rules="rules"
              class="rider-form"
              @submit.native.prevent
            >
              <!-- 名字 + 姓氏 -->
              <div class="form-row">
                <el-form-item :label="$t('firstName')" prop="uname" class="form-item-half">
                  <el-input
                    v-model="form.uname"
                    :placeholder="$t('pleaseEnterFirstName')"
                    class="rider-input"
                  />
                </el-form-item>
                <el-form-item :label="$t('lastName')" prop="last_name" class="form-item-half">
                  <el-input
                    v-model="form.last_name"
                    :placeholder="$t('pleaseEnterLastName')"
                    class="rider-input"
                  />
                </el-form-item>
              </div>

              <!-- 联系方式 + 城市 -->
              <div class="form-row">
                <el-form-item :label="$t('contactType')" prop="contact_type" class="form-item-half">
                  <el-select
                    v-model="form.contact_type"
                    :placeholder="$t('selectContactType')"
                    class="rider-select"
                  >
                    <el-option :label="$t('whatsapp')" value="whatsapp" />
                    <el-option :label="$t('smsShort')" value="sms" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('city')" prop="city_id" class="form-item-half">
                  <el-select
                    v-model="form.city_id"
                    :placeholder="$t('pleaseSelect')"
                    class="rider-select"
                    @change="handleCityChange"
                  >
                    <el-option :label="$t('valencia')" :value="1" />
                    <el-option :label="$t('madrid')" :value="2" />
                    <el-option :label="$t('barcelona')" :value="3" />
                    <el-option :label="$t('otherCity')" :value="4" />
                  </el-select>
                </el-form-item>
              </div>

              <!-- 其他城市输入（条件显示） -->
              <el-form-item
                v-if="form.city_id === 4"
                :label="$t('otherCity')"
                prop="city_other"
                class="form-item-full"
              >
                <el-input
                  v-model="form.city_other"
                  :placeholder="$t('pleaseEnterOtherCity')"
                  class="rider-input"
                />
              </el-form-item>

              <!-- 手机号 -->
              <el-form-item :label="$t('mobileNumber')" prop="mobile" class="form-item-full">
                <el-input
                  v-model="form.mobile"
                  type="text"
                  :placeholder="$t('pleaseEnterPhoneNumberPrefix')"
                  class="rider-input"
                />
              </el-form-item>

              <!-- 车辆类型 -->
              <el-form-item :label="$t('vehicleType')" prop="vehicle_type" class="form-item-full">
                <div class="vehicle-chips">
                  <span
                    v-for="v in vehicleTypes"
                    :key="v.value"
                    class="vehicle-chip"
                    :class="{ active: form.vehicle_type === v.value }"
                    @click="form.vehicle_type = v.value"
                  >
                    {{ $t(v.labelKey) }}
                  </span>
                </div>
              </el-form-item>

              <!-- 自雇状态 -->
              <el-form-item :label="$t('autonomoStatus')" prop="is_autonomo" class="form-item-full">
                <div class="autonomo-chips">
                  <span
                    v-for="a in autonomoOptions"
                    :key="a.value"
                    class="autonomo-chip"
                    :class="{ active: form.is_autonomo === a.value }"
                    @click="form.is_autonomo = a.value"
                  >
                    {{ $t(a.labelKey) }}
                  </span>
                </div>
              </el-form-item>

              <!-- 可服务时段 -->
              <el-form-item :label="$t('availability')" prop="availability" class="form-item-full">
                <div class="availability-chips">
                  <span
                    v-for="av in availabilityOptions"
                    :key="av.value"
                    class="availability-chip"
                    :class="{ active: form.availability.includes(av.value) }"
                    @click="toggleAvailability(av.value)"
                  >
                    {{ $t(av.labelKey) }}
                  </span>
                </div>
              </el-form-item>

              <!-- 推荐人 -->
              <el-form-item :label="$t('recommendedBy') + ' (' + $t('optional') + ')'" class="form-item-full">
                <el-input
                  v-model="form.share_code"
                  :placeholder="$t('pleaseEnterInvitationCode')"
                  class="rider-input"
                />
              </el-form-item>

              <!-- 备注 -->
              <el-form-item :label="$t('comments') + ' (' + $t('optional') + ')'" class="form-item-full">
                <el-input
                  v-model="form.comments"
                  type="textarea"
                  :rows="3"
                  :placeholder="$t('commentsPlaceholder')"
                  class="rider-textarea"
                />
              </el-form-item>

              <!-- 隐私协议 -->
              <div class="privacy-row">
                <el-checkbox v-model="form.privacy_agreed">
                  <span class="privacy-text">{{ $t('privacyAgreement') }}</span>
                </el-checkbox>
              </div>

              <!-- 法律提示 -->
              <p class="legal-notice">{{ $t('legalNotice') }}</p>

              <!-- 提交按钮 -->
              <el-button
                :loading="submitting"
                class="rider-submit-btn"
                @click="handleSubmit"
              >
                {{ submitting ? $t('sending') : $t('sendApplication') }}
              </el-button>
            </el-form>
          </div>
        </div>

        <!-- 右侧：说明卡片 -->
        <div class="rider-info-section">
          <!-- 为什么选择我们 -->
          <div class="info-card">
            <h3 class="info-card-title">{{ $t('whyCollaborateTitle') }}</h3>
            <ul class="info-list">
              <li>
                <span class="info-icon">1</span>
                <div>
                  <strong>{{ $t('flexibility') }}</strong>
                </div>
              </li>
              <li>
                <span class="info-icon">2</span>
                <div>
                  <strong>{{ $t('noExclusivity') }}</strong>
                </div>
              </li>
              <li>
                <span class="info-icon">3</span>
                <div>
                  <strong>{{ $t('highDemandHours') }}</strong>
                </div>
              </li>
              <li>
                <span class="info-icon">4</span>
                <div>
                  <strong>{{ $t('qualityPriority') }}</strong>
                </div>
              </li>
            </ul>
          </div>

          <!-- 申请流程 -->
          <div class="info-card">
            <h3 class="info-card-title">{{ $t('applyNow') }}</h3>
            <div class="steps">
              <div class="step-item" v-for="(step, idx) in steps" :key="idx">
                <div class="step-num">{{ idx + 1 }}</div>
                <div class="step-text">{{ step }}</div>
              </div>
            </div>
          </div>

          <!-- 全页底部法律声明 -->
          <div class="rider-legal-notice">
            <strong>{{ $t('importantLegalNotice') }}</strong>
            <p>{{ $t('riderLegalText') }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rider-page',
  layout: 'default',
  data() {
    const validateAvailability = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error(this.$t('selectAvailability')));
      } else {
        callback();
      }
    };
    const validatePrivacy = (rule, value, callback) => {
      if (!this.form.privacy_agreed) {
        callback(new Error(this.$t('pleaseReadAndUnderstandPrivacyPolicy')));
      } else {
        callback();
      }
    };
    return {
      submitting: false,
      form: {
        uname: '',
        last_name: '',
        mobile: '',
        contact_type: '',
        city_id: '',
        city_other: '',
        vehicle_type: '',
        is_autonomo: null,
        availability: [],
        share_code: '',
        comments: '',
        privacy_agreed: false
      },
      rules: {
        uname: [
          { required: true, message: '', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: '', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '', trigger: 'blur' },
          { pattern: /^[0-9]{6,12}$/, message: '', trigger: 'blur' }
        ],
        contact_type: [
          { required: true, message: '', trigger: 'change' }
        ],
        city_id: [
          { required: true, message: '', trigger: 'change' }
        ],
        vehicle_type: [
          { required: true, message: '', trigger: 'change' }
        ],
        is_autonomo: [
          { required: true, message: '', trigger: 'change' }
        ],
        availability: [
          { required: true, validator: validateAvailability, trigger: 'change' }
        ],
        privacy_agreed: [
          { required: true, validator: validatePrivacy, trigger: 'change' }
        ]
      },
      vehicleTypes: [
        { value: 'moto', labelKey: 'moto' },
        { value: 'bici_electrica', labelKey: 'biciElectrica' },
        { value: 'bici', labelKey: 'bici' },
        { value: 'coche', labelKey: 'coche' }
      ],
      autonomoOptions: [
        { value: 1, labelKey: 'autonomoYes' },
        { value: 0, labelKey: 'autonomoNo' },
        { value: 2, labelKey: 'autonomoInProcess' }
      ],
      availabilityOptions: [
        { value: 'comidas', labelKey: 'comidas' },
        { value: 'cenas', labelKey: 'cenas' },
        { value: 'fines_semana', labelKey: 'finesSemana' },
        { value: 'lluvia', labelKey: 'lluvia' }
      ]
    };
  },
  created() {
    this.rules.uname[0].message = this.$t('pleaseEnterFirstName');
    this.rules.last_name[0].message = this.$t('pleaseEnterLastName');
    this.rules.mobile[0].message = this.$t('pleaseEnterPhoneNumber');
    this.rules.mobile[1].message = this.$t('invalidPhoneNumber');
    this.rules.contact_type[0].message = this.$t('selectContactType');
    this.rules.city_id[0].message = this.$t('pleaseSelect');
    this.rules.vehicle_type[0].message = this.$t('selectVehicleType');
    this.rules.is_autonomo[0].message = this.$t('selectAutonomoStatus');
  },
  computed: {
    steps() {
      return [
        this.$t('step1'),
        this.$t('step2'),
        this.$t('step3'),
        this.$t('step4')
      ];
    }
  },
  methods: {
    handleCityChange(val) {
      if (val !== 4) {
        this.form.city_other = '';
      }
    },
    toggleAvailability(val) {
      const idx = this.form.availability.indexOf(val);
      if (idx > -1) {
        this.form.availability.splice(idx, 1);
      } else {
        this.form.availability.push(val);
      }
    },
    unwrapRegisterResponse(res) {
      if (!res) return {};
      if (res.application_id || res.staff_id || res.app_id || res.id) {
        return res;
      }
      if (res.data && typeof res.data === 'object') {
        if (res.data.application_id || res.data.staff_id || res.data.app_id || res.data.id) {
          return res.data;
        }
        if (res.data.data && typeof res.data.data === 'object') {
          return res.data.data;
        }
      }
      return res;
    },
    handleSubmit() {
      this.$refs.riderForm.validate(async (valid) => {
        if (!valid) return;
        if (!this.form.privacy_agreed) {
          this.$message.error(this.$t('pleaseReadAndUnderstandPrivacyPolicy'));
          return;
        }

        this.submitting = true;
        try {
          const params = {
            uname: this.form.uname,
            last_name: this.form.last_name,
            mobile: this.form.mobile,
            contact_type: this.form.contact_type,
            city_id: this.form.city_id,
            vehicle_type: this.form.vehicle_type,
            is_autonomo: this.form.is_autonomo,
            availability: this.form.availability.join(','),
            share_code: this.form.share_code || '',
            comments: this.form.comments || ''
          };
          if (this.form.city_id === 4 && this.form.city_other) {
            params.city_other = this.form.city_other;
          }

          const res = await this.$axios.post('/staff/entry/register', params);
          const resData = this.unwrapRegisterResponse(res);
          const appId = String(
            resData.application_id || resData.staff_id || resData.app_id || resData.id || ''
          ).trim();

          if (!appId) {
            this.$message.error(this.$t('applicationFailed'));
            return;
          }

          sessionStorage.setItem('rider_application_id', appId);
          sessionStorage.setItem('rider_form_summary', JSON.stringify({
            uname: this.form.uname,
            last_name: this.form.last_name,
            mobile: this.form.mobile,
            city_id: this.form.city_id,
            vehicle_type: this.form.vehicle_type,
            created_at: resData.created_at || new Date().toLocaleString()
          }));

          await this.$router.push({ path: '/success', query: { app_id: appId } });
        } catch (err) {
          this.$message.error(err.message || this.$t('applicationFailed'));
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.rider-page {
  min-height: 100vh;
  background: #fff;
}

/* Hero 区域 */
.rider-hero {
  background: linear-gradient(135deg, #FFF8E2 0%, #FEF3C7 50%, #FDE68A 100%);
  padding: 60px 0 60px;
  border-bottom: 1px solid #F3E8C0;
}

.rider-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.rider-hero-left {
  flex: 1;
  max-width: 560px;
}

.rider-hero-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #8A6A10;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding: 6px 14px;
  background: rgba(250, 190, 29, 0.15);
  border-radius: 20px;
}

.rider-hero-title {
  font-size: 42px;
  font-weight: 700;
  color: #1A1A1A;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.rider-hero-sub {
  font-size: 18px;
  color: #6B5B3E;
  line-height: 1.6;
  margin-bottom: 24px;
}

.rider-hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.rider-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.8);
  border: 1px solid #E8D48A;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  color: #5A4520;
}

.rider-hero-right {
  flex-shrink: 0;
}

.rider-hero-img {
  width: 420px;
  height: 300px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}

/* 主体内容 */
.rider-content {
  padding: 60px 0 100px;
}

.rider-content-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  align-items: start;
}

/* 表单卡片 */
.rider-form-card {
  background: #FFFFFF;
  border: 2px solid #F5E6B8;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.rider-form-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F0E6CC;
}

.rider-form-title {
  font-size: 26px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.rider-form-sub {
  font-size: 14px;
  color: #8A7A5A;
}

.rider-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-item-half {
    width: 100%;
  }

  .form-item-full {
    width: 100%;
    margin-bottom: 20px;
  }

  .rider-input {
    width: 100%;

    ::v-deep .el-input__inner {
      height: 48px;
      border-radius: 12px;
      border: 1.5px solid #E0D8C0;
      font-size: 15px;
      color: #333;
      padding: 0 16px;
      transition: border-color 0.2s;

      &:focus {
        border-color: #FABE1D;
      }
    }
  }

  .rider-select {
    width: 100%;

    ::v-deep .el-input__inner {
      height: 48px;
      border-radius: 12px;
      border: 1.5px solid #E0D8C0;
      font-size: 15px;
      color: #333;
      padding: 0 16px;
    }
  }
}

/* 车辆类型 Chips */
.vehicle-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: 16px;
}

.vehicle-chip {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1.5px solid #E0D8C0;
  background: #FAFAFA;
  font-size: 14px;
  color: #5A5A5A;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    border-color: #FABE1D;
    color: #8A6A10;
  }

  &.active {
    border-color: #FABE1D;
    background: #FFFBEB;
    color: #8A6A10;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(250, 190, 29, 0.3);
  }
}

/* 自雇状态 Chips */
.autonomo-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: 16px;
}

.autonomo-chip {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1.5px solid #E0D8C0;
  background: #FAFAFA;
  font-size: 14px;
  color: #5A5A5A;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    border-color: #FABE1D;
    color: #8A6A10;
  }

  &.active {
    border-color: #FABE1D;
    background: #FFFBEB;
    color: #8A6A10;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(250, 190, 29, 0.3);
  }
}

/* 可服务时段 Chips */
.availability-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: 16px;
}

.availability-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border-radius: 20px;
  border: 1.5px solid #E0D8C0;
  background: #FAFAFA;
  font-size: 13px;
  color: #5A5A5A;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    border-color: #2DC15C;
    color: #1A8A40;
  }

  &.active {
    border-color: #2DC15C;
    background: #F0FDF4;
    color: #1A8A40;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(45, 193, 92, 0.25);
  }
}

/* 隐私协议 */
.privacy-row {
  margin-bottom: 12px;

  ::v-deep .el-checkbox__label {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #FABE1D;
    border-color: #FABE1D;
  }
}

.privacy-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* 法律提示 */
.legal-notice {
  font-size: 11px;
  color: #9E9E9E;
  line-height: 1.6;
  margin-bottom: 24px;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 8px;
  border-left: 3px solid #E0E0E0;
}

/* 全页底部法律声明 */
.rider-legal-notice {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 24px;

  strong {
    font-size: 13px;
    color: #92400E;
    display: block;
    margin-bottom: 6px;
  }

  p {
    font-size: 12px;
    color: #78350F;
    line-height: 1.6;
  }
}

.rider-textarea {
  width: 100%;
  ::v-deep .el-textarea__inner {
    border-radius: 10px;
    border: 1.5px solid #FDE68A;
    font-size: 14px;
    color: #333;
    resize: none;
    &:focus { border-color: #FABE1D; }
  }
}

/* 提交按钮 */
.rider-submit-btn {
  width: 100%;
  height: 56px;
  background: #FABE1D;
  border: none;
  border-radius: 28px;
  font-size: 18px;
  font-weight: 700;
  color: #1f1b00;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(250, 190, 29, 0.4);

  &:hover {
    background: #E5A60C;
    box-shadow: 0 6px 20px rgba(250, 190, 29, 0.5);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

/* 右侧说明卡片 */
.rider-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: #FFFFFF;
  border: 1.5px solid #F0E8C8;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.info-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 2px solid #FABE1D;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 18px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.info-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #FFFBEB;
  border: 1.5px solid #FABE1D;
  color: #8A6A10;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 申请步骤 */
.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.step-num {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FABE1D;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-text {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

/* 表单项 label */
::v-deep .el-form-item__label {
  font-size: 14px;
  font-weight: 600;
  color: #3A3A3A;
  margin-bottom: 8px;
  padding: 0;
}

::v-deep .el-form-item {
  margin-bottom: 18px;
}

::v-deep .el-form-item__error {
  font-size: 12px;
  padding-top: 4px;
}

/* 响应式 */
@media screen and (max-width: $pad-max-width) {
  .rider-hero-inner {
    flex-direction: column;
    padding: 0 24px;
    text-align: center;
  }

  .rider-hero-left {
    max-width: 100%;
  }

  .rider-hero-badges {
    justify-content: center;
  }

  .rider-hero-img {
    width: 100%;
    max-width: 400px;
    height: auto;
  }

  .rider-content-inner {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }

  .rider-info-section {
    order: -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .rider-form-card {
    padding: 24px;
  }

  .rider-form .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media screen and (max-width: $pad-max-width) {
  .rider-hero {
    padding: 160px 0 40px;
  }
}

@media screen and (max-width: $phone-max-width) {
  .rider-hero {
    padding: 140px 0 40px;
  }

  .rider-hero-title {
    font-size: 28px;
  }

  .rider-hero-sub {
    font-size: 15px;
  }

  .rider-info-section {
    grid-template-columns: 1fr;
  }

  .vehicle-chip,
  .autonomo-chip {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
