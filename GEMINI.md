# Contexto del Proyecto: Task Manager Pro

## Objetivo

Desarrollar una aplicación de gestión de tareas tipo Kanban profesional, escalable y mantenible, utilizando prácticas de Clean Code, TDD y CI/CD.

## Tech Stack

- **Core:** Next.js (16.1.4), React (19.2.3), TypeScript (5.x).
- **Estilos:** Tailwind CSS (4.x), shadcn/ui.
- **Estado/Lógica:** React Hooks, Context API.
- **Drag & Drop:** @dnd-kit/core (6.3.1), @dnd-kit/utilities (3.2.2).
- **Testing:** Vitest (4.0.17), React Testing Library (16.3.2).
- **Calidad:** ESLint (9.x), Prettier (3.8.0), Husky (9.1.7).
- **CI/CD:** GitHub Actions.
- **Validación:** Zod (4.3.6).
- **ORM/BD:** Prisma (7.3.0), PostgreSQL.

## Arquitectura (Feature-Based)

El código se organizará por dominios funcionales dentro de `src/features/`.
Ejemplo:

- `src/features/tasks/`: componentes, hooks, tipos y servicios específicos de tareas.
- `src/features/board/`: lógica del tablero y columnas.

## Reglas de Desarrollo

1.  **TDD (Test Driven Development):** - Escribir test rojo (falla) -> Implementar código mínimo (pasa) -> Refactorizar.
2.  **Commits Semánticos:**
    - `feat:` nuevas características.
    - `fix:` corrección de errores.
    - `refactor:` cambios de código que no alteran la funcionalidad.
    - `test:` añadir o corregir tests.
    - `chore:` tareas de mantenimiento/configuración.
3.  **Clean Code:**
    - Nombres de variables descriptivos en inglés.
    - Funciones pequeñas y de responsabilidad única.
    - Separación estricta entre UI y Lógica (Custom Hooks).

## Flujo de Trabajo

1. Crear rama `feat/nombre-tarea`.
2. Definir test de aceptación.
3. Iterar (Rojo-Verde-Refactor).
4. Push y Pull Request.

## Respuestas

Responde siempre en español independientemente del idioma en el que se haga la pregunta.
