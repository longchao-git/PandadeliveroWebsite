import cloneDeep from 'lodash.clonedeep'

/**
 * @description: 对象初始化值
 * @date 2019/5/10  9:35
 * @param _obj {Object} 需要初始化值的对象
 * @param not {Array} 不需要初始化的数据
 * @return {Object}
 */
export function resetObjParam (_obj, not = []) {
	if (!_obj) throw Error('Not obj Param ')
	const obj = copyObj(_obj)
	if (obj instanceof Array) {
		return []
	}

	Object.keys(obj).forEach(key => {
		if (not.indexOf(key) !== -1) return
		if (obj[key] instanceof Array) {
			obj[key] = []
			return
		} else if (obj[key] instanceof Object) {
			resetObjParam(obj[key])
			return
		}
		obj[key] = ''
	})
	return obj
}

/**
 * @description: json 数据 转 form Data 数据
 * @date 2019/5/13  16:06
 */
export function objToFormData (obj) {
	if (!obj) return new FormData()
	if (typeof obj === 'string') return obj
	const formData = new FormData()
	Object.keys(obj).forEach(key => {
		formData.append(key, obj[key] !== undefined ? obj[key] : '')
	})
	return formData
}

/**
 * @description: 把数据转换为 number 类型
 * @date 2019/5/10  9:46
 * @param data {Object} 需要复制的对象
 * @return  {Object} 模板对象，如果存在，则返回只模板有的数据
 */
export function dataToFloat (data) {
	if (!data) throw Error('Not obj Param ')
	Object.keys(data).forEach(key => {
		if (data[key] && !isNaN(data[key]) && /^[0-9]*(\.[0-9]{0,4})?$/.test(data[key])) {
			data[key] = parseFloat(data[key])
		}
	})
	return data
}

/**
 * @description: 数据过滤器
 * @date 2019/5/20  10:53
 *@param data {Array} 处理数据
 * @param filter {Object} 需要过滤的数据
 *  filter: { // 示例数据
 *    sex: [{key: '0', name: '女'}, {key: '1': name: '男'}]
 *  }
 */
export function dataFilterReform (data, filter) {
	const keys = Object.keys(filter)
	if (keys.length === 0) return data
	// 1. 遍历源数据
	// 2. 遍历需要过滤数据的key
	// 3. 通过表达式[key]对应到 源数据item , 然后定位 需要过滤的数据的name 值
	data.forEach(item => {
		keys.forEach(key => {
      let filterVal = filter[key].find(i => item[key] == i.key)// eslint-disable-line
			if (filterVal) {
				item[key + 'Old'] = item[key]
				item[key] = filterVal.name
			}
		})
	})
	return data
}

/**
 * @param { function } 节流函数
 * @param { number } wait 多少区间不执行毫秒数
 */
export function throttle (func, wait = 1000) {
	let _lastTime = null
	return function () {
		const context = this
		const args = arguments
		const _nowTime = +new Date()
		if (_nowTime - _lastTime > wait || !_lastTime) {
			func.apply(context, args)
			_lastTime = _nowTime
		}
	}
}

/**
 * @param { function } 防抖函数
 * @param { number } wait 多少区间后执行毫秒数
 */
export function debounce (func, wait = 1000) {
	let _lastTime = null
	return function () {
		const context = this
		const args = arguments
		if (_lastTime) {
			clearTimeout(_lastTime)
		}
		_lastTime = setTimeout(() => {
			func.apply(context, args)
		}, wait)
	}
}

/**
 * @description: 正整数非0验证
 * @date 2020/10/28
 */
export function isPositiveInteger (val, min = 0, decimal = 0, max) {
	if (val === '') return false
	if (isNaN(val)) return false
	if (String(val).indexOf(' ') !== -1) return false
	if (val < min) return false
	if (max != null && val > max) return false
	// 判断是否有小数位，并且匹配小数长度
	const del = String(val).split('.')
	if (del.length > 1) {
		if (del.length > 2) return false
		if (del[1].length > decimal) return false
	}
	return true
}

/**
 * @description: 复制一个新的对象，防止浅拷贝，更改到源数据
 * @date 2019/5/10  9:46
 * @param obj {Object} 需要复制的对象
 * @return  templateObj {Object} 模板对象，如果存在，则返回只模板有的数据
 */
export function copyObj (obj, templateObj) {
	if (!obj) throw Error('Not obj Param ')
	const _obj = cloneDeep(obj)
	// 如果存在
	if (templateObj) {
		Object.keys(templateObj).forEach(key => {
			const isExist = !(_obj[key] === null || _obj[key] === undefined)
			if (isExist) {
				templateObj[key] = _obj[key]
			} else {
				templateObj[key] = templateObj[key] instanceof Array ? [] : ''
			}
		})
		return templateObj
	}
	return _obj
}
