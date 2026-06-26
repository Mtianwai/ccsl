<div align="center">

# 🔄 ccsl

**Per-terminal Claude provider switcher for cc-switch**

[![npm version](https://img.shields.io/npm/v/@mtianwai/ccsl?style=flat-square&color=blue)](https://www.npmjs.com/package/@mtianwai/ccsl)
[![license](https://img.shields.io/npm/l/@mtianwai/ccsl?style=flat-square&color=green)](./LICENSE)

[English](#-why) | [中文](./README.zh-CN.md)

</div>

---

## 🤔 Why?

cc-switch switches providers **globally**. Want Anthropic in one terminal and DeepSeek in another? **Can't do it.**

ccsl fixes this — each terminal picks its own provider, independently.

## ⚡ Quick Start

**1. Install**

```bash
npm install -g @mtianwai/ccsl
```

**2. Use**

```bash
ccsl        # pick a provider → choose new/continue → launches Claude
ccsl -q     # use current provider, no prompt
```

> No setup needed. No shell config. Just install and go.

## 🎯 Commands

| Command | Description |
|---------|-------------|
| `ccsl [args...]` | Pick a provider, choose new/continue, launch Claude |
| `ccsl -c` | Pick a provider, continue current session |
| `ccsl -n` | Pick a provider, start a new session |
| `ccsl -q` | Use current cc-switch provider, no prompt |
| `ccsl -q -c` | Current provider, continue session |
| `ccsl -q -n` | Current provider, new session |
| `ccsl -p` | Print the settings JSON (debug) |
| `ccsl -h` | Show help |
| `ccsl -v` | Show version |

Extra arguments are passed to `claude`:

```bash
ccsl --resume          # pick a provider, then claude --resume
ccsl -q -c 2000        # current provider, continue, with token limit
ccsl --model opus      # pick a provider, override model
```

## 🔧 How It Works

Claude Code supports `--settings` which overrides the global config **per-invocation**.

ccsl reads the provider from cc-switch's database, builds the right `--settings` JSON, and launches `claude` with it — no shell integration needed, no `eval`, no aliases.

```
┌─────────────────────┐
│  cc-switch database  │  ~/.cc-switch/cc-switch.db
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│   ccsl (interactive) │  pick a provider
└──────────┬──────────┘
           │ claude --settings '{"env":{"ANTHROPIC_BASE_URL":"...","ANTHROPIC_AUTH_TOKEN":"..."}}'
           ▼
┌─────────────────────┐
│    Claude Code       │  using the selected provider
└─────────────────────┘
```

## 📦 Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API key |
| `ANTHROPIC_AUTH_TOKEN` | Auth token |
| `ANTHROPIC_BASE_URL` | API base URL |
| `ANTHROPIC_MODEL` | Primary model |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Sonnet fallback |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Haiku fallback |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Opus fallback |

## 📋 Requirements

- [cc-switch](https://github.com/farion1231/cc-switch) installed and configured
- [Bun](https://bun.sh) runtime

## 📄 License

MIT
