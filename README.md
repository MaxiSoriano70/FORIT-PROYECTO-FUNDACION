
# 📌 Proyecto ForIT Fundación  
Monorepo — Backend (Node/TypeScript + MongoDB) | Frontend (Angular)

Este README unifica la documentación para instalación, desarrollo y despliegue del proyecto completo.

---

## 🛠 Tecnologías principales utilizadas

| Área | Stack |
|---|---|
| Backend | Node.js · TypeScript · Express · MongoDB |
| Frontend | Angular 19 (Standalone Components + SSR) |
| Infraestructura | Docker + Docker Compose (dev & prod) |
| Testing | Vitest · Karma · Storybook Test Runner |
| CI/CD (opcional) | GitHub Actions |

---

## 🎯 Características destacadas del sistema

- API REST modularizada con controladores, servicios y middlewares.
- Autenticación y rutas `/api` separadas por dominio.
- Frontend escalable con Angular + SSR / Prerender.
- Storybook integrado para UI Components.
- Contenedores Docker para backend, frontend y MongoDB.
- Scripts de desarrollo, build, test y despliegue documentados.

---

# 🖥 Backend — Node + TypeScript

Backend del sistema ForIT Fundación. API REST con MongoDB y soporte para Docker y desarrollo local.

### Tecnologías
- TypeScript
- Node.js (18+ recomendado / Docker usa *node:22-slim*)
- MongoDB
- Vitest (tests)
- Docker (opcional)

---

## 📂 Estructura Backend

```
apps/backend/
  .env                # variables de entorno (IGNORAR en Git)
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

## ⚙ Requisitos Backend

- Node >= 18
- npm o yarn
- MongoDB local/Atlas o vía Docker
- Docker (opcional)

---

## 🔐 Variables de entorno

Crear archivo `apps/backend/.env`:

```
PORT=3000
MONGO_DB=mongodb://localhost:27017/foritfundacion
FRONTEND_URL=http://localhost:4200
EMAIL_USER=tu_email@dominio.com
EMAIL_PASS=secreto
```

❗ **No subir `.env` al repositorio.**

---

## 🚀 Comandos Backend

```bash
npm ci --prefix apps/backend      
npm run dev --prefix apps/backend  
npm run build --prefix apps/backend 
npm start --prefix apps/backend    
npm test --prefix apps/backend     
```

---

## 🐳 Docker Backend

```bash
docker compose --progress=plain build
docker compose up -d
docker compose logs -f backend
```

---

## 📌 Endpoints API

| Path | Función |
|------|---------|
| `/api/auth` | Login / Registro |
| `/api/category` | CRUD Categorías |
| `/api/course` | Cursos y búsqueda |
| `/api/registration` | Inscripciones |
| `/api/user` | Usuarios |
| `/api/information` | Información estática |

Ejemplo Login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"maxi@example.com","password":"123456"}'
```

---

## 🧩 Configuración MongoDB

| Tipo | Cadena |
|------|--------|
| Local | `mongodb://localhost:27017/foritfundacion` |
| Atlas | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/foritfundacion` |

---

# 🌐 Frontend — Angular

Angular 19 con Standalone Components + SSR + Storybook + Docker.

---

## 📂 Estructura Frontend

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
```

---

## 🚀 Comandos Frontend

```bash
npm ci --prefix apps/frontend       
npm start --prefix apps/frontend      
npm run build --prefix apps/frontend -- --configuration production
npm run storybook --prefix apps/frontend 
npm test --prefix apps/frontend 
```

---

## ⚙ SSR / Prerender

```ts
{ path: 'inscripcionesxcurso/:id', renderMode: RenderMode.Server }
```

o

```ts
{ path: 'inscripcionesxcurso/:id', 
  renderMode: RenderMode.Prerender, 
  getPrerenderParams: async () => [{ id:'abc'}, {id:'def'} ] } 
```

---

## 🐳 Docker Frontend

```bash
docker compose --progress=plain build
docker compose up -d
```

Acceso → `http://localhost:4200`

---

## 📂 Manejo de Assets

```html
<img src="/assets/imagenes/Banner.jpeg" alt="Banner" />
```

En Storybook:

```ts
staticDirs: ['../src/assets']
```

---

# 🐳 Docker + Dev Mode (Hot Reload)

```yaml
version: "3.8"
services:
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    container_name: forit_backend_dev
    command: npm run dev --prefix ./apps/backend
    env_file:
      - ./apps/backend/.env
    volumes:
      - ./apps/backend:/app/apps/backend
    ports:
      - "3000:3000"

  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    container_name: forit_frontend_dev
    command: npm run start --prefix apps/frontend -- --host 0.0.0.0 --port 4200
    env_file:
      - ./apps/backend/.env
    volumes:
      - ./apps/frontend:/app/apps/frontend
    ports:
      - "4200:4200"

  mongo:
    image: mongo:6
    container_name: forit_mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

# 🧪 Troubleshooting

| Error | Solución |
|-------|----------|
| `.env not found` | Crear `apps/backend/.env` |
| CORS entre Front/Back | Configurar `FRONTEND_URL` en .env |
| SSR falla | usar `RenderMode.Server` |
| Docker lento | mover Dockerfile al contexto adecuado ⚡ |

---

# 👨‍💻 Desarrollado por

**Maximiliano Soriano**  
📩 *maxi.soriano.70.23@gmail.com*  
🔗 LinkedIn: **https://www.linkedin.com/in/maximiliano-soriano/**  
🐙 GitHub: **https://github.com/MaxiSoriano70**

---