import VRChatService from "@/server/services/vrchat";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const result = await VRChatService.getFriend(
    "usr_d20d390d-a41c-4129-87a7-a84984550ba7"
  );
  return NextResponse.json(result);
}
