<template>
	<div class='detail_container'>
		<sales-good-util :list='goodsArr' ref='child' :topInfo='topInfo' :shop_id='shop_id' @addCilck='addCilck' />
		<div class='flex flex-a-c butoonView' style='cursor: pointer;justify-content: flex-end;margin: 0 auto;'>
			<span class='color-242424 font14 ' v-if='addCartAary.length>0'>{{ $t('contentDetail.title') }}
				{{ addCartAary.length }} <span style='color: #ee8080'>{{ $t(`importetotal`) }}：€{{ (min_amount).toFixed(2)
          }}</span> </span>
			<div @click='handleCloseLoginDialog(1)' class='button_info' style='margin-left: 32px'>{{ $t('contentDetail.name')
        }}€{{ topInfo.min_amount }}{{ $t(`partir`) }}
			</div>
		</div>
		<login-window :type='loginType' :card_id='card_id' @handleCloseLoginDialog='handleCloseLoginDialog'
			@handleLoginAdd='handleLoginAdd' @paymentOrder='paymentOrder'
			@handledeteleLoginDialog='handledeteleLoginDialog' :orderAddrList='orderAddrList' :cardList='cardList'
			:payitem='payitem' :orderInfo='orderInfo' :amount='min_amount' />
		<login-succeed :posterUrl='posterUrl' :type='loginType' @handleCloseLoginDialog='handleCloseLoginDialog' />
		<login :loginType='loginType' @handleCloseLoginDialog='handleCloseLoginDialog'></login>
		<add-addr :type='loginType' @handleCloseLoginDialog='handleCloseLoginDialog'></add-addr>
		<add-bank :type='loginType' @handleCloseLoginDialog='handleCloseLoginDialog'></add-bank>
		<div id='posterHtml' class='posterHtml' ref='posterHtml'>
			<img :src='topInfo.logo' class='logo'>
			<div class='flex' style='align-items: center;padding: 20px 10px;justify-content: space-between;'>
				<div>
					<div>{{ topInfo.title }}</div>
					<div v-for='(item,index) in topInfo.huodongMark' class='font12' :style='{color:item.color}'>
						{{ item.title }}
					</div>
				</div>
				<!-- 二维码 -->
				<div class='qrcode' style='flex-shrink: 0'>
					<div id='qrcodeImg'></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import salesGoodUtil from '../components/cloudSales/salesGoodUtil';
	import LoginWindow from '../components/popupWindow/loginWindow.vue';
	import loginSucceed from '../components/popupWindow/loginSucceed.vue';
	import login from '../components/popupWindow/login.vue';
	import addAddr from '../components/popupWindow/addAddr.vue';
	import addBank from '../components/popupWindow/addBank.vue';

	export default {
		components: {
			salesGoodUtil,
			LoginWindow,
			loginSucceed,
			login,
			addAddr,
			addBank
		},
		data() {
			return {
				loginType: -1,
				shop_id: '',
				goodsArr: [],
				addCartAary: [],
				topInfo: {},
				posterUrl: '',
				product_info: '',
				orderAddrList: [],
				cardList: [],
				min_amount: 0,
				payitem: [],
				order_id: '',
				orderInfo: {},
				card_id: ''
			};
		},

		methods: {
			//添加购物车
			addCilck(e) {
				let {
					type,
					index,
					indexs,
					specsIndex,
					isValueNumber
				} = e;


				let goodsArr = this.goodsArr;
				let products = goodsArr[index].products[indexs];
				if (type === 2) {
					if (products.sale_sku > products.num) {
						this.$set(this.goodsArr[index].products, indexs, {
							...goodsArr[index].products[indexs],
							num: products.num + 1
						});
					} else {
						this.$message.info(this.$t(`productos`));
					}
				} else if (type === 1) {
					this.$set(this.goodsArr[index].products, indexs, {
						...goodsArr[index].products[indexs],
						num: products.num - 1
					});
				} else if (type === 4) {
					if (products.sale_sku > products.num) {
						this.$set(this.goodsArr[index].products, indexs, {
							...goodsArr[index].products[indexs],
							num: products.num + 1
						});
						this.$set(this.goodsArr[index].products[indexs].specs, specsIndex, {
							...goodsArr[index].products[indexs].specs[specsIndex],
							num: goodsArr[index].products[indexs].specs[specsIndex].num + 1
						});
					} else {
						this.$message.info(this.$t(`productos`));
					}
				} else if (type === 3) {

					this.$set(this.goodsArr[index].products, indexs, {
						...goodsArr[index].products[indexs],
						num: products.num - 1
					});
					this.$set(this.goodsArr[index].products[indexs].specs, specsIndex, {
						...goodsArr[index].products[indexs].specs[specsIndex],
						num: goodsArr[index].products[indexs].specs[specsIndex].num - 1
					});

				} else if (type === 6) {
					if (products.sale_sku > products.num) {
						this.$set(this.goodsArr[index].products, indexs, {
							...goodsArr[index].products[indexs],
							num: products.num + 1
						});
						this.$set(this.goodsArr[index].products[indexs].priceDatass, specsIndex, {
							...goodsArr[index].products[indexs].priceDatass[specsIndex],
							num: goodsArr[index].products[indexs].priceDatass[specsIndex].num + 1
						});

					} else {
						this.$message.info(this.$t(`productos`));
					}
				} else if (type === 5) {
					this.$set(this.goodsArr[index].products, indexs, {
						...goodsArr[index].products[indexs],
						num: products.num - 1
					});
					this.$set(this.goodsArr[index].products[indexs].priceDatass, specsIndex, {
						...goodsArr[index].products[indexs].priceDatass[specsIndex],
						num: goodsArr[index].products[indexs].priceDatass[specsIndex].num - 1
					});
				} else if (type === 8) {
					if (products.sale_sku > products.num) {
						this.$set(this.goodsArr[index].products, indexs, {
							...goodsArr[index].products[indexs],
							num: products.num + 1
						});
						this.goodsArr[index].products[indexs].specs[specsIndex].pricenewDatass[isValueNumber].num = this
							.goodsArr[index].products[indexs].specs[specsIndex].pricenewDatass[isValueNumber].num + 1;
						this.$refs.child.childMethod(this.goodsArr[index].products[indexs], index, indexs, specsIndex,
							isValueNumber);
					} else {
						this.$message.info(this.$t(`productos`));
					}
				} else if (type === 7) {
					this.$set(this.goodsArr[index].products, indexs, {
						...goodsArr[index].products[indexs],
						num: products.num - 1
					});
					this.goodsArr[index].products[indexs].specs[specsIndex].pricenewDatass[isValueNumber].num = this
						.goodsArr[index].products[indexs].specs[specsIndex].pricenewDatass[isValueNumber].num - 1;
					this.$refs.child.childMethod(this.goodsArr[index].products[indexs], index, indexs, specsIndex,
						isValueNumber);
				}


				this.goodsArr = goodsArr;
				// return
				let info = this.goodsArr[index].products[indexs];
				let infoData = {
					'is_discount': info.is_discount,
					'is_must': info.is_must,
					'oldprice': info.oldprice,
					'price': info.price,
					'package': info.package_price,
					'product_id': info.product_id,
					'pcate_id': info.cate_id,
					'sale_sku': info.sale_sku,
					'sale_type': info.sale_type,
					'shoptitle': this.topInfo.title,
					'shopid': info.shop_id,
					'str_obj': {},
					'str_name': '',
					'title': info.title,
					'sku_id': info.sku_id,
					'spec_id': '',
					'num': info.num
				};
				if (type === 4 || type === 3) {
					infoData.sku_id = info.specs[specsIndex].sku_id;
					infoData.spec_id = info.specs[specsIndex].spec_id;
					infoData.num = info.specs[specsIndex].num;
					infoData.price = info.specs[specsIndex].price;
				}
				if (type === 5 || type === 6) {
					infoData.num = info.priceDatass[specsIndex].num;

					let str_name = [];
					for (let i in info.specification) {
						str_name.push(info.specification[i].key + '_' + info.specification[i].val[info.specification[i]
							.spk]);
					}
					infoData.str_name = str_name.join('-');
				}
				if (type === 7 || type === 8) {
					infoData.sku_id = info.specs[specsIndex].sku_id;
					infoData.spec_id = info.specs[specsIndex].spec_id;
					infoData.num = info.specs[specsIndex].pricenewDatass[isValueNumber].num;
					infoData.price = info.specs[specsIndex].price;

					let str_name = [];
					for (let i in info.specification) {
						str_name.push(info.specification[i].key + '_' + info.specification[i].val[info.specification[i]
							.spk]);
					}
					infoData.str_name = str_name.join('-');
				}
				console.log(infoData);
				let ishowAdd = true;
				for (let i in this.addCartAary) {
					if (this.addCartAary[i].product_id === infoData.product_id && this.addCartAary[i].sku_id === infoData
						.sku_id && this.addCartAary[i].str_name === infoData.str_name) {
						ishowAdd = false;
						if (infoData.num) {
							this.addCartAary[i] = infoData;
						} else {
							this.addCartAary.splice(i, 1);
						}
					}
				}
				if (ishowAdd) {
					this.addCartAary.push(infoData);
				}

				let min_amount = 0;
				for (let item of this.addCartAary) {
					min_amount += item.price * item.num;
				}
				this.min_amount = min_amount;

			},

			/** 处理登录弹框的关闭操作 */
			async handleCloseLoginDialog(value) {
				// this.loginType = 9;
				// this.memberCardIndex();
				// return
				if (value === 2) {
					this.$html2canvas(this.$refs.posterHtml, {}).then((canvas) => {
						let posterUrl = canvas.toDataURL('image/png');
						this.posterUrl = posterUrl;
					});
					this.loginType = 3;
				} else if (value === 1) {
					if (this.addCartAary.length <= 0) {
						this.$message.info(this.$t(`loginOrRegister.placeholder`)[1]);
						return;
					}
					if (this.min_amount < this.topInfo.min_amount) {
						this.$message.info(this.$t(`salida`));
						return;
					}
					if (localStorage.getItem('token')) {
						this.orderForm().then(res => {

							let payitem = [];
							if (res.online_pay == 1) {
								var arr = {
									'title': this.$t(`online_pay`),
									'code': 1
								};
								payitem.push(arr);
							}
							if (res.is_daofu == 1) {
								var arr = {
									'title': this.$t(`is_daofu`),
									'code': 2
								};
								payitem.push(arr);
								if (res.is_pos == 1) {
									var arr1 = {
										'title': this.$t(`is_pos`),
										'code': 3
									};
									payitem.push(arr1);
								}
							}
							this.orderInfo = res;
							this.payitem = payitem;
							this.loginType = 2;
						});
					} else {
						this.loginType = 1;
					}
					return;
				} else if (value === 3) {
					this.loginType = 4;
				} else if (value === -2) {
					this.orderAddr();
					this.handleCloseLoginDialog(1)
					this.loginType = -1
				} else if (value === -9) {
					this.memberCardIndex();
					this.loginType = -1;
				} else if (value === 9) {
					this.loginType = 9;
				} else {
					this.loginType = value;
				}
			},
			//删除银行卡
			handledeteleLoginDialog(card_id) {
				var params = {
					data: {
						card_id: card_id
					}
				};
				this.$confirm(this.$t(`confirm.one`) + '?', this.$t(`confirm.two`), {
					confirmButtonText: this.$t(`asentar`),
					cancelButtonText: this.$t(`confirm.tree`),
					type: 'warning'
				}).then(() => {
					this.$axios.post('/client/member/card/unbind', params).then(async res => {

						this.$message.success(this.$t(`confirm.five`));
						this.card_id = '';
						this.memberCardIndex();

					}).catch(err => {
						this.$message.info(err.message);
					});
				})

			},
			paymentOrder(value) {
				var params = {
					data: {
						...value,
						order_id: this.order_id
					}
				};
				this.$axios.post('/client/payment/order', params).then(async res => {
					this.$message.success(this.$t(`addView`));
					this.handleCloseLoginDialog(-1);
					setTimeout(() => {
						window.location.href = '/';
					}, 1000);

				}).catch(err => {
					this.$message.info(err.message);
				});
			},
			handleLoginAdd(value) {
				let onlinepay = '';
				let is_pos = 0;
				if (value.code == 1) {
					onlinepay = 1;
				} else if (value.code == 2) {
					onlinepay = 0;
					is_pos = 0;
				} else if (value.code == 3) {
					onlinepay = 0;
					is_pos = 1;
				}

				var params = {
					data: {
						shop_id: this.shop_id,
						addr_id: value.addr_id,
						hongbao_id: 0,
						pei_type: 0,
						online_pay: onlinepay,
						products: this.product_info,
						intro: value.intro,
						hg_products: [],
						is_first: 0,
						hongbao_package_id: 0,
						is_pos: is_pos,
						pei_time: 0
					}
				};

				this.$axios.post('/client/waimai/order/create', params).then(res => {
					if (value.code == 1) {
						this.$message.success(this.$t(`enviado`));
						this.order_id = res.order_id;
						this.memberCardIndex();
					} else {
						this.$message.success(this.$t(`addView`));
						this.handleCloseLoginDialog(-1);
						setTimeout(() => {
							window.location.href = '/';
						}, 1000);
					}

				}).catch(err => {
					this.$message.info(err.message);
				});
			},
			memberCardIndex() {
				let params = {
					data: {}
				};
				this.$axios.post('/client/member/card/index', params).then(res => {
					this.cardList = res;
					this.loginType = 5;
				}).catch(err => {
					this.$message.info(err.message);
				});
			},
			orderForm() {
				return new Promise((resolve, reject) => {
					let product_info2 = '';
					let cart = this.addCartAary;
					let title = '';
					console.log(cart);
					for (let i in cart) {
						title = cart[i].shoptitle;
						if (cart[i].spec_id) {
							product_info2 += cart[i].product_id + ':' + cart[i].spec_id + ':' + cart[i].num;
							if (cart[i].str_name) {
								product_info2 += '&' + cart[i].str_name;
							}
						} else if (cart[i].str_name) {
							product_info2 += cart[i].product_id + ':' + 0 + ':' + cart[i].num + '&' + cart[i]
								.str_name;
						} else {
							product_info2 += cart[i].product_id + ':' + 0 + ':' + cart[i].num;
						}
						product_info2 += ',';
					}
					this.product_info = product_info2.substring(0, product_info2.length - 1, 1);
					const params = {
						data: {
							'shop_id': this.shop_id,
							'products': this.product_info,
							'pei_type': 0,
							'is_ziti': 0
						}
					};
					this.$axios.post('/client/waimai/order/order', params).then(res => {
						resolve(res);
					}).catch(err => {
						this.$message.info(err.message);
					});
				});
			},

			orderAddr() {
				const params = {
					data: {
						'shop_id': this.shop_id,
						'page': 1
					}
				};;
				this.$axios.post('/client/member/addr/orderAddr', params).then(res => {
					this.orderAddrList = res.items;
				}).catch(err => {
					this.$message.info(err.message);
				});
			},
			shopDetail() {
				const params = {
					data: {
						'shop_id': this.shop_id
					}
				};
				this.$axios.post('/client/waimai/shop/detail', params).then(res => {
					this.topInfo = res.detail;
					let list = res.detail.items;
					this.goodsArr = list;
					this.resetData();
					// this.qrcode();
				}).catch(err => {
					this.$message.info(err.message);
				});
			},
			// qrcode() {
			//   let qrcode = new this.$RCode('qrcodeImg', {
			//     width: 80, // 设置宽度，单位像素
			//     height: 80, // 设置高度，单位像素
			//     text: 'https://cuai-zi.net/web/app_share.html' // 设置二维码内容或跳转地址
			//   });
			// },

			//渲染数据
			resetData() {
				let that = this,
					goodsArr = that.goodsArr,
					arr = {
						title: this.$t(`all`),
						cate_id: 'all',
						products: []
					},
					sku_id;

				for (let i = 0; i < goodsArr.length; i++) {
					for (let j = 0; j < goodsArr[i].products.length; j++) {
						if (goodsArr[i].products[j].length != 0) {
							//全部商品；
							if (!isNaN(parseInt(goodsArr[i].cate_id))) {
								arr.products.push(goodsArr[i].products[j]);
							}
							goodsArr[i].products[j].specsIndex = -1;
							//定义商品规格及sku_id；
							if (goodsArr[i].products[j].specs && goodsArr[i].products[j].specs.length > 0) {
								goodsArr[i].products[j].specsIndex = 0;
								goodsArr[i].products[j].num = 0;
								let pricenewDatass = [];
								if (goodsArr[i].products[j].specification.length > 0) {
									let arr = [];
									for (let w in goodsArr[i].products[j].specification) {
										goodsArr[i].products[j].specification[w].spk = 0;
										arr.push(goodsArr[i].products[j].specification[w].val);
									}
									pricenewDatass = this.combination(arr);
								}
								for (let h = 0; h < goodsArr[i].products[j].specs.length; h++) {
									sku_id = goodsArr[i].products[j].product_id + '_' + goodsArr[i].products[j].specs[h]
										.spec_id;
									goodsArr[i].products[j].specs[h].sku_id = sku_id;
									if (pricenewDatass.length > 0) {
										goodsArr[i].products[j].specs[h].pricenewDatass = JSON.parse(JSON.stringify(
											pricenewDatass));
									}

									goodsArr[i].products[j].specs[h].title = goodsArr[i].products[j].title + '(' +
										goodsArr[i].products[j].specs[h].spec_name + ')';
									goodsArr[i].products[j].specs[h].is_must = goodsArr[i].products[j].is_must;
									goodsArr[i].products[j].specs[h].num = 0;
								}
							} else {
								sku_id = goodsArr[i].products[j].product_id + '_0';
								goodsArr[i].products[j].sku_id = sku_id;
								goodsArr[i].products[j].num = 0;
							}
							if (goodsArr[i].products[j].specification.length > 0) {
								sku_id = goodsArr[i].products[j].product_id + '_0';
								goodsArr[i].products[j].sku_id = sku_id;
								goodsArr[i].products[j].num = 0;
								let arr = [];
								for (let w in goodsArr[i].products[j].specification) {
									goodsArr[i].products[j].specification[w].spk = 0;
									arr.push(goodsArr[i].products[j].specification[w].val);
								}
								goodsArr[i].products[j].priceDatass = this.combination(arr);
							}
						}
					}
				}
				that.goodsArr = goodsArr;
			},
			combination(arr) {
				let result = [
					[]
				];
				arr.map(x => {
					var res = [];
					result.map(y => {
						x.map(z => {
							res.push([...y, z]);
						});
					});
					result = res;
				});
				let priceDatass = [];
				for (let i in result) {
					priceDatass.push({
						attrJson: result[i].join(','),
						num: 0
					});
				}
				return priceDatass;

			}
		},

		mounted() {
			// localStorage.setItem('token', '2-KT5F50CB82EC23055AC3AD693EA5AD39FD');
			if (this.$route.query.shop_id) {
				this.shop_id = this.$route.query.shop_id;
			}

			this.shopDetail();
			if (localStorage.getItem('token')) {
				this.orderAddr();
			}

		}
	};
