/* ==========================================================================
 *  Cloudreve Android 客户端 · 官网配置中心
 * --------------------------------------------------------------------------
 *  维护官网时只需修改本文件，无需改动 HTML / CSS / JS，保存后刷新页面即可。
 *  通配规则：
 *    - 所有文案使用 { zh: "...", en: "..." } 格式，站点自动匹配语言。
 *    - 所有路径相对于 index.html 所在目录。
 *    - 下载 APK 放入 downloads/ 目录，并在下方 downloads 数组中登记。
 * ========================================================================== */

window.SITE_CONFIG = {
  /* ------------------------------------------------------------------
   * 站点基本信息
   * ------------------------------------------------------------------ */
  site: {
    title:  { zh: "Cloudreve Android 客户端", en: "Cloudreve Android Client" },
    pageTitle: { zh: "Cloudreve Android {version}", en: "Cloudreve Android {version}" },
    description: {
      zh: "Cloudreve 自托管云盘的原生 Android 客户端 1.10.1：多账号隔离、10 种存储策略上传、断点续传与 AES-256-CTR 加密、全格式预览与 Readium/Media3 播放、回收站/后台任务/远程下载/WebDAV、SSE 实时同步与小米超级岛沉浸。",
      en: "Native Android client 1.10.1 for self-hosted Cloudreve: isolated multi-account, 10 storage policies, resumable AES-256-CTR transfers, full-format preview with Readium/Media3, Trash/Tasks/Remote/WebDAV, SSE realtime sync and Xiaomi Super Island."
    },
    keywords: "Cloudreve, Android, 客户端, 网盘, 自托管, APK, 1.10.1, Client, self-hosted, cloud, WebDAV, SSE",
    github: "",
    releaseUrl: "",
    homepage: "https://cloudreve.org/",
    isThirdParty: true,
    copyright: { zh: "Cloudreve Android 客户端", en: "Cloudreve Android Client" },
    disclaimer: {
      zh: "本应用为第三方开发的 Cloudreve 客户端（包名 com.pan.cloudreve），与 Cloudreve 官方团队无隶属关系；服务器端仍需自行部署自托管 Cloudreve v4。",
      en: "This app is an independently developed Cloudreve client (package com.pan.cloudreve), not affiliated with the Cloudreve team; you still need to deploy your own self-hosted Cloudreve v4."
    }
  },

  /* ------------------------------------------------------------------
   * 版本信息（version 区块）
   * ------------------------------------------------------------------ */
  version: {
    current: "1.10.1",
    code: 11001,
    minSdk: 24,
    targetSdk: 37,
    minLabel: { zh: "Android 7.0 (API 24)", en: "Android 7.0 (API 24)" },
    targetLabel: { zh: "Android 17 (API 37)", en: "Android 17 (API 37)" },
    releaseDate: "2026-09-11",
    badge: { zh: "最新版本", en: "LATEST" },
    changelog: [
      {
        version: "1.10.1",
        date: "2026-09-11",
        items: {
          zh: [
            "全面优化弹窗设计，支持内联错误提示",
            "全面改进文件解压缩功能，功能更完善",
            "全面改进压缩包预览页面设计，更优雅"
          ],
          en: [
            "Fully optimized the pop-up design with support for inline error messages",
            "Fully improved the file decompression feature with more complete functionality",
            "Fully improved the archive preview page design for a more elegant look"
          ]
        }
      },
      {
        version: "1.10.0",
        date: "2026-09-04",
        items: {
          zh: [
            "全量能力补齐：回收站（批量恢复/永久删除/清空）与后台任务中心（relocate/import/archive/extract 轮询）",
            "远程下载中心：HTTP / 磁力链接离线下载、文件级勾选与多任务聚合通知",
            "WebDAV 独立账户管理：只读/代理/禁用系统文件三开关（Base64 Bitset）",
            "预览矩阵升级：EPUB/CBZ Readium 真分页、Zip/7z 全览、字体字形预览与 SVG 缩略混淆还原",
            "安全加固：Tink AES-256-GCM 硬件级保险库、SHA-256 账户隔离、JWT 60s 预刷新 + 并发保护",
            "实时与离线：SSE 长连事件驱动（指数退避重连）+ 本地 cached_files 缓存，弱网可浏览",
            "系统沉浸：小米超级岛大/小岛/AOD 多形态、Android 16 Promoted 分段进度、SAF 持久授权与 MediaSession 后台播放",
            "体验打磨：目录记忆视图/排序、分页游标预取、缩略 6 并发信号量、滑条 25 吸附触感与 Motion 弹簧"
          ],
          en: [
            "Full coverage: Trash (batch restore/permanent delete/clear) & Background Tasks center (relocate/import/archive polling)",
            "Remote download hub: HTTP / magnet offline tasks, per-file selection & aggregated notifications",
            "WebDAV account manager: read-only / proxy / disable-system-files bitset",
            "Preview matrix: EPUB/CBZ Readium pagination, Zip/7z full view, font glyph preview & SVG thumb de-obfuscation",
            "Security: Tink AES-256-GCM vault, SHA-256 account isolation, JWT 60s pre-refresh with concurrency guard",
            "Realtime & offline: SSE long-poll with exponential backoff + local cached_files cache",
            "System immersion: Xiaomi Super Island (big/small/AOD), Android 16 Promoted progress, SAF persisted grants & MediaSession",
            "Polish: per-dir view/sort memory, cursor pagination prefetch, 6 thumb semaphores, 25-snap slider haptics & spring motion"
          ]
        }
      },
      {
        version: "1.9.0",
        date: "2026-08-11",
        items: {
          zh: [
            "Android 17（API 37）首发适配，本地网络权限运行时请求",
            "Android 16+ Promoted 通知（分段进度条），低版本优雅回退",
            "小米超级岛深度集成：大岛 / 小岛 / 息屏 AOD 多形态进度",
            "新增文件详情面板（平板双栏），信息项长按复制",
            "Material 3 Expressive 全量动效与毛玻璃局部优化",
            "自适应布局升级：BottomBar / NavigationRail / Drawer 三档切换",
            "下载支持文件夹打包与多文件归档，SAF 持久化授权",
            "AudioVisualizer 频谱驱动全局 Mini 播放器动效"
          ],
          en: [
            "Android 17 (API 37) support with runtime local-network permission",
            "Android 16+ Promoted notifications with graceful fallback",
            "Xiaomi Super Island integration: big / small island & AOD progress",
            "New file detail panel (tablet dual-pane) with long-press copy",
            "Material 3 Expressive motion & optimized frosted-glass blur",
            "Adaptive layout: BottomBar / NavigationRail / Drawer auto switch",
            "Folder & multi-file archive downloads with SAF persisted grants",
            "Audio spectrum drives global Mini Player animations"
          ]
        }
      },
      {
        version: "1.8.0",
        date: "2026-05-20",
        items: {
          zh: [
            "重写上传引擎：10 种存储策略全覆盖",
            "分片并发上传与断点续传，任务持久化重启恢复",
            "AES-256-CTR 流式加密上传",
            "OneDrive 分片 fragmentOverlap 错误恢复",
            "下载目录 SAF tree URI 持久化授权"
          ],
          en: [
            "Rewrite upload engine: full support for 10 storage policies",
            "Concurrent chunked uploads with resume & persisted tasks",
            "AES-256-CTR streaming encryption upload",
            "OneDrive fragmentOverlap error recovery",
            "SAF tree URI persisted download directory grants"
          ]
        }
      }
    ]
  },

  /* ------------------------------------------------------------------
   * 下载入口
   * ------------------------------------------------------------------ */
  downloads: [
    {
      file: "https://github.com/XTAI9/cdapk-down/releases/download/Release/Cloudreve-1.10.1-release-arm64-v8a.apk",
      abi: "arm64-v8a",
      size: "30.7 MB",
      sha256: "",
      note: {
        zh: "适用于 2020 年后的绝大多数 Android 手机（骁龙 / 天玑 / 麒麟 / Exynos），单包 arm64-v8a",
        en: "For the vast majority of modern phones (Snapdragon / Dimensity / Kirin / Exynos) — arm64-v8a single APK"
      }
    }
  ],

  /* ------------------------------------------------------------------
   * 1.10 聚焦：首屏 What's New 胶囊（渲染于 Hero 顶部）
   * ------------------------------------------------------------------ */
  whatsNew: {
    badge: { zh: "1.10.1 新版", en: "NEW 1.10.1" },
    title: {
      zh: "回收站 · 后台任务 · 远程下载 · WebDAV 全量上线",
      en: "Trash · Tasks · Remote Download · WebDAV — all in"
    },
    desc: {
      zh: "SSE 实时同步、Tink 硬件级加密与小米超级岛沉浸同步上线",
      en: "SSE realtime, Tink hardware vault & Super Island immersion"
    },
    link: "#download"
  },

  /* ------------------------------------------------------------------
   * 顶部数字条
   * ------------------------------------------------------------------ */
  stats: [
    { value: "1.10.1",   label: { zh: "当前版本",           en: "Current version" } },
    { value: "10",       label: { zh: "种存储策略上传",      en: "Storage policies" } },
    { value: "11",       label: { zh: "类文件预览 + 播放",   en: "Preview & playback" } },
    { value: "37",       label: { zh: "目标 API / 自适应三档布局", en: "Target API / 3 adaptive layouts" } }
  ],

  /* ------------------------------------------------------------------
   * 功能特性（icon 见 assets/js/main.js 底部 ICONS 表，badge 可选）
   * ------------------------------------------------------------------ */
  features: [
    {
      icon: "user-switch",
      badge: { zh: "隔离", en: "Isolated" },
      title: { zh: "多账号无缝切换", en: "Multi-account switching" },
      desc: {
        zh: "密码 / OAuth / 2FA / Turnstile 全支持，Token 以 Tink AES-256-GCM 加密分账户存储，SHA-256 隔离，切换零成本重写 BaseUrl。",
        en: "Password / OAuth / 2FA / Turnstile, Tink AES-256-GCM per-account vault, SHA-256 isolation, zero-cost BaseUrl rewrite."
      }
    },
    {
      icon: "upload",
      title: { zh: "全覆盖上传引擎", en: "All-policy upload engine" },
      desc: {
        zh: "本地 / 远程从机 / OneDrive / S3 / COS / OBS / OSS / KS3 / 七牛 / 又拍云 10 种策略，每种专属分片与回调（含 OneDrive 327680 对齐）。",
        en: "Local & remote to OneDrive, S3, COS, OBS, OSS, KS3, Qiniu, Upyun — each with dedicated chunk & callback (OneDrive 327680 aligned)."
      }
    },
    {
      icon: "refresh",
      badge: { zh: "NEW", en: "NEW" },
      title: { zh: "断点续传 · 稳定传输", en: "Resumable, resilient" },
      desc: {
        zh: "分片并发 1–10 可调、Semaphore 限流，任务持久化至 Room v13，杀进程不丢；上传下载独立并发与速度聚合。",
        en: "Chunk concurrency 1–10 with Semaphore, persisted to Room v13 — survives kills; independent upload/download control."
      }
    },
    {
      icon: "lock",
      title: { zh: "AES-256-CTR 加密上传", en: "AES-256-CTR uploads" },
      desc: {
        zh: "流式实时加密，分片独立 IV（16 字节块偏移递增），大文件内存阈值 64MB–maxMem/2 智能提示，杜绝 OOM。",
        en: "Streaming encryption per chunk with block-offset IV, smart 64MB–maxMem/2 limit to prevent OOM."
      }
    },
    {
      icon: "download",
      title: { zh: "下载与 SAF 集成", en: "Downloads & SAF" },
      desc: {
        zh: "单文件 / 文件夹打包 / 多文件归档三种模式；Android 10+ 直写系统下载目录，treeUri 持久化授权，批量去重检测。",
        en: "Single file, folder zips & multi-file archives; direct to Downloads on Android 10+, persisted treeUri & dedup check."
      }
    },
    {
      icon: "play",
      badge: { zh: "沉浸", en: "Immersive" },
      title: { zh: "全栈媒体播放", en: "Full media playback" },
      desc: {
        zh: "Media3 + OkHttp 鉴权流，ExoPlayer 倍速/全屏三联动效，16 频段 Visualizer 驱动 Mini 播放器，后台 MediaSession 与锁屏控制。",
        en: "Media3 over authed OkHttp, speed/fullscreen, 16-band Visualizer Mini Player, background MediaSession & lock-screen controls."
      }
    },
    {
      icon: "eye",
      title: { zh: "全格式预览矩阵", en: "Full preview matrix" },
      desc: {
        zh: "图片（含 SVG 混淆还原）/ 音视频 / 文本·代码 / PDF / EPUB·CBZ（Readium 真分页）/ 字体字形 / Zip·7z 全览，缩略 6 并发信号量。",
        en: "Images (SVG de-obfuscation) / A/V / text·code / PDF / EPUB·CBZ (Readium) / font glyphs / Zip·7z, 6-concurrent thumbs."
      }
    },
    {
      icon: "share",
      title: { zh: "分享与 WebDAV", en: "Sharing & WebDAV" },
      desc: {
        zh: "分享链接（密码/过期/计数/二维码）与 WebDAV 账户独立管理，支持只读 / 代理 / 禁用系统文件三开关（webdavUrl=$serverUrl/dav/）。",
        en: "Share links (password/expiry/QR) & WebDAV accounts (read-only/proxy/disable-system-files, webdavUrl=$serverUrl/dav/)."
      }
    },
    {
      icon: "magnet",
      badge: { zh: "NEW", en: "NEW" },
      title: { zh: "远程离线下载", en: "Remote download" },
      desc: {
        zh: "HTTP / 磁力链接扔给服务器离线下载，文件级勾选、3s 轮询进度与多任务聚合通知，批量管理。",
        en: "Hand HTTP / magnet to server, per-file check, 3s polling & aggregated notifications, batch control."
      }
    },
    {
      icon: "pulse",
      badge: { zh: "实时", en: "Realtime" },
      title: { zh: "SSE 实时同步", en: "SSE realtime sync" },
      desc: {
        zh: "text/event-stream 长连订阅 ?uri=URLEncoded，指数退避重连；配合 cached_files 本地缓存，弱网可浏览、强网零延迟。",
        en: "SSE ?uri stream with exponential backoff + cached_files cache — browsable offline, instant online."
      }
    },
    {
      icon: "trash",
      badge: { zh: "NEW", en: "NEW" },
      title: { zh: "回收站与后台任务", en: "Trash & tasks" },
      desc: {
        zh: "回收站批量恢复/永久删除/清空（unlink 权限）；后台任务中心三标签轮询 5s，跟踪 relocate/import/archive/extract。",
        en: "Trash batch restore/purge/clear (unlink); Tasks center with 3 tabs polling 5s for relocate/import/archive."
      }
    },
    {
      icon: "phone",
      title: { zh: "深度平台适配", en: "Deep platform support" },
      desc: {
        zh: "首发 Android 17 本地网络权限、16+ Promoted 分段进度通知、小米超级岛 focus_protocol v3 多形态、动态取色。",
        en: "Android 17 local-network, 16+ Promoted progress, Xiaomi Super Island v3, dynamic color."
      }
    },
    {
      icon: "layout",
      title: { zh: "原生自适应布局", en: "Native adaptive layout" },
      desc: {
        zh: "Material 3 Adaptive：手机底栏 / 平板 Rail / 大屏常驻抽屉，内容 600/720dp 限宽居中，详情面板双栏常驻可开关。",
        en: "Material 3 Adaptive: bottom bar / rail / drawer, 600/720dp centered, detail panel persistent toggle."
      }
    },
    {
      icon: "shield",
      title: { zh: "安全可靠", en: "Secure by design" },
      desc: {
        zh: "Keystore 护航的双 DataStore（auth + secure_vault），JWT 60s 预刷新与同步锁，权限最小化、错误全量透出。",
        en: "Dual DataStore (auth + secure_vault) with Keystore, JWT 60s pre-refresh & lock, minimal permissions, full error transparency."
      }
    }
  ],

  /* ------------------------------------------------------------------
   * 安装步骤
   * ------------------------------------------------------------------ */
  installSteps: [
    {
      title: { zh: "下载 APK", en: "Download the APK" },
      desc:  { zh: "点击下方按钮下载 arm64-v8a 安装包（30.7 MB）。", en: "Tap below to grab the arm64-v8a APK (30.7 MB)." }
    },
    {
      title: { zh: "允许安装", en: "Allow installation" },
      desc:  { zh: "打开 APK 后按提示允许「安装未知来源应用」，目标 SDK 37 无需额外引导。", en: "When prompted, allow unknown sources; target SDK 37 needs no extra steps." }
    },
    {
      title: { zh: "连接服务器", en: "Connect your server" },
      desc:  { zh: "输入自托管 Cloudreve v4 地址（HTTP/HTTPS/本地内网，IDN 自动 punycode）。", en: "Enter your self-hosted Cloudreve v4 URL (HTTP/HTTPS/LAN, IDN punycode supported)." }
    },
    {
      title: { zh: "登录使用", en: "Sign in" },
      desc:  { zh: "密码 / 验证码 / OAuth PKCE / 2FA 全支持，登录后即享完整文件管理与预览。", en: "Password / captcha / OAuth PKCE / 2FA — then enjoy full file & preview." }
    }
  ],

  /* ------------------------------------------------------------------
   * 常见问题
   * ------------------------------------------------------------------ */
  faqs: [
    {
      q: { zh: "支持平板吗？不同屏幕尺寸体验如何？", en: "Does it support tablets and different screen sizes?" },
      a: {
        zh: "支持，且是原生实现的。基于官方 Material 3 自适应库，手机（Compact）使用底部导航、平板（Medium）切换为侧边 Rail、大屏（Expanded）自动变为常驻抽屉，内容限宽居中；平板设置页还会启用双栏布局与文件详情面板，无需重启、可在设置中即时开关。",
        en: "Yes — built-in. Powered by the official Material 3 adaptive library: bottom bar on phones (Compact), side rail on tablets (Medium), persistent drawer on large screens (Expanded), with content auto-centering; tablets also get dual-pane settings and a file detail panel, togglable instantly without restart."
      }
    },
    {
      q: { zh: "支持哪些 Android 版本？", en: "Which Android versions are supported?" },
      a: {
        zh: "最低 Android 7.0（API 24），目标与适配 SDK 为 37（Android 17）。覆盖从老设备到最新系统的绝大部分机型，单包 arm64-v8a。",
        en: "Minimum Android 7.0 (API 24), targeted SDK 37 (Android 17). Covers everything from legacy devices to the newest releases, single arm64-v8a APK."
      }
    },
    {
      q: { zh: "1.10.1 新增了什么？", en: "What’s new in 1.10.1?" },
      a: {
        zh: "全量补齐：回收站与后台任务中心、远程离线下载中心、WebDAV 独立管理；预览矩阵与安全（Tink 保险库）加固；SSE 实时同步与小米超级岛 / Promoted 通知沉浸；体验上目录记忆与分页预取等细节打磨，详见上方更新日志。",
        en: "Full coverage: Trash & Tasks, Remote Download hub, WebDAV manager; preview & security (Tink vault) hardened; SSE realtime & Super Island / Promoted immersion; per-dir memory & pagination polish — see changelog above."
      }
    },
    {
      q: { zh: "我的账号和密码安全吗？", en: "Are my account and password safe?" },
      a: {
        zh: "账号 Token 使用 Android Keystore 保护的 Tink AES-256-GCM 分账户加密存储（secure_vault）；JWT 临近过期 60s 自动刷新并有 synchronized 并发保护；密码只用于登录请求，不落盘明文。",
        en: "Tokens are stored per-account with Tink AES-256-GCM backed by Android Keystore (secure_vault); JWTs auto-refresh 60s before expiry with synchronized guards; passwords are never persisted in plaintext."
      }
    },
    {
      q: { zh: "服务器必须使用 HTTPS 吗？", en: "Does my server need HTTPS?" },
      a: {
        zh: "不需要。考虑到自托管场景，客户端允许明文 HTTP（适合内网 / 局域网），HTTPS 证书验证照常严格进行；服务端需 ≥4.12.0。",
        en: "No. HTTP is allowed for self-hosted / LAN scenarios; HTTPS certificate verification remains strict; server ≥4.12.0 required."
      }
    },
    {
      q: { zh: "支持多账号吗？", en: "Does it support multiple accounts?" },
      a: {
        zh: "支持。可同时保存多个自托管及公共服务器的账号，SHA-256 隔离，点击即可切换，每个账号的 Token 相互隔离；切换时自动清理旧账户缓存。",
        en: "Yes. Multiple self-hosted or community servers can be stored and switched with one tap; SHA-256 isolated; cache cleared on switch."
      }
    },
    {
      q: { zh: "支持哪些上传存储策略？", en: "Which upload storage policies are supported?" },
      a: {
        zh: "10 种：本地、远程从机、OneDrive、S3、COS、OBS、OSS、KS3、七牛、又拍云，均支持对应的分片与回调逻辑（含 OneDrive 327680 对齐与中继）。",
        en: "Ten: local, remote slave, OneDrive, S3, COS, OBS, OSS, KS3, Qiniu and Upyun — each with native chunking & relay (OneDrive 327680 aligned)."
      }
    },
    {
      q: { zh: "下载 / 上传中断了怎么办？", en: "What if a transfer is interrupted?" },
      a: {
        zh: "任务持久化至 Room v13（persisted_upload / download_tasks），下次启动自动恢复（运行中安全降级为暂停），下载支持 HTTP Range 断点续传。",
        en: "Tasks persist to Room v13 (persisted_upload / download_tasks) and auto-resume on next launch (running safely downgrades to paused); downloads use HTTP Range resume."
      }
    },
    {
      q: { zh: "如何更新到新版本？", en: "How do I update?" },
      a: {
        zh: "直接下载新版本 APK 覆盖安装即可，账号、设置、未完成任务全部保留，无需重新配置。",
        en: "Install the new APK over the old one — accounts, settings and pending tasks are all kept."
      }
    },
    {
      q: { zh: "需要 Root 权限吗？", en: "Does it need root?" },
      a: {
        zh: "不需要。仅申请最小权限：网络、通知、媒体播放前台服务（dataSync / mediaPlayback），以及可选的可视化频谱权限。",
        en: "No. Only minimal permissions: network, notifications, media foreground service (dataSync / mediaPlayback), plus optional visualizer."
      }
    }
  ],

  /* ------------------------------------------------------------------
   * 截图（可选）。将图片放入 screenshots/ 目录并登记路径；
   * 轮播为自动渐显切换。留空数组则隐藏整个区块。
   * ------------------------------------------------------------------ */
  screenshots: [
  ],

  /* ------------------------------------------------------------------
   * 界面静态文案
   * ------------------------------------------------------------------ */
  i18n: {
    zh: {
      "nav.features": "功能",
      "nav.download": "下载",
      "nav.faq": "常见问题",

      "hero.keyword": "1.10.1 · 全量能力补齐",
      "hero.title1": "原生 Cloudreve",
      "hero.title2": "Android 客户端",
      "hero.tagline": "回收站与后台任务、远程离线下载、WebDAV 独立管理已上线——多账号隔离、10 种存储策略、SSE 实时同步与小米超级岛沉浸，一站式接管你的 Cloudreve v4。",
      "hero.dl": "立即下载",
      "hero.more": "查看新特性",

      "whatsNew.badge": "NEW",
      "whatsNew.more": "查看详情 →",

      "features.kicker": "功能特性",
      "features.title": "为 Cloudreve 打造完整能力",
      "features.sub": "1.10.1 全量补齐：从传输与预览到回收站与远程下载，每一环原生打磨。",

      "download.kicker": "下载安装",
      "download.title": "获取最新版本",
      "download.sub": "支持 Android 7.0 及以上设备，覆盖安装无损升级，账号与任务全部保留。",
      "download.label": "最新版本",
      "download.file": "安装包",
      "download.arch": "架构",
      "download.size": "大小",
      "download.date": "发布日期",
      "download.min": "最低系统",
      "download.target": "目标系统",
      "download.get": "下载 APK",
      "download.releases": "查看发布页",
      "download.shaHint": "点击复制 SHA-256 校验值",
      "download.shaCopied": "已复制",
      "download.stepsTitle": "三步完成安装",
      "download.changelog": "更新日志",
      "download.changelogEmpty": "暂无更新记录",
      "download.btn": "下载",

      "shots.kicker": "界面预览",
      "shots.title": "一见倾心",
      "shots.sub": "Material 3 Expressive 设计语言，毛玻璃质感与动态取色。",
      "shots.empty": "截图即将上线，敬请期待。",

      "faq.kicker": "常见问题",
      "faq.title": "你想了解的，这里都有",

      "footer.feedback": "问题反馈",
      "footer.homepage": "Cloudreve 官网",
      "footer.github": "开源仓库",
      "footer.copyright": "保留所有权利。",
      "a11y.light": "切换浅色模式",
      "a11y.dark": "切换深色模式"
    },
    en: {
      "nav.features": "Features",
      "nav.download": "Download",
      "nav.faq": "FAQ",

      "hero.keyword": "1.10.1 · Full coverage",
      "hero.title1": "Native Cloudreve",
      "hero.title2": "Android Client",
      "hero.tagline": "Trash & Tasks, Remote Download and WebDAV are here — isolated multi-account, 10 policies, SSE realtime & Super Island in one client for Cloudreve v4.",
      "hero.dl": "Download now",
      "hero.more": "See what’s new",

      "whatsNew.badge": "NEW",
      "whatsNew.more": "Details →",

      "features.kicker": "FEATURES",
      "features.title": "Everything your Cloudreve needs",
      "features.sub": "1.10.1 full coverage — from transfer & preview to trash & remote download, all native.",

      "download.kicker": "DOWNLOAD",
      "download.title": "Get the latest build",
      "download.sub": "Requires Android 7.0+. Install over an old version keeps accounts and tasks intact.",
      "download.label": "Latest",
      "download.file": "Package",
      "download.arch": "Architecture",
      "download.size": "Size",
      "download.date": "Released",
      "download.min": "Minimum",
      "download.target": "Target",
      "download.get": "Download APK",
      "download.releases": "View releases",
      "download.shaHint": "Click to copy SHA-256 checksum",
      "download.shaCopied": "Copied",
      "download.stepsTitle": "Get started in 3 steps",
      "download.changelog": "Changelog",
      "download.changelogEmpty": "No changelog yet",
      "download.btn": "Download",

      "shots.kicker": "GALLERY",
      "shots.title": "Love at first sight",
      "shots.sub": "Material 3 Expressive, frosted glass and dynamic color.",
      "shots.empty": "Screenshots coming soon.",

      "faq.kicker": "FAQ",
      "faq.title": "Everything you need to know",

      "footer.feedback": "Feedback",
      "footer.homepage": "Cloudreve Website",
      "footer.github": "Source code",
      "footer.copyright": "All rights reserved.",
      "a11y.light": "Switch to light mode",
      "a11y.dark": "Switch to dark mode"
    }
  }
};
