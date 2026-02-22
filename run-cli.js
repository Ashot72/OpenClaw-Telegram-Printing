import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { print } from "./print.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const exit = (msg, code = 1) => {
  process.stderr.write(msg);
  process.exit(code);
};

function parseArgs() {
  const args = process.argv.slice(2);
  const chatId = args[0] === "--chat-id" && args[1] ? args[1] : undefined;
  const text = (args[0] === "--chat-id" ? args.slice(2) : args).join(" ").trim();
  return { chatId, text };
}

function getAuthorizedUsers() {
  return (process.env.TELEGRAM_AUTHORIZED_USERS)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getTempPath() {
  return process.env.PRINTER_TEMP_PATH;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  const { chatId, text } = parseArgs();
  const authorizedUsers = getAuthorizedUsers();

  if (!chatId || !authorizedUsers.some((id) => String(id) === String(chatId))) {
    exit("❌ You are not authorized to print.\n");
  }
  if (!text) {
    exit('⚠️ Please provide text to print. Example: node run-cli.js "Hello World"\n');
  }

  const tempPath = getTempPath();
  ensureDir(path.dirname(tempPath));

  try {
    await print(text, tempPath);
    process.stdout.write(`🖨️ Sent to printer: "${text}"\n`);
  } catch (err) {
    exit(`❌ Hardware Error: ${err.message}\n`);
  }
}

run();
