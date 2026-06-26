# CC-Switch Local (ccsl)

[English](#english) | [中文](#中文)

---

## English

Per-terminal Claude model switcher for [cc-switch](https://github.com/farion1231/cc-switch) — use different Claude models in different terminals simultaneously.

### The Problem

cc-switch switches Claude models **globally**. You can't use Opus in one terminal and Sonnet in another at the same time.

### The Solution

ccsl lets each terminal **independently** select its Claude model by exporting environment variables, overriding the global cc-switch setting per shell session.

### Installation

```bash
# npm
npm install -g ccsl

# bun
bun add -g ccsl

# pnpm
pnpm add -g ccsl
```

### Usage

```bash
# Interactive selection — outputs export commands
ccsl

# Apply to current shell
eval $(ccsl)

# Select and launch Claude directly
ccsl --start
# or
ccsl -s

# Use current provider without interactive selection (for aliases)
ccsl --quiet

# Show help
ccsl --help
```

### Shell Alias (recommended)

Add to `.zshrc` or `.bashrc`:

```bash
alias ccsl='eval $(bun run /path/to/ccsl/src/index.ts --quiet)'
```

Then just type `ccsl` to switch models for the current terminal.

### How It Works

1. Reads provider configs from cc-switch's SQLite database (`~/.cc-switch/cc-switch.db`)
2. Presents an interactive selection menu
3. Outputs `export` commands for the selected provider's env vars
4. Your shell applies these variables, overriding the global cc-switch settings

### Environment Variables

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_AUTH_TOKEN`
- `ANTHROPIC_BASE_URL`
- `ANTHROPIC_MODEL`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`
- `ANTHROPIC_DEFAULT_SONNET_MODEL`
- `ANTHROPIC_DEFAULT_OPUS_MODEL`

### Example

```bash
# Terminal 1 — Use Opus for complex tasks
$ ccsl --start
# Select: Claude Official

# Terminal 2 — Use cheaper model for simple tasks
$ ccsl --start
# Select: DeepSeek

# Terminal 3 — Use whatever cc-switch has globally
$ claude
```

### Requirements

- [cc-switch](https://github.com/farion1231/cc-switch) installed and configured
- [Bun](https://bun.sh) runtime

### License

MIT

---

## 中文

终端级 Claude 模型切换器，配合 [cc-switch](https://github.com/farion1231/cc-switch) 使用——让不同终端同时使用不同的 Claude 模型。

### 解决什么问题

cc-switch 切换模型是**全局生效**的，没法在一个终端用 Opus、另一个终端用 Sonnet。

### 怎么解决

ccsl 通过在当前 shell 中导出环境变量，让每个终端**独立选择**自己的 Claude 模型，互不干扰。

### 安装

```bash
# npm
npm install -g ccsl

# bun
bun add -g ccsl

# pnpm
pnpm add -g ccsl
```

### 使用

```bash
# 交互式选择，输出 export 命令
ccsl

# 应用到当前 shell
eval $(ccsl)

# 选择后直接启动 Claude
ccsl --start
# 或
ccsl -s

# 静默模式，直接使用当前 provider（适合写 alias）
ccsl --quiet

# 查看帮助
ccsl --help
```

### Shell Alias（推荐）

添加到 `.zshrc` 或 `.bashrc`：

```bash
alias ccsl='eval $(bun run /path/to/ccsl/src/index.ts --quiet)'
```

之后输入 `ccsl` 即可切换当前终端的模型。

### 工作原理

1. 从 cc-switch 的 SQLite 数据库（`~/.cc-switch/cc-switch.db`）读取 provider 配置
2. 弹出交互式选择菜单
3. 输出选中 provider 的 `export` 命令
4. Shell 应用这些环境变量，覆盖全局 cc-switch 设置

### 环境变量

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_AUTH_TOKEN`
- `ANTHROPIC_BASE_URL`
- `ANTHROPIC_MODEL`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`
- `ANTHROPIC_DEFAULT_SONNET_MODEL`
- `ANTHROPIC_DEFAULT_OPUS_MODEL`

### 示例

```bash
# 终端 1 — 用 Opus 做复杂任务
$ ccsl --start
# 选择：Claude Official

# 终端 2 — 用便宜模型做简单任务
$ ccsl --start
# 选择：DeepSeek

# 终端 3 — 用 cc-switch 全局配置
$ claude
```

### 依赖

- 已安装并配置 [cc-switch](https://github.com/farion1231/cc-switch)
- [Bun](https://bun.sh) 运行时

### 许可证

MIT
