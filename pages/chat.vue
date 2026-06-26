<template>
  <div class="chat-page">
    <!-- 顶部 Banner -->
    <div class="chat-banner">
      <div class="banner-inner">
        <div class="banner-tag">{{ $t('bannerTag') || '运力合作入口' }}</div>
        <h1 class="banner-title">{{ $t('bannerTitle') || '西班牙同城配送本地网络' }}</h1>
        <p class="banner-desc">{{ $t('bannerDesc') || '骑手申请后即可通过平台与运营团队实时沟通，获取接单指导、区域政策与专属福利支持。' }}</p>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div class="chat-body-wrapper" ref="chatBody">
      <!-- 可滚动区域：欢迎区 + 消息 -->
      <div class="chat-scroll-area" ref="messagesArea">
        <!-- 欢迎区 -->
        <div v-if="formSummary" class="welcome-section">
          <div class="welcome-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#FABE1D"/>
            </svg>
          </div>
          <div class="welcome-right">
            <h3>{{ $t('chatTitle') }}</h3>
            <p>{{ $t('chatIntroDesc') }}</p>
            <div class="welcome-summary">
              <div class="summary-row">
                <span class="s-label">{{ $t('name') }}</span>
                <span class="s-val">{{ formSummary.uname }} {{ formSummary.last_name }}</span>
              </div>
              <div class="summary-row">
                <span class="s-label">{{ $t('city') }}</span>
                <span class="s-val">{{ getCityName(formSummary.city_id) }}</span>
              </div>
              <div class="summary-row">
                <span class="s-label">{{ $t('vehicleType') }}</span>
                <span class="s-val">{{ $t(getVehicleLabel(formSummary.vehicle_type)) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="messages-list">
          <template v-for="(msg, idx) in messages">
            <div
              v-if="msg.sender_type === 'system'"
              :key="'sys-' + (msg.message_id || idx)"
              class="system-message"
            >
              <span class="system-message-text">{{ msg.content_es || msg.content }}</span>
              <span class="system-message-time">{{ formatTime(msg.created_at) }}</span>
            </div>
            <div
              v-else
              :key="msg.message_id || idx"
              class="message-item"
              :class="msg.sender_type === 'rider' ? 'message-mine' : 'message-other'"
            >
              <div class="message-avatar">
                <div class="avatar-circle" :class="msg.sender_type">
                  {{ msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : '?' }}
                </div>
              </div>
              <div class="message-content-wrap">
                <div class="message-sender-name">{{ msg.sender_name }}</div>
                <div class="message-bubble">
                  <p class="message-text">{{ msg.sender_type === 'rider' ? msg.content : displayMessageContent(msg) }}</p>
                </div>
                <div v-if="msg.sender_type === 'rider' && msg.content_es && msg.content_es !== msg.content" class="message-translation">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z" fill="#9E9E9E"/>
                  </svg>
                  <span>{{ msg.content_es }}</span>
                </div>
                <div class="message-time">{{ formatTime(msg.created_at) }}</div>
              </div>
            </div>
          </template>

          <!-- 加载中 -->
          <div v-if="loading" class="message-loading">
            <div class="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部输入区 -->
      <div class="chat-footer">
        <div class="chat-footer-inner">
          <div class="input-wrap">
            <textarea
              ref="inputArea"
              v-model="inputText"
              :placeholder="$t('writeMessage')"
              class="chat-input"
              rows="1"
              @keydown.enter.exact.prevent="handleSend"
              @input="autoResize"
            />
            <button
              class="send-btn"
              :disabled="!inputText.trim() || sending"
              :class="{ active: inputText.trim() }"
              @click="handleSend"
            >
              <svg v-if="!sending" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-else class="sending-spinner"></span>
            </button>
          </div>
          <button class="exit-chat-btn" @click="handleExitChat">
            {{ $t('exitChat') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVehicleLabel, CITY_NAMES } from '@/utils/rider';
import { unwrapData } from '@/utils/api';

export default {
  name: 'rider-chat',
  layout: 'header-only',
  data() {
    return {
      applicationId: '',
      conversationId: '',
      applicationType: '',
      formSummary: null,
      inputText: '',
      messages: [],
      sending: false,
      loading: false,
      socket: null,
      reconnectTimer: null,
      reconnectAttempts: 0,
      socketManuallyClosed: false,
      pingTimer: null
    };
  },
  mounted() {
    // 优先级：URL参数 > sessionStorage > localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let appId = urlParams.get('app_id') || sessionStorage.getItem('application_id') || sessionStorage.getItem('rider_application_id') || '';

    // 如果 URL 和 sessionStorage 都没有，从 localStorage 读取
    if (!appId) {
      try {
        const pendingChat = localStorage.getItem('rider_pending_chat');
        if (pendingChat) {
          const chatData = JSON.parse(pendingChat);
          if (chatData.application_id) {
            appId = chatData.application_id;
          }
        }
      } catch (e) {
        console.error('Parse localStorage pending chat error:', e);
      }
    }

    this.applicationId = appId;
    this.conversationId = urlParams.get('conversation_id') || sessionStorage.getItem('conversation_id') || this.applicationId || '';
    this.applicationType = urlParams.get('type') || sessionStorage.getItem('application_type') || '';

    if (!this.applicationId || !this.conversationId) {
      this.$message.error(this.$t('noApplicationIdRedirect'));
      setTimeout(() => { window.location.href = '/rider'; }, 1500);
      return;
    }

    // 保存到 sessionStorage
    sessionStorage.setItem('rider_application_id', this.applicationId);
    sessionStorage.setItem('application_id', this.applicationId);
    if (this.conversationId) {
      sessionStorage.setItem('conversation_id', this.conversationId);
    }
    if (this.applicationType) {
      sessionStorage.setItem('application_type', this.applicationType);
    }

    // JSON schema校验，防止XSS注入
    try {
      let s = sessionStorage.getItem('rider_form_summary');
      // 如果 sessionStorage 没有，尝试从 localStorage 读取
      if (!s) {
        const pendingChat = localStorage.getItem('rider_pending_chat');
        if (pendingChat) {
          const chatData = JSON.parse(pendingChat);
          if (chatData.formSummary) {
            s = JSON.stringify(chatData.formSummary);
          }
        }
      }
      if (s) {
        const raw = JSON.parse(s);
        const schema = {
          uname: { type: 'string', max: 50, pattern: /^[\u4e00-\u9fa5a-zA-Z\s·'.-]*$/ },
          last_name: { type: 'string', max: 50, pattern: /^[\u4e00-\u9fa5a-zA-Z\s·'.-]*$/ },
          city_id: { type: 'number', range: [1, 99] },
          vehicle_type: { type: 'string', max: 30 },
          mobile: { type: 'string', max: 20 },
          team_name: { type: 'string', max: 100 },
          type: { type: 'string', max: 20 },
          conversation_id: { type: 'string', max: 32 },
          rider_count: { type: 'number', range: [0, 99] }
        };
        const validated = {};
        let valid = true;
        for (const [key, rule] of Object.entries(schema)) {
          const val = raw[key];
          if (val === undefined || val === null) continue;
          if (typeof val !== rule.type) { valid = false; break; }
          if (typeof val === 'string' && (val.length > rule.max || (rule.pattern && !rule.pattern.test(val)))) { valid = false; break; }
          if (typeof val === 'number' && (val < rule.range[0] || val > rule.range[1])) { valid = false; break; }
          validated[key] = val;
        }
        this.formSummary = valid ? validated : null;
      } else {
        this.formSummary = null;
      }
    } catch (e) {
      this.formSummary = null;
    }
    this.connectSocket();

    this.$once('hook:destroyed', () => {
      this.closeSocket();
    });
  },
  beforeDestroy() {
    this.closeSocket();
  },
  methods: {
    getCityName(cityId) {
      const lang = this.$i18n.locale;
      return CITY_NAMES[cityId]?.[lang] || cityId;
    },
    getVehicleLabel,
    formatTime(ts) {
      if (!ts) return '';
      try {
        const d = new Date(ts);
        return d.toLocaleTimeString(this.$i18n.locale, { hour: '2-digit', minute: '2-digit' });
      } catch {
        return ts;
      }
    },
    displayMessageContent(msg) {
      if (!msg) return '';
      return msg.client_content || msg.content_es || msg.content || '';
    },
    async loadMessages() {
      if (!this.conversationId) return;
      this.loading = true;
      // 重置已显示消息 ID 集合
      this._displayedMessageIds = new Set();
      try {
        const res = await this.$axios.get(`/api/v1/chat/conversations-messages-${this.conversationId}`);
        const data = unwrapData(res);
        if (Array.isArray(data.messages)) {
          this.messages = data.messages.map(item => this.normalizeMessage(item)).filter(Boolean);
          // 预填充已显示的消息 ID
          this.messages.forEach(msg => {
            if (msg.message_id) {
              this._displayedMessageIds.add(msg.message_id);
            }
          });
        }
        this.$nextTick(() => this.scrollToBottom());
      } catch (err) {
        console.error('loadMessages error:', err);
      } finally {
        this.loading = false;
      }
    },
    async handleSend() {
      if (!this.inputText.trim() || this.sending) return;
      const text = this.inputText.trim();
      this.inputText = '';
      this.sending = true;
      try {
        await this.$axios.post(`/api/v1/chat/conversations-messages-${this.conversationId}`, {
          content: text,
          sender_type: 'rider',
          sender_id: this.conversationId
        });
      } catch (err) {
        this.$message.error(this.$t('messageSendError'));
        this.inputText = text;
      } finally {
        this.sending = false;
      }
    },
    normalizeMessage(message) {
      if (!message || typeof message !== 'object') return null;
      return {
        message_id: String(message.message_id || ''),
        sender_type: message.sender_type || 'system',
        sender_name: message.sender_name || '',
        content: message.content || '',
        content_es: message.content_es || message.client_content || message.content || '',
        client_content: message.client_content || message.content_es || message.content || '',
        content_zh: message.content_zh || '',
        created_at: message.created_at || new Date().toISOString()
      };
    },
    appendMessage(message) {
      const normalized = this.normalizeMessage(message);
      if (!normalized) return;
      // 使用 Set 来跟踪已显示的消息 ID
      if (!this._displayedMessageIds) {
        this._displayedMessageIds = new Set();
      }
      const msgId = normalized.message_id;
      if (msgId && this._displayedMessageIds.has(msgId)) {
        return;
      }
      if (msgId) {
        this._displayedMessageIds.add(msgId);
      }
      if (!normalized.content && !normalized.content_es && normalized.sender_type !== 'system') return;
      this.messages.push(normalized);
      this.$nextTick(() => this.scrollToBottom());
    },
    async getSocketUrl() {
      const res = await this.$axios.get('/api/v1/chat/socket-address', {
        params: { conversation_id: this.conversationId, application_id: this.applicationId }
      });
      return unwrapData(res).url;
    },
    async connectSocket() {
      if (!process.client || !this.conversationId) return;
      this.socketManuallyClosed = false;
      this.clearReconnectTimer();
      this.clearSocketPing();
      if (this.socket) {
        this.socket.onclose = null;
        this.socket.close();
      }
      let url = '';
      try {
        url = await this.getSocketUrl();
      } catch (e) {
        console.error('get socket url error:', e);
        this.scheduleReconnect();
        return;
      }
      const socket = new WebSocket(url);
      this.socket = socket;
      socket.onopen = () => { this.reconnectAttempts = 0; };
      socket.onmessage = (event) => { this.handleSocketMessage(event.data); };
      socket.onerror = () => {};
      socket.onclose = () => {
        this.clearSocketPing();
        if (!this.socketManuallyClosed) this.scheduleReconnect();
      };
    },
    startSocketPing() {
      this.clearSocketPing();
      this.pingTimer = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'message', event: 'socket.ping', data: {}, time: Math.floor(Date.now() / 1000) }));
        }
      }, 10000);
    },
    clearSocketPing() {
      if (this.pingTimer) { clearInterval(this.pingTimer); this.pingTimer = null; }
    },
    handleSocketMessage(raw) {
      let payload = null;
      try { payload = JSON.parse(raw); } catch { return; }
      const event = payload.event;
      const data = payload.data || {};
      if (event === 'socket.pong') return;
      if (event === 'socket.connected') {
        this.startSocketPing();
        this.loadMessages();
        return;
      }
      if (event === 'chat.conversation.claimed' || event === 'chat.conversation.transferred') return;
      if (event !== 'chat.message') return;
      if (String(data.conversation_id || '') !== String(this.conversationId)) return;
      if (data.message) this.appendMessage(data.message);
    },
    scheduleReconnect() {
      this.clearReconnectTimer();
      // 指数退避策略：1s, 2s, 4s, 8s, 16s, 32s (最大 30s)
      const baseDelay = 1000;
      const maxDelay = 30000;
      const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts), maxDelay);
      this.reconnectAttempts += 1;
      this.reconnectTimer = setTimeout(() => { this.connectSocket(); }, delay);
    },
    clearReconnectTimer() {
      if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    },
    closeSocket() {
      this.socketManuallyClosed = true;
      this.clearReconnectTimer();
      this.clearSocketPing();

      if (this.socket) {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket.onclose = null;
        try {
          if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
            this.socket.close();
          }
        } catch (e) {
          console.warn('WebSocket close error:', e);
        }
        this.socket = null;
      }
    },
    scrollToBottom() {
      if (this.$refs.messagesArea) {
        this.$refs.messagesArea.scrollTop = this.$refs.messagesArea.scrollHeight;
      }
    },
    autoResize(e) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    },
    goBack() {
      window.location.href = '/';
    },
    handleExitChat() {
      this.$confirm(this.$t('confirmExitChat'), this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.clearChatData();
        window.location.href = '/';
      }).catch(() => {});
    },
    clearChatData() {
      localStorage.removeItem('rider_pending_chat');
      sessionStorage.removeItem('rider_application_id');
      sessionStorage.removeItem('rider_form_summary');
    }
  }
};
</script>

