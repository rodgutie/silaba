# Cómo poner Sílaba en línea (silaba.io)

Guía paso a paso. Hazla en orden: cada paso usa algo del anterior.
Tiempo estimado: una tarde para los pasos 1–6; los inicios de sesión con Google y Microsoft pueden quedar para otro día.

---

## 0. Cuentas que vas a necesitar

| Herramienta | Para qué | Costo para empezar |
|---|---|---|
| **GitHub** | Guardar el código | Gratis |
| **Supabase** | Base de datos, cuentas de usuario y archivos | Plan gratis |
| **Vercel** | Publicar el sitio | Hobby gratis para pruebas; **Pro cuando empieces a cobrar** (ver nota) |
| **Registrador de dominios** (Cloudflare, Porkbun o Namecheap) | Comprar `silaba.io` | Pago anual |
| **Resend** (o Brevo) | Enviar los correos de acceso | Plan gratis |
| **OpenAlex** | Completar fichas de artículos por DOI | Gratis (clave con cuota diaria) |
| **Google Cloud** y **Microsoft Entra** | Botones "Continuar con Google / Microsoft" | Gratis |

> **Nota sobre Vercel:** el plan Hobby es para uso personal y no comercial. Puedes construir y probar ahí, pero cuando cobres el plan Pro de Sílaba, pasa tu cuenta de Vercel a Pro.

---

## 1. Probar en tu computadora

Necesitas Node.js 20 o superior.

```bash
unzip silaba.zip && cd silaba
npm install
cp .env.example .env.local      # luego completa los valores (paso 2)
npm run dev                     # abre http://localhost:3000
```

---

## 2. Supabase (base de datos y cuentas)

1. Entra a **supabase.com** → **New project**. Nombre: `silaba`. Región: **East US (North Virginia)**, la misma zona donde Vercel ejecuta el sitio por defecto. Guarda la contraseña de la base de datos.
2. Ve a **SQL Editor → New query**, pega todo el contenido de `supabase/schema.sql` y presiona **Run**. Esto crea las tablas, las reglas de seguridad y los espacios para archivos.
3. Ve a **Project Settings → API** (o **API Keys**) y copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ⚠️ Nunca uses la clave `service_role` / `secret` en el sitio.
4. Ve a **Authentication → URL Configuration**:
   - **Site URL:** `https://silaba.io`
   - **Redirect URLs** (agrega las tres):
     - `http://localhost:3000/**`
     - `https://silaba.io/**`
     - `https://*.vercel.app/**`
5. Pon los valores en tu `.env.local`, reinicia `npm run dev` y prueba crear una cuenta con tu correo.
   (Mientras no hagas el paso 6, Supabase solo envía correos a los miembros de tu proyecto y muy pocos por hora.)

---

## 3. GitHub (guardar el código)

1. En **github.com** → **New repository** → nombre `silaba` → **Private** → Create (sin README).
2. En la carpeta del proyecto:

```bash
git init            # si no existe ya
git add -A
git commit -m "Sílaba: primera versión"
git branch -M main
git remote add origin https://github.com/rodgutie/silaba.git
git push -u origin main
```

---

## 4. Vercel (publicar)

1. En **vercel.com** → **Add New → Project** → importa el repositorio `silaba`.
2. Framework: Next.js (lo detecta solo). En **Environment Variables** agrega:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | la Project URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la anon / publishable key |
| `NEXT_PUBLIC_SITE_URL` | `https://silaba.io` (mientras no tengas dominio, la dirección `.vercel.app` que te dé Vercel) |
| `OPENALEX_API_KEY` | tu clave de OpenAlex (paso 7) |

3. **Deploy.** En un par de minutos tendrás una dirección `https://silaba-xxxx.vercel.app`.
4. Desde ahora, cada `git push` a `main` publica una nueva versión automáticamente.

---

## 5. Dominio silaba.io

1. Compra `silaba.io` en tu registrador.
2. En Vercel → tu proyecto → **Settings → Domains** → agrega `silaba.io` y `www.silaba.io`.
3. Vercel te muestra los registros DNS exactos (normalmente un registro **A** para `silaba.io` y un **CNAME** para `www`). Créalos en el panel DNS de tu registrador.
4. Espera a que Vercel marque el dominio como **Valid** (de minutos a unas horas). El certificado HTTPS es automático.
5. Cambia `NEXT_PUBLIC_SITE_URL` a `https://silaba.io` en Vercel y vuelve a desplegar (**Deployments → Redeploy**). Los códigos QR usan esta dirección.

---

## 6. Correos de acceso (obligatorio antes de abrir a docentes)

El servidor de correo incluido en Supabase es solo para pruebas. Configura uno propio:

