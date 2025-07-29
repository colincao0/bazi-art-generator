# 基于生辰信息生成专属画作的AI应用

这是一个结合传统文化与现代AI技术的创新应用，用户输入出生日期和时间，系统会分析生辰信息并生成个性化的艺术画作。

## 功能特点

- 🎨 基于生辰信息的个性化艺术画作生成
- 🔮 传统文化分析与现代AI算法结合
- 🎯 多种艺术风格支持
- ⚡ 秒级生成，无需等待
- 📱 响应式设计，支持多设备
- 🎭 精美的用户界面和交互体验

## 技术栈

- **前端框架**: Next.js 13 + React 18
- **UI组件**: Radix UI + Tailwind CSS
- **AI服务**: DeepSeek API + 火山引擎即梦AI
- **传统文化**: lunar-javascript (农历和八字计算)
- **部署**: Vercel

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/colincao0/bazi-art-generator.git
cd bazi-art-generator
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env.local` 文件并添加必要的API密钥

4. 启动开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 `http://localhost:3000`

## 项目结构

```
├── app/                    # Next.js 13 App Router
│   ├── api/               # API路由
│   │   ├── bazi/          # 生辰分析API
│   │   └── generate-image/ # 图像生成API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── ui/               # UI基础组件
│   └── result-page.tsx   # 结果页面组件
├── lib/                  # 工具函数
└── hooks/                # 自定义Hooks
```

## 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 许可证

MIT License