</script>
<style>
	.main-content {
		background-color: #f5f5f5;
	}

	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* 对于非Webkit浏览器，设置为隐藏 */
	input {
		-moz-appearance: textfield;
	}
</style>
<style scoped lang='scss'>
	.detail_container {
		width: 90%;
		margin: 0 auto;
		padding: 24px 0;

	}

	.butoonView {
		width: 60%;
	}

	.button_info {
		width: 200px;
		height: 53px;
		background: #ee8080;
		border-radius: 4px 4px 4px 4px;
		text-align: center;
		line-height: 53px;
		color: #ffffff;
		font-size: 17px;
		font-weight: bold;
	}

	.posterHtml {
		width: 264px;
		height: 400px;
		background: white;
		position: fixed;
		top: 99999px;

		>.logo {
			object-fit: cover;
			width: 264px;
			height: 264px;
		}

		.qrcode {
			width: 100px;
			height: 100px;

			#qrcodeImg {
				width: 100px;
				height: 100px;
			}
		}
	}

	/* 中屏幕*/
	@media screen and(max-width: $big-pc-width) {
		.butoonView {
			width: 80%;
		}
	}

	/** 平板屏幕 */
	@media screen and (max-width: $pad-max-width) {
		.butoonView {
			width: 100%;
		}
	}

	/** 手机屏幕 */
	@media screen and (max-width: $phone-max-width) {
		.butoonView {
			width: 100%;
		}
	}
</style>