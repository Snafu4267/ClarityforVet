import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function assertLocalSqliteOnly() {
  let rows;
  try {
    rows = await prisma.$queryRawUnsafe("PRAGMA database_list;");
  } catch {
    throw new Error("Safety stop: this setup script is allowed only for local SQLite dev DB.");
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Safety stop: could not verify local SQLite DB.");
  }
  const mainRow = rows.find((row) => row && typeof row === "object" && row.name === "main");
  const filePath = typeof mainRow?.file === "string" ? mainRow.file.toLowerCase() : "";
  if (!filePath || (!filePath.includes("dev.db") && !filePath.includes("sqlite"))) {
    throw new Error(`Safety stop: expected local dev SQLite DB, got "${mainRow?.file ?? "unknown"}".`);
  }
}

async function upsertUser({ email, name, subscriptionStatus, isAdmin, createdAt, passwordHash }) {
  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      subscriptionStatus,
      isAdmin,
      ...(createdAt ? { createdAt } : {}),
    },
    create: {
      email,
      name,
      passwordHash,
      subscriptionStatus,
      isAdmin,
      ...(createdAt ? { createdAt } : {}),
    },
  });
}

async function main() {
  await assertLocalSqliteOnly();

  const password = process.env.MANUAL_CHECKS_PASSWORD?.trim() || "TestPass123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await upsertUser({
    email: "restricted.test@local.dev",
    name: "Restricted Test",
    subscriptionStatus: "none",
    isAdmin: false,
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    passwordHash,
  });

  await upsertUser({
    email: "full.test@local.dev",
    name: "Full Access Test",
    subscriptionStatus: "active",
    isAdmin: false,
    passwordHash,
  });

  await upsertUser({
    email: "admin.test@local.dev",
    name: "Admin Test",
    subscriptionStatus: "active",
    isAdmin: true,
    passwordHash,
  });

  console.log("Manual-check users are ready.");
  console.log("Emails: restricted.test@local.dev, full.test@local.dev, admin.test@local.dev");
  console.log("Password: (set by MANUAL_CHECKS_PASSWORD or defaults to TestPass123!)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
