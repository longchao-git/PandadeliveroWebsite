<template>
  <div class="chat-page">
    <!-- 顶部导航 -->
    <div class="chat-header">
      <div class="chat-header-inner">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="chat-header-center">
          <img src="@/assets/images/cloudSales/header2-logo.png" alt="Pandadelivero" class="chat-logo" />
          <div class="chat-header-info">
            <span class="chat-title">{{ $t('chatTitle') }}</span>
            <span class="chat-subtitle">Pandadelivero</span>
          </div>
        </div>
        <div class="chat-header-right">
          <span v-if="applicationId" class="app-id-tag">{{ applicationId }}</span>
        </div>
      </div>
    </div>

    <!-- 聊天内容区 -->
    <div class="chat-body" ref="chatBody">
      <!-- 欢迎消息 -->
      <div class="welcome-section">
        <div class="welcome-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#FABE1D"/>
          </svg>
        </div>
        <h3>{{ $t('chatTitle') }}</h3>
        <p>{{ $t('chatIntroDesc') }}</p>
        <div v-if="formSummary" class="welcome-summary">
          <div class="summary-item">
            <span class="s-label">{{ $t('name') }}</span>
            <span class="s-val">{{ formSummary.uname }} {{ formSummary.last_name }}</span>
          </div>
          <div class="summary-item">
            <span class="s-label">{{ $t('city') }}</span>
            <span class="s-val">{{ getCityName(formSummary.city_id) }}</span>
          </div>
          <div class="summary-item">
            <span class="s-label">{{ $t('vehicleType') }}</span>
            <span class="s-val">{{ $t(getVehicleLabel(formSummary.vehicle_type)) }}</span>
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
      </div>
    </div>
  </div>
</template>

<script>
const CITY_NAMES = {
  1: { es: 'Valencia', zh: '瓦伦西亚', en: 'Valencia' },
  2: { es: 'Madrid', zh: '马德里', en: 'Madrid' },
  3: { es: 'Barcelona', zh: '巴塞罗那', en: 'Barcelona' },
  4: { es: 'Otra ciudad', zh: '其他城市', en: 'Other city' }
};
const VEHICLE_MAP = { moto: 'moto', bici_electrica: 'biciElectrica', bici: 'bici', coche: 'coche' };

