#!/usr/bin/env bun

import { select, isCancel, cancel, intro, outro } from "@clack/prompts";
import { getClaudeProviders, getProviderById, getCurrentProviderId, isDbExists, ClaudeProvider } from "./db";

const VERSION = "2.0.0";

// All interactive UI goes to stderr; stdout is reserved for --print output.
const ui = process.stderr;

// Common Anthropic / Claude Code env keys. Any of these that the selected
// provider does NOT set are forced to empty in the --settings override, so a
// previous provider's value baked into ~/.claude/settings.json can't leak
// through (settings.json env overrides shell env, but --settings overrides
// settings.json).
const MANAGED_KEYS = [
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_AUTH_TOKEN",
  "ANTHROPIC_BASE_URL",
  "ANTHROPIC_MODEL",
  "ANTHROPIC_DEFAULT_HAIKU_MODEL",
  "ANTHROPIC_DEFAULT_SONNET_MODEL",
  "ANTHROPIC_DEFAULT_OPUS_MODEL",
  "CLAUDE_CODE_USE_BEDROCK",
  "CLAUDE_CODE_USE_VERTEX",
];

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

// Build the env block passed to `claude --settings`. Starts from the union of
// all managed keys + this provider's keys, forces unset (empty) ones the
// provider doesn't define, then applies the provider's actual values.
function buildSettingsEnv(provider: ClaudeProvider, allKeys: string[]): Record<string, string> {
  const env: Record<string, string> = {};
  for (const key of allKeys) env[key] = "";
  for (const [key, value] of Object.entries(provider.env)) {
    if (value) env[key] = value;
  }
  return env;
}

function collectAllKeys(providers: ClaudeProvider[]): string[] {
  const keys = new Set<string>(MANAGED_KEYS);
  for (const p of providers) {
    for (const key of Object.keys(p.env)) keys.add(key);
  }
  return [...keys];
}

function showHelp() {
  console.error(`
ccsl - Per-terminal Claude provider switcher for cc-switch

Usage:
  ccsl [claude args...]    Pick a provider, then launch Claude with it
  ccsl -q, --quiet         Use the current provider without prompting
  ccsl -p, --print         Print the --settings JSON instead of launching

Other:
  ccsl -h, --help          Show this help
  ccsl -v, --version       Show version

Examples:
  ccsl                     Pick a provider and start Claude
  ccsl -q                  Start Claude with the current provider
  ccsl --resume            Pick a provider, then 'claude --resume'

Each terminal stays on whatever provider you launched it with — independent of
cc-switch's global setting and of other terminals.

GitHub: https://github.com/Mtianwai/ccsl
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(VERSION);
    process.exit(0);
  }

  const quiet = args.includes("--quiet") || args.includes("-q");
  const printOnly = args.includes("--print") || args.includes("-p");
  // Remaining args (minus ccsl's own flags) are forwarded to `claude`.
  const claudeArgs = args.filter(
    (a) => !["--quiet", "-q", "--print", "-p"].includes(a)
  );

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

  const env = buildSettingsEnv(provider, collectAllKeys(providers));
  const settingsJson = JSON.stringify({ env });

  if (printOnly) {
    console.log(settingsJson);
    process.exit(0);
  }

  if (!quiet) {
    outro(`✅ Using ${getDisplayName(provider)} (${getModelName(provider)})`, { output: ui });
  }

  // Launch Claude with this provider's settings. --settings overrides the
  // global ~/.claude/settings.json env block, so the choice actually sticks
  // for THIS terminal only — without touching the global config.
  const proc = Bun.spawn(["claude", "--settings", settingsJson, ...claudeArgs], {
    stdio: ["inherit", "inherit", "inherit"],
  });
  await proc.exited;
  process.exit(proc.exitCode ?? 0);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
