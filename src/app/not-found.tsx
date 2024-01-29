import Link from "next/link";

import { buttonVariants } from "@/components/ui/Button";
import { redirect } from "next/navigation";
import { getInitialDoc } from "@/actions/getInitialDoc";
import {cookies} from "next/headers";
import {getUser} from "@/actions/getUser";

const Page: React.FC = async () => {
    const cookieStore = cookies()
    const user = await getUser(cookieStore.get("accessToken")?.value);
    const userId = user?.id;

  if (!userId) {
    return redirect(`/$sign-in`);
  }

  const document = await getInitialDoc(userId);

  return (
    <div className="flex justify-center items-center w-full h-screen flex-col gap-5">
      <span className="text-7xl">404</span>
      <span>This content does not exist</span>
      <Link
        className={buttonVariants({ variant: "default" })}
        href={document?.id ? `/${document.id}` : "/"}
      >
        Back to my content
      </Link>
    </div>
  );
};

export default Page;
