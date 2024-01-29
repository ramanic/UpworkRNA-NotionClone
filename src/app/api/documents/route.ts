import { prisma } from "@/lib/db";
import { DocumentType } from "@/types/db";
import { auth } from "@clerk/nextjs/app-beta";
import { NextResponse } from "next/server";
import {cookies} from "next/headers";
import {getUser} from "@/actions/getUser";

export async function GET() {
  try {
    const cookieStore = cookies()
     const user = await getUser(cookieStore.get("accessToken")?.value);
    const userId = user?.id;
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const docs: DocumentType[] = await prisma.document.findMany({
      where: { ownerId: userId },
      select: {
        title: true,
        id: true,
        iconImage: true,
      },
    });

    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Could not fetch documents" },
      { status: 500 }
    );
  }
}
