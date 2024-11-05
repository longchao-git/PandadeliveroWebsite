import {objToFormData} from '../utils/utils'
import config1 from '../config/index'
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false // （不推荐）忽略证书验证
});

// 初始化请求插件
export default ({redirect, $axios,$cookies}) => {
  // 请求拦截器
  $axios.interceptors.request.use(config => {
    console.log(config)
    config.httpsAgent = agent
    // 如果当前配置的客客请求
    config.baseURL = config1.BASE_URL

    /* 如果是上传，则设置超时为 1小时， 请求超时10分钟 */
    config.timeout = 1000 * 60
    config.data = objToFormData(config.data)

    config.headers['Access-Control-Allow-Origin'] =  '*';
    config.headers['System'] = 'wxapp';
    config.headers['token'] =  localStorage.getItem('token') || '';
    config.headers['content-type'] =  'application/x-www-form-urlencoded';
    return config
  }, error => {
    return Promise.reject(error)
  })

  // 返回结果拦截器
  $axios.interceptors.response.use(response => {

    if (response.status === 200) {
      // 判断登陆是否过期
      if(response.config.url == "/magic/verify"){
        return Promise.resolve(response);
        return
      }
      // 操作成功
      if (response.data.error=='0') {
        return Promise.resolve(response.data.data);
      } else {
        return Promise.reject(response.data);
      }
    } else {
      return Promise.reject(response.data);
    }
  }, error => {
    // 请求错误时，抛出异常提示
    return Promise.reject(error)
  })

  $axios.defaults.withCredentials = true



}
