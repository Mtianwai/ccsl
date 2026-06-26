#!/usr/bin/env bun

import { select, isCancel, cancel, intro, outro } from "@clack/prompts";
import { getClaudeProviders, getProviderById, getCurrentProviderId, isDbExists, ClaudeProvider } from "./db";

const VERSION = "1.0.0";

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

function showHelp() {
  console.log(`
ccsl - Terminal-level model switcher for cc-switch

Usage:
  ccsl                   Interactive provider selection (outputs export commands)
  ccsl --start, -s       Select provider and launch Claude directly
  ccsl --quiet, -q       Use current provider without interactive selection
  ccsl --help, -h        Show this help message
  ccsl --version, -v     Show version

Examples:
  eval $(ccsl)           Apply selected provider to current shell
  ccsl -s                Select and start Claude
  ccsl -q                Export current provider's env vars (for aliases)

GitHub: https://github.com/nicobailon/cc-switch
`);
}

async function main() {
  const args = process.argv.slice(2);
  const startClaude = args.includes("--start") || args.includes("-s");
  const quiet = args.includes("--quiet") || args.includes("-q");

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(VERSION);
    process.exit(0);
  }

  // Check if db exists
  if (!isDbExists()) {
    if (!quiet) console.error("❌ cc-switch database not found.");
    if (!quiet) console.error("   Please make sure cc-switch is installed.");
    process.exit(1);
  }

  // Get all Claude providers
  const providers = getClaudeProviders();

  if (providers.length === 0) {
    if (!quiet) console.error("❌ No Claude providers found in cc-switch database.");
    process.exit(1);
  }

  // Get current provider for highlighting
  const currentId = getCurrentProviderId();

  let selectedId: string;

  if (quiet) {
    // In quiet mode, use current provider directly
    selectedId = currentId || providers[0]?.id;
    if (!selectedId) {
      process.exit(1);
    }
  } else {
    // Interactive mode
    intro("🎨 CC-Switch Local");

    const options = providers.map((p) => ({
      value: p.id,
      label: `${getDisplayName(p)} (${getModelName(p)})`,
      hint: p.id === currentId ? "current" : undefined,
    }));

    const selected = await select({
      message: "Select a Claude provider for this terminal:",
      options,
      initialValue: currentId || options[0]?.value,
    });

    if (isCancel(selected)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    selectedId = selected as string;
  }

  // Get the selected provider
  const provider = getProviderById(selectedId);
  if (!provider) {
    console.error("❌ Provider not found.");
    process.exit(1);
  }

  // Output environment variables
  const envExport = formatEnvExport(provider);

  if (startClaude) {
    // Set env vars and start claude
    for (const [key, value] of Object.entries(provider.env)) {
      if (value) {
        process.env[key] = value;
      }
    }

    if (!quiet) {
      outro(`✅ Using ${getDisplayName(provider)} (${getModelName(provider)})`);
    }

    // Start claude
    const proc = Bun.spawn(["claude"], {
      stdio: ["inherit", "inherit", "inherit"],
    });
    await proc.exited;
  } else {
    // Just output the export commands
    console.log(envExport);

    if (!quiet) {
      outro(`✅ Run 'eval \$(ccsl)' to apply, or 'ccsl --start' to launch Claude directly`);
    }
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
