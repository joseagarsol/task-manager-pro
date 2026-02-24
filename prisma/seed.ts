import {
  PrismaClient,
  Status,
  Priority,
  Role,
} from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  // 1. Limpiar datos existentes
  await prisma.task.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  // 2. Crear Usuario Admin
  const passwordHash = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@admin.com",
      password: passwordHash,
    },
  });
  console.log("User created:", user.email);

  // 3. Crear Tablero Inicial
  const board = await prisma.board.create({
    data: {
      title: "Proyecto Principal",
    },
  });
  console.log("Board created:", board.title);

  // 4. Hacer al usuario dueño del tablero
  await prisma.boardMember.create({
    data: {
      userId: user.id,
      boardId: board.id,
      role: Role.Owner,
    },
  });

  // 5. Crear Tareas iniciales asociadas al tablero y al autor
  await prisma.task.createMany({
    data: [
      {
        title: "Configurar entorno",
        description: "Instalar dependencias y configurar DB",
        status: Status.Done,
        priority: Priority.High,
        estimatedAt: new Date(),
        columnOrder: 1,
        boardId: board.id,
        authorId: user.id,
        assigneeId: user.id,
      },
      {
        title: "Diseñar UI",
        description: "Crear mockups en Figma",
        status: Status.InProgress,
        priority: Priority.Medium,
        estimatedAt: new Date(),
        columnOrder: 2,
        boardId: board.id,
        authorId: user.id,
      },
      {
        title: "Implementar Autenticación",
        description: "Configurar NextAuth con Prisma",
        status: Status.Backlog,
        priority: Priority.High,
        estimatedAt: new Date(),
        columnOrder: 3,
        boardId: board.id,
        authorId: user.id,
      },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
