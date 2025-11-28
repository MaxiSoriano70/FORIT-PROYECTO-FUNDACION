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