<style lang="scss" scoped>
.chat-page {
  display: flex;
  flex-direction: column;

  height: calc(100vh - 100px);
  overflow: hidden;
  background: #F0F2F5;
}

/* 顶部 Banner */
.chat-banner {
  flex-shrink: 0;
  background: #fff7d8;
  border-bottom: 2px solid #f0e0a0;
  padding: 16px 16px 14px;
}

.banner-inner {
  max-width: 800px;
  margin: 0 auto;
}

.banner-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #FFFFFF;
  background: #FABE1D;
  padding: 3px 10px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.banner-title {
  font-size: 18px;
  font-weight: 800;
  color: #8b6a2a;
  margin: 0 0 6px;
  line-height: 1.3;
}

.banner-desc {
  font-size: 12px;
  color: #b09060;
  margin: 0;
  line-height: 1.6;
}

/* 聊天主体 */
.chat-body-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  background: #FFFFFF;
  border-left: 1.5px solid #F0E8C0;
  border-right: 1.5px solid #F0E8C0;
  overflow: hidden;
  min-height: 0;
}

/* 可滚动区域 */
.chat-scroll-area {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #fff7d8;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: #F0E8C0; border-radius: 3px; }
}

/* 欢迎区 */
.welcome-section {
  background: #FFFFFF;
  padding: 14px 16px;
  border-bottom: 1px solid #F0E8C0;
  flex-shrink: 0;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.welcome-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FFFBEB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-right {
  flex: 1;
  min-width: 0;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0 0 4px;
  }

  p {
    font-size: 12px;
    color: #757575;
    margin: 0 0 10px;
    line-height: 1.5;
  }
}

