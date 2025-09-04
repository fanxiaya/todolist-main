# TodoList API

一个基于 Node.js 和 Express 的简单待办事项 API，支持用户注册、登录和待办事项管理。

## 功能特性

- 🔐 用户注册和登录
- 🛡️ JWT 身份验证
- ✅ 待办事项 CRUD 操作
- 📝 输入验证
- 🗄️ MongoDB 数据存储
- 📊 结构化日志记录

## 技术栈

- **运行时**: Node.js (>=18.0.0)
- **框架**: Express.js
- **数据库**: MongoDB (使用 Mongoose ODM)
- **身份验证**: JWT (JSON Web Tokens)
- **验证**: express-validator
- **日志**: Pino
- **环境配置**: dotenv

## 项目结构

```
todolist/
├── src/
│   ├── app.mjs          # Express 应用程序配置
│   └── server.mjs       # 服务器启动文件
├── controller/
│   └── userController.mjs   # 用户控制器
├── middleware/
│   └── userMiddleware.mjs   # 认证和验证中间件
├── model/
│   └── userModel.mjs        # 用户数据模型
├── routes/
│   ├── route.mjs           # 主路由
│   ├── userRouter.mjs      # 用户路由
│   └── todoRouter.mjs      # 待办事项路由
├── schema/
│   ├── loginSchema.mjs     # 登录验证模式
│   └── registerSchema.mjs # 注册验证模式
├── service/
│   └── userService.mjs     # 用户服务层
├── utils/
│   ├── jwtUtils.mjs        # JWT 工具函数
│   └── collectionUtils.mjs # 数据库查询工具
├── logger/
│   └── logger.mjs          # 日志配置
└── log/                    # 日志文件目录
```

## 快速开始

### 前提条件

- Node.js >= 18.0.0
- MongoDB (本地或云端)
- npm 或 yarn

### 安装

1. 克隆项目

```bash
git clone https://github.com/fanxiaya/todolist.git
cd todolist
```

2. 安装依赖

```bash
npm install
```

3. 环境配置

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下环境变量：

```env
MONGO_URI=mongodb://localhost:27017/todolist
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. 启动服务

```bash
# 开发模式（带热重载）
npm run dev

# 生产模式
npm start
```

## API 文档

### 基础 URL

```
http://localhost:3000/api
```

### 用户认证

#### 注册新用户

```http
POST /register
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "123456",
  "age": 25
}
```

#### 用户登录

```http
POST /login
Content-Type: application/json

{
  "email": "zhangsan@example.com",
  "password": "123456"
}
携带token登录会被识别
```

**响应:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 获取用户信息

```http
GET /me
Authorization: Bearer <token>
```

### 待办事项管理

> 注意：所有待办事项 API 都需要在请求头中包含有效的 JWT token。

#### 获取所有待办事项

```http
GET /todos
Authorization: Bearer <token>
```

**响应:**

```json
[
  {
    "id": 1,
    "title": "学习 Node.js",
    "description": "完成 Express 和 MongoDB 教程",
    "completed": false,
    "userEmail": "zhangsan@example.com",
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
]
```

#### 创建新待办事项

```http
POST /todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "学习 Node.js",
  "description": "完成 Express 和 MongoDB 教程"
}
```

#### 更新待办事项

```http
PUT /todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "学习 Node.js (已更新)",
  "description": "完成 Express, MongoDB 和 JWT 教程"
}
```

#### 切换完成状态

```http
PATCH /todos/:id/toggle
Authorization: Bearer <token>
```

#### 删除待办事项

```http
DELETE /todos/:id
Authorization: Bearer <token>
```

## 数据模型

### 用户模型

```javascript
{
  name: String,      // 用户名 (必需, 最少3个字符)
  email: String,     // 邮箱 (必需, 唯一, 邮箱格式)
  password: String,  // 密码 (必需, 最少3个字符)
  age: Number       // 年龄 (必需, 1-100之间)
}
```

### 待办事项模型

```javascript
{
  id: Number,           // 唯一标识符
  title: String,        // 标题 (必需, 1-200字符)
  description: String,  // 描述 (可选, 最多500字符)
  completed: Boolean,   // 完成状态
  userEmail: String,    // 所属用户邮箱
  createdAt: Date,      // 创建时间
  updatedAt: Date       // 更新时间
}
```

## 错误处理

API 使用标准的 HTTP 状态码：

- `200` - 成功
- `201` - 创建成功
- `400` - 请求错误
- `401` - 未授权
- `404` - 资源未找到
- `500` - 服务器内部错误

错误响应格式：

```json
{
  "message": "错误描述",
  "errors": ["详细错误信息"] // 可选，验证错误时包含
}
```

## 日志

应用使用 Pino 进行结构化日志记录：

- 错误日志保存在 `./log/logfile.log`
- 控制台输出彩色格式化日志

## 开发说明

### 启动开发环境

```bash
npm run dev
```

### 项目特点

- 使用 ES6 模块语法 (`.mjs` 文件)
- 遵循 MVC 架构模式
- 输入验证和清理
- JWT 无状态身份验证
- 结构化错误处理
- 详细的请求日志

## 联系方式

- 作者: fanxiaya
- 项目链接: https://github.com/fanxiaya/todolist

## 更新日志

### v1.0.0 (2023-09-01)

- 初始版本发布
- 用户注册和登录功能
- 待办事项 CRUD 操作
- JWT 身份验证
- 基础 API 文档
