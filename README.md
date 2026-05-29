# OneD Social API

MVP backend para **OneD Social**, una red social local/comercial preparada para integrarse en el futuro con OneD Hub y clientes móviles en React Native + Expo.

## Estado del repositorio inicial

El repositorio estaba vacío salvo `.gitkeep`, por lo que se creó una arquitectura backend limpia desde cero sin romper funcionalidad existente.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT access token + refresh token
- bcrypt para contraseñas
- Zod para validación
- Cloudinary preparado por configuración
- Socket.io preparado para eventos en tiempo real

## Estructura de carpetas

```text
src/
  app.js
  server.js
  routes.js
  config/
    cloudinary.js
    database.js
    env.js
  middleware/
    auth.js
    errorHandler.js
    validate.js
  modules/
    auth/
      controllers/ routes/ services/ validators/
    users/
      controllers/ models/ routes/ services/ validators/
    posts/
      controllers/ models/ routes/ services/ validators/
    businesses/
      controllers/ models/ routes/ services/ validators/
    groups/
      controllers/ models/ routes/ services/ validators/
    feed/
      controllers/ routes/ services/
    notifications/
      controllers/ models/ routes/ services/
  seed/
    index.js
```

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` con tus credenciales reales, especialmente:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/oned_social
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Comandos

```bash
npm run dev     # servidor en modo desarrollo con nodemon
npm start       # servidor en modo producción/local
npm run seed    # crea usuarios, negocios, grupo y posts de prueba
```

## Modelos MongoDB

### User

Campos principales: `name`, `username`, `email`, `passwordHash`, `avatarUrl`, `bio`, `location`, `followers`, `following`, `refreshTokens`, `status`.

### Post

Campos principales: `author`, `business`, `group`, `text`, `media`, `type`, `likes`, `comments`, `score`.

### Business

Campos principales: `owner`, `name`, `logoUrl`, `category`, `description`, `location`, `phone`, `whatsapp`, `followers`.

### Group

Campos principales: `owner`, `name`, `description`, `scope`, `location`, `topic`, `members`.

### Notification

Campos principales: `recipient`, `actor`, `type`, `post`, `group`, `readAt`.

## Endpoints REST

Base URL: `/api/v1`

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Rotar refresh token y emitir nuevos tokens |
| POST | `/auth/logout` | Revocar refresh token actual o todos |

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/users/me` | Perfil autenticado |
| PATCH | `/users/me` | Editar perfil, bio, ubicación y foto por URL |
| GET | `/users/:username` | Perfil público |
| POST | `/users/:userId/follow` | Seguir usuario |
| DELETE | `/users/:userId/follow` | Dejar de seguir usuario |

### Publicaciones

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/posts?page=1&limit=20&sort=date` | Feed general de posts públicos |
| POST | `/posts` | Crear post de usuario, negocio, promoción o grupo |
| GET | `/posts/user/:userId` | Posts por usuario |
| PATCH | `/posts/:postId` | Editar post propio |
| DELETE | `/posts/:postId` | Eliminar post propio |
| POST | `/posts/:postId/like` | Like/unlike |
| POST | `/posts/:postId/comments` | Comentar |

### Negocios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/businesses` | Listar negocios con filtros `category`, `location` |
| POST | `/businesses` | Crear perfil de negocio |
| GET | `/businesses/:businessId` | Detalle de negocio |
| GET | `/businesses/:businessId/posts` | Posts y promociones del negocio |

### Grupos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/groups` | Listar grupos por barrio, ciudad o tema |
| POST | `/groups` | Crear grupo |
| POST | `/groups/:groupId/join` | Unirse |
| DELETE | `/groups/:groupId/join` | Salir |
| GET | `/groups/:groupId/posts` | Posts del grupo |

### Feed

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/feed/general` | Feed general |
| GET | `/feed/following` | Feed de usuarios seguidos |
| GET | `/feed/businesses` | Feed de negocios/promociones |

### Notificaciones

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/notifications` | Listar notificaciones |
| PATCH | `/notifications/:notificationId/read` | Marcar como leída |

## Paginación

Todos los listados usan:

```text
?page=1&limit=20
```

Respuesta estándar:

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

## Ejemplo rápido

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","username":"demo","email":"demo@oned.local","password":"Password123!","location":"Santo Domingo"}'
```

Luego usa `tokens.accessToken` como:

```text
Authorization: Bearer <accessToken>
```

## Sugerencias de próximos pasos

1. Agregar tests con Jest/Vitest + Supertest y MongoDB Memory Server.
2. Implementar subida real de media a Cloudinary con endpoints firmados o middleware multipart.
3. Emitir notificaciones por Socket.io cuando se creen likes, comentarios, seguidores y posts de grupos.
4. Crear app móvil Expo con pantallas de auth, feed, perfil, negocio y grupo.
5. Agregar roles, moderación, reportes, bloqueo de usuarios y privacidad.
6. Diseñar ranking de relevancia más avanzado para el feed.
7. Añadir panel web futuro con Next.js para administración y negocios.
