#!/usr/bin/env bun

import { select, confirm, isCancel, cancel, intro, outro } from "@clack/prompts";
import { getClaudeProviders, getProviderById, getCurrentProviderId, isDbExists, ClaudeProvider } from "./db";

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

async function main() {
  const args = process.argv.slice(2);
  const startClaude = args.includes("--start") || args.includes("-s");
  const quiet = args.includes("--quiet") || args.includes("-q");

  if (!quiet) {
    intro("🎨 CC-Switch Local");
  }

  // Check if db exists
  if (!isDbExists()) {
    console.error("❌ cc-switch database not found.");
    console.error("   Please make sure cc-switch is installed.");
    process.exit(1);
  }

  // Get all Claude providers
  const providers = getClaudeProviders();

  if (providers.length === 0) {
    console.error("❌ No Claude providers found in cc-switch database.");
    process.exit(1);
  }

  // Get current provider for highlighting
  const currentId = getCurrentProviderId();

  // Build options for select
  const options = providers.map((p) => ({
    value: p.id,
    label: `${p.name} (${getModelName(p)})`,
    hint: p.id === currentId ? "current" : undefined,
  }));

  // Ask user to select a provider
  const selected = await select({
    message: "Select a Claude provider for this terminal:",
    options,
    initialValue: currentId || options[0]?.value,
  });

  if (isCancel(selected)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  // Get the selected provider
  const provider = getProviderById(selected as string);
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
      outro(`✅ Using ${provider.name} (${getModelName(provider)})`);
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
      outro(`✅ Run 'eval \$(ccs)' to apply, or 'ccs --start' to launch Claude directly`);
    }
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
