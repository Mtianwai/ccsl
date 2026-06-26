#!/usr/bin/env bun

import { select, isCancel, cancel, intro, outro } from "@clack/prompts";
import { getClaudeProviders, getProviderById, getCurrentProviderId, isDbExists, ClaudeProvider } from "./db";

const VERSION = "1.1.0";

// All interactive UI goes to stderr so stdout stays clean for `eval $(ccsl)`.
const ui = process.stderr;

function formatEnvExport(provider: ClaudeProvider): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(provider.env)) {
    if (value) {
      lines.push(`export ${key}="${value}"`);
    }
  }
  return lines.join("\n");
}

function getModelName(provider: ClaudeProvider): string {
  return (
    provider.env.ANTHROPIC_MODEL ||
    provider.env.ANTHROPIC_DEFAULT_SONNET_MODEL ||
    provider.env.ANTHROPIC_DEFAULT_HAIKU_MODEL ||
    "default"
  );
}

function getDisplayName(provider: ClaudeProvider): string {
  return provider.name || "(unnamed)";
}

// The shell function that makes `ccsl` apply env vars to the CURRENT shell.
// Without this, a child process can't modify the parent shell's environment.
function shellInit(): string {
  return `ccsl() {
  local _out
  _out="$(command ccsl --eval "$@")" || return
  eval "$_out"
}`;
}

function showHelp() {
  console.error(`
ccsl - Per-terminal Claude provider switcher for cc-switch

Setup (one-time, add to ~/.zshrc or ~/.bashrc):
  eval "$(ccsl init)"

Usage (after setup):
  ccsl                   Select a provider — applies to current terminal instantly
  ccsl -s, --start       Select a provider, apply, then launch Claude
  ccsl -q, --quiet       Use current provider without interactive selection

Other:
  ccsl init              Print the shell function for setup
  ccsl -h, --help        Show this help
  ccsl -v, --version     Show version

GitHub: https://github.com/Mtianwai/ccsl
`);
}

async function main() {
  const args = process.argv.slice(2);

  // `ccsl init` — print the shell function for the user's rc file.
  if (args[0] === "init") {
    console.log(shellInit());
    process.exit(0);
  }

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(VERSION);
    process.exit(0);
  }

  const startClaude = args.includes("--start") || args.includes("-s");
  const quiet = args.includes("--quiet") || args.includes("-q");
  // --eval is passed by the shell function; means stdout is captured for eval.
  const evalMode = args.includes("--eval");

  // If not run through the shell function (stdout is a TTY, not captured),
  // the export commands would just be printed uselessly. Guide the user.
  if (!evalMode && !quiet && process.stdout.isTTY) {
    console.error("⚠️  ccsl needs shell integration to apply changes to your terminal.\n");
    console.error("Add this line to your ~/.zshrc or ~/.bashrc:\n");
    console.error('  eval "$(ccsl init)"\n');
    console.error("Then restart your terminal. (Run 'ccsl --help' for more.)");
    process.exit(1);
  }

  // Check if db exists
  if (!isDbExists()) {
    console.error("❌ cc-switch database not found. Please make sure cc-switch is installed.");
    process.exit(1);
  }

  const providers = getClaudeProviders();
  if (providers.length === 0) {
    console.error("❌ No Claude providers found in cc-switch database.");
    process.exit(1);
  }

  const currentId = getCurrentProviderId();

  let selectedId: string;

  if (quiet) {
    const id = currentId || providers[0]?.id;
    if (!id) process.exit(1);
    selectedId = id;
  } else {
    intro("🎨 CC-Switch Local", { output: ui });

    const options = providers.map((p) => ({
      value: p.id,
      label: `${getDisplayName(p)} (${getModelName(p)})`,
      hint: p.id === currentId ? "current" : undefined,
    }));

    const selected = await select({
      message: "Select a Claude provider for this terminal:",
      options,
      initialValue: currentId || options[0]?.value,
      output: ui,
    });

    if (isCancel(selected)) {
      cancel("Operation cancelled.", { output: ui });
      process.exit(0);
    }

    selectedId = selected as string;
  }

  const provider = getProviderById(selectedId);
  if (!provider) {
    console.error("❌ Provider not found.");
    process.exit(1);
  }

  // Export commands go to stdout (captured by `eval`); status goes to stderr.
  console.log(formatEnvExport(provider));

  if (!quiet) {
    outro(`✅ Using ${getDisplayName(provider)} (${getModelName(provider)})`, { output: ui });
  }

  // For --start, append `claude` so the shell function launches it after eval,
  // inheriting the freshly-applied env vars.
  if (startClaude) {
    console.log("claude");
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