.welcome-summary {
  background: #FAFAFA;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.s-label {
  font-size: 11px;
  color: #9E9E9E;
  min-width: 40px;
  flex-shrink: 0;
}

.s-val {
  font-size: 12px;
  color: #424242;
  font-weight: 600;
}

/* 消息列表 */
.messages-list {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.system-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
}

.system-message-text {
  display: inline-block;
  max-width: 85%;
  padding: 6px 14px;
  background: #EEEEEE;
  border-radius: 12px;
  font-size: 12px;
  color: #757575;
  text-align: center;
  line-height: 1.5;
}

.system-message-time {
  font-size: 11px;
  color: #BDBDBD;
}

.message-item {
  display: flex;
  gap: 10px;
  align-items: flex-end;

  &.message-mine {
    flex-direction: row-reverse;

    .message-bubble {
      background: #FABE1D;
      border-radius: 20px 20px 4px 20px;
      color: #FFFFFF;
    }

    .message-translation { text-align: right; }
    .message-time { text-align: right; }
    .message-sender-name { text-align: right; }
  }

  &.message-other {
    .message-bubble {
      background: #FFFFFF;
      border-radius: 20px 20px 20px 4px;
      color: #1A1A1A;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
  }
}

.message-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;

  &.rider { background: #FABE1D; }
  &.recruiter { background: #2DC15C; }
}

.message-content-wrap {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.message-sender-name {
  font-size: 11px;
  color: #9E9E9E;
  padding: 0 4px;
}

.message-bubble {
  padding: 10px 14px;
  display: inline-block;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  margin: 0;
}

.message-translation {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 0 4px;
  font-size: 12px;
  color: #9E9E9E;
  line-height: 1.4;

  svg { flex-shrink: 0; margin-top: 2px; }
}

.message-time {
  font-size: 11px;
  color: #BDBDBD;
  padding: 0 4px;
}

/* 加载动画 */
.message-loading {
  display: flex;
  justify-content: flex-start;
}

.loading-dots {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #BDBDBD;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 底部输入 */
.chat-footer {
  flex-shrink: 0;
  background: #FFFFFF;
  border-top: 1.5px solid #F0E8C0;
  padding: 10px 16px;
}

.chat-footer-inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-wrap {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #F5F5F5;
  border-radius: 24px;
  padding: 8px 8px 8px 20px;
  border: 1.5px solid transparent;
  transition: border-color 0.2s;

  &:focus-within { border-color: #FABE1D; }
}

.exit-chat-btn {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1.5px solid #E0E0E0;
  background: #FFFFFF;
  color: #757575;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #F56C66;
    color: #F56C6C;
    background: #FFF5F5;
  }
}

.chat-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1A1A1A;
  resize: none;
  outline: none;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
  padding: 6px 0;

  &::placeholder { color: #BDBDBD; }
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #E0E0E0;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
  transition: all 0.2s;
  flex-shrink: 0;

  &.active {
    background: #FABE1D;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(250, 190, 29, 0.4);

    &:hover { background: #E5A60C; }
  }
}

.sending-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #FFFFFF;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media screen and (max-width: $phone-max-width) {
  .chat-page {
    height: calc(100vh - 120px);
  }

  .chat-body-wrapper {
    border-left: none;
    border-right: none;
  }

  .chat-footer-inner {
    flex-direction: column;
    gap: 8px;
  }

  .input-wrap {
    width: 100%;
  }

  .exit-chat-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
