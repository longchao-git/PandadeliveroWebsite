# dolphin-website 
```
 Git Commit Message:
    feat : 新功能
    fix : 修复bug
    update: 功能做了更新
    docs : 文档改变
    style : 代码格式改变
    refactor : 某个已有功能重构
    perf : 性能优化
    test : 增加测试
    build : 改变了build工具 如 grunt换成了 npm
    revert : 撤销上一次的 commit
    chore : 构建过程或辅助工具的变动
```
#### 注意事项

* 使用了 Git Hooks ，提交前会验证代码格式，代码格式不规范无法上传GIT 
    
#### 框架文档
    
* UI库： Vuetifyjs  [Click Me](https://vuetifyjs.com/zh-Hans/components)
* SSR:   Next.js   [Click Me](https://zh.nuxtjs.org/docs/2.x/directory-structure/components/)
* 单元测试:   Jest.js   [Click Me](https://doc.ebichu.cc/jest/docs/zh-Hans/getting-started.html)
* 动画库：在线动画代码 [Click Me](https://animista.net/play/entrances/slide-in/slide-in-top)     
    &emsp;  &emsp;  &emsp;  hover.css[悬浮展示]  [Click Me](https://ianlunn.github.io/Hover/)
    
---
    
#### 目录架构

* assets 编译资源文件 
    * styles 样式目录
        * common 公共样式
        * variables 样式变量
* components 组件文件
    * common  公共组件 
      * customer-collection.vue 用户采集组件
    * popupWindow  弹窗组件 
    * cloudSales  云销售组件 
* config 配置文件， 包含BASE URL ，及HTTP 错误码，及公共配置。
* layout 默认模板文件 
* mixins mixin 文件
    * collection-mixin.vue 用户信息采集mixin
    * full-screen-scroll-mixin.vue 整屏滚动mixin
* pages 所有页面
* plugins 插件
    * axios 请求拦截器封装
* static 静态文件
* store 公共状态文件 注： 避免出现服务端和客户端出现公共共享
* tests 单元测试
* utils 公共工具目录
    * utils.js 工具函数包含：深拷贝对象、复位对象属性、obj 转formData、 数据过滤器、节流防抖、数字效验
    * regular.js 正则效验包含：手机号正则、密码正则、用户名正则
    
---   
    
#### Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

#### 发布 
1. 本地执行 yarn build || npm run build 
2. 复制本地 docker-compose.yml Dockerfile static nuxt.config.js serverMiddleware .nuxt  config package.json 到服务器。 
3. 赋值完成后 执行 docker build -t dqsite1 . // 注意结尾有个小点
4. 执行完成后， docker-compose up -d  // 完成更新。
