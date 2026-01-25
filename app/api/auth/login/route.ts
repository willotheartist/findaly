import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  COOKIE_NAME,
  createSession,
  getSessionCookieOptions,
} from "@/lib/auth/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const remember = Boolean(body.remember ?? true);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "PASSWORD_REQUIRED" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const { token, expiresAt } = await createSession(user.id, remember);

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(COOKIE_NAME, token, getSessionCookieOptions(expiresAt));
  return res;
}
