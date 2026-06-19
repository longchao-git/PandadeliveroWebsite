<template>
  <div class="team-page">
    <!-- Hero -->
    <div class="team-hero">
      <div class="team-hero-inner">
        <div class="hero-eyebrow">{{ $t('teamEyebrow') }}</div>
        <h1 class="hero-title">{{ $t('teamHeroTitle') }}</h1>
        <p class="hero-desc">{{ $t('teamHeroDesc') }}</p>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="team-content">
      <div class="team-content-inner">

        <!-- 左侧：说明 -->
        <div class="team-info">
          <h2 class="info-section-title">{{ $t('teamTypesTitle') }}</h2>
          <p class="info-section-desc">{{ $t('teamTypesDesc') }}</p>

          <div class="info-cards">
            <div class="info-mini-card">
              <h4>{{ $t('collaborationFormats') }}</h4>
              <ul>
                <li>{{ $t('byCity') }}</li>
                <li>{{ $t('byZone') }}</li>
                <li>{{ $t('byTimeSlot') }}</li>
                <li>{{ $t('peakDemand') }}</li>
                <li>{{ $t('newCityLaunch') }}</li>
              </ul>
            </div>
            <div class="info-mini-card">
              <h4>{{ $t('basicRequirements') }}</h4>
              <ul>
                <li>{{ $t('internalOrganization') }}</li>
                <li>{{ $t('fastCommunication') }}</li>
                <li>{{ $t('suitableVehicles') }}</li>
                <li>{{ $t('regulatoryCompliance') }}</li>
                <li>{{ $t('incidentManagement') }}</li>
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
                  :rows="3"
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
  background: #FAFAFA;
}

.team-hero {
  background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
  border-bottom: 1px solid #BBF7D0;
  padding: 60px 0;
}

.team-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.hero-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #166534;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding: 6px 14px;
  background: rgba(244, 181, 30, 0.1);
  border-radius: 20px;
}

.hero-title {
  font-size: 38px;
  font-weight: 800;
  color: #1A1A1A;
  margin-bottom: 14px;
  letter-spacing: -0.5px;
}

.hero-desc {
  font-size: 17px;
  color: #166534;
  line-height: 1.7;
  max-width: 620px;
}

.team-content {
  padding: 60px 0 100px;
}

.team-content-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 480px;
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
  font-size: 15px;
  color: #616161;
  line-height: 1.7;
  margin-bottom: 28px;
}

.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.info-mini-card {
  background: #FFFFFF;
  border: 1px solid #D1FAE5;
  border-radius: 16px;
  padding: 20px;

  h4 {
    font-size: 15px;
    font-weight: 700;
    color: #166534;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #BBF7D0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 13px;
      color: #374151;
      padding: 5px 0;
      border-bottom: 1px solid #F0FDF4;

      &:last-child { border-bottom: none; }

      &::before {
        content: '·';
        color: #2DC15C;
        font-weight: 700;
        margin-right: 6px;
      }
    }
  }
}

.team-legal-notice {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 12px;
  padding: 16px 20px;

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
  border: 2px solid #BBF7D0;
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.form-sub {
  font-size: 13px;
  color: #9E9E9E;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #F0FDF4;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-item-half {
  width: 100%;
}

.team-input,
.team-select {
  width: 100%;

  ::v-deep .el-input__inner {
    height: 46px;
    border-radius: 10px;
    border: 1.5px solid #D1FAE5;
    font-size: 14px;
    color: #333;

    &:focus {
      border-color: #2DC15C;
    }
  }
}

.team-textarea ::v-deep .el-textarea__inner {
  border-radius: 10px;
  border: 1.5px solid #D1FAE5;
  font-size: 14px;
  color: #333;
  resize: none;

  &:focus { border-color: #2DC15C; }
}

.invoice-chips,
.avail-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.invoice-chip,
.avail-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid #D1FAE5;
  background: #FAFAFA;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover { border-color: #2DC15C; color: #166534; }

  &.active {
    border-color: #2DC15C;
    background: #F0FDF4;
    color: #166534;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(45, 193, 92, 0.25);
  }
}

.privacy-row {
  margin-bottom: 20px;

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #2DC15C;
    border-color: #2DC15C;
  }

  ::v-deep .el-checkbox__label {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
  }
}

.privacy-text {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.team-submit-btn {
  width: 100%;
  height: 52px;
  background: #2DC15C;
  border: none;
  border-radius: 26px;
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(45, 193, 92, 0.4);

  &:hover {
    background: #25A84F;
    box-shadow: 0 6px 20px rgba(45, 193, 92, 0.5);
    transform: translateY(-1px);
  }
}

::v-deep .el-form-item__label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

::v-deep .el-form-item {
  margin-bottom: 16px;
}

@media screen and (max-width: $pad-max-width) {
  .team-content-inner {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .team-hero-inner {
    padding: 0 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media screen and (max-width: $phone-max-width) {
  .team-hero { padding: 40px 0; }
  .hero-title { font-size: 26px; }
  .team-form-card { padding: 24px; }
}
</style>
