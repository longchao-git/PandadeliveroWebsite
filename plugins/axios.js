import {objToFormData} from '../utils/utils'
import config1 from '../config/index'


// 初始化请求插件
export default ({redirect, $axios,$cookies}) => {
  // 请求拦截器
  $axios.interceptors.request.use(config => {

    /* 如果是上传，则设置超时为 1小时， 请求超时10分钟 */
    config.timeout = 1000 * 60
    config.data = objToFormData(config.data)

    config.headers['System'] = config.headers['System'] || 'IOS';
    // config.headers['token'] =  localStorage.getItem('token') || '';
    config.headers['TOKEN'] = config.headers['TOKEN'] || localStorage.getItem('token') || '';
    config.headers['CITY_ID'] = config.headers['CITY_ID'] || 2
    config.headers['Api'] = config.headers['Api'] || 'STAFF'
    config.headers['Version'] = config.headers['Version'] || '4.3.20190404'
    if (!(config.data instanceof FormData)) {
      config.headers['content-type'] = config.headers['content-type'] || 'application/x-www-form-urlencoded';
    } else if (config.headers['content-type']) {
      delete config.headers['content-type']
      delete config.headers['Content-Type']
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  // 返回结果拦截器
  $axios.interceptors.response.use(response => {

    if (response.status === 200) {
      // 判断登陆是否过期
      if (response.config.url == "/magic/verify") {
        return Promise.resolve(response);
      }
      // 操作成功
      if (response.data.error == '0') {
        return Promise.resolve(response.data.data ?? response.data);
      } else {
        return Promise.reject(response.data);
      }
    } else {
      return Promise.reject(response.data);
    }
  }, error => {
    // 请求错误时，将后端返回的 data 透传出去，而非原始 error 对象
    const data = error?.response?.data
    return Promise.reject(data || error)
  })

  $axios.defaults.withCredentials = false



}
