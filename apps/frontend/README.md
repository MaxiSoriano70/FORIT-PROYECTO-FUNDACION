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

## Contribuciones

- Crea una rama por feature/bugfix.
- Sigue el mismo estilo del proyecto y agrega tests (Vitest / Karma / Storybook tests).

---

Si querés que haga un `docker-compose.dev.yml`, o que mueva los Dockerfiles a `apps/frontend/Dockerfile` y `apps/backend/Dockerfile` para acelerar builds, lo hago ahora y ajusto `docker-compose.yml` automáticamente.

¿Te hago esos cambios? 
