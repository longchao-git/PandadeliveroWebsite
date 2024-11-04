import LRUCache from 'lru-cache'

const cache = new LRUCache({
	maxAge: 1000 * 60 * 2, // 有效期2分钟
	max: 1000 // 最大缓存数量
})

export default function (req, res, next) {
	// 本地开发环境不做页面缓存
	if (process.env.NODE_ENV !== 'development') {
		try {
			const cacheKey = req.url
			const cacheData = cache.get(cacheKey)
			if (cacheData) {
				return res.end(cacheData, 'utf8')
			}
			const originalEnd = res.end
			res.end = function (data) {
				cache.set(cacheKey, data)
				originalEnd.call(res, ...arguments)
			}
		} catch (error) {
			next()
		}
	}
	next()
}
