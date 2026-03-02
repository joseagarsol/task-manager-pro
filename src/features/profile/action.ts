"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { ProfileSchema } from "./schemas";

interface UploadImageResponse {
  success: boolean;
  error?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  error?: string;
}

const utapi = new UTApi();

export async function uploadImage(
  imageUrl: string,
): Promise<UploadImageResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (user?.image) {
    const fileKey = user.image.split("/f/").pop();
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    revalidatePath("/profile");
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error al actualizar el perfil",
    };
  }
}

export async function deleteImage(
  imageUrl: string,
): Promise<UploadImageResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  if (session.user.image && session.user.image === imageUrl) {
    const fileKey = session.user.image.split("/f/").pop();

    if (!fileKey) {
      return {
        success: false,
        error: "No se pudo obtener la clave de la imagen",
      };
    }

    try {
      await utapi.deleteFiles(fileKey);

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: null,
        },
      });

      revalidatePath("/profile");
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Error al eliminar la imagen",
      };
    }
  }

  return {
    success: false,
    error: "La imagen no coincide con la del usuario",
  };
}

export async function updateProfile(
  data: ProfileSchema,
): Promise<UpdateProfileResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/profile");
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error al actualizar el perfil",
    };
  }
}
