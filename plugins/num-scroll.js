import Vue from 'vue'
import { CountUp } from 'countup.js'

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
		startNumScroll(el, bind)

		// 动画，执行完成，则释放
		window.removeEventListener('scroll', scrollHandle, true)
	}
}

/**
 * @description: 开始数字滚动
 * @date 2021/4/12
 */
function startNumScroll (el, { value }) {
	setTimeout(() => {
		new CountUp(el, value.endNum, {
			separator: '',
			duration: 2,
			startVal: value.start || 0
		}).start()
	}, value.delay || 600)
}

Vue.directive('num-scroll', {
	inserted (el, bind) {
		// 判断是否支持 IntersectionObserver
		if ('IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
			el.observer = new IntersectionObserver(entries => {
				if (entries[0].intersectionRatio > 0) { // 进入可视区域
				  startNumScroll(el, bind)
					// 动画执行完成，则释放
					el.observer.disconnect()
				}
			}, {
				threshold: [1]
			})
			el.observer.observe(el)
		} else {
			window.addEventListener('scroll', scrollHandle.bind(null, {
				el,
				bind
			}), true)
		}
	}
})
