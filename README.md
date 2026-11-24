# Sílaba · silaba.io

Espacio propio para docentes y educadores: **reúne** tus recursos, **desarrolla** tus líneas temáticas y notas, y **comparte** tus cursos por semana con un enlace o un código QR. Los estudiantes entran sin cuenta.

**Para ponerlo en línea, sigue [DEPLOY.md](./DEPLOY.md).**

## Tecnología

- **Next.js 16** (App Router, Server Actions) + **Tailwind CSS 4**
- **Supabase**: Postgres con reglas de seguridad por fila, inicio de sesión (enlace por correo, Google, Microsoft) y Storage
- **OpenAlex** para completar fichas de artículos por DOI
- Códigos QR generados en el servidor (`qrcode`)
- Tipografías incluidas en el proyecto: Source Serif 4 (títulos) e Inter (texto)

## Estructura

```
src/app/
  page.tsx                  Landing
  entrar/                   Crear cuenta / entrar
  auth/callback, auth/salir Inicio y cierre de sesión
  [handle]/                 Perfil público  → silaba.io/nombre
  [handle]/[curso]/         Curso para estudiantes (por semanas)
  api/qr/                   Descarga del QR en PNG
  panel/                    Panel del docente
    temas/                  Recursos y líneas temáticas (+ notas)
    cursos/                 Cursos y editor por semanas
    perfil/                 Editar perfil, foto y portada
    portafolio/             Portafolio académico imprimible (Pro)
    actions.ts              Todas las acciones del panel
src/components/             Marca, tarjetas de recursos, formularios
src/lib/                    Supabase, tipos, utilidades (DOI, video, QR)
supabase/schema.sql         Base de datos, seguridad y almacenamiento
DESIGN.md                   Sistema de diseño (azul marino + oro)
```

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # compilación de producción
npm run lint
```
