<div align="center">

# 🔄 ccsl

**Per-terminal Claude model switcher for cc-switch**

[![npm version](https://img.shields.io/npm/v/ccsl?style=flat-square&color=blue)](https://www.npmjs.com/package/ccsl)
[![license](https://img.shields.io/npm/l/ccsl?style=flat-square&color=green)](./LICENSE)
[![bun](https://img.shields.io/badge/bun-compatible-yellow?style=flat-square)](https://bun.sh)

[English](#quick-start) | [中文](./README.zh-CN.md)

</div>

---

## 🤔 Why?

cc-switch switches Claude models **globally**. Want Opus in one terminal and Sonnet in another? **Can't do it.**

ccsl fixes this — each terminal picks its own model, independently.

## ⚡ Quick Start

```bash
# Install
bun add -g ccsl

# Use (interactive selection)
eval $(ccsl)

# Or select and launch Claude directly
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
npm install -g ccsl
```

</td>
<td>

```bash
bun add -g ccsl
```

</td>
<td>

```bash
pnpm add -g ccsl
```

</td>
</tr>
</table>

## 🎯 Usage

| Command | Description |
|---------|-------------|
| `ccsl` | Interactive selection, outputs `export` commands |
| `eval $(ccsl)` | Apply selected model to current shell |
| `ccsl -s` / `ccsl --start` | Select and launch Claude directly |
| `ccsl -q` / `ccsl --quiet` | Use current provider (no interaction, for aliases) |
| `ccsl -h` / `ccsl --help` | Show help |
| `ccsl -v` / `ccsl --version` | Show version |

### 💡 Pro Tip: Shell Alias

Add to `.zshrc` / `.bashrc`:

```bash
alias ccsl='eval $(bun run /path/to/ccsl/src/index.ts --quiet)'
```

Then just type `ccsl` to switch — one word, done.

## 🔧 How It Works

```
┌─────────────────────┐
│  cc-switch database  │  ~/.cc-switch/cc-switch.db
└──────────┬──────────┘
           │ read providers
           ▼
┌─────────────────────┐
│   ccsl interactive   │  pick a model
└──────────┬──────────┘
           │ export ENV vars
           ▼
┌─────────────────────┐
│    current shell     │  ANTHROPIC_API_KEY, ANTHROPIC_MODEL, ...
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
# Terminal 1 — complex tasks, need Opus
$ ccsl -s
# → Select: Claude Official

# Terminal 2 — quick questions, use cheaper model
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
