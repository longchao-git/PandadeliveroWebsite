/**
 * @Description: 验证密码 是 长度(6 - 21)的英数组合密码。
 * @date 2019/3/26  14:49
 */
export const validPassword = (val) => {
	return !(val.length < 6 || val.length > 21)
}

/**
 * @Description:  正则验证手机号是否正确
 * @date 2019/4/8  13:55
 */
export const validPhoneNum = (val) => {
	return /^1[34578]\d{9}$/.test(val)
}

/**
 * @description: 验证用户名 是 长度(6 - 18)的英数组合用户名。
 * @date 2019/3/26  14:49
 */
export const validUserName = (val) => {
	return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(val)
}
