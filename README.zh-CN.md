<div align="center">

# 🔄 ccsl

**终端级 Claude 模型切换器，配合 cc-switch 使用**

[![npm version](https://img.shields.io/npm/v/ccsl?style=flat-square&color=blue)](https://www.npmjs.com/package/ccsl)
[![license](https://img.shields.io/npm/l/ccsl?style=flat-square&color=green)](./LICENSE)
[![bun](https://img.shields.io/badge/bun-compatible-yellow?style=flat-square)](https://bun.sh)

[English](./README.md) | [中文](#快速开始)

</div>

---

## 🤔 解决什么问题

cc-switch 切换 provider 是**全局生效**的。想在一个终端用 Anthropic、另一个终端用 DeepSeek？**做不到。**

ccsl 解决了这个问题——每个终端独立选择自己的 provider，互不干扰。

## ⚡ 快速开始

```bash
# 安装
bun add -g @mtianwai/ccsl

# 使用（交互式选择）
eval $(ccsl)

# 或者选择后直接启动 Claude
ccsl -s
```

<table>
<tr>
<th>npm</th>
<th>bun</th>
<th>pnpm</th>
</tr>
<tr>
<td>

```bash
npm install -g @mtianwai/ccsl
```

</td>
<td>

```bash
bun add -g @mtianwai/ccsl
```

</td>
<td>

```bash
pnpm add -g @mtianwai/ccsl
```

</td>
</tr>
</table>

## 🎯 用法

| 命令 | 说明 |
|------|------|
| `ccsl` | 交互式选择，输出 `export` 命令 |
| `eval $(ccsl)` | 将选中的模型应用到当前 shell |
| `ccsl -s` / `ccsl --start` | 选择后直接启动 Claude |
| `ccsl -q` / `ccsl --quiet` | 静默模式，使用当前 provider（适合写 alias） |
| `ccsl -h` / `ccsl --help` | 查看帮助 |
| `ccsl -v` / `ccsl --version` | 查看版本 |

### 💡 推荐：Shell Alias

添加到 `.zshrc` / `.bashrc`：

```bash
alias cs='eval $(ccsl --quiet)'
```

然后输入 `cs` 即可切换——两个字母搞定。

## 🔧 工作原理

```
┌─────────────────────┐
│  cc-switch 数据库    │  ~/.cc-switch/cc-switch.db
└──────────┬──────────┘
           │ 读取 provider 配置
           ▼
┌─────────────────────┐
│   ccsl 交互式选择    │  选一个模型
└──────────┬──────────┘
           │ 输出 export 环境变量
           ▼
┌─────────────────────┐
│    当前 shell        │  ANTHROPIC_API_KEY, ANTHROPIC_MODEL, ...
└─────────────────────┘
```

## 📦 环境变量

| 变量 | 用途 |
|------|------|
| `ANTHROPIC_API_KEY` | API 密钥 |
| `ANTHROPIC_AUTH_TOKEN` | 认证 Token |
| `ANTHROPIC_BASE_URL` | API 基础 URL |
| `ANTHROPIC_MODEL` | 主模型 |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Sonnet 备选 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Haiku 备选 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Opus 备选 |

## 🌰 示例

```bash
# 终端 1 — 用 Anthropic 官方 API
$ ccsl -s
# → 选择：Claude Official

# 终端 2 — 用 DeepSeek 等第三方
$ ccsl -s
# → 选择：DeepSeek

# 终端 3 — 用 cc-switch 全局配置
$ claude
```

## 📋 依赖

- 已安装并配置 [cc-switch](https://github.com/farion1231/cc-switch)
- [Bun](https://bun.sh) 运行时

## 📄 许可证

MIT
