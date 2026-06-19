<template>
  <div class="admin-chat-page">

    <!-- 验证加载中 -->
    <div v-if="verifying" class="page-loading">
      <div class="loading-spinner"></div>
      <p>{{ $t('loading') }}</p>
    </div>

    <!-- 验证失败 -->
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

    <!-- 正常聊天界面 -->
    <template v-else>
      <!-- 顶部栏 -->
      <div class="admin-header">
        <div class="admin-header-inner">
          <div class="header-left">
            <img src="@/assets/images/cloudSales/header2-logo.png" alt="Pandadelivero" class="header-logo" />
            <div class="header-title-group">
              <span class="header-title">{{ $t('recruiterChat') }}</span>
              <span class="header-sub">{{ $t('online') }}</span>
            </div>
          </div>
          <div class="header-right">
            <div class="recruiter-info">
              <div class="recruiter-avatar">{{ recruiterName ? recruiterName.charAt(0) : $t('recruiter').charAt(0) }}</div>
              <div class="recruiter-meta">
                <span class="recruiter-name">{{ recruiterName }}</span>
                <span class="recruiter-role">{{ $t('recruiter') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 三栏主体 -->
      <div class="admin-body">

        <!-- 对话列表侧边栏 -->
        <div class="conv-sidebar">
          <div class="conv-sidebar-header">
            <h3>{{ $t('conversationList') }}</h3>
          </div>
          <div v-if="loadingConversations" class="conv-loading">
            <div class="loading-spinner small"></div>
          </div>
          <div v-else-if="conversationList.length === 0" class="conv-empty">
            <p>{{ $t('noConversations') }}</p>
          </div>
          <div v-else class="conv-list">
            <div
              v-for="conv in conversationList"
              :key="conv.conversation_id"
              class="conv-item"
              :class="{ active: conv.conversation_id === applicationId }"
              @click="switchConversation(conv.conversation_id)"
            >
              <div class="conv-avatar">{{ (conv.rider_name || conv.uname || '?').charAt(0).toUpperCase() }}</div>
              <div class="conv-info">
                <div class="conv-name">{{ conv.rider_name || conv.uname || '—' }}</div>
                <div class="conv-meta">{{ conv.city_name || '' }} · {{ conv.vehicle_type ? $t(getVehicleLabel(conv.vehicle_type)) : '' }}</div>
              </div>
              <div class="conv-status">
                <span class="conv-badge" :class="conv.latest_status || 'new'">
                  {{ $t(conv.latest_status || 'new') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 左栏：申请信息（移至右侧） -->
        <div class="panel-left">
          <div class="panel-title">{{ $t('applicationInfo') }}</div>
          <div v-if="applicationDetail" class="app-detail-card">
            <div class="app-id-row">
              <span class="app-id-label">{{ $t('applicationNumber') }}</span>
              <span class="app-id-value">{{ applicationDetail.application_id }}</span>
            </div>
            <div class="app-status-row">
              <span class="status-badge" :class="applicationDetail.status || 'new'">
                {{ $t(applicationDetail.status) || $t('new') }}
              </span>
            </div>

            <div class="detail-list">
              <div class="detail-item">
                <span class="d-label">{{ $t('name') }}</span>
                <span class="d-value">{{ applicationDetail.uname }} {{ applicationDetail.last_name }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">{{ $t('mobileNumber') }}</span>
                <span class="d-value">{{ applicationDetail.mobile }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">{{ $t('contactType') }}</span>
                <span class="d-value">{{ applicationDetail.contact_type === 'whatsapp' ? $t('whatsapp') : $t('smsShort') }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">{{ $t('city') }}</span>
                <span class="d-value">{{ applicationDetail.city_name }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">{{ $t('vehicleType') }}</span>
                <span class="d-value">{{ $t(getVehicleLabel(applicationDetail.vehicle_type)) }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">{{ $t('autonomoStatus') }}</span>
                <span class="d-value">{{ $t(getAutonomoLabel(applicationDetail.is_autonomo)) }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">{{ $t('availability') }}</span>
                <span class="d-value">{{ formatAvailability(applicationDetail.availability) }}</span>
              </div>
            </div>

            <div v-if="applicationDetail.created_at" class="app-time">
              {{ $t('submittedAt') }}: {{ applicationDetail.created_at }}
            </div>
          </div>

          <!-- 状态操作 -->
          <div class="status-actions">
            <div class="panel-title" style="margin-top: 24px">{{ $t('status') }}</div>
            <div class="status-btns">
              <button
                v-for="s in statusOptions"
                :key="s.value"
                class="status-btn"
                :class="[s.value, { active: applicationDetail && applicationDetail.status === s.value }]"
                @click="updateStatus(s.value)"
              >
                {{ $t(s.labelKey) }}
              </button>
            </div>
          </div>

          <!-- 快捷回复 -->
          <div class="quick-replies-section">
            <div class="panel-title" style="margin-top: 24px">{{ $t('quickReplies') }}</div>
            <div class="quick-replies">
              <p class="quick-replies-hint">{{ $t('optional') }}</p>
              <button
                v-for="q in quickReplies"
                :key="q.cn"
                class="quick-reply-btn"
                @click="useQuickReply(q.cn)"
              >
                <span class="qr-cn">{{ q.cn }}</span>
              </button>
            </div>
            <div class="tips-section">
              <div class="tips-title">{{ $t('tips') }}</div>
              <ul class="tips-list">
                <li>{{ $t('adminTip1') }}</li>
                <li>{{ $t('adminTip2') }}</li>
                <li>{{ $t('adminTip3') }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 中栏：聊天记录 -->
        <div class="panel-center">
          <div class="panel-center-header">
            <div class="chat-with">
              <span class="chat-with-name">{{ applicationDetail ? (applicationDetail.uname + ' ' + applicationDetail.last_name) : '' }}</span>
              <span class="chat-with-city">{{ applicationDetail ? applicationDetail.city_name : '' }}</span>
            </div>
          </div>

          <!-- 消息列表 -->
          <div class="messages-area" ref="messagesArea">
            <div v-if="loadingMessages" class="loading-messages">
              <div class="loading-spinner small"></div>
            </div>
            <div v-else-if="messages.length === 0" class="empty-messages">
              <p>{{ $t('noMessages') }}</p>
            </div>
            <template v-else>
              <div
                v-for="(msg, idx) in messages"
                :key="msg.message_id || idx"
                class="chat-message"
                :class="msg.sender_type"
              >
                <div class="msg-avatar" :class="msg.sender_type">
                  {{ msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : '?' }}
                </div>
                <div class="msg-body">
                  <div class="msg-header">
                    <span class="msg-name">{{ msg.sender_name }}</span>
                    <span class="msg-time">{{ formatTime(msg.created_at) }}</span>
                  </div>
                  <div class="msg-bubble">
                    <p>{{ msg.content }}</p>
                  </div>
                  <!-- 骑手消息显示中文翻译 -->
                  <div v-if="msg.translated_content && msg.sender_type === 'rider'" class="msg-translation">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z" fill="#9E9E9E"/>
                    </svg>
                    {{ msg.translated_content }}
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- 输入区 -->
          <div class="input-area">
            <div class="input-section-label">{{ $t('recruiterInput') }}</div>
            <div class="input-row">
              <textarea
                v-model="cnInput"
                :placeholder="$t('recruiterInput')"
                class="cn-textarea"
                rows="3"
              />
            </div>

            <!-- AI 翻译预览 -->
            <div v-if="translatedPreview" class="translation-preview">
              <div class="preview-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z" fill="#FABE1D"/>
                </svg>
                {{ $t('aiTranslationPreview') }}
              </div>
              <p class="preview-text">{{ translatedPreview }}</p>
            </div>

            <!-- 按钮行 -->
            <div class="input-actions">
              <button class="btn-translate" :disabled="!cnInput.trim() || translating" @click="handleTranslate">
                {{ translating ? $t('sending') + '...' : $t('generateSpanish') }}
              </button>
              <button class="btn-send" :disabled="!cnInput.trim() || sending" @click="handleSend">
                {{ sending ? $t('sending') : $t('confirmSend') }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<script>
const VEHICLE_MAP = { moto: 'moto', bici_electrica: 'biciElectrica', bici: 'bici', coche: 'coche' };
const AUTONOMO_MAP = { 1: 'autonomoYes', 0: 'autonomoNo', 2: 'autonomoInProcess' };
const AVAILABILITY_MAP = {
  comidas: 'comidas', cenas: 'cenas', fines_semana: 'finesSemana', lluvia: 'lluvia'
};
const QUICK_REPLIES = [
  { cn: '你好，请问你已注册自雇了吗？' },
  { cn: '你好，我们已收到你的申请，请问你方便通话吗？' },
  { cn: '你好，你的申请已通过，欢迎加入 Pandadelivero！' },
  { cn: '你好，请问你有摩托车驾照吗？' },
  { cn: '你好，请问你目前在哪个城市？' }
];

export default {
  name: 'admin-chat',
  layout: 'default',
  data() {
    return {
      token: '',
      applicationId: '',
      verifying: true,
      verifyError: '',
      recruiterName: '',
      applicationDetail: null,
      messages: [],
      loadingMessages: false,
      conversationList: [],
      loadingConversations: false,
      cnInput: '',
      translatedPreview: '',
      translating: false,
      sending: false,
      pollingTimer: null,
      statusOptions: [
        { value: 'new', labelKey: 'new' },
        { value: 'contacted', labelKey: 'contacted' },
        { value: 'approved', labelKey: 'approved' },
        { value: 'rejected', labelKey: 'rejected' }
      ],
      quickReplies: QUICK_REPLIES
    };
  },
  mounted() {
    this.token = this.$route.query.token || '';
    this.applicationId = this.$route.query.application_id || '';
    if (!this.token || !this.applicationId) {
      this.verifyError = this.$t('missingTokenOrApplicationId');
      this.verifying = false;
      return;
    }
    this.verifyAndLoad();
  },
  beforeDestroy() {
    this.stopPolling();
  },
  methods: {
    async verifyAndLoad() {
      this.verifying = true;
      this.verifyError = '';
      try {
        const res = await this.$axios.get(`/staff/chat/verify-token`, {
          params: { token: this.token, application_id: this.applicationId }
        });
        const d = res && res.data ? res.data : res;
        this.recruiterName = (d.recruiter_name || this.$t('recruiter'));
        this.applicationDetail = d.application || d || null;
        await Promise.all([
          this.loadMessages(),
          this.loadConversationList()
        ]);
        this.startPolling();
      } catch (err) {
        this.verifyError = err.message || this.$t('tokenInvalid');
      } finally {
        this.verifying = false;
      }
    },
    async loadMessages() {
      this.loadingMessages = true;
      try {
        const res = await this.$axios.get(`/api/v1/chat/conversations/${this.applicationId}/messages`);
        let msgs = null;
        if (res && res.data) {
          if (Array.isArray(res.data.messages)) msgs = res.data.messages;
          else if (Array.isArray(res.data)) msgs = res.data;
        } else if (res && Array.isArray(res.messages)) {
          msgs = res.messages;
        } else if (Array.isArray(res)) {
          msgs = res;
        }
        if (msgs) this.messages = msgs;
        this.$nextTick(() => this.scrollToBottom());
      } catch (err) {
        console.error('loadMessages error:', err);
      } finally {
        this.loadingMessages = false;
      }
    },
    async loadConversationList() {
      this.loadingConversations = true;
      try {
        const res = await this.$axios.get('/staff/applications', { params: { page: 1, page_size: 50 } });
        let list = [];
        if (res && res.data && Array.isArray(res.data.list)) {
          list = res.data.list;
        } else if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res.data)) {
          list = res.data;
        }
        this.conversationList = list.filter(item => item.application_id).map(item => ({
          conversation_id: item.application_id,
          rider_name: `${item.uname || ''} ${item.last_name || ''}`.trim(),
          uname: item.uname,
          last_name: item.last_name,
          city_name: item.city_name,
          vehicle_type: item.vehicle_type,
          latest_status: item.status
        }));
      } catch (err) {
        console.error('loadConversationList error:', err);
      } finally {
        this.loadingConversations = false;
      }
    },
    async switchConversation(convId) {
      if (convId === this.applicationId) return;
      this.applicationId = convId;
      const conv = this.conversationList.find(c => c.conversation_id === convId);
      if (conv) {
        this.applicationDetail = {
          application_id: convId,
          uname: conv.uname,
          last_name: conv.last_name,
          city_name: conv.city_name,
          vehicle_type: conv.vehicle_type,
          status: conv.latest_status
        };
      }
      this.messages = [];
      await this.loadMessages();
    },
    async handleTranslate() {
      if (!this.cnInput.trim() || this.translating) return;
      this.translating = true;
      try {
        const res = await this.$axios.post('/api/v1/chat/translate', {
          text: this.cnInput.trim(),
          source_lang: 'zh',
          target_lang: 'es'
        });
        this.translatedPreview = res.translated_text || '';
      } catch (err) {
        this.$message.error(this.$t('translationFailed'));
      } finally {
        this.translating = false;
      }
    },
    async handleSend() {
      if (!this.cnInput.trim() || this.sending) return;
      if (!this.translatedPreview) {
        this.$message.warning(this.$t('pleaseTranslateFirst'));
        return;
      }
      const text = this.cnInput.trim();
      const translated = this.translatedPreview;
      this.cnInput = '';
      this.translatedPreview = '';
      this.sending = true;
      try {
        await this.$axios.post(`/api/v1/chat/conversations/${this.applicationId}/messages`, {
          content: translated,
          sender_type: 'recruiter'
        });
        await this.loadMessages();
      } catch (err) {
        this.$message.error(this.$t('messageSendError'));
        this.cnInput = text;
        this.translatedPreview = translated;
      } finally {
        this.sending = false;
      }
    },
    async updateStatus(status) {
      if (!this.applicationDetail) return;
      try {
        await this.$axios.put(`/staff/applications/${this.applicationId}/status`, {
          status
        });
        this.$set(this.applicationDetail, 'status', status);
        this.$message.success(this.$t('statusUpdated'));
      } catch (err) {
        this.$message.error(this.$t('statusUpdateFailed'));
      }
    },
    useQuickReply(cn) {
      this.cnInput = cn;
      this.translatedPreview = '';
    },
    startPolling() {
      this.pollingTimer = setInterval(() => {
        this.loadMessages();
      }, 5000);
    },
    stopPolling() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    },
    scrollToBottom() {
      if (this.$refs.messagesArea) {
        this.$refs.messagesArea.scrollTop = this.$refs.messagesArea.scrollHeight;
      }
    },
    formatTime(ts) {
      if (!ts) return '';
      try {
        return new Date(ts).toLocaleString(this.$i18n.locale, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
      } catch {
        return ts;
      }
    },
    getVehicleLabel(type) {
      return VEHICLE_MAP[type] || type || '';
    },
    getAutonomoLabel(val) {
      return AUTONOMO_MAP[val] || 'autonomoUnknown';
    },
    formatAvailability(av) {
      if (!av) return '';
      return av.split(',').map(a => this.$t(AVAILABILITY_MAP[a] || a)).join(', ');
    },
    goHome() {
      window.location.href = '/';
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-chat-page {
  min-height: 100vh;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
}

/* 加载状态 */
.page-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  p { color: #9E9E9E; font-size: 14px; }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #F0E8C0;
  border-top-color: #FABE1D;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  &.small {
    width: 24px;
    height: 24px;
    border-width: 2px;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误状态 */
.page-error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 40px;

  h3 { font-size: 22px; color: #1A1A1A; }
  p { color: #757575; font-size: 14px; max-width: 360px; }
}

.btn-home {
  padding: 12px 32px;
  background: #FABE1D;
  border: none;
  border-radius: 24px;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #E5A60C; }
}

/* 顶部栏 */
.admin-header {
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
  height: 70px;
  flex-shrink: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.admin-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.header-title-group {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
}

.header-sub {
  font-size: 12px;
  color: #2DC15C;
  font-weight: 600;
}

.recruiter-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.recruiter-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2DC15C;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.recruiter-meta {
  display: flex;
  flex-direction: column;
}

.recruiter-name {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}

.recruiter-role {
  font-size: 11px;
  color: #9E9E9E;
}

/* 三栏主体：会话列表 + 聊天 + 申请资料 */
.admin-body {
  flex: 1;
  display: grid;
  grid-template-columns: 290px 1fr 300px;
  gap: 18px;
  overflow: hidden;
}

/* 对话列表侧边栏 */
.conv-sidebar {
  background: #F9F9F9;
  border-right: 1px solid #EEEEEE;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conv-sidebar-header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid #EEEEEE;

  h3 {
    font-size: 14px;
    font-weight: 700;
    color: #1A1A1A;
  }
}

.conv-loading,
.conv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 8px;
  flex: 1;

  p { font-size: 13px; color: #9E9E9E; text-align: center; }
}

.conv-list {
  overflow-y: auto;
  flex: 1;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #F0F0F0;
  transition: background 0.15s;

  &:hover { background: #F0F0F0; }

  &.active {
    background: #FFFBEB;
    border-left: 3px solid #FABE1D;
    padding-left: 13px;
  }
}

.conv-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FABE1D;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.conv-info {
  flex: 1;
  overflow: hidden;
}

.conv-name {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-meta {
  font-size: 11px;
  color: #9E9E9E;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

.conv-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 8px;
  white-space: nowrap;

  &.new { background: #EFF6FF; color: #3B82F6; }
  &.contacted { background: #FFFBEB; color: #F59E0B; }
  &.approved { background: #F0FDF4; color: #22C55E; }
  &.rejected { background: #FEF2F2; color: #EF4444; }
}

/* 左栏 */
.panel-left {
  background: #FFFFFF;
  border-right: 1px solid #EEEEEE;
  padding: 20px;
  overflow-y: auto;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #424242;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #FABE1D;
}

.app-detail-card {
  background: #FAFAFA;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.app-id-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.app-id-label {
  font-size: 12px;
  color: #9E9E9E;
}

.app-id-value {
  font-size: 13px;
  font-weight: 700;
  color: #FABE1D;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  &.new { background: #EFF6FF; color: #3B82F6; }
  &.contacted { background: #FFFBEB; color: #F59E0B; }
  &.approved { background: #F0FDF4; color: #22C55E; }
  &.rejected { background: #FEF2F2; color: #EF4444; }
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 1px solid #EEEEEE;

  &:last-child { border-bottom: none; }
}

.d-label {
  font-size: 11px;
  color: #9E9E9E;
  margin-bottom: 2px;
}

.d-value {
  font-size: 13px;
  color: #424242;
  font-weight: 500;
}

.app-time {
  font-size: 11px;
  color: #BDBDBD;
  margin-top: 10px;
}

.status-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.status-btn {
  padding: 8px;
  border-radius: 10px;
  border: 1.5px solid #E0E0E0;
  background: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  color: #757575;
  cursor: pointer;
  transition: all 0.2s;

  &.active.new { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  &.active.contacted { border-color: #F59E0B; color: #F59E0B; background: #FFFBEB; }
  &.active.approved { border-color: #22C55E; color: #22C55E; background: #F0FDF4; }
  &.active.rejected { border-color: #EF4444; color: #EF4444; background: #FEF2F2; }
}

/* 中栏 */
.panel-center {
  display: flex;
  flex-direction: column;
  background: #FAFAFA;
  overflow: hidden;
}

.panel-center-header {
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
  padding: 16px 20px;
  flex-shrink: 0;
}

.chat-with {
  display: flex;
  flex-direction: column;
}

.chat-with-name {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
}

.chat-with-city {
  font-size: 12px;
  color: #9E9E9E;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-messages,
.empty-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #BDBDBD;
  font-size: 14px;
}

.chat-message {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &.rider {
    flex-direction: row;

    .msg-bubble {
      background: #FFFFFF;
      color: #1A1A1A;
      border-radius: 4px 20px 20px 20px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
  }

  &.recruiter {
    flex-direction: row-reverse;

    .msg-bubble {
      background: #FABE1D;
      color: #FFFFFF;
      border-radius: 20px 4px 20px 20px;
    }
  }
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #FFFFFF;
  flex-shrink: 0;

  &.rider { background: #FABE1D; }
  &.recruiter { background: #2DC15C; }
}

.msg-body {
  max-width: 65%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.msg-header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.msg-name {
  font-size: 12px;
  color: #9E9E9E;
}

.msg-time {
  font-size: 11px;
  color: #BDBDBD;
}

.recruiter .msg-header {
  flex-direction: row-reverse;
}

.msg-bubble {
  padding: 12px 16px;
  display: inline-block;
  font-size: 14px;
  line-height: 1.5;

  p { word-break: break-word; }
}

.msg-translation {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 0 4px;
  font-size: 12px;
  color: #9E9E9E;
  line-height: 1.4;

  svg { flex-shrink: 0; margin-top: 2px; }
}

/* 输入区 */
.input-area {
  flex-shrink: 0;
  background: #FFFFFF;
  border-top: 1px solid #EEEEEE;
  padding: 16px 20px;
}

.input-section-label {
  font-size: 12px;
  font-weight: 600;
  color: #424242;
  margin-bottom: 8px;
}

.input-row {
  margin-bottom: 10px;
}

.cn-textarea {
  width: 100%;
  border: 1.5px solid #E0E0E0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #1A1A1A;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: #FABE1D; }
  &::placeholder { color: #BDBDBD; }
}

.translation-preview {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 10px;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8A6A10;
  font-weight: 600;
  margin-bottom: 6px;
}

.preview-text {
  font-size: 14px;
  color: #5A4520;
  line-height: 1.5;
}

.input-actions {
  display: flex;
  gap: 10px;
}

.btn-translate {
  flex: 1;
  height: 40px;
  border: 1.5px solid #FABE1D;
  border-radius: 20px;
  background: #FFFFFF;
  color: #8A6A10;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) { background: #FFFBEB; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.btn-send {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 20px;
  background: #FABE1D;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(250, 190, 29, 0.4);

  &:hover:not(:disabled) { background: #E5A60C; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

/* 快捷回复 */

.quick-reply-btn {
  display: block;
  width: 100%;
  padding: 10px 14px;
  background: #FAFAFA;
  border: 1px solid #EEEEEE;
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;

  &:hover {
    background: #FFFBEB;
    border-color: #FABE1D;
  }
}

.qr-cn {
  font-size: 13px;
  color: #424242;
  line-height: 1.4;
}

.tips-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #EEEEEE;
}

.tips-title {
  font-size: 13px;
  font-weight: 700;
  color: #424242;
  margin-bottom: 10px;
}

.tips-list {
  padding-left: 16px;
  margin: 0;

  li {
    font-size: 12px;
    color: #757575;
    line-height: 1.6;
    margin-bottom: 6px;
  }
}

/* 响应式 */
@media screen and (max-width: $pad-max-width) {
  .admin-body {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .conv-sidebar,
  .panel-left {
    display: none;
  }

  .panel-center {
    height: calc(100vh - 70px);
  }
}

.quick-replies-section {
  margin-top: 24px;
  .quick-replies {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
  }
  .quick-replies-hint {
    font-size: 11px;
    color: #9E9E9E;
    margin-bottom: 4px;
  }
  .tips-section {
    .tips-title { font-size: 12px; font-weight: 700; color: #666; margin-bottom: 6px; }
    .tips-list { padding-left: 16px; margin: 0; li { font-size: 11px; color: #888; margin-bottom: 4px; } }
  }
}
</style>
