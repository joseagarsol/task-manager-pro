"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { profileSchema, type ProfileSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { updateProfile } from "../action";
import { useSession } from "next-auth/react";

interface ProfileFormProps {
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { update } = useSession();
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  async function onSubmit(data: ProfileSchema) {
    const response = await updateProfile(data);
    if (response.error) {
      form.setError("root.serverError", {
        type: "server",
        message: response.error,
      });
      return;
    }

    await update({ name: data.name });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>
          Actualice sus datos de contacto y nombre de usuario.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Nombre"
                    autoComplete="off"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Correo electrónico
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Correo electrónico"
                    autoComplete="off"
                    disabled
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="flex justify-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Guardar cambios
              </Button>
            </div>
            {form.formState.errors.root?.serverError && (
              <FieldError errors={[form.formState.errors.root.serverError]} />
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
