# Arquitectura OneD Social

```mermaid
flowchart TD
  Mobile[React Native Expo] --> API[Express API /api/v1]
  Web[Next.js Admin futuro] --> API
  API --> Modules[src/modules]
  Modules --> Mongo[(MongoDB)]
  Modules --> Cloudinary[(Cloudinary CDN)]
  API --> Socket[Socket.io]
  Socket --> Mobile
  API -. futuro .-> Redis[(Redis Cache / BullMQ)]
```

## Capas

- Routes: definen endpoints y middleware.
- Controllers: adaptación HTTP liviana.
- Services: reglas de negocio reutilizables.
- Models: esquemas Mongoose e índices.
- Validators: contratos Zod.
- Middleware: auth, RBAC, errores, rate limit y sanitización.
