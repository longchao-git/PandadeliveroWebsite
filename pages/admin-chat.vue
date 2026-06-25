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
              <button class="btn-logout" @click="logoutAdmin">{{ $t('logOut') }}</button>
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
                :class="{ active: String(conv.conversation_id) === String(conversationId), disabled: !socketReady }"
                @click="switchConversation(conv.conversation_id)"
              >
                <div class="conv-avatar">{{ (conv.rider_name || conv.uname || '?').charAt(0).toUpperCase() }}</div>
                <div class="conv-info">
                  <div class="conv-name">{{ conv.rider_name || conv.uname || '—' }}</div>
                  <div class="conv-meta">
                    <span class="conv-handler-tag" :class="handlerTagClass(conv)">{{ handlerLabel(conv) }}</span>
                    <span v-if="conv.city_name || conv.vehicle_type" class="conv-meta-text">
                      {{ conv.city_name || '' }}<template v-if="conv.city_name && conv.vehicle_type"> · </template>{{ conv.vehicle_type ? $t(getVehicleLabel(conv.vehicle_type)) : '' }}
                    </span>
                  </div>
                </div>
                <div class="conv-right">
                  <span
                    v-if="unreadCount(conv) > 0"
                    class="conv-unread"
                    :title="$t('unreadMessages', { count: unreadCount(conv) })"
                  >{{ formatUnreadCount(conv) }}</span>
                  <span class="conv-badge" :class="conv.latest_status || 'new'">
                    {{ $t(conv.latest_status || 'new') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 中栏：聊天记录 -->
          <div class="panel-center">
            <div class="panel-center-header">
              <div class="chat-with">
                <span class="chat-with-name">{{ applicationDetail ? (applicationDetail.type === 'team' ? (applicationDetail.team_name || applicationDetail.uname) : (applicationDetail.uname + ' ' + applicationDetail.last_name)) : '' }}</span>
                <span class="chat-with-city">{{ applicationDetail ? applicationDetail.city_name : '' }}</span>
              </div>
              <div v-if="conversationId" class="handler-bar">
                <span class="handler-text">
                  <template v-if="chatMode === 'active'">{{ $t('handlingByYou') }}</template>
                  <template v-else-if="handlerAdminName">{{ $t('handlingByOther', { name: handlerAdminName }) }}</template>
                  <template v-else>{{ $t('unassignedConversation') }}</template>
                </span>
                <button
                  v-if="chatMode === 'active'"
                  class="btn-transfer"
                  @click="openTransferModal"
                >
                  {{ $t('transferConversation') }}
                </button>
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
                <template v-for="(msg, idx) in messages">
                  <div
                    v-if="msg.sender_type === 'system'"
                    :key="'sys-' + (msg.message_id || idx)"
                    class="system-message"
                  >
                    <span class="system-message-text">{{ msg.content }}</span>
                    <span class="system-message-time">{{ formatTime(msg.created_at) }}</span>
                  </div>
                  <div
                    v-else
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
                      <div v-if="msg.content_es && msg.sender_type !== 'system'" class="msg-translation">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z" fill="#9E9E9E"/>
                        </svg>
                        {{ msg.sender_type === 'recruiter' ? msg.content_es : msg.content_zh }}
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>

            <!-- 输入区 -->
            <div class="input-area" :class="{ readonly: chatMode === 'readonly' }">
              <div v-if="chatMode === 'readonly'" class="readonly-tip">{{ $t('readonlyConversationTip', { name: handlerAdminName || '—' }) }}</div>
              <div class="input-section-label">{{ $t('recruiterInput') }}</div>
              <div class="input-row">
                <textarea
                  v-model="cnInput"
                  :placeholder="$t('recruiterInput')"
                  class="cn-textarea"
                  rows="3"
                  :disabled="!canSend"
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
                <button class="btn-translate" :disabled="!canSend || !cnInput.trim() || translating" @click="handleTranslate">
                  {{ translating ? $t('sending') + '...' : $t('generateSpanish') }}
                </button>
                <button class="btn-send" :disabled="!canSend || !cnInput.trim() || sending" @click="handleSend">
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
                  <span class="d-value">{{ applicationDetail.type === 'team' ? (applicationDetail.team_name || applicationDetail.uname) : (applicationDetail.uname + ' ' + applicationDetail.last_name) }}</span>
                </div>
                <div class="detail-item">
                  <span class="d-label">{{ $t('mobileNumber') }}</span>
                  <span class="d-value">{{ applicationDetail.mobile }}</span>
                </div>
                <div v-if="applicationDetail.email" class="detail-item">
                  <span class="d-label">{{ $t('email') }}</span>
                  <span class="d-value">{{ applicationDetail.email }}</span>
                </div>
                <div v-if="applicationDetail.type !== 'team'" class="detail-item">
                  <span class="d-label">{{ $t('contactType') }}</span>
                  <span class="d-value">{{ applicationDetail.contact_type === 'whatsapp' ? $t('whatsapp') : $t('smsShort') }}</span>
                </div>
                <div class="detail-item">
                  <span class="d-label">{{ $t('city') }}</span>
                  <span class="d-value">{{ applicationDetail.city_name }}</span>
                </div>
                <div v-if="applicationDetail.type !== 'team'" class="detail-item">
                  <span class="d-label">{{ $t('vehicleType') }}</span>
                  <span class="d-value">{{ $t(getVehicleLabel(applicationDetail.vehicle_type)) }}</span>
                </div>
                <div v-if="applicationDetail.type !== 'team'" class="detail-item">
                  <span class="d-label">{{ $t('autonomoStatus') }}</span>
                  <span class="d-value">{{ $t(getAutonomoLabel(applicationDetail.is_autonomo)) }}</span>
                </div>
                <div v-if="applicationDetail.type === 'team'" class="detail-item">
                  <span class="d-label">{{ $t('riderCount') }}</span>
                  <span class="d-value">{{ applicationDetail.rider_count }}</span>
                </div>
                <div v-if="applicationDetail.type === 'team'" class="detail-item">
                  <span class="d-label">{{ $t('canInvoice') }}</span>
                  <span class="d-value">{{ applicationDetail.can_invoice }}</span>
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

      <div v-if="showTransferModal" class="transfer-modal-mask" @click.self="showTransferModal = false">
        <div class="transfer-modal">
          <h3>{{ $t('transferConversation') }}</h3>
          <button class="transfer-option" @click="handleTransfer(0)">{{ $t('releaseConversation') }}</button>
          <div class="transfer-list">
            <button
              v-for="admin in adminList"
              :key="admin.admin_id"
              class="transfer-option"
              :disabled="String(admin.admin_id) === String(adminId)"
              @click="handleTransfer(admin.admin_id, admin.admin_name)"
            >
              {{ admin.admin_name }}
            </button>
          </div>
          <button class="transfer-cancel" @click="showTransferModal = false">{{ $t('cancel') }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getVehicleLabel, getAutonomoLabel, AVAILABILITY_MAP } from '@/utils/rider';
import { unwrapData, unwrapList } from '@/utils/api';

export default {
  name: 'admin-chat',
  layout: 'header-only',
  data () {
    return {
      adminId: '',
      token: '',
      applicationId: '',
      conversationId: '',
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
      socket: null,
      socketConnecting: false,
      reconnectTimer: null,
      reconnectAttempts: 0,
      socketManuallyClosed: false,
      pingTimer: null,
      socketReady: false,
      socketReadyPromise: null,
      socketReadyResolve: null,
      chatMode: '',
      handlerAdminName: '',
      showTransferModal: false,
      adminList: [],
      pendingInitialClaim: false,
      recruiterAvatar: '',
      _isSocketInitialized: false
    }
  },
  computed: {
    canSend () {
      return this.socketReady && this.chatMode === 'active' && !!this.conversationId
    }
  },
  mounted () {
    if (this._isSocketInitialized) return
    this._isSocketInitialized = true

    this.adminId = this.$route.query.admin_id || ''
    this.token = this.$route.query.token || ''
    this.applicationId = this.$route.query.application_id || ''
    this.conversationId = this.$route.query.conversation_id || ''
    if (!this.adminId || !this.token) {
      this.verifyError = this.$t('missingAdminChatParams')
      this.verifying = false
      return
    }
    if (process.client) {
      sessionStorage.setItem('pandadelivero_admin_session', JSON.stringify({
        admin_id: this.adminId,
        token: this.token
      }))
    }
    this.pendingInitialClaim = !!this.conversationId
    this.verifyAndLoad()

    this.$once('hook:destroyed', () => {
      this.closeSocket()
    })
  },
  beforeDestroy () {
    this.closeSocket()
  },
  methods: {
    adminParams (extra = {}) {
      return { admin_id: this.adminId, ...extra }
    },
    adminHeaders () {
      return { Api: 'ADMIN', TOKEN: this.token }
    },
    adminRequestConfig (extra = {}) {
      return {
        params: this.adminParams(extra),
        headers: this.adminHeaders()
      }
    },
    mapConversationItem (item) {
      return {
        conversation_id: String(item.conversation_id || item.application_id),
        application_id: item.application_id,
        type: item.type || 'individual',
        rider_name: item.rider_name || item.team_name || `${item.uname || ''} ${item.last_name || ''}`.trim(),
        uname: item.uname,
        last_name: item.last_name,
        team_name: item.team_name || '',
        mobile: item.mobile || '',
        email: item.email || '',
        contact_type: item.contact_type || '',
        city_name: item.city_name,
        vehicle_type: item.vehicle_type,
        is_autonomo: item.is_autonomo,
        availability: item.availability || '',
        rider_count: item.rider_count || 0,
        can_invoice: item.can_invoice || '',
        latest_status: item.status || item.latest_status,
        handler_admin_id: Number(item.handler_admin_id || 0),
        handler_admin_name: item.handler_admin_name || '',
        last_message_at: item.last_message_at || '',
        recruiter_unread: item.recruiter_unread != null ? Number(item.recruiter_unread) : undefined
      }
    },
    unreadCount (conv) {
      return Number(conv && conv.recruiter_unread ? conv.recruiter_unread : 0)
    },
    formatUnreadCount (conv) {
      const count = this.unreadCount(conv)
      return count > 99 ? '99+' : String(count)
    },
    clearConversationUnread (conversationId) {
      const idx = this.conversationList.findIndex(c => String(c.conversation_id) === String(conversationId))
      if (idx < 0) return
      this.$set(this.conversationList, idx, {
        ...this.conversationList[idx],
        recruiter_unread: 0
      })
    },
    syncConversationFromMessagePush (conversationId, data = {}) {
      const incomingId = String(conversationId || '')
      if (!incomingId) return

      const idx = this.conversationList.findIndex(c => String(c.conversation_id) === incomingId)
      if (idx < 0) {
        this.loadConversationList()
        return
      }

      const conv = this.conversationList[idx]
      const isActive = incomingId === String(this.conversationId)
      const next = {
        ...conv,
        last_message_at: (data.message && data.message.created_at) || new Date().toISOString()
      }

      if (isActive) {
        next.recruiter_unread = 0
      } else if (typeof data.recruiter_unread !== 'undefined') {
        next.recruiter_unread = Number(data.recruiter_unread || 0)
      } else if (data.message && data.message.sender_type === 'rider') {
        next.recruiter_unread = this.unreadCount(conv) + 1
      }

      this.$set(this.conversationList, idx, next)
    },
    async verifyAndLoad () {
      this.verifying = true
      this.verifyError = ''
      try {
        const res = await this.$axios.get('/admin/chat/verify', this.adminRequestConfig(
          this.conversationId ? { conversation_id: this.conversationId, application_id: this.applicationId } : {}
        ))
        const d = unwrapData(res)
        this.recruiterName = (d.recruiter_name || this.$t('recruiter'))
        this.$store.commit('SET_IS_ADMIN_SESSION', true)
        if (d.admin_id) this.adminId = d.admin_id
        this.recruiterAvatar = (d.recruiter_name || this.$t('recruiter')).charAt(0).toUpperCase()
        if (d.application) {
          this.applicationDetail = d.application
          this.conversationId = this.conversationId || String(d.application.conversation_id || '')
          this.applicationId = this.applicationId || String(d.application.application_id || '')
        }
        await this.loadConversationList()
        this.resetSocketReadyState()
        await this.connectSocket()
      } catch (err) {
        this.verifyError = err.message || this.$t('tokenInvalid')
      } finally {
        this.verifying = false
      }
    },
    async loadMessages () {
      if (!this.conversationId) return
      this.loadingMessages = true
      // 重置已显示消息 ID 集合
      this._displayedMessageIds = new Set()
      try {
        const res = await this.$axios.get(`/admin/chat/conversations-messages-${this.conversationId}`, this.adminRequestConfig())
        const data = unwrapData(res)
        if (Array.isArray(data.messages)) {
          this.messages = data.messages.map(msg => {
            // 预填充已显示的消息 ID
            if (msg.message_id) {
              this._displayedMessageIds.add(String(msg.message_id))
            }
            return {
              message_id: String(msg.message_id || ''),
              sender_type: msg.sender_type || 'system',
              sender_name: msg.sender_name || '',
              content: msg.content || '',
              content_es: msg.content_es || '',
              content_zh: msg.content_zh || '',
              created_at: msg.created_at || ''
            }
          })
        }
        if (data.claim) {
          this.applyClaimState(data.claim)
        }
        this.clearConversationUnread(this.conversationId)
        this.$nextTick(() => {
          this.$nextTick(() => this.scrollToBottom())
        })
      } catch (err) {
        console.error('loadMessages error:', err)
      } finally {
        this.loadingMessages = false
      }
    },
    appendMessage (message) {
      if (!message || !message.message_id) return
      // 使用 Set 来跟踪已显示的消息 ID，避免数组遍历
      const msgId = String(message.message_id)
      if (this._displayedMessageIds && this._displayedMessageIds.has(msgId)) {
        return
      }
      if (!this._displayedMessageIds) {
        this._displayedMessageIds = new Set()
      }
      this._displayedMessageIds.add(msgId)
      this.messages.push(message)
      this.$nextTick(() => this.scrollToBottom())
    },
    async loadConversationList () {
      this.loadingConversations = true
      try {
        const res = await this.$axios.get('/admin/chat/conversations', this.adminRequestConfig({ page: 1, page_size: 50 }))
        const list = unwrapList(res)
        this.conversationList = list
          .filter(item => item.conversation_id || item.application_id)
          .map(item => this.mapConversationItem(item))
      } catch (err) {
        console.error('loadConversationList error:', err)
      } finally {
        this.loadingConversations = false
      }
    },
    setApplicationPreview (convId) {
      const conv = this.conversationList.find(c => String(c.conversation_id) === String(convId))
      if (!conv) return
      this.applicationDetail = {
        application_id: conv.application_id,
        conversation_id: convId,
        type: conv.type,
        uname: conv.uname,
        last_name: conv.last_name,
        team_name: conv.team_name,
        mobile: conv.mobile,
        email: conv.email,
        contact_type: conv.contact_type,
        city_name: conv.city_name,
        vehicle_type: conv.vehicle_type,
        is_autonomo: conv.is_autonomo,
        availability: conv.availability,
        rider_count: conv.rider_count,
        can_invoice: conv.can_invoice,
        status: conv.latest_status
      }
    },
    async loadApplicationDetail (convId) {
      if (!convId) return
      const conv = this.conversationList.find(c => String(c.conversation_id) === String(convId))
      if (conv && this.applicationDetail && this.applicationDetail.mobile) return
      try {
        const res = await this.$axios.get(`/admin/chat/applications-detail-${convId}`, this.adminRequestConfig({ conversation_id: convId }))
        this.applicationDetail = unwrapData(res)
      } catch (err) {
        console.error('loadApplicationDetail error:', err)
      }
    },
    async switchConversation (convId) {
      if (String(convId) === String(this.conversationId)) return
      if (!(await this.ensureSocketReady())) {
        this.$message.warning(this.$t('socketNotReady'))
        return
      }

      const previousConversationId = this.chatMode === 'active' ? this.conversationId : ''
      this.conversationId = String(convId)
      const conv = this.conversationList.find(c => String(c.conversation_id) === String(convId))
      this.applicationId = conv ? (conv.application_id || '') : ''
      this.setApplicationPreview(convId)
      this.messages = []
      await this.claimAndLoad(convId, previousConversationId)
    },
    async claimAndLoad (conversationId, previousConversationId = '') {
      await this.claimConversation(conversationId, previousConversationId)
      await this.loadMessages()
      await this.loadApplicationDetail(conversationId)
    },
    async claimConversation (conversationId, previousConversationId = '') {
      if (!conversationId || !this.socketReady) {
        return false
      }
      try {
        const res = await this.$axios.post(`/admin/chat/conversations-claim-${conversationId}`, {
          previous_conversation_id: previousConversationId
        }, {
          headers: this.adminHeaders()
        })
        const data = unwrapData(res)
        this.applyClaimState(data)
        return data.mode !== 'active' || data.joined_group === '1'
      } catch (err) {
        this.$message.error(err.message || this.$t('claimFailed'))
        return false
      }
    },
    resetSocketReadyState () {
      this.socketReady = false
      this.clearSocketPing()
      if (this.socketReadyResolve) {
        this.socketReadyResolve(false)
        this.socketReadyResolve = null
      }
      this.socketReadyPromise = new Promise((resolve) => {
        this.socketReadyResolve = resolve
      })
    },
    markSocketReady () {
      this.socketReady = true
      if (this.socketReadyResolve) {
        this.socketReadyResolve(true)
        this.socketReadyResolve = null
      }
    },
    async ensureSocketReady (timeout = 15000) {
      if (!process.client) {
        return false
      }
      if (!this.socketReadyPromise) {
        this.resetSocketReadyState()
      }
      if (this.socketReady) {
        return true
      }
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING) {
        await this.connectSocket()
      }
      try {
        return !!(await Promise.race([
          this.socketReadyPromise,
          new Promise((resolve) => setTimeout(() => resolve(false), timeout))
        ]))
      } catch (e) {
        return false
      }
    },
    applyClaimState (data) {
      if (!data) return
      this.chatMode = data.mode || ''
      this.handlerAdminName = data.handler_admin_name || ''
      if (data.conversation) {
        this.upsertConversationItem(data.conversation)
      }
    },
    upsertConversationItem (item) {
      if (!item || (!item.conversation_id && !item.application_id)) return
      const mapped = this.mapConversationItem(item)
      const idx = this.conversationList.findIndex(c => String(c.conversation_id) === mapped.conversation_id)
      if (idx >= 0) {
        const prev = this.conversationList[idx]
        if (mapped.recruiter_unread == null) {
          mapped.recruiter_unread = prev.recruiter_unread
        }
        this.$set(this.conversationList, idx, { ...prev, ...mapped })
      } else {
        if (mapped.recruiter_unread == null) {
          mapped.recruiter_unread = 0
        }
        this.conversationList.unshift(mapped)
      }
    },
    handlerLabel (conv) {
      const handlerId = Number(conv.handler_admin_id || 0)
      if (!handlerId) {
        return this.$t('unassignedConversation')
      }
      if (String(handlerId) === String(this.adminId)) {
        return this.$t('handlingByYouShort')
      }
      return conv.handler_admin_name || this.$t('recruiter')
    },
    handlerTagClass (conv) {
      const handlerId = Number(conv.handler_admin_id || 0)
      if (!handlerId) return 'unassigned'
      if (String(handlerId) === String(this.adminId)) return 'mine'
      return 'other'
    },
    async openTransferModal () {
      this.showTransferModal = true
      if (this.adminList.length) return
      try {
        const res = await this.$axios.get('/admin/chat/admins', this.adminRequestConfig())
        const data = unwrapData(res)
        this.adminList = Array.isArray(data.list) ? data.list : []
      } catch (err) {
        console.error('loadAdmins error:', err)
      }
    },
    async handleTransfer (targetAdminId, targetAdminName = '') {
      if (!this.conversationId) return
      if (!(await this.ensureSocketReady())) {
        this.$message.warning(this.$t('socketNotReady'))
        return
      }
      try {
        await this.$axios.post(`/admin/chat/conversations-transfer-${this.conversationId}`, {
          target_admin_id: targetAdminId,
          target_admin_name: targetAdminName
        }, {
          headers: this.adminHeaders()
        })
        this.showTransferModal = false
        if (targetAdminId > 0 && String(targetAdminId) !== String(this.adminId)) {
          this.chatMode = 'readonly'
          this.handlerAdminName = targetAdminName
        } else {
          this.chatMode = ''
          this.handlerAdminName = ''
        }
        this.$message.success(this.$t('transferSuccess'))
        await this.loadConversationList()
      } catch (err) {
        this.$message.error(err.message || this.$t('transferFailed'))
      }
    },
    async handleTranslate () {
      if (!this.canSend || !this.cnInput.trim() || this.translating) return
      this.translating = true
      try {
        const res = await this.$axios.post('/admin/chat/translate', {
          text: this.cnInput.trim(),
          source_lang: 'zh',
          target_lang: 'es',
          admin_id: this.adminId
        }, {
          headers: this.adminHeaders()
        })
        this.translatedPreview = unwrapData(res).translated_text || res.translated_text || ''
      } catch (err) {
        this.$message.error(err.message || this.$t('translationFailed'))
      } finally {
        this.translating = false
      }
    },
    async handleSend () {
      if (!this.canSend || !this.cnInput.trim() || this.sending) return
      if (!this.translatedPreview) {
        this.$message.warning(this.$t('pleaseTranslateFirst'))
        return
      }
      const text = this.cnInput.trim()
      const translated = this.translatedPreview
      this.cnInput = ''
      this.translatedPreview = ''
      this.sending = true
      try {
        const message = unwrapData(await this.$axios.post(`/admin/chat/conversations-messages-${this.conversationId}`, {
          content: text,
          content_es: translated,
          source_lang: 'zh',
          target_lang: 'es',
          sender_type: 'recruiter',
          admin_id: this.adminId
        }, {
          headers: this.adminHeaders()
        }))
        this.appendMessage(message)
      } catch (err) {
        this.$message.error(this.$t('messageSendError'))
        this.cnInput = text
        this.translatedPreview = translated
      } finally {
        this.sending = false
      }
    },
    async socketUrl () {
      const res = await this.$axios.get('/admin/chat/socket-address', this.adminRequestConfig())
      const data = unwrapData(res)
      if (!data.url) {
        throw new Error('socket address unavailable')
      }
      return data.url
    },
    async connectSocket () {
      if (!process.client) return
      if (this.socketManuallyClosed) return
      if (this.socketConnecting) return
      if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
        return
      }
      this.socketConnecting = true
      this.clearReconnectTimer()
      if (this.socket) {
        this.socket.onclose = null
        this.socket.close()
        this.socket = null
      }
      this.resetSocketReadyState()

      let url = ''
      try {
        url = await this.socketUrl()
      } catch (err) {
        console.error('socketUrl error:', err)
        this.socketConnecting = false
        this.scheduleReconnect()
        return
      }
      const socket = new WebSocket(url)
      this.socket = socket
      socket.onopen = () => {
        if (this.socket !== socket) return
        this.reconnectAttempts = 0
      }
      socket.onmessage = (event) => {
        if (this.socket !== socket) return
        this.handleSocketMessage(event.data)
      }
      socket.onerror = () => {
        // Reconnect is scheduled by onclose.
      }
      socket.onclose = (event) => {
        if (this.socket !== socket) return
        this.socketConnecting = false
        this.clearSocketPing()
        this.resetSocketReadyState()
        if (event.code !== 1000 && event.code !== 1001) {
          console.warn('[admin-chat] socket closed', event.code, event.reason || '')
        }
        if (!this.socketManuallyClosed) {
          this.scheduleReconnect()
        }
      }
    },
    startSocketPing () {
      this.clearSocketPing()
      this.pingTimer = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(this.buildSocketPingMessage())
        }
      }, 10000)
    },
    buildSocketPingMessage () {
      return JSON.stringify({
        type: 'message',
        event: 'socket.ping',
        data: {},
        time: Math.floor(Date.now() / 1000)
      })
    },
    clearSocketPing () {
      if (this.pingTimer) {
        clearInterval(this.pingTimer)
        this.pingTimer = null
      }
    },
    async onSocketReady () {
      if (!this.socketReady || !this.conversationId) return
      if (this.pendingInitialClaim) {
        this.pendingInitialClaim = false
        await this.claimAndLoad(this.conversationId)
        return
      }
      await this.claimConversation(this.conversationId)
    },
    handleSocketMessage (raw) {
      let payload = null
      try {
        payload = JSON.parse(raw)
      } catch (e) {
        return
      }

      const event = payload.event
      const data = payload.data || {}

      if (event === 'socket.pong') {
        return
      }

      if (event === 'socket.connected') {
        this.socketConnecting = false
        this.markSocketReady()
        this.startSocketPing()
        this.onSocketReady()
        return
      }

      if (event === 'chat.conversation.new') {
        this.upsertConversationItem(data.conversation || data)
        return
      }

      if (event === 'chat.conversation.claimed' || event === 'chat.conversation.transferred') {
        const conversation = data.conversation || data
        this.upsertConversationItem(conversation)
        if (String(conversation.conversation_id) !== String(this.conversationId)) {
          return
        }
        this.applyClaimState({
          mode: String(conversation.handler_admin_id) === String(this.adminId) ? 'active' : (conversation.handler_admin_id ? 'readonly' : ''),
          handler_admin_name: conversation.handler_admin_name,
          conversation
        })
        return
      }

      if (event !== 'chat.message') {
        return
      }

      const incomingId = String(data.conversation_id || '')
      if (incomingId === String(this.conversationId) && data.message) {
        this.appendMessage(data.message)
      }
      this.syncConversationFromMessagePush(incomingId, data)
    },
    scheduleReconnect () {
      this.clearReconnectTimer()
      // 指数退避策略：1s, 2s, 4s, 8s, 16s, 32s (最大 30s)
      const baseDelay = 1000
      const maxDelay = 30000
      const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts), maxDelay)
      this.reconnectAttempts += 1
      this.reconnectTimer = setTimeout(() => {
        this.connectSocket()
      }, delay)
    },
    clearReconnectTimer () {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    },
    closeSocket () {
      this.socketManuallyClosed = true
      this.socketConnecting = false
      this.clearReconnectTimer()
      this.clearSocketPing()
      this.resetSocketReadyState()
      if (this.socket) {
        this.socket.onopen = null
        this.socket.onmessage = null
        this.socket.onerror = null
        this.socket.onclose = null
        try {
          if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
            this.socket.close()
          }
        } catch (e) {
          console.warn('WebSocket close error:', e)
        }
        this.socket = null
      }
    },
    scrollToBottom () {
      if (this.$refs.messagesArea) {
        this.$refs.messagesArea.scrollTop = this.$refs.messagesArea.scrollHeight
      }
    },
    formatTime (ts) {
      if (!ts) return ''
      try {
        return new Date(ts).toLocaleString(this.$i18n.locale, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      } catch (err) {
        return ts
      }
    },
    getVehicleLabel,
    getAutonomoLabel,
    formatAvailability (av) {
      if (!av) return ''
      return av.split(',').map(a => this.$t(AVAILABILITY_MAP[a] || a)).join(', ')
    },
    goHome () {
      window.location.href = '/'
    },
    logoutAdmin () {
      this.$confirm(this.$t('confirmExitAdminChat'), this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.closeSocket()
        this.$store.commit('SET_IS_ADMIN_SESSION', false)
        if (process.client) {
          sessionStorage.removeItem('pandadelivero_admin_session')
        }
        window.location.href = '/'
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">
$yellow: #FABE1D;
$green: #2DC15C;
$border: #F0E8C0;
$bg-page: #F0F2F5;
$bg-card: #FFFFFF;

.admin-chat-page {
  height: calc(100vh - 110px);
  overflow: hidden;
  background: $bg-page;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 16px;
  min-height: 0;
}

/* ========== 三栏主体 ========== */
.chat-body {
  flex: 1;
  background: $bg-card;
  border: 1.5px solid $border;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 260px 1fr 360px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  h3 {
    font-size: 13px;
    font-weight: 700;
    color: #1A1A1A;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }
}

.btn-logout {
  border: 1px solid #DC2626;
  background: #FFFFFF;
  color: #DC2626;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 200ms;
  &:hover {
    background: #DC2626;
    color: #FFFFFF;
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

  &.disabled {
    opacity: 0.55;
    cursor: wait;
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

.conv-info { flex: 1; overflow: hidden; min-width: 0; }

.conv-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.conv-unread {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #EF4444;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.35);
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
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
  overflow: hidden;
}

.conv-meta-text {
  font-size: 11px;
  color: #9E9E9E;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-handler-tag {
  display: inline-block;
  align-self: flex-start;
  max-width: 100%;
  padding: 1px 7px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.mine {
    background: #FFFBEB;
    color: #B45309;
  }

  &.other {
    background: #EFF6FF;
    color: #2563EB;
  }

  &.unassigned {
    background: #F3F4F6;
    color: #6B7280;
  }
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

.handler-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #F0F0F0;
}

.handler-text {
  font-size: 12px;
  color: #616161;
}

.btn-transfer {
  padding: 6px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 16px;
  background: #FFFFFF;
  font-size: 12px;
  cursor: pointer;
}

.input-area.readonly {
  opacity: 0.85;
}

.readonly-tip {
  margin-bottom: 10px;
  padding: 10px 12px;
  background: #FFF8E1;
  border-radius: 8px;
  font-size: 12px;
  color: #8D6E00;
}

.transfer-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.transfer-modal {
  width: 320px;
  max-height: 70vh;
  overflow-y: auto;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
}

.transfer-modal h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

.transfer-option,
.transfer-cancel {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background: #FFFFFF;
  text-align: left;
  cursor: pointer;
}

.transfer-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 600PX;
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
