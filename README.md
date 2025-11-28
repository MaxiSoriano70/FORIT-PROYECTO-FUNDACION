# Backend (Node + TypeScript)

Este README describe cómo configurar, ejecutar y desarrollar el backend del proyecto ForIT Fundacion.

- Lenguaje: TypeScript
- Entorno runtime: Node.js (recomendado 18 o superior; la imagen Docker usa node:22-slim)
- Base de datos: MongoDB (uri configurable)

---

## Estructura básica

```
apps/backend/
  .env                # variables de entorno (no incluir en VCS)
  package.json
  tsconfig.json
  src/
    index.ts
    controllers/
    data/mongo/
    helpers/
    middlewares/
    routers/
    service/
```

---

## Requisitos

- Node >= 18 (o Node 22 si usas imagen docker base)
- npm o yarn
- Docker & Docker Compose (opcional)
- MongoDB (puede ser servicio local, Atlas o en docker-compose)

---

## Variables de entorno

Crea un archivo `.env` dentro de `apps/backend/` (no lo agregues al control de versiones). Ejemplo de `.env`:

```
PORT=3000
MONGO_DB=mongodb://localhost:27017/foritfundacion
FRONTEND_URL=http://localhost:4200
EMAIL_USER=tu_email@dominio.com
EMAIL_PASS=secreto
```

- `PORT`: puerto en el que corre el servidor (en desarrollo por defecto 3000). En producción con Docker suele mapearse a 8080.
- `MONGO_DB`: URI para MongoDB.
- `FRONTEND_URL`: URL del frontend para permitir CORS.
- `EMAIL_USER` / `EMAIL_PASS`: credenciales SMTP si tu app manda correos.

---

## Comandos principales (local)

Desde la raíz del repo o desde `apps/backend/`:

Instalar dependencias:

```bash
npm ci --prefix apps/backend
# o
cd apps/backend && npm ci
```

Desarrollo con recarga (recomendado):

```bash
npm run dev --prefix apps/backend
# o dentro de apps/backend
npm run dev
```

Construir (preparar `dist`):

```bash
npm run build --prefix apps/backend
# o
npm run build
```

Ejecutar compilado (producción local):

```bash
npm start --prefix apps/backend
# o dentro de apps/backend
npm start
```

Ejecutar tests (Vitest):

```bash
npm test --prefix apps/backend
# o dentro de apps/backend
npm test
```

---

## Ejecutar con Docker Compose (recomendado para desarrollo/infra)

Desde la raíz del repo (asegurate que `docker compose` apunte al contexto correcto):

```bash
# Compilar y crear imágenes
docker compose --progress=plain build

# Levantar (detached)
docker compose up -d

# Parar (stops and removes)
docker compose down

# Ver logs
docker compose logs -f backend
```

Nota: el `docker-compose.yml` mapea `apps/backend/.env` como env_file. Si usás otro `.env`, actualizalo.

---

## Endpoints principales

API está montada bajo el prefijo `/api` y los routers principales están en `src/routers/api/`.

- `/api/auth` — login, registro, refresh tokens (según implementación)
- `/api/category` — CRUD de categorías
- `/api/course` — CRUD de cursos, búsquedas, etc.
- `/api/registration` — endpoints de inscripciones
- `/api/user` — manejo de usuarios
- `/api/information` — contenido estático/metadata

Ejemplo (login):

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maxi@example.com","password":"123456"}'
```

Ejemplo (obtener categorías):

```bash
curl http://localhost:8080/api/category
```

Nota: cuando ejecutas localmente con `npm start` o `npm run dev`, el backend suele escuchará `http://localhost:3000` si lo configuraste así. En Docker Compose se expone como `8080`.

---

## Conexión a MongoDB

