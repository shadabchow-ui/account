import { NextResponse } from "next/server";
import { getUserForSessionRequest } from "lib/auth/session-store";

export async function GET() {
  const user = await getUserForSessionRequest();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar_url,
    },
  });
}
