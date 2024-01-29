import { createUntitled } from "@/actions/createUntitled";
import { auth } from "@clerk/nextjs/app-beta";
import { NextResponse } from "next/server";
import {cookies} from "next/headers";
import {getUser} from "@/actions/getUser";

export async function POST() {
  try {
    const cookieStore = cookies()
     const user = await getUser(cookieStore.get("accessToken")?.value);
  const userId = user?.id;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await createUntitled(userId);

    return NextResponse.json(id, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "Something went wrong when create untiled document",
      },
      { status: 500 }
    );
  }
}
