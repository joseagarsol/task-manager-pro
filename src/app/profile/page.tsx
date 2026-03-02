import { Separator } from "@/components/ui/separator";
import UploadImage from "@/features/profile/components/UploadImage";
import { auth } from "@/auth";
import ProfileForm from "@/features/profile/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Configuración del Perfil
        </h1>
        <p className="text-muted-foreground">
          Administre su información personal
        </p>
      </div>
      <Separator />
      <div className="grid gap-8">
        {/* Sección Foto de Perfil */}
        <UploadImage initialImage={session?.user?.image} />
        {/* Sección Información Personal */}
        <ProfileForm
          user={{ name: session?.user?.name, email: session?.user?.email }}
        />
      </div>
    </div>
  );
}
