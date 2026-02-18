import {
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <CardHeader>
        <CardTitle>Registro de usuarios</CardTitle>
        <CardAction>
          <Button asChild variant="link">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </>
  );
}
