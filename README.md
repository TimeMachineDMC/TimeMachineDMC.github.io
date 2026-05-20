# Danil's Ink 个人主页维护指南

这是 `TimeMachineDMC/timemachinedmc.github.io` 的 GitHub Pages 个人主页仓库。网站使用 Astro 构建，日常维护目标是：尽量只改内容文件，不写 HTML。

## 快速开始

进入仓库：

```bash
cd /Users/metthewshih/Code/timemachinedmc.github.io
```

本地预览：

```bash
npm run dev -- --host 127.0.0.1
```

打开：

```text
http://127.0.0.1:4321/
```

构建检查：

```bash
npm run build
```

## 日常修改入口

整站内容主要放在：

```text
content-site/
```

一般不要为了改文字、链接、项目、生活分区去改 `src/pages/*.astro`。

常用文件：

- `content-site/site.json`：网站标题、作者、头像、导航栏、页脚、社交链接。
- `content-site/home.json`：主页 About、Education、Music、精选 Projects、Skills。
- `content-site/about.json`：About 页面内容。
- `content-site/projects.json`：Projects 页面项目分组和项目卡片。
- `content-site/life.json`：Life 页面，设备、音乐、时尚、文学、电影、游戏、品牌、画廊等。
- `content-site/links.json`：Links 页面，只放自己的公开链接。

## 修改后发布

改完 `content-site/` 或 Blog 后，运行：

```bash
npm run publish -- "Update site content"
```

这个命令会自动完成：

1. 导入 `content-inbox/blog/` 里的新 Blog Markdown。
2. 校验 `content-site/*.json`。
3. 构建网站。
4. 创建 Git commit。
5. 推送到 GitHub。

只想先检查内容格式：

```bash
npm run content:check
```

## JSON 修改规则

`content-site/*.json` 必须是合法 JSON：

- 字符串用双引号。
- 不能写注释。
- 数组或对象最后一项后面不能多逗号。
- 图片路径要指向真实文件。

添加 Life 卡片示例：

```json
{
  "heading": "香水",
  "subheading": "记录气味、场景和记忆。",
  "date": "Template · Scent notes"
}
```

最稳的做法：复制已有的一整块，改文字、链接、图片名，然后运行：

```bash
npm run content:check
```

## 新增 Blog

创建新文章草稿：

```bash
npm run new:blog -- "文章标题"
```

然后编辑生成的 Markdown 文件：

```text
content-inbox/blog/
```

写完后发布：

```bash
npm run publish -- "Add new blog post"
```

也可以直接在 `src/content/blog/` 写正式 Blog。未完成的文章保持：

```yaml
draft: true
```

准备发布时改成：

```yaml
draft: false
```

## 页面路径

当前主要页面：

- `/`
- `/blog/`
- `/projects/`
- `/life/`
- `/links/`
- `/about/`

项目使用 trailing slash，所以本地和线上访问子页面时建议带 `/`，例如 `/life/`，不要写成 `/life`。

## 什么时候需要改代码

只改内容：改 `content-site/` 或 Markdown。

需要改代码的情况：

- 新增一种完全不同的页面布局。
- 新增新的数据渲染方式。
- 改组件样式或交互。
- 增加自动化脚本能力。

代码主要在：

```text
src/
scripts/
```

不确定时，先改内容文件并运行 `npm run content:check`。如果检查通过但页面效果不是想要的，再考虑改代码。

## 常用命令

```bash
# 本地开发
npm run dev -- --host 127.0.0.1

# 校验内容 JSON
npm run content:check

# 构建网站
npm run build

# 新建 Blog 草稿
npm run new:blog -- "文章标题"

# 发布并推送
npm run publish -- "Update site content"
```
