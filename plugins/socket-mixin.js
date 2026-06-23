/**
 * WebSocket 管理 Mixin
 * 封装骑手聊天系统的通用 WebSocket 逻辑
 * 包含：连接、重连、心跳、消息解析、滚动到底部
 */

const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000];

export default {
  data() {
    return {
      socket: null,
      reconnectTimer: null,
      reconnectAttempts: 0,
      socketManuallyClosed: false,
      pingTimer: null
    };
  },
  methods: {
    buildSocketPingMessage() {
      return JSON.stringify({
        type: 'message',
        event: 'socket.ping',
        data: {},
        time: Math.floor(Date.now() / 1000)
      });
    },

    startSocketPing() {
      this.clearSocketPing();
      this.pingTimer = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(this.buildSocketPingMessage());
        }
      }, 10000);
    },

    clearSocketPing() {
      if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
    },

    scheduleReconnect() {
      this.clearReconnectTimer();
      const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempts, RECONNECT_DELAYS.length - 1)];
      this.reconnectAttempts += 1;
      this.reconnectTimer = setTimeout(() => {
        this.doReconnect();
      }, delay);
    },

    doReconnect() {
      if (typeof this.reconnect === 'function') {
        this.reconnect();
      } else if (this.applicationId) {
        this.connectSocket();
      }
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
      if (typeof this.onSocketClosed === 'function') {
        this.onSocketClosed();
      }
    },

    scrollToBottom() {
      const el = this.$refs.chatBody || this.$refs.messagesArea;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    },

    /**
     * 解析 WebSocket 消息，提取 event 和 data
     */
    parseSocketPayload(raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },

    /**
     * 默认消息处理器（可由组件覆盖）
     * 返回 true 表示已处理，false 表示跳过
     */
    handleSocketMessage(raw) {
      const payload = this.parseSocketPayload(raw);
      if (!payload) return false;

      const event = payload.event;
      const data = payload.data || {};

      if (event === 'socket.pong') return true;
      if (event === 'socket.connected') {
        this.startSocketPing();
        return true;
      }
      return false;
    },

    /**
     * 建立 WebSocket 连接（由子类提供 socketUrl）
     */
    connectSocket() {
      if (!process.client) return;
      this.socketManuallyClosed = false;
      this.clearReconnectTimer();
      this.clearSocketPing();
      if (this.socket) {
        this.socket.onclose = null;
        this.socket.close();
      }

      Promise.resolve()
        .then(() => typeof this.getSocketUrl === 'function' ? this.getSocketUrl() : null)
        .then(url => {
          if (!url) throw new Error('socket url unavailable');
          return url;
        })
        .then(url => {
          const socket = new WebSocket(url);
          this.socket = socket;
          socket.onopen = () => {
            this.reconnectAttempts = 0;
          };
          socket.onmessage = (event) => {
            this.onSocketMessage(event.data);
          };
          socket.onerror = () => {};
          socket.onclose = () => {
            this.clearSocketPing();
            if (!this.socketManuallyClosed) {
              this.scheduleReconnect();
            }
          };
        })
        .catch(err => {
          console.error('WebSocket connect error:', err);
          this.scheduleReconnect();
        });
    }
  }
};
