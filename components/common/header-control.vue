<template>
	<div :class='getHeadClass'>
		<v-overlay class='phone-menu-mask' @click.native='isShowPhoneMenu = false' :value='isShowPhoneMenu'></v-overlay>

		<v-app-bar fixed :flat='true' class='header-app-bar top-app-bar' color='transparent'>
			<!--手机端-->
			<div class='phone-menu-box max-width'>
				<div class='disflex al-center phone-menu-bar max-width'>
					<!--          <nuxt-link style='margin-right: 14px' class='clear-flex h-logo-img' to='/'>-->
					<!--            <embed width='60%' :src="require('~/assets/images/cloudSales/header2-logo.svg')"-->
					<!--                   type='image/svg+xml' />-->
					<!--          </nuxt-link>-->
					<img @click="handleHome" :src="require('~/assets/images/cloudSales/header2-logo.svg')"
						style="width: 8%; max-height: 100px; margin-right: 14px; cursor: pointer; object-fit: cover"
						alt="" />
					<v-spacer />
					<div class='login-input' v-if='getActiveMenuInx>0'>
						<el-input @keyup.enter.native="handleClick(2)" v-model='context' :placeholder="$t('header.placeholder')" class='c-input'
							style='color: #ee8080' />
						<!--          el-icon-search-->
						<i class="el-icon-search " @click='handleClick(2)' style='font-size: 24px;color: #ee8080'></i>
						<!--          <img style='width: 32px; height: 32px' src='~/assets/images/cloudSales/icon_sousuo.png' alt='' @click='handleClick(2)'/>-->
					</div>
					<div style='display: flex'>
						<v-btn @click='handleInfoWindowState(true)' class='login-bt try-out-bt' height='50px'> {{ $t('header.lang')
              }}
						</v-btn>
						<v-btn @click='handleClick(1)' class='login-bt try-out-bt'
							height='50px'>{{ $t('header.information') }}</v-btn>
					</div>
				</div>
			</div>

			<!--PC端-->
			<div class='disflex ju-center max-width al-center col-f pc-menu-box'>
				<!--        <div @click="handleHome" style='cursor: pointer'>-->
				<!--          <embed :src="require('~/assets/images/cloudSales/header2-logo.svg')"  style='margin-right: 14px;' width='8%'-->
				<!--                 type='image/svg+xml' />-->
				<img @click="handleHome" :src="require('~/assets/images/cloudSales/header2-logo.svg')"
					style="width: 8%; max-height: 100px; margin-right: 14px; cursor: pointer; object-fit: cover"
					alt="" />
				<!--        </div>-->

				<!-- 登录样式 -->
				<div class='login-input' v-if='getActiveMenuInx>0'>
					<el-input v-model='context' @keyup.enter.native="handleClick(2)" :placeholder="$t('header.placeholder')" class='c-input'
						style='color: #ee8080' />
					<!--          el-icon-search-->
					<i class="el-icon-search " @click='handleClick(2)' style='font-size: 24px;color: #ee8080'></i>
					<!--          <img style='width: 32px; height: 32px' src='~/assets/images/cloudSales/icon_sousuo.png' alt='' @click='handleClick(2)'/>-->
				</div>
				<div style='display: flex'>
					<v-btn @click='handleInfoWindowState(true)' class='login-bt try-out-bt' height='50px'
						style='margin-right: 20px;'> {{ $t('header.lang')
            }}
					</v-btn>
					<v-btn @click='handleClick(1)' class='login-bt try-out-bt'
						height='50px'>{{ $t('header.information') }}</v-btn>
					<!--          <v-btn @click='handleClick(1)' class='login-bt try-out-bt' height='50px'>{{ $t('header.information') }}</v-btn>-->
					<!--          <v-menu eager bottom offset-y left open-on-hover>-->
					<!--            <template #activator="{ attrs, on }">-->
					<!--              <v-tab v-bind="attrs" v-on="on" class="v-tab&#45;&#45;active">-->
					<!--                <v-btn  class='login-bt try-out-bt' height='50px'>{{ $t('header.login') }}</v-btn>-->
					<!--              </v-tab>-->
					<!--            </template>-->
					<!--            <v-list flat>-->
					<!--              <template v-if='true'>-->
					<!--                <v-list-item link>-->
					<!--                  <v-list-item-title @click="handleCloseLoginDialog(1)">{{ $t('header.login') }}/{{ $t('header.register') }}</v-list-item-title>-->
					<!--                </v-list-item>-->
					<!--              </template>-->
					<!--              <template v-else>-->
					<!--                <v-list-item href="/personalCenter?type=3">-->
					<!--                  <v-list-item-title>{{ $t('header.navList')[0] }}</v-list-item-title>-->
					<!--                </v-list-item>-->
					<!--                <v-list-item href="/personalCenter?type=2">-->
					<!--                  <v-list-item-title>{{ $t('header.navList')[1] }}</v-list-item-title>-->
					<!--                </v-list-item>-->
					<!--                <v-list-item link href="/message">-->
					<!--                  <v-list-item-title style="color: #292e35 !important">{{ $t('header.navList')[2] }}</v-list-item-title>-->
					<!--                </v-list-item>-->
					<!--              </template>-->
					<!--            </v-list>-->
					<!--          </v-menu>-->
				</div>
			</div>
		</v-app-bar>
		<!-- 登录弹窗 -  -->
		<login-user :type='loginType' @handleCloseLoginDialog='handleCloseLoginDialog' />
		<!-- 语言切换 -->
		<info-window :isShow='isShowContactInfoDialog' @handleClose='handleInfoWindowState' />
	</div>
