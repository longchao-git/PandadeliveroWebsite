import Vue from 'vue'
import { throttle } from '../utils/utils'

/**
 * @description: 滑动事件
 * @date 2021/3/23
 */
function scrollHandle ({ el, bind }) {
	const offset = el.getBoundingClientRect()
	const offsetTop = offset.top
	const offsetBottom = offset.bottom
	// 进入可视区域
	if (offsetTop <= window.innerHeight && offsetBottom >= 0) {
		elAddOrRemoveClass(el, bind.value)
	} else {
		if (bind.modifiers.not === true) return
		elAddOrRemoveClass(el, bind.value, true)
	}
}

/**
 * @description: 添加与移除class
 * @date 2021/3/23
 * @param el {Element} 元素
 * @param className {String} 添加/移除的样式
 * @param isRemove {Boolean} 是否是移除样式
 */
const elAddOrRemoveClass = throttle(function elAddOrRemoveClass (el, val, isRemove = false) {
	let classVal = el.getAttribute('class') || ''
	let className = val
	// 如果传入的样式为函数， 则回调
	if (typeof className === 'function') {
		className = val() || ''
	}
	if (className) {
		if (isRemove === true) {
			classVal = classVal.replace(' ' + className, '')
		} else if (classVal.indexOf(className) === -1) {
			classVal += ' ' + className
		}
		el.setAttribute('class', classVal)
	}
}, 30)

Vue.directive('show-transition', {
	inserted (el, bind) {
		// 判断是否支持 IntersectionObserver
		if ('IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
			el.observer = new IntersectionObserver(entries => {
				if (entries[0].intersectionRatio > 0) { // 进入可视区域
					elAddOrRemoveClass(el, bind.value)
				} else {
					if (bind.modifiers.not === true) return
					elAddOrRemoveClass(el, bind.value, true)
				}
			}, {
				threshold: [0.3]
			})
			el.observer.observe(el)
		} else {
			window.addEventListener('scroll', scrollHandle.bind(null, {
				el,
				bind
			}), true)
		}
	},
	componentUpdated (el, bind) {
		if (bind.modifiers.update === true) {
			elAddOrRemoveClass(el, bind.value, true)
			setTimeout(() => { elAddOrRemoveClass(el, bind.value) }, 60)
		}
	},

	unbind (el) {
		if (el.observer) {
			el.observer.disconnect()
		} else {
			window.removeEventListener('scroll', scrollHandle, true)
		}
	}
})
