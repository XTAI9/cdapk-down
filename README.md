# Cloudreve Android 客户端 · 官网

Liquid Glass（iOS 26 风格）设计语言的静态官网，零依赖、零构建、零后端。当前版本 **1.10.1 (11001)** 全量能力已上线。

![tech](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-6366f1) ![deps](https://img.shields.io/badge/dependencies-0-22d3ee)

---

## 目录结构

```
cloudreve-down_web/
├── index.html            # 页面骨架（一般无需修改）
├── config.js             # ★ 站点配置中心：所有文案/版本/下载/功能/FAQ 都在这里
├── assets/
│   ├── css/main.css      # Liquid Glass 设计系统
│   ├── js/main.js        # 渲染引擎（从 config.js 读取并渲染）
│   └── img/icon.svg      # 站点图标
├── downloads/            # ★ 放置 APK 安装包（需在 config.js 中登记）
└── screenshots/          # ★ 放置截图（需在 config.js 中登记）
```

## 本地预览

直接双击 `index.html` 即可在浏览器打开（纯静态，无网络请求，`file://` 协议完全可用）。

或启动本地服务：

```powershell
# 方式一（任选其一）
python -m http.server 8080

# 方式二
npx serve .

# 方式三
php -S 127.0.0.1:8080
```

然后访问 `http://localhost:8080`。

## 部署

整个目录拷贝到任意静态托管即可，无需构建：

| 平台 | 说明 |
|---|---|
| **GitHub Pages** | 把整个目录推到仓库 → Settings → Pages → 选择分支/目录，完成 |
| **Cloudflare Pages** | 创建项目 → 上传整个目录（构建命令留空） |
| **Nginx** | 见下方示例 |
| **任意对象存储 / 虚拟主机** | 上传根目录所有文件 |

所有资源均使用相对路径，**子目录部署同样可行**（如 `https://xxx.com/cloudreve/`）。

### Nginx 示例

```nginx
server {
    listen 443 ssl;
    server_name client.example.com;

    root /var/www/cloudreve-down_web;
    index index.html;

    # 静态站点安全加固
    add_header Content-Security-Policy "default-src 'none'; base-uri 'none'; connect-src 'none'; font-src 'self'; form-action 'none'; object-src 'none'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header Referrer-Policy no-referrer;

    location / { try_files $uri $uri/ /index.html; }

    # APK 强制下载，不缓存校验信息
    location ~* \.apk$ {
        add_header Content-Disposition "attachment";
        expires 7d;
    }
}
```

> 页面内已内置同等 CSP meta 标签，即使忘记配置响应头也有基础防线。

## 日常维护（只改 config.js）

**当前版本**：`1.10.1 (11001)` · `2026-09-12` · `targetSdk 37 / minSdk 24 / arm64-v8a`  
**1.10.1 聚焦**：文件解压缩功能与压缩包预览功能体验改进

**发布新版本**：只需改 `config.js` 中的 `version.current / code / releaseDate`，并把新 APK 放入 `downloads/` 后更新文件名；在 `changelog` 数组顶部追加新条目；`features` 中可用 `badge` 标记 NEW。

**新增架构包**（如 x86_64）：在 `downloads` 数组追加一条记录，页面自动生成对应下载按钮。

**更新文案 / 功能卡片 / FAQ / 安装步骤**：直接编辑对应数组或 `i18n` 中的文案。

**添加截图**：放入 `screenshots/` 并在 `screenshots` 数组登记路径。

**其他配置项**：`site.github`（源码链接）、`site.releaseUrl`（发布页链接）、`site.isThirdParty`（第三方声明）等，全部在文件顶部有注释说明。

## 安全特性

- 零外部请求：CSP `connect-src 'none'`，页面不发起任何网络调用，与第三方库供应链风险完全隔离
- 无表单、无鉴权、无后端，静态文件即全部攻击面
- `Referrer-Policy: no-referrer`，不外泄来源路径
- 所有外链 `rel="noopener noreferrer"`
- 支持 `prefers-reduced-motion`，减弱动效无障碍访问

## 语言与主题

- 右上角按钮切换 **简体中文 / English**（记忆在 localStorage）
- 右上角按钮切换 **浅色 / 深色**，默认跟随系统
- 全部文案双语文档化存放在 `config.js`，新增文案时以 `{ zh: "...", en: "..." }` 格式声明即可
