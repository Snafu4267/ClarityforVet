const baseUrl = process.env.MANUAL_CHECKS_BASE_URL?.trim() || "http://localhost:3000";

class SessionClient {
  constructor() {
    this.cookies = new Map();
  }

  readCookieHeader() {
    if (this.cookies.size === 0) return "";
    return [...this.cookies.entries()]
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  saveCookies(response) {
    const setCookie = response.headers.getSetCookie?.() ?? [];
    for (const raw of setCookie) {
      const firstPart = raw.split(";")[0];
      const split = firstPart.indexOf("=");
      if (split <= 0) continue;
      const name = firstPart.slice(0, split).trim();
      const value = firstPart.slice(split + 1).trim();
      this.cookies.set(name, value);
    }
  }

  async fetch(path, options = {}) {
    const headers = new Headers(options.headers ?? {});
    const cookie = this.readCookieHeader();
    if (cookie) headers.set("cookie", cookie);
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      redirect: "manual",
    });
    this.saveCookies(response);
    return response;
  }
}

async function login(email, password) {
  const client = new SessionClient();

  const csrfRes = await client.fetch("/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const csrfToken = typeof csrfData?.csrfToken === "string" ? csrfData.csrfToken : "";
  if (!csrfToken) throw new Error("Could not load CSRF token from /api/auth/csrf.");

  const form = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${baseUrl}/`,
  });

  await client.fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  return client;
}

async function status(path, { method = "GET", body, session } = {}) {
  const client = session ?? new SessionClient();
  const headers = new Headers();
  let requestBody = undefined;
  if (body !== undefined) {
    headers.set("content-type", "application/json");
    requestBody = JSON.stringify(body);
  }
  const response = await client.fetch(path, { method, headers, body: requestBody });
  return response.status;
}

async function noActiveSession(session) {
  const response = await session.fetch("/api/auth/session");
  const data = await response.json();
  return !data?.user?.id;
}

function printResult(ok, label, detail) {
  const marker = ok ? "PASS" : "FAIL";
  console.log(`[${marker}] ${label} (${detail})`);
}

async function main() {
  const testPassword = process.env.MANUAL_CHECKS_PASSWORD?.trim() || "TestPass123!";
  const results = [];

  const badRegisterStatus = await status("/api/register", {
    method: "POST",
    body: { email: "bad-email", password: testPassword, name: "Invalid Email" },
  });
  results.push({
    label: "bad email rejected on /register",
    ok: badRegisterStatus === 400,
    detail: `status ${badRegisterStatus}`,
  });

  const badPasswordLogin = await login("full.test@local.dev", "WrongPass123!");
  const badPasswordBlocked = await noActiveSession(badPasswordLogin);
  results.push({
    label: "bad password shows error on /login",
    ok: badPasswordBlocked,
    detail: badPasswordBlocked ? "session not created" : "session unexpectedly created",
  });

  const restrictedSession = await login("restricted.test@local.dev", testPassword);
  const restrictedJournalStatus = await status("/api/journal", { session: restrictedSession });
  results.push({
    label: "restricted account gets 403 on /api/journal",
    ok: restrictedJournalStatus === 403,
    detail: `status ${restrictedJournalStatus}`,
  });

  const fullSession = await login("full.test@local.dev", testPassword);
  const fullJournalStatus = await status("/api/journal", { session: fullSession });
  results.push({
    label: "full-access account gets 200 on /api/journal",
    ok: fullJournalStatus === 200,
    detail: `status ${fullJournalStatus}`,
  });

  const adminSession = await login("admin.test@local.dev", testPassword);
  const adminFeedbackStatus = await status("/admin/feedback", { session: adminSession });
  results.push({
    label: "admin account can load /admin/feedback",
    ok: adminFeedbackStatus === 200,
    detail: `status ${adminFeedbackStatus}`,
  });

  let failed = 0;
  for (const result of results) {
    printResult(result.ok, result.label, result.detail);
    if (!result.ok) failed += 1;
  }

  console.log(`\nSummary: ${results.length - failed}/${results.length} checks passed.`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
