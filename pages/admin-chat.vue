<template>
  <div class="admin-chat-page">

    <!-- 验证加载中 -->
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
    <!-- 正常聊天界面 -->
    <template v-else>
      <!-- 主内容 -->
      <div class="chat-main">

        <!-- 聊天区：左会话列表 + 中聊天 + 右申请资料 -->
        <div class="chat-body">

          <!-- 左栏：对话列表 -->
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
                <span class="conv-badge" :class="conv.latest_status || 'new'">
                  {{ $t(conv.latest_status || 'new') }}
                </span>
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
              <div v-if="translatedPreview" class="translation-preview">
                <div class="preview-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z" fill="#FABE1D"/>
                  </svg>
                  {{ $t('aiTranslationPreview') }}
                </div>
                <p class="preview-text">{{ translatedPreview }}</p>
              </div>
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

          <!-- 右栏：申请资料 -->
          <div class="panel-right">
            <div class="section-title">{{ $t('applicationInfo') }}</div>
            <div v-if="applicationDetail" class="app-detail-card">
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
      pollingTimer: null
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

<style lang="scss">
$yellow: #FABE1D;
$green: #2DC15C;
$border: #F0E8C0;
$bg-page: #F0F2F5;
$bg-card: #FFFFFF;

.admin-chat-page {
  min-height: calc(100vh - 80px);
  background: $bg-page;
}

/* ========== 加载 ========== */
.page-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  p { color: #9E9E9E; font-size: 14px; }
}

/* ========== 错误页 ========== */
.page-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  gap: 16px;
  background: $bg-page;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-text {
  font-size: 16px;
  color: #666;
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
  transition: background 0.2s;
  &:hover { background: darken(#FABE1D, 8%); }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $border;
  border-top-color: $yellow;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  &.small { width: 22px; height: 22px; border-width: 2px; }
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ========== 主内容区 ========== */
.chat-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 24px 40px;
}

/* ========== 三栏主体 ========== */
.chat-body {
  background: $bg-card;
  border: 1.5px solid $border;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 260px 1fr 360px;
  height: calc(100vh - 120px - 40px);
}

/* ========== 左栏：会话列表 ========== */
.conv-sidebar {
  background: $bg-card;
  border-right: 1.5px solid $border;
  display: flex;
  flex-direction: column;
}

.conv-sidebar-header {
  padding: 14px 18px 12px;
  border-bottom: 1.5px solid $border;
  h3 {
    font-size: 13px;
    font-weight: 700;
    color: #1A1A1A;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }
}

.conv-loading,
.conv-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  p { font-size: 13px; color: #9E9E9E; text-align: center; }
}

.conv-list {
  overflow-y: auto;
  flex: 1;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: $border; border-radius: 2px; }
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 18px;
  cursor: pointer;
  border-bottom: 1px solid #F8F5E8;
  transition: background 0.15s;
  &:hover { background: #FAFAFA; }
  &.active {
    background: #FFFBEB;
    border-left: 3px solid $yellow;
    padding-left: 15px;
  }
}

.conv-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, $yellow 0%, #F5A623 100%);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(250,190,29,0.35);
}

.conv-info { flex: 1; overflow: hidden; }

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

/* ========== 中栏：聊天 ========== */
.panel-center {
  display: flex;
  flex-direction: column;
  background: $bg-page;
  overflow: hidden;
}

.panel-center-header {
  background: $bg-card;
  border-bottom: 1.5px solid $border;
  padding: 14px 24px;
  flex-shrink: 0;
}

.chat-with {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-with-name {
  font-size: 15px;
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
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: $border; border-radius: 3px; }
}

.loading-messages,
.empty-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #9E9E9E;
  font-size: 14px;
  gap: 8px;
}

.chat-message {
  display: flex;
  gap: 10px;
  align-items: flex-end;

  &.rider {
    flex-direction: row;
    .msg-bubble {
      background: $bg-card;
      color: #1A1A1A;
      border-radius: 2px 16px 16px 16px;
      border: 1px solid #EFEFEF;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
  }

  &.recruiter {
    flex-direction: row-reverse;
    .msg-bubble {
      background: $yellow;
      color: #FFFFFF;
      border-radius: 16px 2px 16px 16px;
      box-shadow: 0 2px 8px rgba(250,190,29,0.35);
    }
  }
}

.msg-avatar {
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
  &.rider { background: $yellow; box-shadow: 0 2px 6px rgba(250,190,29,0.3); }
  &.recruiter { background: $green; box-shadow: 0 2px 6px rgba(45,193,92,0.3); }
}

.msg-body {
  max-width: 62%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.msg-header {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0 4px;
}

.msg-name {
  font-size: 11px;
  color: #9E9E9E;
  font-weight: 600;
}

.msg-time {
  font-size: 10px;
  color: #C8C8C8;
}

.recruiter .msg-header {
  flex-direction: row-reverse;
}

.msg-bubble {
  padding: 10px 14px;
  display: inline-block;
  font-size: 14px;
  line-height: 1.55;
  p { word-break: break-word; margin: 0; }
}

.msg-translation {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 2px 4px 0;
  font-size: 11px;
  color: #9E9E9E;
  line-height: 1.4;
  font-style: italic;
  svg { flex-shrink: 0; margin-top: 2px; }
}

/* ========== 输入区 ========== */
.input-area {
  flex-shrink: 0;
  background: $bg-card;
  border-top: 1.5px solid $border;
  padding: 14px 24px 16px;
}

.input-section-label {
  font-size: 11px;
  font-weight: 700;
  color: #9E9E9E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.input-row { margin-bottom: 10px; }

.cn-textarea {
  width: 100%;
  border: 1.5px solid $border;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #1A1A1A;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  background: $bg-page;
  &:focus { border-color: $yellow; background: $bg-card; }
  &::placeholder { color: #C8C8C8; }
}

.translation-preview {
  background: #FFFBEB;
  border: 1px solid $border;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 10px;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #8A6A10;
  font-weight: 700;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.preview-text {
  font-size: 14px;
  color: #5A4520;
  line-height: 1.5;
  margin: 0;
}

.input-actions {
  display: flex;
  gap: 10px;
}

.btn-translate {
  flex: 1;
  height: 40px;
  border: 1.5px solid $yellow;
  border-radius: 20px;
  background: $bg-card;
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
  background: $yellow;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 10px rgba(250,190,29,0.4);
  &:hover:not(:disabled) { background: #E5A60C; transform: translateY(-1px); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

/* ========== 右栏：申请资料 ========== */
.panel-right {
  background: $bg-card;
  border-left: 1.5px solid $border;
  overflow-y: auto;
  padding: 20px 18px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: $border; border-radius: 2px; }
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 2px solid $yellow;
}

.app-detail-card {
  background: $bg-page;
  border: 1.5px solid $border;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.detail-list { display: flex; flex-direction: column; }

.detail-item {
  display: flex;
  flex-direction: column;
  padding: 7px 0;
  border-bottom: 1px solid #F5F0E0;
  &:last-child { border-bottom: none; }
}

.d-label {
  font-size: 10px;
  color: #9E9E9E;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
}

.d-value {
  font-size: 13px;
  color: #1A1A1A;
  font-weight: 500;
}

/* ========== 响应式 ========== */
@media screen and (max-width: $pad-max-width) {
  .chat-body {
    grid-template-columns: 1fr;
    max-height: none;
    min-height: auto;
  }
  .conv-sidebar,
  .panel-right {
    display: none;
  }
  .panel-center {
    min-height: 500px;
  }
}
</style>
