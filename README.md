# CC-Switch Local (ccsll)

Terminal-level model switcher for cc-switch - use different Claude models in different terminals simultaneously.

## Problem

cc-switch allows switching between Claude models globally, but you can't use different models in different terminal tabs at the same time. This tool solves that by allowing each terminal to independently select its Claude model.

## Installation

### Global Install (recommended)

```bash
# Using npm
npm install -g ccsl

# Using bun
bun add -g ccsl

# Using pnpm
pnpm add -g ccsl
```

### Local Development

```bash
git clone <this-repo>
cd ccsl
bun install
bun link
```

## Usage

### Interactive Selection

```bash
# Interactive provider selection (outputs export commands)
ccsl

# Apply to current shell
eval $(ccsl)
```

### Quick Start Claude

```bash
# Select provider and start Claude immediately
ccsl --start
# or
ccsl -s
```

### Add to Shell Config

For convenience, add an alias to your `.zshrc` or `.bashrc`:

```bash
alias ccsl='eval $(bun run /path/to/ccsl/src/index.ts --quiet)'
```

Then just type `ccsl` to switch models for the current terminal.

## How It Works

1. Reads provider configurations from cc-switch's SQLite database (`~/.cc-switch/cc-switch.db`)
2. Presents an interactive selection menu
3. Outputs `export` commands for the selected provider's environment variables
4. Your shell applies these variables, overriding the global cc-switch settings

## Environment Variables

The tool sets these Claude-related environment variables:

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_AUTH_TOKEN`
- `ANTHROPIC_BASE_URL`
- `ANTHROPIC_MODEL`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`
- `ANTHROPIC_DEFAULT_SONNET_MODEL`
- `ANTHROPIC_DEFAULT_OPUS_MODEL`

## Example

```bash
# Terminal 1 - Use Claude Opus for complex tasks
$ ccsl --start
# Select: Claude Official
# Claude starts with official API

# Terminal 2 - Use cheaper model for simple tasks
$ ccsl --start
# Select: DeepSeek
# Claude starts with DeepSeek API

# Terminal 3 - Use current default
$ claude
# Uses whatever cc-switch has configured globally
```

## Requirements

- [cc-switch](https://github.com/nicobailon/cc-switch) installed and configured
- [Bun](https://bun.sh) runtime

## License

MIT
