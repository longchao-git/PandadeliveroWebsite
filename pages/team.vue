<template>
  <div class="team-page">
    <!-- Hero -->
    <div class="team-hero">
      <div class="team-hero-inner">
        <div class="rider-hero-left">
          <div class="rider-hero-eyebrow">{{ $t('teamEyebrow') }}</div>
          <h1 class="rider-hero-title">{{ $t('teamHeroTitle') }}</h1>
          <p class="rider-hero-sub">{{ $t('teamHeroDesc') }}</p>
        </div>
        <div class="rider-hero-right">
          <img src="@/assets/images/creaTionIcon.png" alt="" class="rider-hero-img" />
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="team-content">
      <div class="team-content-inner">

        <!-- 左侧：说明 -->
        <div class="team-info">
          <h2 class="info-section-title">{{ $t('teamTypesTitle') }}</h2>
          <p class="info-section-desc">{{ $t('teamTypesDesc') }}</p>

          <div class="team-info-cards">
            <div class="info-card">
              <h3 class="info-card-title">{{ $t('collaborationFormats') }}</h3>
              <ul class="info-list">
                <li>
                  <span class="info-icon">1</span>
                  <span>{{ $t('byCity') }}</span>
                </li>
                <li>
                  <span class="info-icon">2</span>
                  <span>{{ $t('byZone') }}</span>
                </li>
                <li>
                  <span class="info-icon">3</span>
                  <span>{{ $t('byTimeSlot') }}</span>
                </li>
                <li>
                  <span class="info-icon">4</span>
                  <span>{{ $t('peakDemand') }}</span>
                </li>
                <li>
                  <span class="info-icon">5</span>
                  <span>{{ $t('newCityLaunch') }}</span>
                </li>
              </ul>
            </div>
            <div class="info-card">
              <h3 class="info-card-title">{{ $t('basicRequirements') }}</h3>
              <ul class="info-list">
                <li>
                  <span class="info-icon">1</span>
                  <span>{{ $t('internalOrganization') }}</span>
                </li>
                <li>
                  <span class="info-icon">2</span>
                  <span>{{ $t('fastCommunication') }}</span>
                </li>
                <li>
                  <span class="info-icon">3</span>
                  <span>{{ $t('suitableVehicles') }}</span>
                </li>
                <li>
                  <span class="info-icon">4</span>
                  <span>{{ $t('regulatoryCompliance') }}</span>
                </li>
                <li>
                  <span class="info-icon">5</span>
                  <span>{{ $t('incidentManagement') }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="team-legal-notice">
            <strong>{{ $t('importantNotice') }}</strong>
            <p>{{ $t('teamLegalText') }}</p>
          </div>
        </div>

        <!-- 右侧：表单 -->
        <div class="team-form-section">
          <div class="team-form-card">
            <h2 class="form-title">{{ $t('teamApplicationForm') }}</h2>
            <p class="form-sub">{{ $t('teamApplicationSub') }}</p>

            <el-form ref="teamForm" :model="form" :rules="rules" @submit.native.prevent>
              <el-form-item :label="$t('responsibleName')" prop="uname">
                <el-input v-model="form.uname" :placeholder="$t('pleaseInput')" class="team-input" />
              </el-form-item>

              <el-form-item :label="$t('teamName')" prop="team_name">
                <el-input v-model="form.team_name" :placeholder="$t('pleaseInput')" class="team-input" />
              </el-form-item>

              <div class="form-row">
                <el-form-item :label="$t('phoneWhatsapp')" prop="mobile" class="form-item-half">
                  <el-input v-model="form.mobile" type="text" :placeholder="$t('pleaseInput')" class="team-input" />
                </el-form-item>
                <el-form-item :label="$t('email')" prop="email" class="form-item-half">
                  <el-input v-model="form.email" type="email" :placeholder="$t('pleaseInput')" class="team-input" />
                </el-form-item>
              </div>

              <el-form-item :label="$t('mainCity')" prop="city_id">
                <el-select v-model="form.city_id" :placeholder="$t('pleaseSelect')" class="team-select">
                  <el-option :label="$t('madrid')" :value="2" />
                  <el-option :label="$t('barcelona')" :value="3" />
                  <el-option :label="$t('valencia')" :value="1" />
                  <el-option :label="$t('otherCity')" :value="4" />
                </el-select>
              </el-form-item>

              <el-form-item v-if="form.city_id === 4" :label="$t('otherCity')" prop="city_other">
                <el-input v-model="form.city_other" :placeholder="$t('pleaseEnterOtherCity')" class="team-input" />
              </el-form-item>

              <el-form-item :label="$t('riderCount')" prop="rider_count">
                <el-select v-model="form.rider_count" :placeholder="$t('pleaseSelect')" class="team-select">
                  <el-option :label="$t('count1to3')" :value="1" />
                  <el-option :label="$t('count4to8')" :value="2" />
                  <el-option :label="$t('count9to15')" :value="3" />
                  <el-option :label="$t('count15plus')" :value="4" />
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('canInvoice')" prop="can_invoice">
                <div class="invoice-chips">
                  <span
                    v-for="opt in invoiceOptions"
                    :key="opt.value"
                    class="invoice-chip"
                    :class="{ active: form.can_invoice === opt.value }"
                    @click="form.can_invoice = opt.value"
                  >
                    {{ $t(opt.labelKey) }}
                  </span>
                </div>
              </el-form-item>

              <el-form-item :label="$t('availability')" prop="availability">
                <div class="avail-chips">
                  <span
                    v-for="av in availOptions"
                    :key="av.value"
                    class="avail-chip"
                    :class="{ active: form.availability.includes(av.value) }"
                    @click="toggleAvail(av.value)"
                  >
                    {{ $t(av.labelKey) }}
                  </span>
                </div>
              </el-form-item>

              <el-form-item :label="$t('comments') + ' (' + $t('optional') + ')'">
                <el-input
                  v-model="form.comments"
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('teamCommentsPlaceholder')"
                  class="team-textarea"
                />
              </el-form-item>

              <div class="privacy-row">
                <el-checkbox v-model="form.privacy_agreed">
                  <span class="privacy-text">{{ $t('teamPrivacyText') }}</span>
                </el-checkbox>
              </div>

              <el-button
                :loading="submitting"
                class="team-submit-btn"
                @click="handleSubmit"
              >
                {{ submitting ? $t('sending') : $t('sendTeamApplication') }}
              </el-button>
            </el-form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'team-page',
  layout: 'default',
  data() {
    return {
      submitting: false,
      form: {
        uname: '',
        team_name: '',
        mobile: '',
        email: '',
        city_id: '',
        city_other: '',
        rider_count: null,
        can_invoice: null,
        availability: [],
        comments: '',
        privacy_agreed: false
      },
      rules: {
        uname: [{ required: true, message: this.$t('pleaseInput'), trigger: 'blur' }],
        team_name: [{ required: true, message: this.$t('pleaseInput'), trigger: 'blur' }],
        mobile: [{ required: true, message: this.$t('pleaseInput'), trigger: 'blur' }],
        email: [
          { required: true, message: this.$t('pleaseInput'), trigger: 'blur' },
          { type: 'email', message: this.$t('invalidEmail'), trigger: 'blur' }
        ],
        city_id: [{ required: true, message: this.$t('pleaseSelect'), trigger: 'change' }],
        rider_count: [{ required: true, message: this.$t('pleaseSelect'), trigger: 'change' }],
        can_invoice: [{ required: true, message: this.$t('pleaseSelect'), trigger: 'change' }],
        availability: [{ required: true, message: this.$t('selectAvailability'), trigger: 'change' }]
      },
      invoiceOptions: [
        { value: 'yes', labelKey: 'yes' },
        { value: 'no', labelKey: 'no' },
        { value: 'depends', labelKey: 'dependsOnAgreement' }
      ],
      availOptions: [
        { value: 'comidas', labelKey: 'comidas' },
        { value: 'cenas', labelKey: 'cenas' },
        { value: 'fines_semana', labelKey: 'finesSemana' },
        { value: 'lluvia', labelKey: 'lluvia' },
        { value: 'eventos', labelKey: 'events' }
      ]
    };
  },
  methods: {
    toggleAvail(val) {
      const idx = this.form.availability.indexOf(val);
      if (idx > -1) this.form.availability.splice(idx, 1);
      else this.form.availability.push(val);
    },
    handleSubmit() {
      this.$refs.teamForm.validate(async (valid) => {
        if (!valid) return;
        if (!this.form.privacy_agreed) {
          this.$message.error(this.$t('pleaseReadAndUnderstandPrivacyPolicy'));
          return;
        }
        this.submitting = true;
        try {
          const params = {
            uname: this.form.uname,
            team_name: this.form.team_name,
            mobile: this.form.mobile,
            email: this.form.email,
            city_id: this.form.city_id,
            rider_count: this.form.rider_count,
            can_invoice: this.form.can_invoice,
            availability: this.form.availability.join(','),
            comments: this.form.comments || ''
          };
          if (this.form.city_id === 4 && this.form.city_other) {
            params.city_other = this.form.city_other;
          }
          await this.$axios.post('/staff/team/register', params);
          this.$message.success(this.$t('submittedSuccessfullyDataUnderReview'));
          this.$refs.teamForm.resetFields();
          this.form.availability = [];
          this.form.privacy_agreed = false;
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
.team-page {
  min-height: 100vh;
  background: #fff;
}

.team-hero {
  background: linear-gradient(135deg, #FFF8E2 0%, #FEF3C7 50%, #FDE68A 100%);
  padding: 60px 0 60px;
  border-bottom: 1px solid #F3E8C0;
}

.team-hero-inner {
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

.rider-hero-right {
  flex-shrink: 0;
}

.rider-hero-img {
  width:600px;
  height: 300px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}

.team-content {
  padding: 60px 0 100px;
}

.team-content-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 650px;
  gap: 48px;
  align-items: start;
}

.info-section-title {
  font-size: 26px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.info-section-desc {
  font-size: 14px;
  color: #8A7A5A;
  line-height: 1.7;
  margin-bottom: 28px;
}

.team-info-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.info-card {
  background: #FFFFFF;
  border: 1.5px solid #F0E8C8;
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.info-card-title {
  font-size: 17px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 2px solid #FABE1D;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #555;
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

.team-legal-notice {
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

.team-form-card {
  background: #FFFFFF;
  border: 2px solid #F5E6B8;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.form-sub {
  font-size: 14px;
  color: #8A7A5A;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F0E6CC;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-item-half {
  width: 100%;
}

.team-input,
.team-select {
  width: 100%;

  ::v-deep .el-input__inner {
    height: 54px;
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

.team-textarea ::v-deep .el-textarea__inner {
  border-radius: 12px;
  border: 1.5px solid #E0D8C0;
  font-size: 14px;
  color: #333;
  resize: none;

  &:focus { border-color: #FABE1D; }
}

.invoice-chips,
.avail-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: 16px;
}

.invoice-chip,
.avail-chip {
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

  &:hover { border-color: #FABE1D; color: #8A6A10; }

  &.active {
    border-color: #FABE1D;
    background: #FFFBEB;
    color: #8A6A10;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(250, 190, 29, 0.3);
  }
}

.privacy-row {
  margin-bottom: 12px;

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #FABE1D;
    border-color: #FABE1D;
  }

  ::v-deep .el-checkbox__label {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }
}

.privacy-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.team-submit-btn {
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

@media screen and (max-width: $pad-max-width) {
  .team-content-inner {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }

  .team-hero-inner {
    flex-direction: column;
    padding: 0 24px;
    text-align: center;
  }

  .rider-hero-left {
    max-width: 100%;
  }

  .rider-hero-img {
    width: 100%;
    max-width: 400px;
    height: auto;
  }

  .rider-hero-sub {
    max-width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .team-form-card {
    padding: 24px;
  }

  .team-hero {
    padding: 160px 0 40px;
  }
}

@media screen and (max-width: $phone-max-width) {
  .team-hero {
    padding: 140px 0 40px;
  }

  .rider-hero-title {
    font-size: 28px;
  }

  .rider-hero-sub {
    font-size: 15px;
  }

  .invoice-chip,
  .avail-chip {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
