/**
 * Seed an admin user into MongoDB.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Override defaults with environment variables:
 *   ADMIN_NAME="John Doe" ADMIN_EMAIL="john@example.com" ADMIN_PASSWORD="secret" npm run seed:admin
 *
 * The script upserts — safe to run multiple times. Re-running with new
 * credentials updates the existing admin user.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

// ── Config ────────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("\n✗ MONGODB_URI is not set. Add it to .env.local and run:\n");
  console.error("  npm run seed:admin\n");
  process.exit(1);
}

// ── User schema (inline — avoids TS/Next.js module resolution) ───────────────

const UserSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true, lowercase: true },
    password:      { type: String, select: false },
    role:          { type: String, enum: ["admin", "editor", "volunteer-coordinator", "content-manager", "visitor"], default: "visitor" },
    image:         String,
    emailVerified: Date,
  },
  { timestamps: true }
);

const User = mongoose.models?.User ?? mongoose.model("User", UserSchema);

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      result[key] = args[i + 1] ?? true;
      i++;
    }
  }
  return result;
}

async function prompt(rl, question, defaultValue) {
  const hint = defaultValue ? ` [${defaultValue}]` : "";
  const answer = await rl.question(`  ${question}${hint}: `);
  return answer.trim() || defaultValue || "";
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const flags = parseArgs();

  // Collect credentials — flags > env vars > interactive prompt
  let name     = flags.name     || process.env.ADMIN_NAME;
  let email    = flags.email    || process.env.ADMIN_EMAIL;
  let password = flags.password || process.env.ADMIN_PASSWORD;

  const needsPrompt = !name || !email || !password;

  let rl;
  if (needsPrompt) {
    console.log("\n── RUACH Global Admin Seed ─────────────────────────────────\n");
    rl = readline.createInterface({ input, output });
  }

  if (!name)     name     = await prompt(rl, "Admin name",     "RUACH Admin");
  if (!email)    email    = await prompt(rl, "Admin email",    "admin@ruachglobal.org");
  if (!password) password = await prompt(rl, "Admin password", "");

  if (rl) rl.close();

  if (!email || !password) {
    console.error("\n✗ Email and password are required.\n");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("\n✗ Password must be at least 8 characters.\n");
    process.exit(1);
  }

  // Connect
  console.log("\n  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("  ✓ Connected");

  // Hash
  const hashed = await bcrypt.hash(password, 12);

  // Upsert
  const result = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { name, email: email.toLowerCase(), password: hashed, role: "admin" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const action = result.createdAt.getTime() === result.updatedAt.getTime() ? "created" : "updated";
  console.log(`  ✓ Admin ${action}: ${result.name} <${result.email}> (role: ${result.role})`);
  console.log("\n  You can now sign in at /admin/login\n");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message, "\n");
  process.exit(1);
});
