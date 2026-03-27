import { ChildProcess, spawn, spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type GatewayState = {
  process: ChildProcess | null;
  pid: number | null;
  startedAt: number | null;
  lastCrashAt: number | null;
  logs: string[];
  watchdogStarted: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __easyclawGatewayState: GatewayState | undefined;
}

const gatewayState: GatewayState =
  global.__easyclawGatewayState ??
  {
    process: null,
    pid: null,
    startedAt: null,
    lastCrashAt: null,
    logs: [],
    watchdogStarted: false
  };

global.__easyclawGatewayState = gatewayState;

const OPENCLAW_CONFIG_PATH = path.join(os.homedir(), ".openclaw", "openclaw.json");
const GATEWAY_URL = "http://127.0.0.1:18789/status";

function pushLog(line: string) {
  gatewayState.logs.push(`[${new Date().toISOString()}] ${line}`);
  if (gatewayState.logs.length > 400) gatewayState.logs.shift();
}

export function detectOpenClawInstalled() {
  const result = spawnSync("openclaw", ["--version"], { encoding: "utf-8" });
  return {
    installed: result.status === 0,
    version: result.stdout?.trim() || null
  };
}

export async function getGatewayStatus() {
  try {
    const response = await fetch(GATEWAY_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const body = await response.json();
    return {
      connected: true,
      channels: body.channels ?? [],
      uptime: body.uptime ?? (gatewayState.startedAt ? Math.floor((Date.now() - gatewayState.startedAt) / 1000) : 0),
      messageCount: body.messageCount ?? body.messages ?? 0
    };
  } catch {
    return {
      connected: false,
      channels: [],
      uptime: gatewayState.startedAt ? Math.floor((Date.now() - gatewayState.startedAt) / 1000) : undefined,
      messageCount: 0
    };
  }
}

async function runDoctorFix() {
  return new Promise<void>((resolve) => {
    const doctor = spawn("openclaw", ["doctor", "--fix"], { stdio: ["ignore", "pipe", "pipe"] });
    doctor.stdout.on("data", (chunk) => pushLog(`[doctor] ${chunk.toString().trim()}`));
    doctor.stderr.on("data", (chunk) => pushLog(`[doctor] ${chunk.toString().trim()}`));
    doctor.on("close", () => resolve());
    doctor.on("error", () => resolve());
  });
}

export async function spawnGateway() {
  if (gatewayState.process && !gatewayState.process.killed) {
    return { pid: gatewayState.pid, status: "already-running" as const };
  }

  const processRef = spawn("openclaw", ["gateway", "--install-daemon"], {
    stdio: ["ignore", "pipe", "pipe"]
  });

  gatewayState.process = processRef;
  gatewayState.pid = processRef.pid ?? null;
  gatewayState.startedAt = Date.now();
  pushLog("Gateway spawn requested");

  processRef.stdout.on("data", (chunk) => pushLog(chunk.toString().trim()));
  processRef.stderr.on("data", (chunk) => pushLog(`[stderr] ${chunk.toString().trim()}`));
  processRef.on("close", (code) => {
    gatewayState.lastCrashAt = Date.now();
    gatewayState.process = null;
    gatewayState.pid = null;
    pushLog(`Gateway exited with code ${code ?? "unknown"}`);
  });
  processRef.on("error", (error) => {
    pushLog(`Gateway spawn error: ${error.message}`);
  });

  if (!gatewayState.watchdogStarted) {
    gatewayState.watchdogStarted = true;
    setInterval(async () => {
      const status = await getGatewayStatus();
      if (!status.connected && (!gatewayState.process || gatewayState.process.killed)) {
        pushLog("Watchdog entered repair mode");
        await runDoctorFix();
        await spawnGateway();
      }
    }, 10_000);
  }

  return { pid: gatewayState.pid, status: "spawned" as const };
}

export async function getConfig() {
  try {
    const text = await readFile(OPENCLAW_CONFIG_PATH, "utf-8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function writeConfig(payload: {
  apiKey?: string;
  model: string;
  channels: string[];
  tools?: string[];
  userPhoneNumber?: string;
}) {
  const channelsConfig: Record<string, Record<string, unknown>> = {};

  payload.channels.forEach((channel) => {
    if (channel === "whatsapp" || channel === "whatsapp-business") {
      channelsConfig.whatsapp = {
        dmPolicy: "allowlist",
        allowFrom: [payload.userPhoneNumber || "+15551234567"],
        groupPolicy: "allowlist",
        groupAllowFrom: [payload.userPhoneNumber || "+15551234567"]
      };
      return;
    }

    channelsConfig[channel] = { enabled: true };
  });

  const config = {
    channels: channelsConfig,
    model: payload.model,
    gateway: {
      auth: {
        mode: "token",
        token: payload.apiKey || "demo-token"
      },
      port: 18789
    },
    tools: payload.tools ?? []
  };

  await mkdir(path.dirname(OPENCLAW_CONFIG_PATH), { recursive: true });
  await writeFile(OPENCLAW_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  return config;
}

export async function generateQRValue() {
  const defaultValue = "ws://127.0.0.1:18789/whatsapp-link";

  try {
    const output = await new Promise<string>((resolve) => {
      const child = spawn("openclaw", ["channels", "login", "--channel", "whatsapp"], {
        stdio: ["ignore", "pipe", "pipe"]
      });
      let data = "";
      const timeout = setTimeout(() => {
        child.kill("SIGTERM");
        resolve(data);
      }, 8000);

      child.stdout.on("data", (chunk) => {
        data += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        data += chunk.toString();
      });
      child.on("close", () => {
        clearTimeout(timeout);
        resolve(data);
      });
      child.on("error", () => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    const match = output.match(/(ws|wss):\/\/[^\s]+/);
    return match?.[0] || defaultValue;
  } catch {
    return defaultValue;
  }
}

export function getGatewayLogs() {
  return gatewayState.logs;
}
