import { auth } from "@clerk/nextjs/app-beta";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { TitleUpdateValidator } from "@/lib/validators/Documents";

import { Context, routeContextSchema } from "@/lib/validators/route";
import { getIsOwner } from "@/actions/getIsOwner";
import {cookies} from "next/headers";
import {getUser} from "@/actions/getUser";

export async function PATCH(req: Request, context: Context) {
  try {
    const cookieStore = cookies()
     const user = await getUser(cookieStore.get("accessToken")?.value);
  const userId = user?.id;


    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Validate the route params.
    const {
      params: { documentId },
    } = routeContextSchema.parse(context);

    const isOwner = await getIsOwner(documentId, userId);

    if (!isOwner) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { title, id } = TitleUpdateValidator.parse(body);

    await prisma.document.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json("Edited", { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return NextResponse.json(
      {
        message: error.message || "Something went wrong when update title",
      },
      { status: 500 }
    );
  }
}
