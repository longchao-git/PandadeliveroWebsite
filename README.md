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

---

> **骑手申请 & 聊天系统后端接口文档**：请参考 `骑手申请聊天系统_后端接口文档.md`

---

## 骑手申请 & 聊天系统 — 功能说明

### 业务流程总览

```
用户入口
  │
  ├─ /collab                      （合作入口页，三按钮引导）
  │    ├─ 「申请成为骑手」→ /rider     （个人骑手申请）
  │    ├─ 「配送小队合作」→ /team      （团队申请）
  │    └─ 「个人骑手」→ /rider
  │
  ├─ /rider                       （个人骑手申请表单页）
  │    └─ 提交成功 → /success         （展示申请编号 + 打开聊天入口）
  │              └─ 打开聊天 → /chat  （骑手与运营人员实时聊天）
  │
  ├─ /team                        （配送小队申请表单页）
  │    └─ 提交成功 → 停留本页 + 提示    （无聊天流程）
  │
  └─ /admin                       （运营人员后台 — 需登录）
       └─ 点击「聊天」→ /admin-chat   （运营人员与骑手聊天，需 token）
```

### 页面说明

| 页面 | 路由 | 访问条件 | 说明 |
|---|---|---|---|
| 合作入口 | `/collab` | 公开 | 三个入口按钮，引导用户选择申请类型 |
| 骑手申请 | `/rider` | 公开 | 个人骑手申请表，提交后自动创建聊天会话 |
| 申请成功 | `/success` | 需 sessionStorage 数据 | 展示申请编号，提供打开聊天入口 |
| 骑手聊天 | `/chat` | 需申请编号（URL参数或 sessionStorage） | 骑手发送消息，运营人员回复，西语界面 |
| 小队申请 | `/team` | 公开 | 配送小队申请表，进入线索池，无聊天流程 |
| 运营后台 | `/admin` | 需 staff_id 登录 | 申请列表、筛选、导出、状态管理 |
| 运营聊天 | `/admin-chat` | 需 token + application_id | 运营人员与骑手聊天，中文输入 + AI 翻译发送 |

### 运营人员后台（/admin）

1. 查看所有申请（个人 + 团队）的筛选、搜索、分页
2. 点击「联系」生成 token 并打开 `/admin-chat` 新标签页
3. 在 `/admin-chat` 中：
   - 查看骑手申请资料（姓名、城市、车辆、自雇状态等）
   - 输入中文 → 点击「生成西语」预览 → 确认发送
   - 更新申请状态（new / contacted / approved / rejected）
4. 导出 Excel（所有申请数据）

### API 响应约定

所有后端接口响应统一包装为 `{ error, data }` 格式：

```json
// 成功
{ "error": "0", "data": { ... } }

// 失败
{ "error": "1", "message": "错误信息" }
```

前端 axios 拦截器行为请参考 `骑手申请聊天系统_后端接口文档.md` 中的"响应字段路径约定"章节。

### 环境变量（需后端配置）

| 变量名 | 说明 | 示例 |
|---|---|---|
| `OPENAI_API_KEY` | GPT API Key（用于翻译服务） | `sk-xxx` |
| `CHAT_SECRET_KEY` | Chat 模块签名密钥 | `your-server-secret-key` |
| `API_BASE_URL` | 后端服务地址 | `https://demo.pandadelivero.com` |

