# Contexto del Proyecto: Task Manager Pro

## Objetivo

Desarrollar una aplicación de gestión de tareas tipo Kanban profesional, escalable y mantenible, utilizando prácticas de Clean Code, TDD y CI/CD.

## Tech Stack

- **Core:** Next.js (App Router), TypeScript.
- **Estilos:** Tailwind CSS, shadcn/ui.
- **Estado/Lógica:** React Hooks, Context API (si es necesario).
- **Drag & Drop:** @dnd-kit/core, @dnd-kit/sortable.
- **Testing:** Vitest, React Testing Library.
- **Calidad:** ESLint, Prettier, Husky.
- **CI/CD:** GitHub Actions.

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
