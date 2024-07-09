import VRChatService from "@/server/services/vrchat";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const result = await VRChatService.loginWithTotp();
  return NextResponse.json(result);
}