- Local: `mongodb://localhost:27017/foritfundacion`
- Atlas: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/foritfundacion`

Si querés agregar un servicio Mongo al `docker-compose`, puedo ayudarte a agregarlo para testing con datos persistentes.

---

## Desarrollo y debugging

- Si hay errores TS al compilar, realiza `npm run build` localmente para ver los mensajes de tsc y resolver los tipos.
- Para debug en VS Code: Configura un `launch.json` que use `node` apuntando a `dist/index.js` o usa `ts-node-dev`.

---

## Buenas prácticas

- No commitees tus `.env` o secretos.
- Asegurate de que la `MONGO_DB` sea segura en entornos de staging/producción.
- Cuando generes builds en Docker, separa los contextos de build para acelerar el proceso (mover Dockerfile a apps/backend y usar `context: ./apps/backend`).

---

## Contribuciones

- Si vas a modificar endpoints o el modelo, añade pruebas unitarias en `apps/backend/src/service/*/*.spec.ts`.
- Mantén un estilo de TypeScript estricto: el `tsconfig.json` del backend aplica reglas estrictas.

---

## Contacto

Si necesitás ayuda con algún error en particular, pegá la salida del `docker compose logs` o del `npm run build` y te ayudo a depurarlo.

---

Gracias por usar ForIT Fundacion backend — configurá los env y avisame si querés que arme `docker-compose.dev.yml` para hot reload y un `mongo` local en Docker.

# Frontend (Angular)

Este README explica cómo instalar, ejecutar y trabajar con el frontend del proyecto ForIT Fundacion (Angular 19, Standalone Components). Incluye velocidades para desarrollo, build, SSR, Storybook y Docker.

---

## Estructura principal

```
apps/frontend/
  package.json
  angular.json
  src/
    index.html
    main.ts
    main.server.ts
    server.ts
    app/
      app.routes.ts
      app.routes.server.ts
      features/
      components/
    assets/
    styles.css
  .storybook/
  public/
  README.md
```

---

## Requisitos

- Node.js 18+ (recomendada 18 o 22 para producción)
- npm o yarn
- Angular CLI (local preferible - no es obligatorio): `npm i -g @angular/cli`
- Docker & Docker Compose (opcional)

---

## Variables de entorno

La configuración del backend se hace en el código o se inyectan con Docker. Si usás `Fetch`/API basadas en absoluta: configúralo en `apps/frontend/src/environments` o usa la variable `FRONTEND_URL` del backend.

---

## Comandos rápidos (desde la raíz o desde `apps/frontend`)

Instalar dependencias:
```bash
# Desde la raíz del repo
npm ci --prefix apps/frontend
# o dentro de apps/frontend
npm ci
```

Servir en desarrollo (con reload):
```bash
npm start --prefix apps/frontend
# o
cd apps/frontend && ng serve
```
Por defecto se abrirá en `http://localhost:4200`.

Build para producción:
```bash
npm run build --prefix apps/frontend -- --configuration production
# o dentro de apps/frontend
ng build --configuration production
```

Build para SSR (server-side rendering / Angular Universal):
```bash
# compilar SSR
ng run angular-entrega-1:server
# o la configuración del proyecto si existe
```

Ejecutar storybook (si lo usás):
```bash
npm run storybook --prefix apps/frontend
# o
npm run build-storybook --prefix apps/frontend
```

Test (karma/unit tests y storybook runner):
```bash
npm test --prefix apps/frontend
# Para ejecutar Storybook Test Runner
npm run test:stories --prefix apps/frontend
```

---

## Docker (production)

Se provee un Dockerfile multi-stage que compila la app en un contenedor Node y luego la sirve con Nginx.

Desde la raíz del repo:
```bash
# build e up
docker compose --progress=plain build
docker compose up -d
```

Acceder a la app (host):
```
http://localhost:4200
```

El `docker-compose.yml` mapea `4200:80` (host:container), por eso visitás 4200 en host.

---

## SSR / Prerender y rutas con parámetros

- Si usás prerender (pre-generación de rutas) tené cuidado con rutas parametrizadas (ej. `inscripcionesxcurso/:id`). Debés decidir:
  - Cambiarla a `RenderMode.Server` en `apps/frontend/src/app/app.routes.server.ts` (no será prerenderizada), o
  - Implementar `getPrerenderParams` en `app.routes.server.ts` para devolver los `:id` que querés prerenderizar (si son pocos y estables).

Ejemplo (Server render):
```ts
{ path: 'inscripcionesxcurso/:id', renderMode: RenderMode.Server }
```

Ejemplo (Prerender con params):
```ts
{ path: 'inscripcionesxcurso/:id', renderMode: RenderMode.Prerender, getPrerenderParams: async () => [{ id: 'abc' }, { id: 'def' }] }
```

---

## Storybook (vTDD / UI tests)

- Storybook ya está configurado en `.storybook`.
- Para exponer assets estáticos en storybook, añadí `staticDirs: ['../src/assets']` en `.storybook/main.ts` si hace falta.
- Para tests visuales con Storybook Test Runner:
  1. Instala `@storybook/test-runner` como devDependency.
  2. Añade en `package.json` el script `test:stories` que ejecute `test-storybook`.
  3. Corre: `npm run test:stories --prefix apps/frontend`.

---

## Assets y rutas

- En Angular, usa rutas absolutas de `assets` para que Nginx/Storybook las resuelva bien. Ej:
```html
<img src="/assets/imagenes/Banner.jpeg" alt="Banner" />
```
- Si las assets no aparecen en Storybook: revisá `staticDirs` y el path del asset.

---

## Debugging y errores comunes

- `ng s` no arranca o hay errores de compilación: corré `ng build` para ver los errores de tsc y asegurate que `tsconfig.json` esté correctamente configurado.
- `ERR prerender` en build: ver el punto SSR/Prerender anterior.
- `CORS` cuando el frontend llama al backend: configurá `FRONTEND_URL` en `apps/backend/.env` o en tu `api` y habilita CORS en la app backend.
- `assets 404` — revisa el archivo o path en `/assets` y la configuración del `baseHref` si lo cambiaste.

---

## Recomendaciones (mejorar flujo de desarrollo)

- Para un entorno local dev con hot reload y sin rebuilds largos, creá un `docker-compose.dev.yml` que monte el frontend/backend como volúmenes y use `ng serve` y `npm run dev`.
- Para build/production, mantené Nginx como servidor y sirve la carpeta `dist`.

---

