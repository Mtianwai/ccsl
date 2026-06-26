<div align="center">

# 🔄 ccsl

**Per-terminal Claude provider switcher for cc-switch**

[![npm version](https://img.shields.io/npm/v/@mtianwai/ccsl?style=flat-square&color=blue)](https://www.npmjs.com/package/@mtianwai/ccsl)
[![license](https://img.shields.io/npm/l/@mtianwai/ccsl?style=flat-square&color=green)](./LICENSE)
[![bun](https://img.shields.io/badge/bun-compatible-yellow?style=flat-square)](https://bun.sh)

[English](#-why) | [中文](./README.zh-CN.md)

</div>

---

## 🤔 Why?

cc-switch switches providers **globally**. Want Anthropic in one terminal and DeepSeek in another? **Can't do it.**

ccsl fixes this — each terminal picks its own provider, independently.

## ⚡ Quick Start

**1. Install**

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

**2. Add shell integration** (one-time) — append to `~/.zshrc` or `~/.bashrc`:

```bash
eval "$(ccsl init)"
```

Then restart your terminal. **That's it.**

**3. Use it**

```bash
ccsl        # select a provider → applies to this terminal instantly
ccsl -s     # select → apply → launch Claude
```

> [!NOTE]
> The `eval "$(ccsl init)"` line is required because a program can't change its
> parent shell's environment by itself — the shell has to do it. This is the same
> pattern used by `zoxide`, `starship`, `fnm`, and `direnv`.

## 🎯 Commands

| Command | Description |
|---------|-------------|
| `ccsl` | Select a provider, applies to current terminal instantly |
| `ccsl -s` / `ccsl --start` | Select, apply, then launch Claude |
| `ccsl -q` / `ccsl --quiet` | Use current provider without interactive selection |
| `ccsl init` | Print the shell function (for setup) |
| `ccsl -h` / `ccsl --help` | Show help |
| `ccsl -v` / `ccsl --version` | Show version |

## 🔧 How It Works

```
┌─────────────────────┐
│  cc-switch database  │  ~/.cc-switch/cc-switch.db
└──────────┬──────────┘
           │ read providers
           ▼
┌─────────────────────┐
│   ccsl (interactive) │  pick a provider
└──────────┬──────────┘
           │ shell function evals the export commands
           ▼
┌─────────────────────┐
│    current shell     │  ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, ...
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

## 🌰 Example

```bash
# Terminal 1 — official Anthropic API
$ ccsl -s
# → Select: Claude Official

# Terminal 2 — cheaper alternative via DeepSeek
$ ccsl -s
# → Select: DeepSeek

# Terminal 3 — just use whatever cc-switch has globally
$ claude
```

## 📋 Requirements

- [cc-switch](https://github.com/farion1231/cc-switch) installed and configured
- [Bun](https://bun.sh) runtime

## 📄 License

MIT
