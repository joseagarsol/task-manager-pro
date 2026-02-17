import LoginForm from "@/features/auth/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inicio de sesión</CardTitle>
          <CardDescription>
            Ingrese su correo electrónico para iniciar sesión en su cuenta
          </CardDescription>
          <CardAction>
            <Button variant="link">Crear cuenta</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
