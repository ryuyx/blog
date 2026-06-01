---
title: "Linux 包管理器入门：apt 和 dnf/yum"
pubDatetime: 2026-06-01
description: "Debian/Ubuntu 用 apt，RHEL/CentOS/Fedora 用 dnf。搞清这两个，大部分 Linux 服务器你都会装了。"
tags: ["Linux", "apt", "dnf", "tutorial"]
lang: "zh"
---

你拿到一台新 Linux 服务器，想装个 Nginx。第一反应是什么？

大部分人输入 `apt install nginx`。但如果你面对的是 CentOS 或 RHEL，这条命令会报错——因为它用的是 dnf（或者老一点的 yum）。

为什么 Linux 世界不能统一用一个包管理器？

先回答问题：**历史原因**。两大发行版家族各自发展了一套体系，一直延续到今天。

## 一张图看懂两大阵营

```
┌─────────────────────────────────────────────────────┐
│                    Linux 包管理器                      │
├──────────────────────────┬──────────────────────────┤
│     Debian 系            │     Red Hat 系            │
│                          │                          │
│  Debian                  │  RHEL                     │
│  ├─ Ubuntu               │  ├─ CentOS                │
│  │  ├─ Linux Mint        │  ├─ Fedora                │
│  │  └─ Deepin            │  └─ Amazon Linux          │
│  │                       │                          │
│  └── 包工具: apt         │  └── 包工具: dnf / yum    │
│      包格式: .deb        │      包格式: .rpm         │
└──────────────────────────┴──────────────────────────┘
```

两个阵营互不兼容。你在 Debian 上不能装 `.rpm` 文件，在 RHEL 上也不能装 `.deb`。这就像 iPhone 的充电接口和 Android 的——功能一样，但插头不同。

## apt：Debian/Ubuntu 系

apt 的全称是 Advanced Package Tool。它是 Debian 系（包括 Ubuntu、Linux Mint、Deepin 等）的包管理器。

### 常用命令一览

| 操作 | 命令 | 说明 |
|------|------|------|
| 更新源 | `apt update` | 刷新软件包列表 |
| 安装 | `apt install 包名` | 装包，自动处理依赖 |
| 卸载 | `apt remove 包名` | 删包，保留配置文件 |
| 彻底卸载 | `apt purge 包名` | 连配置文件一起删 |
| 搜索 | `apt search 关键词` | 在源里搜包 |
| 查看信息 | `apt show 包名` | 看包的详细信息 |
| 升级所有 | `apt upgrade` | 升级所有可更新的包 |
| 修复依赖 | `apt --fix-broken install` | 解决依赖问题 |

举个例子。装 Nginx：

```bash
sudo apt update
sudo apt install nginx
```

两行搞定。apt 会自动处理依赖关系——你要的包依赖什么库，它会一并装上。

### 三个小细节

第一，`apt update` 只是刷新源列表，不装任何东西。很多人刚接触时以为它干了什么大事，其实只是去远端的软件仓库拉了个包清单。

第二，`apt` 和 `apt-get` 的关系。`apt-get` 是老版本，`apt` 是后来做的统一前端。日常用 `apt` 就够了，写法更少，输出更友好。但在脚本里，很多教程仍然用 `apt-get`，因为它接口更稳定。

第三，软件源配置文件在 `/etc/apt/sources.list`。如果默认源在国内下载慢，换成清华或阿里的镜像源，速度能快几十倍。

## dnf / yum：Red Hat 系

Red Hat 系的包管理器经历了两次迭代：

```
 yum (Python 2)  ──→  dnf (Python 3)
 2003-2020             2015-至今
 RHEL 7 / CentOS 7     RHEL 8+ / CentOS 8+ / Fedora
```

最早是 yum（Yellowdog Updater, Modified），用 Python 2 写的。后来 Fedora 用 Python 3 重写了一遍，改名叫 dnf（Dandified YUM）。

现在谁用哪个？

| 发行版 | 用什么 | 说明 |
|--------|--------|------|
| RHEL 7 / CentOS 7 | `yum` | 旧系统，仍在运行 |
| RHEL 8+ / CentOS Stream | `dnf` | 当前主流 |
| Fedora | `dnf` | 最早换用 dnf |
| Amazon Linux 2023 | `dnf` | 云上最常见 |
| Rocky Linux / AlmaLinux | `dnf` | RHEL 的下游替代 |

好在两者的命令几乎一样。你只需要把下面的 `dnf` 换成 `yum`，在老系统上也能跑。

### 常用命令一览

| 操作 | 命令 | 说明 |
|------|------|------|
| 检查更新 | `dnf check-update` | 查看有何可更新 |
| 安装 | `dnf install 包名` | 装包，自动处理依赖 |
| 卸载 | `dnf remove 包名` | 删包 |
| 搜索 | `dnf search 关键词` | 在源里搜包 |
| 查看信息 | `dnf info 包名` | 看包的详细信息 |
| 升级所有 | `dnf upgrade` | 升级所有可更新的包 |
| 清理缓存 | `dnf clean all` | 清掉缓存，省硬盘 |

同样是装 Nginx：

```bash
sudo dnf install nginx
```

注意，dnf 默认不需要像 apt 那样先 `update`。`dnf install` 会自动检查源缓存，必要时刷新。

## apt vs dnf：一分钟对比

| 对比项 | apt | dnf / yum |
|--------|-----|-----------|
| 所属阵营 | Debian 系 | Red Hat 系 |
| 包格式 | `.deb` | `.rpm` |
| 安装命令 | `apt install` | `dnf install` |
| 搜索命令 | `apt search` | `dnf search` |
| 需先 update？ | 是（`apt update`） | 否（自动检查） |
| 源配置文件 | `/etc/apt/sources.list` | `/etc/yum.repos.d/*.repo` |
| 依赖解析 | 较保守 | 使用 libsolv，更快 |
| 典型发行版 | Ubuntu, Debian, Mint | RHEL, Fedora, CentOS |

## 怎么快速判断该用哪个？

两步走：

**第一步，看发行版。**

```bash
cat /etc/os-release | grep '^ID='
```

输出 `ID=ubuntu` → 用 apt。输出 `ID=rhel` → 用 dnf。

**第二步，看有没有包管理器。**

```bash
# 如果有输出，就是 apt 系
which apt

# 如果没输出再试 dnf
which dnf
```

敲两个命令的时间成本，远低于查文档。

## 一个现实问题：源太慢怎么办

在国内用默认源，下载速度经常只有几十 KB/s。解决方案：

**apt 换源**（以阿里云为例）：

```bash
sudo sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
sudo apt update
```

**dnf 换源**：

```bash
sudo sed -i 's/mirror.centos.org/mirrors.aliyun.com/g' /etc/yum.repos.d/*.repo
sudo dnf makecache
```

换成阿里云、清华、中科大的镜像，速度能跑到带宽上限。

---

包管理器只是一个入口。真正重要的不是记命令，是理解你所在的发行版生态：

- 用 **apt** 的系统包最多最全，社区活跃
- 用 **dnf** 的系统更偏企业级，稳定性优先

选一个主攻，另一个知道怎么查就行。

下回拿到一台新机器，先看发行版，再选命令。apt 还是 dnf，敲对了，后面就顺了。