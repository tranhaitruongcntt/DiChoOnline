#!/usr/bin/env node
// Tạo / đặt lại mật khẩu tài khoản quản trị.
// Cách dùng:  npm run create-admin -- <tên_đăng_nhập>    (mật khẩu sẽ được hỏi, không lưu vào lịch sử shell)
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const username = (process.argv[2] || "").trim();
if (!/^[a-zA-Z0-9_.-]{3,50}$/.test(username)) {
  console.error("Cách dùng: npm run create-admin -- <tên_đăng_nhập>  (3–50 ký tự a-z, 0-9, _ . -)");
  process.exit(1);
}

async function askPassword(q) {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  rl._writeToOutput = (s) => { if (s.includes(q)) process.stdout.write(s); };
  const answer = await new Promise((r) => rl.question(q, r));
  rl.close();
  process.stdout.write("\n");
  return answer;
}

const password = await askPassword("Mật khẩu (tối thiểu 12 ký tự): ");
if (password.length < 12) { console.error("Mật khẩu phải có ít nhất 12 ký tự."); process.exit(1); }
const confirm = process.env.ADMIN_PASSWORD ? password : await askPassword("Nhập lại mật khẩu: ");
if (confirm !== password) { console.error("Mật khẩu không khớp."); process.exit(1); }

// Cùng tham số với lib/password.ts
const N = 2 ** 15, R = 8, P = 1;
const salt = randomBytes(16);
const hash = scryptSync(password.normalize("NFKC"), salt, 64, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 });
const stored = `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;

const file = path.resolve(process.env.DATABASE_PATH || "./data/dicho.db");
fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new DatabaseSync(file);
db.exec(fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"));
db.prepare(
  `INSERT INTO admins (username, password_hash) VALUES (?, ?)
   ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash`,
).run(username, stored);
// Đăng xuất mọi phiên cũ của tài khoản này
db.prepare("DELETE FROM sessions WHERE admin_id = (SELECT id FROM admins WHERE username = ?)").run(username);
console.log(`Đã lưu tài khoản quản trị "${username}".`);
