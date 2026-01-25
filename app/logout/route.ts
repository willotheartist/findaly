// app/logout/route.ts
import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/", req.url));
}
