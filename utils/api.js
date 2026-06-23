/**
 * API 响应解包工具
 * axios 拦截器统一将 res.data 解包，但部分接口返回 res（拦截器未命中时）
 * 此工具兼容两种模式：先检查 res.data，再降级到 res
 */

/**
 * 解包单个对象数据
 */
export function unwrapData(res) {
  return res && res.data ? res.data : res;
}

/**
 * 解包列表数据，可指定列表字段名
 */
export function unwrapList(res, key = 'list') {
  const data = unwrapData(res);
  if (Array.isArray(data[key])) return data[key];
  if (Array.isArray(data)) return data;
  return [];
}
