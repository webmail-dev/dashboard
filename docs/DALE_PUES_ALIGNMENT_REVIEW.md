# Dale Pues Alignment Review

Fecha de revision: 2026-06-29

## Alcance

Esta revision pausa la conexion de nuevas pantallas del dashboard y verifica que lo construido hasta ahora siga la arquitectura real de Dale Pues.

Se revisaron:

- `docs/` de este proyecto.
- `../dale-pues/dale-pues/docs`.
- `../dale-pues/dale-pues/src/app`.
- `../dale-pues/dale-pues/backend/pb_migrations`.

Nota de ruta: la ruta solicitada `../dalepues` no existe en este workspace. La ruta real disponible es `../dale-pues/dale-pues`, que coincide con la documentacion generada previamente.

## Arquitectura confirmada

Dale Pues usa:

- Angular 21 standalone con `bootstrapApplication`, rutas lazy por componente y guards funcionales.
- PocketBase como backend de autenticacion y contenido dinamico.
- `PocketbaseService` con una unica instancia SDK y solo `getInstance()`.
- `AuthPocketbaseService` como responsable de sesion, roles, defaults de usuario, bloqueo de cuentas y `lastLoginAt`.
- `ContentDataService` como capa que consulta PocketBase, normaliza records para vistas y cae a JSON local como fallback.
- `ScriptLoaderService`, `UiInitService` y `VisualPluginService` para scripts heredados y reinicializacion visual post-render.

## Colecciones reales

Las migraciones reales definen y documentan estas colecciones:

- `users`
- `categories`
- `businesses`
- `products`
- `banners`
- `promotions`

No existen colecciones para:

- `orders`
- `payments`
- `cart`
- `tracking`
- `merchant_profiles`
- `courier_profiles`

`merchant_profiles` y `courier_profiles` figuran como deuda tecnica futura. Mientras no existan migraciones, el dashboard debe seguir usando los campos temporales de `users`.

## Reglas de acceso confirmadas

`users`:

- Listado: usuario autenticado con `type = "admin"` o `type = "support"`.
- Vista: usuario propio, `admin` o `support`.
- Creacion: publica segun regla de auth collection.
- Actualizacion: usuario propio, `admin` o `support`.
- Eliminacion y manage: solo `admin`.
- Auth: bloquea `blocked` e `inactive`.

Contenido (`categories`, `businesses`, `products`, `banners`, `promotions`):

- Lectura publica si `active = true`.
- Lectura completa para `admin` o `support`.
- Escritura para `admin` o `support`.

## Verificacion de servicios del dashboard

Servicios revisados:

- `dashboard/src/app/core/services/pocketbase.service.ts`
- `dashboard/src/app/core/services/auth-pocketbase.service.ts`
- `dashboard/src/app/core/services/dale-pues-crud.service.ts`
- `dashboard/src/app/core/services/categories.service.ts`
- `dashboard/src/app/core/services/businesses.service.ts`
- `dashboard/src/app/core/services/products.service.ts`
- `dashboard/src/app/core/services/users.service.ts`
- `dashboard/src/app/core/services/banners.service.ts`
- `dashboard/src/app/core/services/promotions.service.ts`
- `dashboard/src/app/core/services/dale-pues-admin-data.service.ts`
- `dashboard/src/app/core/guards/admin-auth.guard.ts`

## Cambios realizados en esta revision

1. `PocketbaseService`

   Se retiro API extra (`getBaseUrl`, `isAuthenticated`, `clearAuth`) para dejarlo alineado con Dale Pues: una instancia SDK y `getInstance()`.

2. Resolucion de imagenes

   Se renombro el helper base de `getImageUrl` a `resolveImage`, igual que el patron de `ContentDataService`.

3. `adminAuthGuard`

   Se ajusto para limpiar sesion con `auth.logout()` cuando detecta usuario `blocked` o `inactive`, igual que los guards del proyecto principal.

4. Documentacion de modulos

   Se actualizo `DALE_PUES_DASHBOARD_MODULES.md` para reflejar la capa de servicios corregida.

## Alineacion actual

La capa de servicios queda alineada con las decisiones del proyecto principal en estos puntos:

- Usa la misma dependencia `pocketbase@^0.27.0`.
- Usa `environment.pocketbaseUrl`.
- Mantiene una sola instancia PocketBase.
- No crea colecciones nuevas.
- No cambia nombres de campos, estados ni tipos existentes.
- Consulta y modifica solo colecciones reales.
- Mantiene `users.type` como fuente de roles.
- Mantiene `users.status` como fuente de estado operativo.
- Respeta la ausencia de pedidos/pagos/tracking.
- Resuelve archivos de PocketBase y campos temporales `imageUrl`, `logoUrl`, `coverUrl`.

## Diferencias aceptadas

- El dashboard administra records reales, por lo que sus modelos son mas cercanos al esquema PocketBase que los modelos visuales de `ContentDataService`.
- `DalePuesCrudService` no existe en el cliente principal, pero concentra operaciones administrativas repetidas sin cambiar contratos de backend.
- Los servicios CRUD devuelven `Promise`, igual que `AuthPocketbaseService`; las vistas de catalogo del cliente principal usan `Observable` porque combinan PocketBase con fallback JSON.
- El dashboard tiene `adminAuthGuard` especifico porque solo permite `admin` y `support`.

## Diferencias o riesgos detectados

- `../dalepues` no existe. Toda referencia operativa debe apuntar a `../dale-pues/dale-pues` salvo que se cree o renombre el proyecto.
- `environment.prod.ts` del dashboard tiene un cambio local no originado en esta revision: `https://db-dale-pues.buckapi.online:8090`. No se modifico.
- El build completo del dashboard requiere Node compatible con Angular 21 (`>=20.19`); en este entorno local ya se habia detectado Node 18.
- No se deben implementar CRUD de pedidos hasta que exista migracion real.
- No se deben crear `merchant_profiles` ni `courier_profiles` desde el dashboard; primero debe existir migracion aprobada en Dale Pues.

## Resultado

La capa de servicios actual queda apta para seguir conectando modulos existentes, con la condicion de no avanzar a nuevas pantallas hasta que cualquier cambio futuro vuelva a contrastarse contra:

- migraciones PocketBase,
- modelos existentes,
- servicios existentes,
- reglas de negocio documentadas,
- deuda tecnica abierta.
