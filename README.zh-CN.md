<div align="center">

# 🔄 ccsl

**终端级 Claude provider 切换器，配合 cc-switch 使用**

[![npm version](https://img.shields.io/npm/v/@mtianwai/ccsl?style=flat-square&color=blue)](https://www.npmjs.com/package/@mtianwai/ccsl)
[![license](https://img.shields.io/npm/l/@mtianwai/ccsl?style=flat-square&color=green)](./LICENSE)

[English](./README.md) | [中文](#-解决什么问题)

</div>

---

## 🤔 解决什么问题

cc-switch 切换 provider 是**全局生效**的。想在一个终端用 Anthropic、另一个终端用 DeepSeek？**做不到。**

ccsl 解决了这个问题——每个终端独立选择自己的 provider，互不干扰。

## ⚡ 快速开始

**1. 安装**

```bash
npm install -g @mtianwai/ccsl
```

**2. 使用**

```bash
ccsl        # 选择 provider → 选新会话/继续 → 启动 Claude
ccsl -q     # 使用当前 provider，跳过选择
```

> 无需配置，无需 shell 集成，装了就能用。

## 🎯 命令

| 命令 | 说明 |
|------|------|
| `ccsl [参数...]` | 选择 provider，选择新会话/继续，启动 Claude |
| `ccsl -c` | 选择 provider，继续当前会话 |
| `ccsl -n` | 选择 provider，开启新会话 |
| `ccsl -q` | 使用 cc-switch 当前 provider，跳过选择 |
| `ccsl -q -c` | 当前 provider，继续会话 |
| `ccsl -q -n` | 当前 provider，新会话 |
| `ccsl -p` | 打印 settings JSON（调试用） |
| `ccsl -h` | 查看帮助 |
| `ccsl -v` | 查看版本 |

额外参数会透传给 `claude`：

```bash
ccsl --resume          # 选择 provider，然后 claude --resume
ccsl -q -c 2000        # 当前 provider，继续会话，限制 token
ccsl --model opus      # 选择 provider，覆盖模型
```

## 🔧 工作原理

Claude Code 支持 `--settings` 参数，可以**覆盖**全局配置文件 `~/.claude/settings.json`。

ccsl 从 cc-switch 数据库读取 provider 配置，构建对应的 `--settings` JSON，直接启动 `claude`。无需 shell 集成，无需 `eval`。

```
┌─────────────────────┐
│  cc-switch 数据库    │  ~/.cc-switch/cc-switch.db
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│   ccsl 交互式选择    │  选一个 provider
└──────────┬──────────┘
           │ claude --settings '{"env":{"ANTHROPIC_BASE_URL":"...","ANTHROPIC_AUTH_TOKEN":"..."}}'
           ▼
┌─────────────────────┐
│    Claude Code       │  使用选中的 provider
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

## 📋 依赖

- 已安装并配置 [cc-switch](https://github.com/farion1231/cc-switch)
- [Bun](https://bun.sh) 运行时

## 📄 许可证

MIT
