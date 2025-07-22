// /app/api/messages/route.ts

import { getMessages } from "@/app/actions/chat-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { chatID, startFrom } = await req.json();

    if (!chatID) {
        return NextResponse.json({ error: "chatID is required" }, { status: 400 });
    }

    const result = await getMessages(chatID, startFrom || null);

    return NextResponse.json(result);
}
