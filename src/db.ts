import { Database } from "bun:sqlite";
import { join } from "path";
import { homedir } from "os";
import { existsSync } from "fs";

export interface ClaudeProvider {
  id: string;
  name: string;
  env: Record<string, string>;
}

interface ProviderRow {
  id: string;
  name: string;
  settings_config: string;
}

const CC_SWITCH_DB_PATH = join(homedir(), ".cc-switch", "cc-switch.db");

export function getDbPath(): string {
  return CC_SWITCH_DB_PATH;
}

export function isDbExists(): boolean {
  return existsSync(CC_SWITCH_DB_PATH);
}

export function getClaudeProviders(): ClaudeProvider[] {
  if (!isDbExists()) {
    throw new Error(
      `cc-switch database not found at ${CC_SWITCH_DB_PATH}\nPlease make sure cc-switch is installed.`
    );
  }

  const db = new Database(CC_SWITCH_DB_PATH, { readonly: true });

  try {
    const rows = db
      .query(
        `
        SELECT id, name, settings_config
        FROM providers
        WHERE app_type = 'claude'
        ORDER BY sort_index, name
      `
      )
      .all() as ProviderRow[];

    return rows.map((row) => {
      const config = JSON.parse(row.settings_config);
      return {
        id: row.id,
        name: row.name,
        env: config.env || {},
      };
    });
  } finally {
    db.close();
  }
}

export function getProviderById(id: string): ClaudeProvider | undefined {
  if (!isDbExists()) {
    return undefined;
  }

  const db = new Database(CC_SWITCH_DB_PATH, { readonly: true });

  try {
    const row = db
      .query(
        `
        SELECT id, name, settings_config
        FROM providers
        WHERE id = ? AND app_type = 'claude'
      `
      )
      .get(id) as ProviderRow | undefined;

    if (!row) return undefined;

    const config = JSON.parse(row.settings_config);
    return {
      id: row.id,
      name: row.name,
      env: config.env || {},
    };
  } finally {
    db.close();
  }
}

export function getCurrentProviderId(): string | undefined {
  const settingsPath = join(homedir(), ".cc-switch", "settings.json");
  if (!existsSync(settingsPath)) return undefined;

  const settings = require(settingsPath);
  return settings.currentProviderClaude;
}
