import PreventBubblingClient from "@/components/PreventBubblingClient";
import Nav from "@/components/Home/Nav";
import { buttonVariants } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/app-beta";
import { getInitialDoc } from "@/actions/getInitialDoc";
import { createUntitled } from "@/actions/createUntitled";
import {cookies} from "next/headers";
import {getUser} from "@/actions/getUser";

export default async function Home() {
  const cookieStore = cookies()


  const user = await getUser(cookieStore.get("accessToken")?.value);
  const userId = user?.id;
  if (userId) {
    const document = await getInitialDoc(userId);

    // find first document to redirect if already logged in
    if (document) {
      return redirect(`/${document.id}`);
    } else {
      //   if there is no doc yet make one then redirect
      const { id } = await createUntitled(userId);

      return redirect(`/${id}`);
    }
  }

  return redirect(process.env.NEXT_PUBLIC_CHAT_URL+`/auth/sign-in`);
}