1. Crea una cuenta en **resend.com** → **Domains → Add domain** → `silaba.io` → agrega en tu DNS los registros que te indique y espera la verificación.
2. En Resend crea una **API key** y usa sus datos SMTP (host `smtp.resend.com`, puerto `465`, usuario `resend`, contraseña = la API key).
3. En Supabase → **Authentication → Emails → SMTP Settings** → activa **Custom SMTP**:
   - Sender email: `hola@silaba.io` · Sender name: `Sílaba`
   - Host, puerto, usuario y contraseña del punto anterior.
4. En **Authentication → Rate Limits** sube el límite de correos por hora según lo que esperes (por ejemplo, para una presentación con muchos docentes).
5. Si tu proveedor tiene "seguimiento de enlaces" (link tracking), desactívalo: rompe los enlaces de acceso.
6. Opcional: en **Authentication → Emails → Templates** traduce el correo de "Magic Link" al español.

---

## 7. OpenAlex (fichas automáticas por DOI)

1. Crea una cuenta en **openalex.org** → **Settings → API** → copia tu clave.
2. Ponla en `OPENALEX_API_KEY` (en `.env.local` y en Vercel). La clave gratuita incluye una cuota diaria; consultar un DOI cuesta muy poco de esa cuota.

---

## 8. "Continuar con Google"

1. **console.cloud.google.com** → crea un proyecto `Sílaba`.
2. **APIs & Services → OAuth consent screen**: tipo *External*, nombre de la app, correo de soporte, dominio `silaba.io`. Publica la app cuando esté lista.
3. **Credentials → Create credentials → OAuth client ID** → tipo *Web application*.
   - **Authorized redirect URI:** `https://TU-PROYECTO.supabase.co/auth/v1/callback`
4. Copia **Client ID** y **Client secret** → Supabase → **Authentication → Sign In / Providers → Google** → actívalo y pégalos.

## 9. "Continuar con Microsoft" (correos institucionales y Outlook)

1. **portal.azure.com** → **Microsoft Entra ID → App registrations → New registration**.
   - Supported account types: *Accounts in any organizational directory and personal Microsoft accounts*.
   - Redirect URI (Web): `https://TU-PROYECTO.supabase.co/auth/v1/callback`
2. **Certificates & secrets → New client secret** → copia el *Value*.
3. Supabase → **Providers → Azure** → actívalo: Client ID (*Application ID*), Secret, y **Azure Tenant URL** `https://login.microsoftonline.com/common`.
4. Si al entrar aparece un error de correo, en la app de Azure ve a **Token configuration → Add optional claim → ID → email**.

> Algunas universidades bloquean apps externas en sus cuentas Microsoft. Si un docente no puede entrar así, siempre puede usar el enlace por correo.

---

## 10. Planes Gratis y Pro

- **Gratis:** perfil, 1 curso, líneas temáticas, enlaces, DOI, videos y código QR.
- **Pro:** cursos ilimitados, documentos propios, copiar curso al siguiente ciclo, portafolio en PDF.
- La base de datos ya aplica estos límites (el plan Gratis no puede crear un segundo curso ni subir documentos).

**Mientras no haya pagos automáticos**, activa Pro a mano: Supabase → **Table Editor → profiles** → busca al docente → columna `plan` → `pro`. Un usuario no puede cambiarse el plan a sí mismo.

**Cobros (siguiente etapa):** Stripe no abre cuentas de pago para negocios en Costa Rica. Una opción es **Polar** (polar.sh), que vende como *merchant of record* y paga a Costa Rica. El flujo sería: botón "Empezar con Pro" → checkout de Polar → un webhook en Sílaba cambia `plan` a `pro`. Esto aún no está construido.

---

## 11. Lista de verificación antes de invitar docentes

- [ ] Crear tu cuenta y tu perfil en `silaba.io` (correo, Google y Microsoft).
- [ ] Crear una línea temática y guardar un enlace, un DOI y un video de YouTube.
- [ ] Crear un curso, agregar materiales a 2 semanas y **publicarlo**.
- [ ] Abrir el curso desde el celular sin sesión y escanear el código QR.
- [ ] Ponerte `plan = pro` y probar subir un PDF propio y el portafolio.
- [ ] Revisar los **Términos** (`/terminos`) con un abogado de propiedad intelectual: ahora son un borrador.

---

## 12. Lo que todavía falta (siguientes versiones)

- Cobro automático del plan Pro (Polar u otro proveedor).
- Detección de artículos publicados al subir un PDF (por ahora el docente declara la autoría).
- Estadísticas de lectura por curso.
- Guardar desde el celular por WhatsApp o correo, e integración con Google Drive.
- Panel de administración propio (por ahora se administra desde Supabase).
- Versión en portugués.

## Cómo seguir desarrollando

Abre la carpeta en **Claude Code**: `DESIGN.md` describe colores, tipografía y componentes, y `supabase/schema.sql` el modelo de datos. Al correr `npm run dev`, Next.js crea un archivo `AGENTS.md` con notas para asistentes de código; puedes guardarlo en el repositorio.