</template>

<script>
	import LoginWindow from '@/components/popupWindow/loginWindow';
	import LoginUser from '@/components/popupWindow/loginLogin';
	import InfoWindow from '@/components/popupWindow/infoWindow';
	import {
		mapGetters,
		mapMutations,
		mapState,
		mapActions
	} from 'vuex';

	export default {
		name: 'header-control',
		components: {
			LoginWindow,
			InfoWindow,
			LoginUser
		},
		data() {
			return {
				currentMenuInx: 1, // 当前选择菜单下标
				isShowPhoneMenu: false, // 是否展示手机端菜单
				// 登录的选项类型
				loginType: -1,
				context: '',
				// 是否显示联系方式弹框
				isShowContactInfoDialog: false
			};
		},
		watch: {
			$route() {
				this.isShowPhoneMenu = false;
			},
			searchKeywords() {
				this.context = this.searchKeywords;
			}
		},
		created() {
			console.log(this.searchKeywords)
			this.context = this.searchKeywords;
		},
		computed: {
			...mapState(['searchKeywords']),
			// 获取url 路径
			getUrlPath() {
				return this.$route.path;
			},
			// 是否展示黑底背景
			getHeadClass() {
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
				];

				return notPath.includes(this.getUrlPath) ? 'cover-bg' : '';
			},
			// 获取菜单选中下标
			getActiveMenuInx() {
				const activeMenus = [
					[],
					['/', ''],
					['/creation'],
				];
				// console.log(this.getUrlPath)
				// console.log(activeMenus.findIndex(item => item.includes(this.getUrlPath)))
				return activeMenus.findIndex(item => item.includes(this.getUrlPath));
			}
		},
		methods: {
			handleHome() {
				window.location.href = '/';
			},
			handleClick(type) {
				if (type === 1) {
					window.location.href = 'https://apps.apple.com/es/app/kuaizi/id6447261841';
				} else {
					if (!this.context) {
						this.$message.warning(this.$t('header.placeholder'));
						return;
					}
					window.location.href = '/creation?keywords=' + this.context;
				}
			},

			/** 处理联系方式弹框的状态 */
			handleInfoWindowState(value) {
				this.isShowContactInfoDialog = value;
			},
			/** 处理登录弹框的关闭操作 */
			handleCloseLoginDialog(value) {
				console.log(value)
				this.loginType = value;
			}
		}
	};
</script>

<style lang='scss'>
	.cover-bg {
		height: 100px !important;
		box-shadow: none !important;
		background-color: #FFFFFF !important;
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
        border:1px solid #ee8080;
				justify-content: space-between;
				align-items: center;
				padding: 0 28px;
				color: white !important;

				.el-input__inner {
					background: transparent;
					border: none;
					color: #ee8080;
				}

				.el-input__inner::-webkit-input-placeholder {
					color: #ee8080;
				}
			}

			.login-bt {
				box-shadow: inset 0 0 20px #EE8080;
				background: #EE8080;
				border-radius: 35px;
				height: 49px;
				padding: 0 20px;
				line-height: 49px;
				text-align: center;
				font-weight: 700;
				font-size: 16px;
				color: #FFFFFF;
				text-shadow: none;
				-webkit-transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
				transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
			}

			.v-toolbar__content {
				padding: 0;
				height: 100px !important;
			}

			.v-toolbar__content {
				height: 100% !important;
			}

			&.v-app-bar--is-scrolled {
				top: 0 !important;
				box-shadow: none !important;
				background-color: #FFFFFF !important;
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
					background-color: #FFFFFF !important;


					&.v-toolbar {
						box-shadow: none !important;
						background-color: #FFFFFF !important;
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