export default {
  name: 'rider-chat',
  layout: 'default',
  data() {
    return {
      applicationId: '',
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
    // 优先级：URL参数 > sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    this.applicationId = urlParams.get('app_id') || sessionStorage.getItem('rider_application_id') || '';
    if (!this.applicationId) {
      this.$message.error(this.$t('noApplicationIdRedirect'));
      setTimeout(() => { window.location.href = '/rider'; }, 1500);
      return;
    }
    // JSON schema校验，防止XSS注入
    try {
      const s = sessionStorage.getItem('rider_form_summary');
      if (s) {
        const raw = JSON.parse(s);
        const schema = {
          uname: { type: 'string', max: 50, pattern: /^[\u4e00-\u9fa5a-zA-Z\s·'.-]*$/ },
          last_name: { type: 'string', max: 50, pattern: /^[\u4e00-\u9fa5a-zA-Z\s·'.-]*$/ },
          city_id: { type: 'number', range: [1, 99] },
          vehicle_type: { type: 'string', max: 30 },
          mobile: { type: 'string', max: 20 }
        };
        const validated = {};
        let valid = true;
        for (const [key, rule] of Object.entries(schema)) {
          const val = raw[key];
          if (val === undefined || val === null) continue;
          if (typeof val !== rule.type) { valid = false; break; }
          if (typeof val === 'string' && (val.length > rule.max || !rule.pattern.test(val))) { valid = false; break; }
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
  },
  beforeDestroy() {
    this.closeSocket();
  },
  methods: {
    unwrapData(res) {
      return res && res.data ? res.data : res;
    },
    getCityName(cityId) {
      const lang = this.$i18n.locale;
      return CITY_NAMES[cityId]?.[lang] || cityId;
    },
    getVehicleLabel(type) {
      return VEHICLE_MAP[type] || type || '';
    },
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
      if (!this.applicationId) return;
      this.loading = true;
      try {
        const res = await this.$axios.get(`/chat/conversations-messages-${this.applicationId}`);
        const data = this.unwrapData(res);
        if (Array.isArray(data.messages)) {
          this.messages = data.messages.map(item => this.normalizeMessage(item)).filter(Boolean);
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
        await this.$axios.post(`/chat/conversations-messages-${this.applicationId}`, {
          content: text,
          sender_type: 'rider',
          sender_id: this.applicationId
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
      if (normalized.message_id && this.messages.some(item => String(item.message_id) === normalized.message_id)) {
        return;
      }
      if (!normalized.content && !normalized.content_es && normalized.sender_type !== 'system') return;
      this.messages.push(normalized);
      this.$nextTick(() => this.scrollToBottom());
    },
    async socketUrl() {
      const res = await this.$axios.get('/chat/socket-address', {
        params: { application_id: this.applicationId }
      });
      return this.unwrapData(res).url;
    },
    async connectSocket() {
      if (!process.client || !this.applicationId) return;
      this.socketManuallyClosed = false;
      this.clearReconnectTimer();
      this.clearSocketPing();
      if (this.socket) {
        this.socket.onclose = null;
        this.socket.close();
      }

      let url = '';
      try {
        url = await this.socketUrl();
      } catch (e) {
        console.error('get socket url error:', e);
        this.scheduleReconnect();
        return;
      }
      const socket = new WebSocket(url);
      this.socket = socket;
      socket.onopen = () => {
        this.reconnectAttempts = 0;
      };
      socket.onmessage = (event) => {
        this.handleSocketMessage(event.data);
      };
      socket.onerror = () => {};
      socket.onclose = () => {
        this.clearSocketPing();
        if (!this.socketManuallyClosed) {
          this.scheduleReconnect();
        }
      };
    },
    startSocketPing() {
      this.clearSocketPing();
      this.pingTimer = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(this.buildSocketPingMessage());
        }
      }, 10000);
    },
    buildSocketPingMessage() {
      return JSON.stringify({
        type: 'message',
        event: 'socket.ping',
        data: {},
        time: Math.floor(Date.now() / 1000)
      });
    },
    clearSocketPing() {
      if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
    },
    handleSocketMessage(raw) {
      let payload = null;
      try {
        payload = JSON.parse(raw);
      } catch (e) {
        return;
      }

      const event = payload.event;
      const data = payload.data || {};

      if (event === 'socket.pong') {
        return;
      }

      if (event === 'socket.connected') {
        this.startSocketPing();
        this.loadMessages();
        return;
      }

      if (event === 'chat.conversation.claimed' || event === 'chat.conversation.transferred') {
        return;
      }

      if (event !== 'chat.message') {
        return;
      }

      if (String(data.application_id || data.conversation_id || '') !== String(this.applicationId)) {
        return;
      }

      if (data.message) {
        this.appendMessage(data.message);
      }
    },
    scheduleReconnect() {
      this.clearReconnectTimer();
      const delays = [1000, 2000, 5000, 10000, 30000];
      const delay = delays[Math.min(this.reconnectAttempts, delays.length - 1)];
      this.reconnectAttempts += 1;
      this.reconnectTimer = setTimeout(() => {
        this.connectSocket();
      }, delay);
    },
    clearReconnectTimer() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    },
    closeSocket() {
      this.socketManuallyClosed = true;
      this.clearReconnectTimer();
      this.clearSocketPing();
      if (this.socket) {
        this.socket.onclose = null;
        this.socket.close();
        this.socket = null;
      }
    },
    scrollToBottom() {
      if (this.$refs.chatBody) {
        this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight;
      }
    },
    autoResize(e) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    },
    goBack() {
      window.location.href = '/';
    }
  }
};
</script>

<style lang="scss" scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  background: #FAFAFA;
}

/* 顶部导航 */
.chat-header {
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
  flex-shrink: 0;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
}

.chat-header-inner {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid #EEEEEE;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #616161;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
    border-color: #FABE1D;
    color: #FABE1D;
  }
}

.chat-header-center {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.chat-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.chat-header-info {
  display: flex;
  flex-direction: column;
}

.chat-title {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
}

.chat-subtitle {
  font-size: 12px;
  color: #9E9E9E;
}

.chat-header-right {
  flex-shrink: 0;
}

.app-id-tag {
  font-size: 11px;
  color: #9E9E9E;
  background: #F5F5F5;
  padding: 4px 10px;
  border-radius: 12px;
}

/* 聊天内容 */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 欢迎区 */
.welcome-section {
  text-align: center;
  padding: 32px 20px;
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #F0E8C0;
  margin-bottom: 8px;

  h3 {
    font-size: 22px;
    font-weight: 700;
    color: #1A1A1A;
    margin: 16px 0 8px;
  }

  p {
    font-size: 14px;
    color: #757575;
    max-width: 400px;
    margin: 0 auto 20px;
    line-height: 1.6;
  }
}

.welcome-icon {
  display: inline-block;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #FFFBEB;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-summary {
  background: #FAFAFA;
  border-radius: 14px;
  padding: 16px 20px;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.summary-item {
  display: flex;
  gap: 20px;
}

.s-label {
  font-size: 12px;
  color: #9E9E9E;
  min-width: 60px;
}

.s-val {
  font-size: 13px;
  color: #424242;
  font-weight: 600;
}

/* 消息列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  gap: 12px;
  align-items: flex-end;

  &.message-mine {
    flex-direction: row-reverse;

    .message-bubble {
      background: #FABE1D;
      border-radius: 20px 20px 4px 20px;
      color: #FFFFFF;
    }

    .message-translation {
      text-align: right;
    }

    .message-time {
      text-align: right;
    }

    .message-sender-name {
      text-align: right;
    }
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;

  &.rider {
    background: #FABE1D;
  }

  &.recruiter {
    background: #2DC15C;
  }
}

.message-content-wrap {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-sender-name {
  font-size: 11px;
  color: #9E9E9E;
  padding: 0 4px;
}

.message-bubble {
  padding: 12px 16px;
  display: inline-block;
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.message-translation {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 0 4px;
  font-size: 12px;
  color: #9E9E9E;
  line-height: 1.4;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
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
  padding: 0 4px;
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
  border-top: 1px solid #EEEEEE;
  padding: 16px 20px;
}

.chat-footer-inner {
  max-width: 800px;
  margin: 0 auto;
}

.input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #F5F5F5;
  border-radius: 24px;
  padding: 8px 8px 8px 20px;
  border: 1.5px solid transparent;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #FABE1D;
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

  &::placeholder {
    color: #BDBDBD;
  }
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

    &:hover {
      background: #E5A60C;
    }
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media screen and (max-width: $phone-max-width) {
  .chat-page {
    height: calc(100vh - 120px);
  }

  .message-content-wrap {
    max-width: 82%;
  }
}
</style>
