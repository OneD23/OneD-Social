# OneD Social API

Backend de **OneD Social**, una plataforma social local/comercial para comunidades, negocios, marketplace, empleos, eventos, stories, chat privado y contenido social. Está preparada para clientes **React Native + Expo**, un panel futuro en **Next.js** y una integración posterior con OneD Hub.

## Estado del repositorio

La fase MVP ya incluía Node.js, Express, MongoDB, Mongoose, JWT, refresh tokens, bcrypt, Zod, Socket.io, Cloudinary preparado y módulos de Auth, Users, Posts, Businesses, Groups, Feed y Notifications. En esta fase se evolucionó esa base sin romper rutas existentes.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT access token + refresh token rotativo
- bcrypt para contraseñas y refresh tokens hasheados
- Zod para validación
- Cloudinary para media
- Socket.io para tiempo real
- Rate limiting, sanitización, RBAC y auditoría
- Swagger OpenAPI y colección Postman
- Redis/BullMQ preparados para escalado

## Estructura de carpetas

```text
src/
  app.js, server.js, routes.js
  cache/ redis.js
  config/ cloudinary.js database.js env.js
  docs/ openapi.yaml
  middleware/ auth.js errorHandler.js rbac.js validate.js
  queues/ index.js
  realtime/ socket.js
  security/ rateLimiters.js sanitize.js
  modules/
    admin/ analytics/ audit/ auth/ businesses/ chat/ communities/
    events/ feed/ groups/ jobs/ marketplace/ media/ notifications/
    posts/ reports/ search/ stories/ users/
  seed/ index.js
```

Cada módulo mantiene separación entre `models`, `routes`, `controllers`, `services` y `validators` cuando aplica.

## Instalación

```bash
npm install
cp .env.example .env
```

Variables principales:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/oned_social
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REDIS_URL=redis://127.0.0.1:6379
```

## Comandos

```bash
npm run dev
npm start
npm run seed
npm test
```

## Documentación API

- Swagger UI: `http://localhost:4000/api-docs`
- OpenAPI YAML: `src/docs/openapi.yaml`
- Postman: `docs/postman/oned-social.postman_collection.json`
- Diagrama: `docs/architecture.md`

## Endpoints principales

Base URL: `/api/v1`

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registro |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token rotativo |
| POST | `/auth/logout` | Logout |

### Media

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/media/upload` | Upload imagen/video a Cloudinary con validación MIME y tamaño |
| DELETE | `/media/:id` | Soft delete y eliminación en Cloudinary |

### Chat

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/chat/conversation` | Crear conversación privada o grupal |
| GET | `/chat/conversations` | Listar conversaciones |
| GET | `/chat/messages/:conversationId` | Listar mensajes |
| POST | `/chat/send` | Enviar mensaje con adjuntos o respuesta |
| PATCH | `/chat/conversations/:conversationId/read` | Marcar conversación leída |

Socket.io soporta `join:user`, `join:conversation`, `typing:start`, `typing:stop`, `chat:message`, `chat:read` y eventos de notificación.

### Feed y publicaciones

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/feed/general` | Feed cronológico |
| GET | `/feed/following` | Feed de usuarios seguidos |
| GET | `/feed/businesses` | Feed de negocios |
| GET | `/feed/smart` | Feed inteligente con ranking dinámico |
| POST | `/posts/:id/share` | Compartir publicación con comentario o en grupo |

El ranking usa likes, comentarios, shares, frescura, popularidad y afinidad usuario-autor/negocio.

### Stories

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/stories` | Crear story imagen/video por 24 horas |
| GET | `/stories` | Listar stories activas |
| GET | `/stories/:userId` | Stories de un usuario y registro de vistas |

### Búsqueda, reportes y admin

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/search?q=` | Busca usuarios, negocios, posts, grupos y stories |
| POST | `/reports` | Reportar contenido |
| GET | `/admin/reports` | Revisar reportes con RBAC |
| POST | `/admin/users/:userId/ban` | Banear usuario |
| POST | `/admin/users/:userId/verify` | Verificar usuario |
| POST | `/admin/businesses/:businessId/verify` | Verificar negocio |

### Marketplace, empleos, eventos y comunidades

| Recurso | Rutas |
|---|---|
| Marketplace | CRUD `/marketplace`, categorías modeladas |
| Jobs | CRUD `/jobs`, aplicar `/jobs/:id/apply`, guardar `/jobs/:id/save` |
| Events | CRUD `/events`, asistencia `/events/:id/attend` |
| Communities | CRUD `/communities` |
| Analytics | `/analytics/dashboard` para admins |
| Audit | `/audit` para admins |

## Seguridad de producción incluida

- Helmet.
- Rate limiting global, auth y uploads.
- Sanitización básica contra operadores Mongo y scripts.
- RBAC con roles `user`, `moderator`, `admin`, `superadmin`.
- Soft delete en contenido sensible.
- Auditoría para acciones críticas.
- Refresh tokens hasheados y rotativos.
- Índices de texto y de consulta en modelos principales.

## Seeds

`npm run seed` genera usuarios, negocios, posts, stories, marketplace, empleos, eventos y comunidades locales realistas. Credenciales de prueba:

```text
ana@oned.local / Password123!
luis@oned.local / Password123!
maria@oned.local / Password123!
```

## Próximas mejoras

1. Workers BullMQ reales para limpieza de media y notificaciones push.
2. Cache Redis por feed/search con invalidación por eventos.
3. Moderación automática de media/texto.
4. Integración con push notifications de Expo.
5. Sharding/replicas de MongoDB y storage regional para CDN.
6. Panel Next.js para negocios, reportes, analytics y moderación.
