import { NextRequest, NextResponse } from "next/server";
import { validateReturnTo } from "lib/auth/oauth";
import { revokePersistentSessionOnResponse } from "lib/auth/session-store";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_ACCOUNT_URL ?? request.nextUrl.origin;
  const returnTo = validateReturnTo(
    request.nextUrl.searchParams.get("return_to"),
  );
  const url = new URL(returnTo ?? "/signin", baseUrl);
  const response = NextResponse.redirect(url);

  await revokePersistentSessionOnResponse(response);

  return response;
}
