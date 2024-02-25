"use client";

import {
  CLOUDINARY_COVER_IMAGE_FOLDER,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/config/cloudinary";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/Button";
import { Icons } from "../Icons";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast, toastError } from "@/hooks/use-toast";
import { CoverImagePayload } from "@/lib/validators/route";
import { useS3Upload } from "next-s3-upload";

interface CoverImageBtnProps {
  id: string;
}

const CoverImgUploadBtn: React.FC<CoverImageBtnProps> = ({ id }) => {
  // eslint-disable-next-line no-unused-vars
  const [_, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const onUpload = async (url:string) => {
    if (url) {
      try {
        setIsLoading(true);

        const payload: CoverImagePayload = {
          id,
          coverImageUrl: url
        };

        await axios.patch(`/api/images/${id}`, payload);

        startTransition(() => {
          router.refresh();
          toast({
            title: "Successfully added the cover image",
            variant: "default",
          });
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 422) {
            toastError({
              title: "Invalid payload axios.",
              axiosPayloadDesc: "Please provide coverImageUrl and id",
              error,
            });
            return;
          }
        }

        toastError({ error, title: "Failed upload cover image" });
      } finally {
        setIsLoading(false);
      }
    }
  };
  let handleFileChange = async (file: File) => {
    let { url } = await uploadToS3(file);
    console.log('File Upload',url);
    await onUpload(url)
  };


  return (
          <Button
              onClick={() => openFileDialog()}
            type="button"
            className="cursor-pointer text-sm md:!opacity-0 group-hover:!opacity-80 transition-opacity duration-200 px-2 gap-2"
            variant={"ghost"}
            size={"sm"}
            disabled={isLoading}
          >
            <FileInput onChange={handleFileChange} />
            <Icons.Image className="h-4 w-4" />
            <span>Add Cover</span>
          </Button>
        );

};

export default CoverImgUploadBtn;
