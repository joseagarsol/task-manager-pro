import { useState } from "react";
import { imageSchema } from "../schemas";
import { useUploadThing } from "@/lib/uploadthing";
import { deleteImage, uploadImage } from "../action";
import { useSession } from "next-auth/react";

export function useUploadImage(initialImage?: string | null) {
  const { update } = useSession();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const { startUpload, isUploading } = useUploadThing("profilePicture", {
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: async (res) => {
      const url = res[0].ufsUrl;
      const result = await uploadImage(url);
      if (result.success) {
        update({ image: url });
        setImage(url);
      } else {
        setError(result.error || "Error al actualizar el usuario");
      }
      setUploadProgress(0);
    },
    onUploadError: (error) => {
      console.error(error);
      setError("Error al subir la imagen");
      setImage(initialImage || null);
      setUploadProgress(0);
    },
  });
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validation = imageSchema.safeParse({ image: file });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message;
      setError(firstError || "Error al subir la imagen");
      return;
    }

    const previousImage = image;
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);

    const res = await startUpload([file]);

    if (!res) {
      setImage(previousImage);
    }
  };

  const handleDeleteImage = async () => {
    if (!image) return;

    setIsDeleting(true);
    setError(null);

    const result = await deleteImage(image);
    if (result.success) {
      await update({ image: null });
      setImage(null);
    } else {
      setError(result.error || "Error al eliminar la imagen");
    }
    setIsDeleting(false);
  };

  return {
    image,
    error,
    handleFileChange,
    isUploading,
    handleDeleteImage,
    uploadProgress,
    isDeleting,
  };
}
