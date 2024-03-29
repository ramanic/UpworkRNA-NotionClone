import { findDoc } from "@/actions/findDoc";
import Header from "@/components/Header";
import CoverImgUploadBtn from "@/components/Main/CoverImgUploadBtn";
import CoverImage from "@/components/Main/coverImage";
import IconImgUploadBtn from "@/components/Main/IconImgUploadBtn";
import { cn, isValidObjectID } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import IconImage from "@/components/Main/IconImage";
import Editor from "@/components/Editor/editor";
import { getIsOwner } from "@/actions/getIsOwner";
import { auth } from "@clerk/nextjs";
import Forbidden from "@/components/Main/Forbidden";
import Title from "@/components/Main/Title";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cookies } from 'next/headers'
import {getUser} from "@/actions/getUser";
interface ParamsProps {
  params: { documentId: string };
}

const Page: React.FC<ParamsProps> = async ({ params: { documentId } }) => {
  const validObjectID = isValidObjectID(documentId);

  if (!validObjectID) return notFound();

  const doc = await findDoc(documentId);

  if (!doc) return notFound();
  const cookieStore = cookies()
   const user = await getUser(cookieStore.get("accessToken")?.value);
  const userId = user?.id;

  if (!userId) {
    return redirect(`/$sign-in`);
  }

  const isOwner = await getIsOwner(documentId, userId);

  if (!isOwner) {
    return <Forbidden />;
  }

  const { title, coverImage, iconImage, editorJson } = doc;

  return (
    <>
      <Header doc={doc} />

      <ScrollArea className="h-[calc(100vh_-_48px)]" type="always">
        <main className="flex flex-col h-[inherit]">
          {coverImage && <CoverImage coverImage={coverImage} id={documentId} />}

          <section className="flex flex-col flex-1 w-full">
            <div
              className={cn(
                "group flex flex-col shrink-0 px-10 md:px-24 w-full max-w-[900px] mx-auto relative",
                iconImage && coverImage && "pt-[70px]",
                !iconImage && coverImage && "pt-[25px]",
                iconImage && !coverImage && "pt-16",
                !iconImage && !coverImage && "pt-10"
              )}
            >
              {iconImage && (
                <IconImage
                  id={documentId}
                  isCoverImage={!!coverImage}
                  iconImage={iconImage}
                />
              )}

              {!(iconImage && coverImage) && (
                <div className="h-6 inline-flex gap-2 mt-5">
                  {!iconImage && <IconImgUploadBtn id={documentId} />}
                  {!coverImage && <CoverImgUploadBtn id={documentId} />}
                </div>
              )}

              <Title currentTitle={title} id={documentId} />
            </div>

            <Editor id={documentId} editorJson={editorJson} />
          </section>
        </main>
      </ScrollArea>
    </>
  );
};

export default Page;

export async function generateMetadata(
  { params: { documentId } }: ParamsProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];

  const validObjectID = isValidObjectID(documentId);

  if (!validObjectID)
    return {
      title: "Not Found",
      openGraph: {
        images: [...previousImages],
      },
      icons: {
        icon: [
          {
            type: "image/x-icon",
            sizes: "any",
            url: "/favicon.ico",
          },
        ],
      },
    };

  // fetch data
  const document = await findDoc(documentId);

  const cookieStore = cookies()
   const user = await getUser(cookieStore.get("accessToken")?.value);
  const userId = user?.id;

  if (!userId) {
    return redirect(`/$sign-in`);
  }

  const isOwner = await getIsOwner(documentId, userId);

  // optionally access and extend (rather than replace) parent metadata


  return {
    title: !document
      ? "Not Found"
      : !isOwner
      ? "Forbidden"
      : document.title || "Untitled",
    openGraph: {
      images: [...previousImages],
    },
    icons: {
      icon: [
        {
          type: "image/x-icon",
          sizes: "any",
          // @ts-ignore
          url: !isOwner? "/favicon.ico" : document?.iconImage?.url ?? "/favicon.ico",
        },
      ],
    },
  };
}
