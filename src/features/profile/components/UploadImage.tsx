"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { useUploadImage } from "../hooks/useUploadImage";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface UploadImageProps {
  initialImage?: string | null;
}

export default function UploadImage({ initialImage }: UploadImageProps) {
  const {
    image,
    error,
    handleFileChange,
    handleDeleteImage,
    isUploading,
    uploadProgress,
    isDeleting,
  } = useUploadImage(initialImage);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de perfil</CardTitle>
        <CardDescription>
          Esta imagen será visible para otros miembros del equipo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="rounded-full aspect-square bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/20 relative">
            {image ? (
              <Image
                src={image}
                alt="Profile"
                width={128}
                height={128}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isUploading && "opacity-40 grayscale-[50%]",
                )}
              />
            ) : (
              <User
                className={cn(
                  "w-16 h-16 text-muted-foreground/50",
                  isUploading && "opacity-20",
                )}
              />
            )}

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
          </div>
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "absolute inset-0 bg-black/40 rounded-full opacity-0 transition-opacity flex items-center justify-center cursor-pointer",
              !isUploading && "group-hover:opacity-100",
            )}
          >
            <Camera className="text-white w-8 h-8" />
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={async (e) => {
              await handleFileChange(e);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              disabled={isUploading || isDeleting}
            >
              <Camera className="mr-2 h-4 w-4" />
              Cambiar foto
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDeleteImage()}
              disabled={isUploading || isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Eliminar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, GIF o PNG. Tamaño máximo de 2MB.
          </p>
          {isUploading && (
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <p className="text-xs text-center text-muted-foreground italic">
                {uploadProgress < 100
                  ? `Subiendo... ${uploadProgress}%`
                  : "Casi listo, procesando..."}
              </p>
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
