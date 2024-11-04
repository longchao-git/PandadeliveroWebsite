<script>
/**
 * @description: 信息采集
 * @date 2021/3/17
 */
import { validPhoneNum } from '../utils/regular'
import config from '../config/index'
import { debounce, resetObjParam, throttle } from '../utils/utils'

export default {
	name: 'collection-mixin',
	render: () => '',
	data () {
		return {
			collectionFormData: {
				type: '试用',
				occName: '',
				occOther: '',
				occPhone: ''
			}
		}
	},
	methods: {
		/**
     * @description: 初始化客户类型
     * @date 2021/4/6
     */
		initUserType (type) {
			this.collectionFormData.type = type
		},

		/**
     * @description: 重置表单内容
     * @date 2021/4/8
     */
		onResetCollectionFormData () {
			this.collectionFormData = resetObjParam(this.collectionFormData)
		},

		/**
     * @description: 提交用户收集
     * @date 2021/4/2
     */
		onSubmitCustomerCollection (form, msg = '提交成功', isShowToast = true) {
			  return new Promise((resolve, reject) => {
				// 如果不存在用户名，则添加空用户
				if (!form.occName) {
					form.occName = '---'
				}
				this.$axios.post('/www/customer/save', JSON.stringify({
					...form,
				}), {
					headers: {
						'Content-type': 'application/json;charset=utf-8'
					}
				}).then(() => {
					if (isShowToast === true) this.$toast.info(msg)
					return resolve('success')
				}, (err) => {
					reject(err)
				  if (isShowToast === true)	this.$toast.error(err.errorMsg || '提交失败，请重试')
				})
			})
		},

		/**
     * @description: 输入手机号试用
     * @date 2021/4/6
     */
		onInputTryout: throttle(function () {
			const { occPhone } = this.collectionFormData
			if (!occPhone) return this.$toast.warning('请输入手机号')
			if (!validPhoneNum(occPhone)) return this.$toast.warning('手机号输入不正确')

			this.onSubmitCustomerCollection(this.collectionFormData).then(() => {
				localStorage.userRegisterPhone = occPhone
				this.onResetCollectionFormData()
				setTimeout(() => {
					window.open(this.$router.resolve({
						path: '/register'
					}).href)
				}, 1000)
			})
		}),

		/**
     * @description: 输入框失去焦点
     * @date 2021/3/17
     */
		onInputBlur: debounce(function () {
			const { occPhone } = this.collectionFormData
			if (!validPhoneNum(occPhone)) return
			this.onSubmitCustomerCollection(this.collectionFormData, null, false)
		}, 300)
	}
}
</script>
