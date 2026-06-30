<template>
  <div>
    <v-overlay class='phone-menu-mask' @click.native='isShowPhoneMenu = false' :value='isShowPhoneMenu'></v-overlay>

    <v-app-bar fixed :flat='true' elevation="2" class='header-app-bar top-app-bar' color='transparent'>
      <!--手机端-->
      <div class='phone-menu-box max-width'>
        <div class='disflex al-center phone-menu-bar max-width'>
          <nuxt-link
            style='margin-right: 14px'
            class='clear-flex h-logo-img'
            to='/'
          >
            <embed
              width='100%'
              :src="require('~/assets/images/cloudSales/header2-logo.png')"
              type='image/svg+xml'
            />
          </nuxt-link>
          <v-spacer />
          <v-app-bar-nav-icon
            @click='isShowPhoneMenu = !isShowPhoneMenu'
          >
            <img src='../../assets/images/icon_shaixuan.png'
                 style='width: 48px;height: 48px;margin-left:8px '
                 alt='' />

          </v-app-bar-nav-icon>
          <div v-if='!isAdminSession && (userNewInfo.staff_id || userNewInfo.uid)' style='margin-left: 32px'>
            <div class='flex flex-a-c'>
              <el-image v-if="userNewInfo.face"
                style='width: 60px; height: 60px;border-radius: 60px'
                :src='userNewInfo.face'
                fit='cover'></el-image>
              <div class='ml2'>
                <div class='font14' style='color: #f9c13e'>
                  {{ userNewInfo.name ? userNewInfo.name : userNewInfo.nickname ? userNewInfo.nickname : '' }}
                </div>
                <div class='font12' style='color: #909090'>{{ userNewInfo.mobile }}</div>
                <div class='font12' style='color: #909090' v-if='userNewInfo.share_code'>
                  {{ $t('invitationCode') }}{{ userNewInfo.share_code }}
                </div>
                <div class='font12' style='color: #909090' v-if='userNewInfo.integral'>
                  {{ $t('points') }}{{ userNewInfo.integral }}
                </div>
                <div class='font12' style='color: #909090' v-if='userNewInfo.cash_in_hand'>
                  {{ $t('balance') }}： {{ userNewInfo.cash_in_hand }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <v-expand-transition>
          <div
            v-show='isShowPhoneMenu'
            class='phone-menu-list max-width'
          >
            <v-list dense>
              <v-list-item link href='/rider' v-if='!isAdminSession'>
                <v-list-item-title>{{ $t('riderPageTitle') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if='!isAdminSession' />
              <v-list-item target='_blank' href='/about' v-if='!isAdminSession'>
                <v-list-item-title>{{ $t('aboutUs') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if='!isAdminSession' />
              <!-- 暂时隐藏手机端菜单
              <v-list-item target='_blank' href='/points-mall' v-if="userNewInfo.staff_id && !isAdminSession">
                <v-list-item-title>{{ $t('pointsMall') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if="userNewInfo.staff_id && !isAdminSession" />
              <v-list-item target='_blank' href='/cart' v-if="userNewInfo.staff_id && !isAdminSession">
                <v-list-item-title>{{ $t('shoppingCart') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if="userNewInfo.staff_id && !isAdminSession" />
              <v-list-item target='_blank' href='/my-orders' v-if="userNewInfo.staff_id && !isAdminSession">
                <v-list-item-title>{{ $t('myOrders') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if="userNewInfo.staff_id && !isAdminSession" />
              <v-list-item target='_blank' href='/my-addresses' v-if="userNewInfo.staff_id && !isAdminSession">
                <v-list-item-title>{{ $t('myAddresses') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if="userNewInfo.staff_id && !isAdminSession" />
              -->

              <v-list-item target='_blank' :href='adminLeadUrl' v-if='isAdminSession'>
                <v-list-item-title>{{ $t('leadManagement') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if='isAdminSession' />
              <v-list-item @click='goToAdminChat' v-if='isAdminSession'>
                <v-list-item-title>{{ $t('chatManagement') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if='isAdminSession' />

              <v-list-item @click='handleInfoWindowState(true)'>
                <v-list-item-title>{{ $t('languageSwitch') }}</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click='handleClick(1)' v-if='!isAdminSession && !userNewInfo.staff_id && !userNewInfo.uid'>
                <v-list-item-title>{{ $t('login') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click='handleClick(2)' v-if='!isAdminSession && userNewInfo.uid'>
                <v-list-item-title>{{ $t('invitationCodeRedemption') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click='handleClick(3)' v-if='!isAdminSession && userNewInfo.integral'>
                <v-list-item-title>{{ $t('luckyDraw') }}</v-list-item-title>
              </v-list-item>
              <v-list-item target='_blank' href='/information' v-if='!isAdminSession && userNewInfo.uid'>
                <v-list-item-title>{{ $t('personalInformation') }}</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click='bingOutLogin' v-if='!isAdminSession && (userNewInfo.staff_id || userNewInfo.uid)'>
                <v-list-item-title>{{ $t('logOut') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-expand-transition>
      </div>
      <!--PC端-->
      <div class='disflex ju-center max-width al-center col-f pc-menu-box'>
        <img @click='handleHome' :src="require('~/assets/images/cloudSales/header2-logo.png')"
             style='width: 8%; max-height: 100px; margin-right: 14px; cursor: pointer; object-fit: cover'
             alt='' />
        <!-- 登录样式 -->
        <div style='display: flex;align-items: center'>
          <v-tab v-if="!isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 0,
                            inactive: getActiveMenuInx !== 0,
                        }"
            @click.prevent="$router.push('/')"
          >{{ $t('joinUs') }}
          </v-tab>

          <v-tab v-if="!isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 1,
                            inactive: getActiveMenuInx !== 1,
                        }"
            @click.prevent="$router.push('/about')"
          >{{ $t('aboutUs') }}
          </v-tab>
          <!-- 暂时隐藏积分商城 tab
          <v-tab  v-if="userNewInfo.staff_id && !isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 2,
                            inactive: getActiveMenuInx !== 2,
                        }"
            @click.prevent="$router.push('/points-mall')"
          >{{ $t('pointsMall') }}
          </v-tab>
          -->
          <v-tab v-if="!isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 3,
                            inactive: getActiveMenuInx !== 3,
                        }"
            @click.prevent="$router.push('/rider')"
          >{{ $t('riderPageTitle') }}
          </v-tab>

          <v-tab v-if="!isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 4,
                            inactive: getActiveMenuInx !== 4,
                        }"
            @click.prevent="$router.push('/team')"
          >{{ $t('teamTitle') }}
          </v-tab>

          <v-tab v-if="hasPendingChat && !isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 6,
                            inactive: getActiveMenuInx !== 6,
                        }"
            @click.prevent="goToChat"
          >
            {{ $t('continueChat') }}
          </v-tab>

          <v-tab  v-if="isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 5,
                            inactive: getActiveMenuInx !== 5,
                        }"
            @click.prevent="goToAdminLead"
          >{{ $t('leadManagement') }}
          </v-tab>

          <v-tab  v-if="isAdminSession"
            :class="{
                            'v-tab--active': getActiveMenuInx === 8,
                            inactive: getActiveMenuInx !== 8,
                        }"
            @click.prevent="goToAdminChat"
          >{{ $t('chatManagement') }}
          </v-tab>

          <el-button @click='handleInfoWindowState(true)' class='login-bt try-out-bt' height='50px'
                     style='margin-right: 20px;margin-left: 16px'>{{ $t('languageSwitch') }}
          </el-button>

          <el-button @click='handleClick(1)' class='login-bt try-out-bt' v-if='!isAdminSession && !userNewInfo.staff_id && !userNewInfo.uid'
                     style='margin-left: 16px;'
                     height='50px'>{{ $t('login') }}
          </el-button>

          <el-button @click='handleClick(2)' class='login-bt try-out-bt' v-if='!isAdminSession && userNewInfo.uid'
                     style='margin-left: 16px;'
                     height='50px'>{{ $t('invitationCodeRedemption') }}
          </el-button>

          <el-button @click='handleClick(3)' class='login-bt try-out-bt' v-if='!isAdminSession && userNewInfo.integral'
                     style='margin-left: 16px;'
                     height='50px'>{{ $t('luckyDraw') }}
          </el-button>

          <div v-if='!isAdminSession && (userNewInfo.staff_id || userNewInfo.uid)' style='margin-left: 32px'>
            <v-menu eager bottom offset-y left open-on-hover>
              <template #activator='{ attrs, on }'>
                <div class='flex flex-a-c' v-bind='attrs' v-on='on'>
                  <el-image v-if="userNewInfo.face"
                    style='width: 60px; height: 60px;border-radius: 60px'
                    :src='userNewInfo.face'
                    fit='cover'></el-image>
                  <div class='ml2'>
                    <div class='font14' style='color: #f9c13e'>
                      {{ userNewInfo.name ? userNewInfo.name : userNewInfo.nickname ? userNewInfo.nickname : '' }}
                    </div>
                    <div class='font12' style='color: #909090'>{{ userNewInfo.mobile }}</div>
                    <div class='font12' style='color: #909090' v-if='userNewInfo.share_code'>
                      {{ $t('invitationCode') }}： {{ userNewInfo.share_code }}
                    </div>
                    <div class='font12' style='color: #909090' v-if='userNewInfo.integral'>
                      {{ $t('points') }}： {{ userNewInfo.integral }}
                    </div>
                    <div class='font12' style='color: #909090' v-if='userNewInfo.cash_in_hand'>
                      {{ $t('balance') }}： {{ userNewInfo.cash_in_hand }}
                    </div>
                  </div>
                </div>
              </template>
              <v-list flat>
                <v-list-item href='/information' v-if='userNewInfo.uid'>
                  <v-list-item-title>{{ $t('personalInformation') }}</v-list-item-title>
                </v-list-item>

                <!-- 暂时隐藏以下功能
                <v-list-item @click='bingCart' v-if="userNewInfo.staff_id">
                  <v-list-item-title>{{ $t('shoppingCart') }}</v-list-item-title>
                </v-list-item>

                <v-list-item @click='bingOrders' v-if="userNewInfo.staff_id">
                  <v-list-item-title>{{ $t('myOrders') }}</v-list-item-title>
                </v-list-item>

                <v-list-item @click='bingAddresses' v-if="userNewInfo.staff_id">
                  <v-list-item-title>{{ $t('myAddresses') }}</v-list-item-title>
                </v-list-item>
                -->

                <v-list-item @click='bingOutLogin'>
                  <v-list-item-title>{{ $t('logOut') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

        </div>
      </div>
    </v-app-bar>

    <!-- 语言切换 -->
    <info-window :isShow='isShowContactInfoDialog' @handleClose='handleInfoWindowState' />
    <login :loginType='loginType' @handleCloseLoginDialog='handleCloseLoginDialog'></login>
    <invitation-redemption :loginType='loginType'
                           @handleCloseLoginDialog='handleCloseLoginDialog'></invitation-redemption>
    <draw-lottery :loginType='loginType'
                  @handleCloseLoginDialog='handleCloseLoginDialog'></draw-lottery>
  </div>
</template>

<script>
import InfoWindow from '@/components/popupWindow/infoWindow';
import login from '@/components/popupWindow/login';
import InvitationRedemption from '@/components/popupWindow/InvitationRedemption';
import drawLottery from '@/components/popupWindow/drawLottery';


import {
  mapGetters,
  mapMutations,
  mapState,
  mapActions
} from 'vuex';

export default {
  name: 'header-control',
  components: {
    InfoWindow,
    login,
    InvitationRedemption,
    drawLottery
  },
  data() {
    return {
      currentMenuInx: 1, // 当前选择菜单下标
      isShowPhoneMenu: false, // 是否展示手机端菜单
      // 登录的选项类型
      loginType: -1,
      userNewInfo: {},
      // 是否显示联系方式弹框
      isShowContactInfoDialog: false,
      // 聊天相关
      hasPendingChat: false,
    };
  },
  watch: {
    $route() {
      this.isShowPhoneMenu = false;
    },
    isAdminSession(val) {
      if (val) {
        return;
      }
      if (this.getUserInfo.staff_id || this.getUserInfo.uid) {
        this.accountProfile();
      }
    }
  },
  mounted() {
    this.userNewInfo = this.getUserInfo;
    if (!this.isAdminSession && (this.getUserInfo.staff_id || this.getUserInfo.uid)) {
      this.accountProfile();
    }
    // 检查是否有待处理的聊天会话
    this.checkPendingChat();
  },
  computed: {
    ...mapGetters({
      getUserInfo: 'getUserInfo'
    }),
    ...mapState({
      isAdminSession: state => state.isAdminSession
    }),

    // 获取url 路径
    getUrlPath() {
      return this.$route.path;
    },

    // 获取菜单选中下标
    getActiveMenuInx() {
      const activeMenus = [
        ['/'],          // 0: join us
        ['/about'],     // 1: about us
        ['/points-mall'], // 2: points mall
        ['/rider'],     // 3: rider
        ['/team'],      // 4: team
        ['/admin'],     // 5: admin
        ['/chat'],      // 6: chat
        ['/success'],   // 7: success
        ['/admin-chat'] // 8: admin chat
      ];
      return activeMenus.findIndex(item => item.includes(this.getUrlPath));
    },
    adminLeadUrl() {
      const creds = this.getAdminCredentials();
      if (!creds) return '/admin';
      return `/admin?admin_id=${encodeURIComponent(creds.adminId)}&token=${encodeURIComponent(creds.token)}`;
    }
  },
  methods: {
    getAdminCredentials() {
      const adminId = this.$route.query.admin_id;
      const token = this.$route.query.token;
      if (adminId && token) {
        return { adminId, token };
      }
      if (process.client) {
        try {
          const raw = sessionStorage.getItem('pandadelivero_admin_session');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.admin_id && parsed.token) {
              return { adminId: parsed.admin_id, token: parsed.token };
            }
          }
        } catch (e) {}
      }
      return null;
    },
    buildAdminUrl(path) {
      const creds = this.getAdminCredentials();
      if (!creds) return path;
      return `${path}?admin_id=${encodeURIComponent(creds.adminId)}&token=${encodeURIComponent(creds.token)}`;
    },
    accountProfile() {
      this.$axios.post('/staff/account/profile', {}).then(res => {
        this.userNewInfo = res;
      }).catch(err => {
        this.$message.info(err.message);
      });
    },
    bingOutLogin() {
      this.$confirm(this.$t('confirmExitContinue') + '?', this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        this.$store.commit('SET_USERINFO', {});
        this.$store.commit('SET_IS_ADMIN_SESSION', false);
        this.userNewInfo = {};
        this.$router.push('/');
      });
    },
    handleHome() {
      if (this.isAdminSession) {
        this.$router.push('/admin');
        return;
      }
      this.$router.push('/');
    },
    bingCart(){
      this.$router.push('/cart');
    },
    bingOrders(){
      this.$router.push('/my-orders');
    },
    bingAddresses(){
      this.$router.push('/my-addresses');
    },
    goToAdminChat() {
      if (this.$route.path === '/admin-chat') {
        return;
      }
      if (!this.isAdminSession) {
        return;
      }
      const url = this.buildAdminUrl('/admin-chat');
      if (url.includes('admin_id=')) {
        this.$router.push(url);
      }
    },
    goToAdminLead() {
      if (this.$route.path === '/admin') {
        return;
      }
      if (!this.isAdminSession) {
        return;
      }
      const url = this.buildAdminUrl('/admin');
      if (url.includes('admin_id=')) {
        this.$router.push(url);
      }
    },
    handleClick(type) {
      if (this.isAdminSession) {
        this.$store.commit('SET_IS_ADMIN_SESSION', false);
      }
      if (type === 1) {
        this.handleCloseLoginDialog(1);
      } else if (type === 2) {
        this.handleCloseLoginDialog(2);
      } else {
        this.handleCloseLoginDialog(3);
      }
    },

    /** 处理联系方式弹框的状态 */
    handleInfoWindowState(value) {
      this.isShowContactInfoDialog = value;
    },
    /** 处理登录弹框的关闭操作 */
    handleCloseLoginDialog(value) {
      if(value === -2){
        this.loginType = -1;
        this.accountProfile()
      }else {
        this.loginType = value;
      }
      if (this.isAdminSession) {
        this.$store.commit('SET_IS_ADMIN_SESSION', false);
      }

    },
    /** 检查是否有待处理的聊天会话 */
    checkPendingChat() {
      const pendingChat = localStorage.getItem('rider_pending_chat');
      if (!pendingChat) {
        this.hasPendingChat = false;
        return;
      }
      try {
        const chatData = JSON.parse(pendingChat);
        this.hasPendingChat = !!chatData.application_id;
      } catch (e) {
        this.hasPendingChat = false;
      }
    },
    /** 跳转到聊天页面 */
    goToChat() {
      const pendingChat = localStorage.getItem('rider_pending_chat');
      if (pendingChat) {
        try {
          const chatData = JSON.parse(pendingChat);
          if (chatData.application_id) {
            this.$router.push(`/chat?app_id=${encodeURIComponent(chatData.application_id)}`);
            return;
          }
        } catch (e) {
          console.error('Parse pending chat error:', e);
        }
      }
      // 如果没有待处理聊天，跳转到首页
      this.$message.warning(this.$t('noPendingChat'));
      this.$router.push('/');
    }
  }
};
</script>

<style lang='scss'>


.el-button {
  border: none !important;
}

.v-tab {
  color: #5E5E5E !important;
  font-size: 16px;
  padding: 0 16px !important;
}

.v-tab--active {
  color: #0F0E0E !important;
}

.v-application {
  .phone-menu-mask {
    display: none;
  }

  .header-app-bar {
    transition: all 500ms ease-in-out;
    height: 100px !important;
    z-index: 1000 !important;
    box-shadow: none !important;
    background: linear-gradient(0deg, rgba(37, 37, 37, 0) 83.5%, rgba(37, 37, 37, 0.5) 100%);

    .pc-menu-box {
      width:80%;
      justify-content: space-between;
      margin: auto;
    }

    .h-logo-img {
      width: 5.31%;
      height: 2.77%;
    }

    .login-input {
      width: 600px;
      height: 52px;
      margin: 0 126px 0 166px;
      border-radius: 60px;
      background: white;
      display: flex;
      border: 1px solid #f9c13e;
      justify-content: space-between;
      align-items: center;
      padding: 0 28px;
      color: white !important;

      .el-input__inner {
        background: transparent;
        border: none;
        color: #f9c13e;
      }

      .el-input__inner::-webkit-input-placeholder {
        color: #f9c13e;
      }
    }

    .login-bt {
      box-shadow: inset 0 0 20px #f9c13e;
      background: #f9c13e;
      border-radius: 35px;
      height: 49px;
      padding: 0 14px;
      line-height: 49px;
      flex-shrink: 0;
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      color: #fff8e2;
      text-shadow: none;
      -webkit-transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
      transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
    }

    .v-toolbar__content {
      padding: 0;
      height: 100px !important;
      background-color: #fff8e2 !important;
    }

    .v-toolbar__content {
      height: 100% !important;
    }

    &.v-app-bar--is-scrolled {
      top: 0 !important;
      box-shadow: none !important;
      background-color: #fff8e2 !important;
    }
  }
}

/*小于大屏幕的设备*/
@media screen and(max-width: $big-pc-width) {
  .login-bt {
    min-width: 72px;
    min-height: 48px;
    //margin-left: px;
  }

  body {
    .v-application {
      .header-app-bar {
        .v-tab {
          font-size: $small-tab-font-size;
          margin-right: 22px;
        }
      }

      .v-slide-group__prev {
        display: none !important;
      }

    }
  }
}

@mixin __header_control_style($height, $phone) {
  .header-app-bar {
    height: $height !important;

    .phone-menu-box {
      display: if($phone ==true, block, none);
    }

    .pc-menu-box {
      display: if($phone ==false, inherit, none);
    }
  }
}

@include __header_control_style($app-bar-height, false);

@media screen and (max-width: $pad-max-width) {
  @include __header_control_style($small-app-bar-height, true);

  body {
    .v-application {
      .phone-menu-mask {
        display: inherit;
      }

      .v-list-item--link:before {
        background-color: transparent !important;
      }

      .header-app-bar {
        height: 120px !important;
        background-color: #fff8e2 !important;


        &.v-toolbar {
          box-shadow: none !important;
          background-color: #fff8e2 !important;
        }

        .theme--light.v-divider {
          background-color: #f4f5f6;
        }

        .v-toolbar__content {
          padding: 4px 0;
        }

        .phone-menu-box {
          .phone-menu-bar {
            padding: 0 32px;
          }

          .v-list-item {
            font-size: 16px;
            padding: 0;
          }

          .h-logo-img {
            width: 32%;
            height: 30%;
          }

          .phone-menu-list {
            padding: 16px;
            position: fixed;
            top: 120px;
            background-color: white;

            .v-list-item__title,
            .v-list-item__icon .v-icon {
              color: #171b20 !important;
            }

            .v-list-group__items {
              .v-list-item__title {
                color: #292e35 !important;
              }
            }
          }
        }
      }
    }
  }
}

/* 继续聊天样式 */
</style>
