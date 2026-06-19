<template>
  <div class="collab-page">
    <!-- Hero 区域 -->
    <div class="collab-hero">
      <div class="collab-hero-inner">
        <div class="hero-text">
          <div class="hero-eyebrow">{{ $t('collaborationPortal') }}</div>
          <h1 class="hero-title">{{ $t('collabHeroTitle') }}</h1>
          <p class="hero-desc">{{ $t('collabHeroDesc') }}</p>
          <div class="hero-cta">
            <button class="cta-primary" @click="goRider">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.34L3 21l1.5-1.5 1.83.17C8.5 21.5 14 21 18 15c1 2 3 4 3 6 1-1 2-3 2-5 0-1-1-2-2-2H15c-1.7 0-3-1.3-3-3 0-1.5 1-2.5 2-3z" fill="currentColor"/>
              </svg>
              {{ $t('iAmRider') }}
            </button>
            <button class="cta-secondary" @click="goTeam">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ $t('iHaveTeam') }}
            </button>
            <button class="cta-outline" disabled>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" stroke-width="2"/>
              </svg>
              {{ $t('businessSolutions') }}
            </button>
          </div>
        </div>
        <div class="hero-map">
          <div class="map-visual">
            <div class="map-overlay">
              <div class="city-pin pin-madrid">
                <div class="pin-dot"></div>
                <div class="pin-label">
                  <strong>{{ $t('madrid') }}</strong>
                  <small>{{ $t('highDemand') }}</small>
                </div>
              </div>
              <div class="city-pin pin-bcn">
                <div class="pin-dot"></div>
                <div class="pin-label">
                  <strong>{{ $t('barcelona') }}</strong>
                  <small>{{ $t('localTeams') }}</small>
                </div>
              </div>
              <div class="city-pin pin-valencia">
                <div class="pin-dot"></div>
                <div class="pin-label">
                  <strong>{{ $t('valencia') }}</strong>
                  <small>{{ $t('newCapacity') }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 三身份选择卡片 -->
    <div class="collab-cards-section">
      <div class="section-inner">
        <h2 class="section-title">{{ $t('chooseCollabType') }}</h2>
        <p class="section-desc">{{ $t('chooseCollabDesc') }}</p>
        <div class="collab-cards">
          <!-- 卡片1：个人骑手 -->
          <div class="collab-card" @click="goRider">
            <div class="card-icon-wrap card-icon-rider">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.34L3 21l1.5-1.5 1.83.17C8.5 21.5 14 21 18 15c1 2 3 4 3 6 1-1 2-3 2-5 0-1-1-2-2-2H15c-1.7 0-3-1.3-3-3 0-1.5 1-2.5 2-3z" fill="currentColor"/>
              </svg>
            </div>
            <div class="card-number">1</div>
            <h3>{{ $t('individualRiderTitle') }}</h3>
            <p>{{ $t('individualRiderDesc') }}</p>
            <div class="card-tags">
              <span class="card-tag">{{ $t('noExclusivity') }}</span>
              <span class="card-tag">{{ $t('flexibleHours') }}</span>
            </div>
            <button class="card-btn-primary">{{ $t('sendApplication') }}</button>
          </div>

          <!-- 卡片2：配送小队 -->
          <div class="collab-card" @click="goTeam">
            <div class="card-icon-wrap card-icon-team">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-number">2</div>
            <h3>{{ $t('teamTitle') }}</h3>
            <p>{{ $t('teamDesc') }}</p>
            <div class="card-tags">
              <span class="card-tag">{{ $t('teamCapacity') }}</span>
              <span class="card-tag">{{ $t('cityBased') }}</span>
            </div>
            <button class="card-btn-secondary">{{ $t('sendTeamApplication') }}</button>
          </div>

          <!-- 卡片3：企业商家 -->
          <div class="collab-card collab-card-disabled">
            <div class="card-icon-wrap card-icon-business">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="card-number">3</div>
            <h3>{{ $t('businessTitle') }}</h3>
            <p>{{ $t('businessDesc') }}</p>
            <div class="card-tags">
              <span class="card-tag card-tag-soon">{{ $t('comingSoon') }}</span>
            </div>
            <button class="card-btn-disabled" disabled>{{ $t('comingSoon') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 城市能力 -->
    <div class="cities-section">
      <div class="section-inner">
        <h2 class="section-title">{{ $t('citiesAndCapacity') }}</h2>
        <div class="city-cards">
          <div class="city-card">
            <div class="city-card-header">
              <span class="city-name">{{ $t('madrid') }}</span>
              <span class="city-demand">{{ $t('activeDemand') }}</span>
            </div>
            <p class="city-desc">{{ $t('madridDesc') }}</p>
            <div class="city-tags">
              <span class="city-tag">{{ $t('autonomousRecruit') }}</span>
              <span class="city-tag">{{ $t('motoAndTeams') }}</span>
            </div>
          </div>
          <div class="city-card">
            <div class="city-card-header">
              <span class="city-name">{{ $t('barcelona') }}</span>
              <span class="city-demand">{{ $t('localReinforce') }}</span>
            </div>
            <p class="city-desc">{{ $t('barcelonaDesc') }}</p>
            <div class="city-tags">
              <span class="city-tag">{{ $t('localTeamReinforce') }}</span>
              <span class="city-tag">{{ $t('experiencedRider') }}</span>
            </div>
          </div>
          <div class="city-card">
            <div class="city-card-header">
              <span class="city-name">{{ $t('valencia') }}</span>
              <span class="city-demand">{{ $t('earlyAccess') }}</span>
            </div>
            <p class="city-desc">{{ $t('valenciaDesc') }}</p>
            <div class="city-tags">
              <span class="city-tag">{{ $t('earlyCandidates') }}</span>
              <span class="city-tag">{{ $t('demandSpikes') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index-page',
  layout: 'default',
  methods: {
    goRider() {
      window.location.href = '/rider';
    },
    goTeam() {
      window.location.href = '/team';
    }
  }
};
</script>

<style lang="scss" scoped>
.collab-page {
  min-height: 100vh;
  background: #FAFAFA;
}

/* Hero */
.collab-hero {
  background: linear-gradient(135deg, #FFF8E2 0%, #FEF3C7 100%);
  border-bottom: 1px solid #F3E8C0;
  padding: 60px 0;
}

.collab-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  gap: 60px;
}

.hero-text {
  flex: 1;
}

.hero-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #8A6A10;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding: 6px 14px;
  background: rgba(250, 190, 29, 0.15);
  border-radius: 20px;
}

.hero-title {
  font-size: 40px;
  font-weight: 800;
  color: #1A1A1A;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.hero-desc {
  font-size: 17px;
  color: #6B5B3E;
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 520px;
}

.hero-cta {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 360px;
}

.cta-primary,
.cta-secondary,
.cta-outline {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  border: none;
}

.cta-primary {
  background: #FABE1D;
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(250, 190, 29, 0.4);

  &:hover {
    background: #E5A60C;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(250, 190, 29, 0.5);
  }
}

.cta-secondary {
  background: #FFFFFF;
  color: #1A1A1A;
  border: 2px solid #E8D48A;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  &:hover {
    border-color: #FABE1D;
    background: #FFFBEB;
    transform: translateY(-1px);
  }
}

.cta-outline {
  background: rgba(255,255,255,0.5);
  color: #9E9E9E;
  border: 2px dashed #E0D8C0;
  cursor: not-allowed;
}

/* Map */
.hero-map {
  flex-shrink: 0;
  width: 420px;
}

.map-visual {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border: 1.5px solid #F3E8C0;
  height: 320px;
  position: relative;
}

.map-overlay {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.city-pin {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 12px 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: 1px solid #F0E8C0;
  width: 220px;
}

.pin-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pin-madrid .pin-dot { background: #EF4444; }
.pin-bcn .pin-dot { background: #3B82F6; }
.pin-valencia .pin-dot { background: #FABE1D; }

.pin-label {
  display: flex;
  flex-direction: column;

  strong { font-size: 14px; color: #1A1A1A; }
  small { font-size: 11px; color: #9E9E9E; }
}

/* Cards Section */
.collab-cards-section {
  padding: 80px 0;
  background: #FFFFFF;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1A1A1A;
  text-align: center;
  margin-bottom: 12px;
}

.section-desc {
  font-size: 16px;
  color: #757575;
  text-align: center;
  margin-bottom: 48px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.collab-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.collab-card {
  background: #FFFFFF;
  border: 2px solid #F0E8C0;
  border-radius: 24px;
  padding: 32px 28px;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:hover {
    border-color: #FABE1D;
    box-shadow: 0 8px 32px rgba(250, 190, 29, 0.15);
    transform: translateY(-4px);
  }

  &.collab-card-disabled {
    opacity: 0.7;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: none;
      border-color: #F0E8C0;
    }
  }
}

.card-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-icon-rider { background: #FFFBEB; color: #FABE1D; }
.card-icon-team { background: #F0FDF4; color: #2DC15C; }
.card-icon-business { background: #EFF6FF; color: #3B82F6; }

.card-number {
  font-size: 13px;
  font-weight: 700;
  color: #BDBDBD;
  margin-bottom: 8px;
}

.collab-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 10px;
}

.collab-card p {
  font-size: 14px;
  color: #757575;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.card-tag {
  font-size: 12px;
  color: #8A6A10;
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 20px;
  padding: 4px 12px;

  &.card-tag-soon {
    color: #9E9E9E;
    background: #F5F5F5;
    border-color: #E0E0E0;
  }
}

.card-btn-primary,
.card-btn-secondary,
.card-btn-disabled {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.card-btn-primary {
  background: #FABE1D;
  color: #FFFFFF;
  box-shadow: 0 3px 12px rgba(250, 190, 29, 0.35);

  &:hover {
    background: #E5A60C;
  }
}

.card-btn-secondary {
  background: #FFFFFF;
  color: #1A1A1A;
  border: 2px solid #FABE1D;

  &:hover {
    background: #FFFBEB;
  }
}

.card-btn-disabled {
  background: #F5F5F5;
  color: #BDBDBD;
  cursor: not-allowed;
}

/* Cities Section */
.cities-section {
  padding: 80px 0;
  background: #FAFAFA;
  border-top: 1px solid #F0E8C0;
}

.city-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.city-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #F0E8C0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.city-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.city-name {
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
}

.city-demand {
  font-size: 11px;
  font-weight: 600;
  color: #EF4444;
  background: #FEF2F2;
  padding: 3px 10px;
  border-radius: 10px;
}

.city-desc {
  font-size: 13px;
  color: #757575;
  line-height: 1.6;
  margin-bottom: 14px;
}

.city-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.city-tag {
  font-size: 11px;
  color: #616161;
  background: #F5F5F5;
  padding: 3px 10px;
  border-radius: 8px;
}

/* 响应式 */
@media screen and (max-width: $pad-max-width) {
  .collab-hero-inner {
    flex-direction: column;
    padding: 0 24px;
  }

  .hero-title { font-size: 28px; }

  .hero-map { width: 100%; }
  .map-visual { height: auto; }

  .collab-cards { grid-template-columns: 1fr; }
  .city-cards { grid-template-columns: 1fr; }
}

@media screen and (max-width: $phone-max-width) {
  .collab-hero { padding: 40px 0; }
  .collab-cards-section,
  .cities-section { padding: 60px 0; }
  .section-inner { padding: 0 20px; }
  .collab-card { padding: 24px 20px; }
}
</style>
