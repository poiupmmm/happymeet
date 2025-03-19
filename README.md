# HappyMeet - 社交活动平台

HappyMeet是一个基于Next.js开发的现代化社交活动平台，让用户能够创建、发现和参与各种兴趣小组活动。

## 技术栈

- 前端：Next.js 14 + TypeScript + Tailwind CSS
- 后端：Next.js API Routes
- 数据库：PostgreSQL + Prisma ORM
- 认证：NextAuth.js
- 实时通信：Socket.io
- 地图集成：Leaflet

## 项目结构

```
happymeet/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # 认证相关页面
│   ├── (dashboard)/       # 用户仪表板
│   ├── groups/            # 小组相关页面
│   ├── events/            # 活动相关页面
│   └── api/               # API路由
├── components/            # React组件
│   ├── ui/               # UI基础组件
│   ├── groups/           # 小组相关组件
│   ├── events/           # 活动相关组件
│   └── layout/           # 布局组件
├── lib/                   # 工具函数和配置
├── prisma/               # 数据库模型和迁移
└── public/               # 静态资源
```

## 核心功能

1. 用户系统
   - 注册/登录
   - 个人资料管理
   - 兴趣标签

2. 小组功能
   - 创建和管理兴趣小组
   - 小组搜索和加入
   - 成员管理

3. 活动管理
   - 活动创建和编辑
   - 活动详情页
   - 报名系统

4. 通知系统
   - 活动提醒
   - 新成员通知
   - 小组动态

5. 互动功能
   - 活动评论
   - 私信系统
   - 小组聊天室

6. 发现页面
   - 地理位置推荐
   - 兴趣匹配
   - 热门活动排行

7. 会员系统
   - 会员特权
   - 订阅管理

## 开发指南

1. 安装依赖
```bash
npm install
```

2. 设置环境变量
```bash
cp .env.example .env.local
```

3. 初始化数据库
```bash
npx prisma generate
npx prisma db push
```

4. 启动开发服务器
```bash
npm run dev
```

## 环境变量

创建 `.env.local` 文件并设置以下变量：

```
DATABASE_URL="postgresql://user:password@localhost:5432/happymeet"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 