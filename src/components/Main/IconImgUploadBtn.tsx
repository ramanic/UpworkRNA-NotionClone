"use client";

import {
  CLOUDINARY_ICON_IMAGE_FOLDER,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/config/cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/Button";
import { Icons } from "../Icons";
import { useState, useTransition } from "react";
import axios, { AxiosError } from "axios";
import { IconImagePayload } from "@/lib/validators/route";
import { toast, toastError } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface IconImageBtnProps {
  id: string;
}
import { useS3Upload } from "next-s3-upload";
const IconImgUploadBtn: React.FC<IconImageBtnProps> = ({ id }) => {
  // eslint-disable-next-line no-unused-vars
  const [_, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let handleFileChange = async (file: File) => {
    let { url } = await uploadToS3(file);
    console.log('File Upload',url);
    await onUpload(url)
  };
  const onUpload = async (url: string) => {
    if (url) {
      try {
        setIsLoading(true);

        const payload: IconImagePayload = {
          id,
          iconImageUrl: url,
        };

        await axios.patch(`/api/images/${id}`, payload);

        startTransition(() => {
          queryClient.invalidateQueries({ queryKey: ["docs"] });
          router.refresh();
          toast({
            title: "Successfully added the icon image",
            variant: "default",
          });
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 422) {
            toastError({
              title: "Invalid payload axios.",
              axiosPayloadDesc: "Please provide iconImageUrl and id",
              error,
            });
            return;
          }
        }

        toastError({ error, title: "Failed upload icon image" });
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
          <Button
            onClick={() => openFileDialog()}
            type="button"
            className="cursor-pointer text-sm md:!opacity-0 group-hover:!opacity-80 transition-opacity duration-200 px-2 gap-2 "
            variant={"ghost"}
            size={"sm"}
            disabled={isLoading}
          >
            <Icons.Camera className="h-4 w-4" />
            <FileInput onChange={handleFileChange} />
            <span>Add Icon</span>
          </Button>
  );
};

export default IconImgUploadBtn;
