<template>
  <div class="admin-page">
    <div v-if="verifying" class="page-loading">
      <div class="loading-spinner"></div>
      <p>{{ $t('loading') }}</p>
    </div>
    <div v-else-if="verifyError" class="page-error">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#EF4444" stroke-width="2"/>
          <path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h3>{{ $t('tokenInvalid') }}</h3>
      <p>{{ verifyError }}</p>
      <button class="btn-home" @click="goHome">{{ $t('redirectHomepage') }}</button>
    </div>
    <template v-else>
    <!-- 顶部导航 -->
    <div class="admin-nav">
      <div class="admin-nav-inner">
        <div class="nav-left">
          <img src="@/assets/images/cloudSales/header2-logo.png" alt="Pandadelivero" class="nav-logo" />
          <div class="nav-title-group">
            <span class="nav-title">{{ $t('leadManagement') }}</span>
            <span class="nav-sub">{{ $t('leadManagementSub') }}</span>
          </div>
        </div>
        <div class="nav-right">
          <div class="recruiter-badge">
            <div class="recruiter-avatar">R</div>
            <span>{{ $t('recruiter') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-inner">
        <div class="stat-card stat-new">
          <div class="stat-label">{{ $t('newApplicationsToday') }}</div>
          <div class="stat-number">{{ stats.newToday }}</div>
          <div class="stat-detail">{{ $t('individualCount', { individual: stats.individual, team: stats.teams }) }}</div>
        </div>
        <div class="stat-card stat-pending">
          <div class="stat-label">{{ $t('notContacted') }}</div>
          <div class="stat-number">{{ stats.notContacted }}</div>
          <div class="stat-detail">{{ $t('autoReminderAfter24h') }}</div>
        </div>
        <div class="stat-card stat-peak">
          <div class="stat-label">{{ $t('dinnerPeakAvailable') }}</div>
          <div class="stat-number">{{ stats.dinnerPeak }}</div>
          <div class="stat-detail">{{ $t('forMealPeriodCapacity') }}</div>
        </div>
        <div class="stat-card stat-all">
          <div class="stat-label">{{ $t('totalApplications') }}</div>
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-detail">{{ $t('totalDesc') }}</div>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-section">
      <div class="filter-inner">
        <div class="filter-tabs">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            class="filter-tab"
            :class="{ active: activeFilter === tab.value }"
            @click="activeFilter = tab.value"
          >
            {{ $t(tab.labelKey) }}
            <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
          </button>
        </div>
        <div class="filter-actions">
          <input
            v-model="searchKeyword"
            class="search-input"
            :placeholder="$t('searchPlaceholder')"
            @input="handleSearch"
          />
          <button class="btn-export" @click="handleExport">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ $t('exportExcel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 申请列表 -->
    <div class="list-section">
      <div class="list-inner">
        <div v-if="loading" class="list-loading">
          <div class="loading-spinner"></div>
          <span>{{ $t('loading') }}</span>
        </div>

        <div v-else-if="filteredList.length === 0" class="list-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#E0E0E0" stroke-width="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>{{ $t('noApplications') }}</p>
        </div>

        <div v-else class="list-table">
          <!-- 表头 -->
          <div class="table-head">
            <div class="th th-applicant">{{ $t('applicant') }}</div>
            <div class="th th-type">{{ $t('type') }}</div>
            <div class="th th-city">{{ $t('city') }}</div>
            <div class="th th-vehicle">{{ $t('vehicleOrCount') }}</div>
            <div class="th th-avail">{{ $t('availability') }}</div>
            <div class="th th-status">{{ $t('status') }}</div>
            <div class="th th-date">{{ $t('appliedAt') }}</div>
            <div class="th th-action">{{ $t('action') }}</div>
          </div>

          <!-- 表格行 -->
          <div
            v-for="item in paginatedList"
            :key="item.conversation_id || item.application_id"
            class="table-row"
            :class="{ 'row-new': item.isNew }"
          >
            <div class="td td-applicant">
              <div class="applicant-info">
                <div class="applicant-avatar" :class="item.type">
                  {{ item.uname ? item.uname.charAt(0).toUpperCase() : '?' }}
                </div>
                <div class="applicant-detail">
                  <span class="applicant-name">{{ item.type === 'team' ? (item.team_name || item.uname) : (item.uname + ' ' + item.last_name) }}</span>
                  <span class="applicant-mobile">{{ item.mobile }}</span>
                </div>
              </div>
            </div>
            <div class="td td-type">
              <span class="type-badge" :class="item.type">
                {{ item.type === 'individual' ? $t('individual') : $t('team') }}
              </span>
            </div>
            <div class="td td-city">{{ item.city_name }}</div>
            <div class="td td-vehicle">{{ item.vehicle_or_count }}</div>
            <div class="td td-avail">
              <div class="avail-chips">
                <span
                  v-for="av in item.availability_arr"
                  :key="av"
                  class="avail-chip"
                >
                  {{ $t(availKeyMap[av] || 'avail_' + av) }}
                </span>
              </div>
            </div>
            <div class="td td-status">
              <span class="status-badge" :class="item.status">
                {{ $t(statusKeyMap[item.status] || 'status_' + item.status) }}
              </span>
            </div>
            <div class="td td-date">{{ formatDate(item.created_at) }}</div>
            <div class="td td-action">
              <div class="action-btns">
                <button
                  class="action-btn chat-btn"
                  @click="openChat(item)"
                  :title="$t('openChat')"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
                  </svg>
                  {{ $t('contact') }}
                </button>
                <button class="action-btn status-btn" @click="openStatusPicker(item)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="17 1 21 5 17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="7 23 3 19 7 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ $t('updateStatus') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="filteredList.length > pageSize" class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="page-info">{{ $t('pageInfo', { page: currentPage, total: totalPages }) }}</span>
          <button class="page-btn" :disabled="currentPage >= totalPages" @click="currentPage++">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 状态选择弹窗 -->
    <div v-if="showStatusPicker" class="modal-overlay" @click.self="showStatusPicker = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ $t('updateStatus') }} — {{ statusPickerItem ? statusPickerItem.uname : '' }}</h3>
          <button class="modal-close" @click="showStatusPicker = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="status-options">
            <button
              v-for="s in statusOptions"
              :key="s.value"
              class="status-option"
              :class="[s.value, { active: newStatus === s.value }]"
              @click="newStatus = s.value"
            >
              <span class="option-dot"></span>
              {{ $t(s.labelKey) }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showStatusPicker = false">{{ $t('cancel') }}</button>
          <button class="btn-confirm" :disabled="!newStatus || updating" @click="confirmStatusUpdate">
            {{ updating ? $t('sending') : $t('confirm') }}
          </button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import { getVehicleLabel } from '@/utils/rider';
import { debounce } from '@/utils/utils';
import { unwrapData } from '@/utils/api';

export default {
  name: 'admin-page',
  layout: 'default',
  data() {
    return {
      adminId: '',
      token: '',
      verifying: true,
      verifyError: '',
      loading: false,
      list: [],
      activeFilter: 'all',
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      stats: {
        newToday: 0,
        individual: 0,
        teams: 0,
        notContacted: 0,
        dinnerPeak: 0,
        total: 0
      },
      showStatusPicker: false,
      statusPickerItem: null,
      newStatus: '',
      updating: false,
      statusOptions: [
        { value: 'new', labelKey: 'status_new' },
        { value: 'contacted', labelKey: 'status_contacted' },
        { value: 'approved', labelKey: 'status_approved' },
        { value: 'rejected', labelKey: 'status_rejected' }
      ],
      // 国际化键名映射
      availKeyMap: {
        comidas: 'avail_comidas',
        cenas: 'avail_cenas',
        fines_semana: 'avail_fines_semana',
        lluvia: 'avail_lluvia'
      },
      statusKeyMap: {
        new: 'status_new',
        contacted: 'status_contacted',
        approved: 'status_approved',
        rejected: 'status_rejected'
      }
    };
  },
  computed: {
    filteredList() {
      let result = this.list;
      if (this.activeFilter === 'individual') {
        result = result.filter(i => i.type === 'individual');
      } else if (this.activeFilter === 'team') {
        result = result.filter(i => i.type === 'team');
      }
      if (this.searchKeyword.trim()) {
        const kw = this.searchKeyword.trim().toLowerCase();
        result = result.filter(i =>
          (i.uname + ' ' + i.last_name).toLowerCase().includes(kw) ||
          (i.team_name || '').toLowerCase().includes(kw) ||
          (i.mobile || '').includes(kw) ||
          (i.city_name || '').toLowerCase().includes(kw)
        );
      }
      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.pageSize);
    },
    paginatedList() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    },
    filterTabs() {
      // 单次遍历计算所有计数，避免多次 filter
      let individualCount = 0;
      let teamCount = 0;
      for (const item of this.list) {
        if (item.type === 'individual') {
          individualCount++;
        } else if (item.type === 'team') {
          teamCount++;
        }
      }
      return [
        { value: 'all', labelKey: 'allApplications', count: this.list.length },
        { value: 'individual', labelKey: 'individualRiders', count: individualCount },
        { value: 'team', labelKey: 'teams', count: teamCount }
      ];
    }
  },
  watch: {
    activeFilter() {
      this.currentPage = 1;
    },
    filteredList() {
      this.currentPage = 1;
    }
  },
  mounted() {
    // 初始化防抖搜索
    this.debouncedSearch = debounce(() => {
      this.currentPage = 1;
    }, 300);

    this.initAccess();
  },
  beforeDestroy() {
    if (this.debouncedSearch && this.debouncedSearch.cancel) {
      this.debouncedSearch.cancel();
    }
  },
  methods: {
    adminParams(extra = {}) {
      return { admin_id: this.adminId, ...extra };
    },
    adminHeaders() {
      return { Api: 'ADMIN', TOKEN: this.token };
    },
    adminRequestConfig(extra = {}) {
      return {
        params: this.adminParams(extra),
        headers: this.adminHeaders()
      };
    },
    saveAdminSession() {
      if (!process.client || !this.adminId || !this.token) return;
      sessionStorage.setItem('pandadelivero_admin_session', JSON.stringify({
        admin_id: this.adminId,
        token: this.token
      }));
    },
    restoreAdminSession() {
      if (!process.client) return null;
      try {
        const raw = sessionStorage.getItem('pandadelivero_admin_session');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.admin_id && parsed.token) {
          return parsed;
        }
      } catch (e) {}
      return null;
    },
    initAccess() {
      this.adminId = this.$route.query.admin_id || '';
      this.token = this.$route.query.token || '';
      if (!this.adminId || !this.token) {
        const stored = this.restoreAdminSession();
        if (stored) {
          this.adminId = stored.admin_id;
          this.token = stored.token;
          if (!this.$route.query.admin_id || !this.$route.query.token) {
            this.$router.replace({
              path: '/admin',
              query: { admin_id: this.adminId, token: this.token }
            });
            return;
          }
        }
      }
      if (!this.adminId || !this.token) {
        this.verifying = false;
        this.$router.replace('/');
        return;
      }
      this.saveAdminSession();
      this.verifyAndLoad();
    },
    async verifyAndLoad() {
      this.verifying = true;
      this.verifyError = '';
      try {
        await this.$axios.get('/admin/chat/verify', this.adminRequestConfig());
        this.$store.commit('SET_IS_ADMIN_SESSION', true);
        await this.loadList();
      } catch (err) {
        this.verifyError = err.message || this.$t('tokenInvalid');
      } finally {
        this.verifying = false;
      }
    },
    goHome() {
      window.location.href = '/';
    },
     /**
     * 加载申请列表数据
     */
    async loadList() {
      this.loading = true;
      try {
        const res = await this.$axios.get('/admin/chat/applications', this.adminRequestConfig({ page: 1, page_size: 100 }));
        const data = unwrapData(res);
        const items = Array.isArray(data.list) ? data.list : [];
        if (data.stats) {
          this.stats = { ...this.stats, ...data.stats };
        }
        this.list = items.map(item => {
          const isNew = item.status === 'new';
          const vehicleOrCount = item.type === 'team'
            ? (item.rider_count ? `${item.rider_count} ${this.$t('riders')}` : '—')
            : (item.vehicle_type ? this.$t(getVehicleLabel(item.vehicle_type)) : '—');
          return {
            ...item,
            id: parseInt(item.id, 10) || 0,
            type: item.type || 'individual',
            conversation_id: String(item.conversation_id || item.application_id || ''),
            isNew,
            vehicle_or_count: vehicleOrCount,
            availability_arr: item.availability ? item.availability.split(',') : []
          };
        });
      } catch (err) {
        this.$message.error(this.$t('loadError'));
      } finally {
        this.loading = false;
      }
    },
    /**
     * 格式化日期显示
     * @param {string|number} ts - 时间戳或日期字符串
     * @returns {string} 格式化后的日期
     */
    formatDate(ts) {
      if (!ts) return '—';
      try {
        const d = new Date(ts);
        if (isNaN(d.getTime())) return ts;
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return d.toLocaleDateString(this.$i18n.locale, options);
      } catch {
        return ts;
      }
    },
    /**
     * 防抖搜索处理
     */
    handleSearch() {
      if (this.debouncedSearch) {
        this.debouncedSearch();
      }
    },
    /**
     * 打开聊天窗口
     * @param {Object} item - 申请项
     */
    openChat(item) {
      if (!item || !item.conversation_id) {
        this.$message.error(this.$t('applicationFailed'));
        return;
      }
      const url = `/admin-chat?token=${encodeURIComponent(this.token)}&admin_id=${encodeURIComponent(this.adminId)}&application_id=${encodeURIComponent(item.application_id)}&conversation_id=${encodeURIComponent(item.conversation_id)}`;
      window.open(url, '_blank');
    },
    /**
     * 打开状态选择弹窗
     * @param {Object} item - 申请项
     */
    openStatusPicker(item) {
      this.statusPickerItem = item;
      this.newStatus = item.status || '';
      this.showStatusPicker = true;
    },
    /**
     * 同步列表中某项的状态，并更新统计
     */
    applyStatusToList(applicationId, status) {
      const idx = this.list.findIndex(i => parseInt(i.id, 10) === applicationId);
      if (idx === -1) return;
      const prev = this.list[idx];
      const oldStatus = prev.status;
      this.$set(this.list, idx, {
        ...prev,
        status,
        isNew: status === 'new'
      });
      if (oldStatus === 'new' && status !== 'new') {
        this.stats.notContacted = Math.max(0, (this.stats.notContacted || 0) - 1);
      } else if (oldStatus !== 'new' && status === 'new') {
        this.stats.notContacted = (this.stats.notContacted || 0) + 1;
      }
    },
    /**
     * 确认更新申请状态
     */
    async confirmStatusUpdate() {
      if (!this.newStatus || !this.statusPickerItem) return;
      const applicationId = parseInt(this.statusPickerItem.id, 10);
      if (!applicationId) {
        this.$message.error(this.$t('statusUpdateFailed'));
        return;
      }
      this.updating = true;
      try {
        await this.$axios.put(
          `/admin/chat/applications-status-${applicationId}`,
          { application_id: applicationId, status: this.newStatus },
          this.adminRequestConfig({ application_id: applicationId })
        );
        this.applyStatusToList(applicationId, this.newStatus);
        this.$message.success(this.$t('statusUpdated'));
        this.showStatusPicker = false;
        this.statusPickerItem = null;
        this.newStatus = '';
      } catch (err) {
        this.$message.error(this.$t('statusUpdateFailed'));
      } finally {
        this.updating = false;
      }
    },
    /**
     * 导出列表为 CSV 文件
     */
    handleExport() {
      const rows = this.filteredList.map(item => [
        item.type === 'team' ? (item.team_name || item.uname) : (item.uname + ' ' + item.last_name),
        item.type === 'individual' ? this.$t('individual') : this.$t('team'),
        item.city_name || '',
        item.vehicle_or_count,
        item.availability_arr.map(a => this.$t(this.availKeyMap[a] || 'avail_' + a)).join(', '),
        this.$t(this.statusKeyMap[item.status] || 'status_' + item.status),
        this.formatDate(item.created_at),
        item.email || '',
        item.contact_type || '',
        item.can_invoice || '',
        item.comments || ''
      ]);
      const headers = [
        this.$t('name'), this.$t('type'), this.$t('city'),
        this.$t('vehicleOrCount'), this.$t('availability'),
        this.$t('status'), this.$t('appliedAt'),
        this.$t('email'), this.$t('contactType'), this.$t('canInvoice'), this.$t('comments')
      ];
      const csvContent = [headers, ...rows]
        .map(r => r.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.page-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;

  p {
    color: #9E9E9E;
    font-size: 14px;
  }
}

.page-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  gap: 16px;
  background: #F5F5F5;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #1A1A1A;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}

.btn-home {
  background: #FABE1D;
  color: #1A1A1A;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e5ab0a;
  }
}

/* 导航栏 */
.admin-nav {
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
  height: 70px;
  flex-shrink: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.admin-nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.nav-title-group {
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
}

.nav-sub {
  font-size: 12px;
  color: #9E9E9E;
}

.recruiter-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #F5F5F5;
  border-radius: 20px;
  font-size: 13px;
  color: #616161;
  font-weight: 500;
}

.recruiter-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2DC15C;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

/* 统计卡片 */
.stats-section {
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
  padding: 20px 0;
  flex-shrink: 0;
}

.stats-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #FAFAFA;
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid #EEEEEE;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #757575;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 4px;
}

.stat-detail {
  font-size: 12px;
  color: #9E9E9E;
}

.stat-new .stat-number { color: #EF4444; }
.stat-pending .stat-number { color: #F59E0B; }
.stat-peak .stat-number { color: #8B5CF6; }
.stat-all .stat-number { color: #1A1A1A; }

/* 筛选栏 */
.filter-section {
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
  padding: 14px 0;
  flex-shrink: 0;
}

.filter-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.filter-tabs {
  display: flex;
  gap: 4px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  border: 1.5px solid transparent;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #757575;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
    color: #1A1A1A;
  }

  &.active {
    background: #FFFBEB;
    border-color: #FABE1D;
    color: #8A6A10;
    font-weight: 700;
  }
}

.tab-count {
  background: #F0E0A0;
  color: #8A6A10;
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 700;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  height: 38px;
  border: 1.5px solid #EEEEEE;
  border-radius: 19px;
  padding: 0 16px;
  font-size: 13px;
  color: #1A1A1A;
  outline: none;
  width: 240px;
  transition: border-color 0.2s;

  &:focus { border-color: #FABE1D; }
  &::placeholder { color: #BDBDBD; }
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 18px;
  border: 1.5px solid #EEEEEE;
  border-radius: 19px;
  background: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  color: #616161;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #FABE1D;
    color: #8A6A10;
    background: #FFFBEB;
  }
}

/* 列表 */
.list-section {
  flex: 1;
  padding: 20px 0;
}

.list-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.list-loading,
.list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 0;
  color: #9E9E9E;
  font-size: 14px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #F0E8C0;
  border-top-color: #FABE1D;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* 表格 */
.list-table {
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #EEEEEE;
}

.table-head {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1.5fr;
  gap: 0;
  padding: 12px 20px;
  background: #FAFAFA;
  border-bottom: 1px solid #EEEEEE;
}

.th {
  font-size: 11px;
  font-weight: 700;
  color: #9E9E9E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1.5fr;
  gap: 0;
  padding: 14px 20px;
  border-bottom: 1px solid #F5F5F5;
  align-items: center;
  transition: background 0.15s;

  &:last-child { border-bottom: none; }
  &:hover { background: #FAFAFA; }

  &.row-new {
    background: #FFFBEB;
    &:hover { background: #FFF3CD; }
  }
}

.td {
  font-size: 13px;
  color: #424242;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.applicant-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: #FFFFFF;
  flex-shrink: 0;

  &.individual { background: #FABE1D; }
  &.team { background: #2DC15C; }
}

.applicant-detail {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.applicant-name {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.applicant-mobile {
  font-size: 11px;
  color: #9E9E9E;
}

/* 类型标签 */
.type-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;

  &.individual { background: #FFFBEB; color: #8A6A10; }
  &.team { background: #F0FDF4; color: #166534; }
}

/* 可用时段 */
.avail-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.avail-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  background: #F5F5F5;
  color: #757575;
}

/* 状态标签 */
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;

  &.new { background: #EFF6FF; color: #3B82F6; }
  &.contacted { background: #FFFBEB; color: #F59E0B; }
  &.approved { background: #F0FDF4; color: #22C55E; }
  &.rejected { background: #FEF2F2; color: #EF4444; }
}

/* 动作按钮 */
.action-btns {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
  white-space: nowrap;
}

.chat-btn {
  background: #FFFFFF;
  border-color: #FABE1D;
  color: #8A6A10;

  &:hover {
    background: #FFFBEB;
  }
}

.status-btn {
  background: #F5F5F5;
  border-color: #E0E0E0;
  color: #616161;

  &:hover {
    background: #EEEEEE;
    border-color: #BDBDBD;
  }
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #EEEEEE;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #616161;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #FABE1D;
    color: #FABE1D;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.page-info {
  font-size: 13px;
  color: #757575;
}

/* 状态弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: #FFFFFF;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #EEEEEE;

  h3 { font-size: 16px; font-weight: 700; color: #1A1A1A; }
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #757575;
  transition: all 0.2s;

  &:hover { background: #EEEEEE; color: #1A1A1A; }
}

.modal-body {
  padding: 20px 24px;
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #EEEEEE;
  background: #FAFAFA;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #424242;
  transition: all 0.2s;
  text-align: left;

  .option-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &.new .option-dot { background: #3B82F6; }
  &.contacted .option-dot { background: #F59E0B; }
  &.approved .option-dot { background: #22C55E; }
  &.rejected .option-dot { background: #EF4444; }

  &:hover { border-color: #BDBDBD; }
  &.active.new { border-color: #3B82F6; background: #EFF6FF; color: #1D4ED8; }
  &.active.contacted { border-color: #F59E0B; background: #FFFBEB; color: #B45309; }
  &.active.approved { border-color: #22C55E; background: #F0FDF4; color: #15803D; }
  &.active.rejected { border-color: #EF4444; background: #FEF2F2; color: #DC2626; }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #EEEEEE;
}

.btn-cancel,
.btn-confirm {
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: #F5F5F5;
  color: #616161;
  &:hover { background: #EEEEEE; }
}

.btn-confirm {
  background: #FABE1D;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(250,190,29,0.4);

  &:hover:not(:disabled) { background: #E5A60C; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

@media screen and (max-width: $pad-max-width) {
  .stats-inner {
    grid-template-columns: 1fr 1fr;
  }

  .filter-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-input { width: 100%; }
  .filter-actions { width: 100%; }
}

@media screen and (max-width: $phone-max-width) {
  .stats-inner { grid-template-columns: 1fr; }
  .table-head { display: none; }
  .table-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }
  .th-action { display: flex !important; }
}
</style>
