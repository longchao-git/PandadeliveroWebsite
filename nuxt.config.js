import config from './config/index';

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,
  loading: false,

  server: {
    host: '0.0.0.0',
    port: 3003
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'KUAIZI',
    title: 'KUAIZI',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      {
        httpEquiv: 'Content-Type',
        content: 'text/html; charset=utf-8'
      },
      {
        name: 'renderer',
        content: 'webkit'
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css'
      },
      /* -------------DNS start -------------- */
      {
        rel: 'dns-prefetch',
        href: '//keke.aikkcard.com'
      },
      {
        rel: 'dns-prefetch',
        href: '//api.aikkcard.cn'
      },
      {
        rel: 'dns-prefetch',
        href: '//img.aikkcard.cn'
      },
      /* -------------End-------------- */
      {
        rel: 'preload',
        href: '//cdn.jsdelivr.net/npm/font-awesome@4.x/fonts/fontawesome-webfont.woff2?v=4.7.0'
      }
    ],
    script: [
      { src: 'https://js.stripe.com/v3/', ssr: false },
      { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDWG-HwH8F2CLS5aqYS12Me0qyxi9vkuig&libraries=places&v=weekly', ssr: false }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/styles/common',
    '~/assets/styles/fonts.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src:  '~/plugins/stripe.js', ssr: false },
    { src: '~/plugins/qrcode.js', ssr: false },
    { src: '~/plugins/html2canvas.js', ssr: false },
    { src: '~/plugins/LocalStorage.js' },
    { src: '~/plugins/element-ui.js' },
    { src: '~/plugins/websocket.js' },
    { src: '~/plugins/i18n.js' },
    { src: '~/plugins/axios' },
    {
      src: '~/plugins/vue-seamless-scroll',
      mode: 'client'
    },
    {
      src: '~/plugins/vue-awesom-swiper',
      mode: 'client'
    },
    {
      src: '~/plugins/show-transition'
    },
    {
      src: '~/plugins/data-view',
      mode: 'client'
    },
    {
      src: '~/plugins/vue-sticky',
      mode: 'client'
    },
    {
      src: '~/plugins/vue-toast',
      mode: 'client'
    },
    {
      src: '~/plugins/num-scroll',
      mode: 'client'
    },
    {
      src: '~/plugins/vue-cookies',
      mode: 'client'
    }
  ],

  serverMiddleware: ['~/serverMiddleware/page-cache.js'],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios', // 可选配置项可以根据需求调整

    ['vue-scrollto/nuxt', {
      duration: 0,
      cancelable: false,
      easing: 'linear'
    }]
  ],

  axios: {
    withCredentials: true,
    credentials: true,
    proxy:true,
  },
  proxy: {
    // 配置/api代理到http://localhost:3002
    '/api/': { // 匹配代理的URL前缀
      target: 'https://www.cuai-zi.net', // 目标服务器地址
      changeOrigin: true, // 是否改变源地址
      pathRewrite: {
        '^/api/': '' // 重写路径
      }
    }
  },

  render: {
    resourceHints: false
  },
  performance: {
    prefetch: false
  },
  router: {
    prefetchPayloads: false,
    prefetchLinks: false
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/styles/variables'],
    silent: true,
    defaultAssets: false,
    treeShake: true
  },
  generate: {
    routes: ['/', '/about', '/fr', '/fr/about']
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: false,
    vendor: ['vue-i18n'],
    cache: true, // 开发环境，关闭缓存，不然会影响
    transpile: [/^swiper/, /^vuetify/, /^data-view/],
    cssSourceMap: false,
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        minSize: 10000,
        maxSize: 1024000,
        // 配置单独打包
        cacheGroups: {
          vuetify: {
            test: /node_modules[\\/]vuetify/,
            chunks: 'all',
            name: true
          },
          'data-view': {
            test: /node_modules[\\/]data-view/,
            chunks: 'all',
            name: true
          },
          swiper: {
            test: /node_modules[\\/]swiper/,
            chunks: 'all',
            name: true
          }
        }
      }
    },
    // 配置打包分离
    splitChunks: {
      pages: true,
      vendor: false,
      commons: true,
      runtime: false,
      layouts: false
    },
    // 配置CSS 打包分离
    extractCSS: false
    // publicPath: 'https://img.aikkcard.com/dqsite/'
  }
};
