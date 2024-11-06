<template>
  <div :class='getHeadClass'>
    <v-overlay class='phone-menu-mask' @click.native='isShowPhoneMenu = false' :value='isShowPhoneMenu'></v-overlay>

    <v-app-bar fixed :flat='true' class='header-app-bar top-app-bar' color='transparent'>
      <!--PC端-->
      <div class='disflex ju-center max-width al-center col-f pc-menu-box'>
        <img @click='handleHome' :src="require('~/assets/images/cloudSales/header2-logo.png')"
             style='width: 8%; max-height: 100px; margin-right: 14px; cursor: pointer; object-fit: cover'
             alt='' />
        <!-- 登录样式 -->
        <div style='display: flex;align-items: center'>
          <v-tab
            :class="{
                            'v-tab--active': getActiveMenuInx === 2,
                            inactive: getActiveMenuInx !== 2,
                        }"
            link
            href='/creation'
          >{{ $t(`成为一名快递员`) }}
          </v-tab>

          <v-tab
            :class="{
                            'v-tab--active': getActiveMenuInx === 3,
                            inactive: getActiveMenuInx !== 3,
                        }"
            link
            href='/about'
          >{{ $t(`关于我们`) }}
          </v-tab>

          <el-button @click='handleInfoWindowState(true)' class='login-bt try-out-bt' height='50px'
                     style='margin-right: 20px;margin-left: 16px'>{{ $t(`语言切换`) }}
          </el-button>

          <el-button @click='handleClick(1)' class='login-bt try-out-bt' v-if='!userNewInfo.staff_id&&!userNewInfo.uid'
                     style='margin-left: 16px;'
                     height='50px'>{{ $t(`登录`) }}
          </el-button>

          <!--          <el-button @click='handleClick(2)' class='login-bt try-out-bt' v-if='userNewInfo.staff_id'-->
          <!--                     style='margin-left: 16px;'-->
          <!--                     height='50px'>{{ $t(`邀请码兑换`) }}-->
          <!--          </el-button>-->

          <div v-if='userNewInfo.staff_id||userNewInfo.uid' style='margin-left: 32px'>
            <v-menu eager bottom offset-y left open-on-hover>
              <template #activator='{ attrs, on }'>
                <div class='flex flex-a-c' v-bind='attrs' v-on='on'>
                  <el-image
                    style='width: 60px; height: 60px;border-radius: 60px'
                    :src='userNewInfo.face'
                    fit='cover'></el-image>
                  <div class='ml2'>
                    <div class='font14' style='color: #f9c13e'>
                      {{ userNewInfo.name ? userNewInfo.name : userNewInfo.nickname ? userNewInfo.nickname : '' }}
                    </div>
                    <div class='font12' style='color: #909090'>{{ userNewInfo.mobile }}</div>
                  </div>
                </div>
              </template>
              <v-list flat>
                <v-list-item href='/information' v-if='userNewInfo.uid'>
                  <v-list-item-title>{{ $t(`个人信息`) }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click='bingOutLogin'>
                  <v-list-item-title>{{ $t(`退出登录`) }}</v-list-item-title>
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
  </div>
</template>

<script>
import InfoWindow from '@/components/popupWindow/infoWindow'
import login from '@/components/popupWindow/login'
import InvitationRedemption from '@/components/popupWindow/InvitationRedemption'
import {
  mapGetters,
  mapMutations,
  mapState,
  mapActions
} from 'vuex'

export default {
  name: 'header-control',
  components: {
    InfoWindow,
    login,
    InvitationRedemption
  },
  data () {
    return {
      currentMenuInx: 1, // 当前选择菜单下标
      isShowPhoneMenu: false, // 是否展示手机端菜单
      // 登录的选项类型
      loginType: -1,
      userNewInfo: {},
      // 是否显示联系方式弹框
      isShowContactInfoDialog: false
    }
  },
  watch: {
    $route () {
      this.isShowPhoneMenu = false
    }

  },
  mounted () {
    this.userNewInfo = this.getUserInfo
  },
  computed: {
    ...mapGetters({
      getUserInfo: 'getUserInfo'
    }),

    // 获取url 路径
    getUrlPath () {
      return this.$route.path
    },
    // 是否展示黑底背景
    getHeadClass () {
      const notPath = [
        '/message',
        '/headlines-detail',
        '/popular-tags',
        '/contentDetail',
        '/authorIndex',
        '/personalCenter',
        '/accountManagement',
        '/loginSafety',
        '/globalPreferences',
        '/styleRecommend',
        '/individualPrivacy',
        '/AgreementsAndArticles',
        '/creation'
      ]

      return notPath.includes(this.getUrlPath) ? 'cover-bg' : ''
    },
    // 获取菜单选中下标
    getActiveMenuInx () {
      const activeMenus = [
        [],
        ['/', ''],
        ['/creation'],
        ['/about']
      ]
      // console.log(this.getUrlPath)
      console.log(activeMenus.findIndex(item => item.includes(this.getUrlPath)))
      return activeMenus.findIndex(item => item.includes(this.getUrlPath))
    }
  },
  methods: {
    bingOutLogin () {
      this.$confirm('确认退出吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        this.$store.commit('SET_USERINFO', {})
        window.location.href = '/'
      })
    },
    handleHome () {
      window.location.href = '/'
    },
    handleClick (type) {
      if (type === 1) {
        this.handleCloseLoginDialog(1)
      } else {
        this.handleCloseLoginDialog(2)
      }
    },

    /** 处理联系方式弹框的状态 */
    handleInfoWindowState (value) {
      this.isShowContactInfoDialog = value
    },
    /** 处理登录弹框的关闭操作 */
    handleCloseLoginDialog (value) {
      this.loginType = value
    }
  }
}
</script>

<style lang='scss'>
.cover-bg {
  height: 100px !important;
  box-shadow: none !important;
  background-color: #fff8e2 !important;
}

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
    background: linear-gradient(0deg, rgba(37, 37, 37, 0) 83.5%, rgba(37, 37, 37, 0.5) 100%);

    .pc-menu-box {
      width: 70%;
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
      padding: 0 20px;
      line-height: 49px;
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
        height: 66px !important;
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
            top: $small-app-bar-height;
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
</style>
