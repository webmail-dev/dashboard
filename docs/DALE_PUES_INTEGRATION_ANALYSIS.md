# Dale Pues Integration Analysis

Fecha de analisis: 2026-06-29

## Resumen de arquitectura

Dale Pues es una PWA mobile-first hecha con Angular 21 standalone y PocketBase 0.39.4. La aplicacion existente vive en `../dale-pues/dale-pues` y combina:

- Frontend Angular standalone con rutas lazy por componente.
- PocketBase como backend para autenticacion, perfiles de usuario y contenido dinamico.
- JSON local como fallback temporal para Home, Food, Grocery, Pharmacy y Profile.
- Angular Service Worker en produccion.
- Servicios visuales para reinicializar Swiper y scripts heredados despues del render dinamico.

La fuente principal de datos ya esta abstraida en `ContentDataService`: los componentes consumen modelos normalizados y no acceden directamente a colecciones PocketBase.

Importante: en esta copia no existe `../dale-pues/dale-pues/client-app`. El frontend cliente real esta en `../dale-pues/dale-pues/src/app`. La integracion del nuevo dashboard debe reutilizar ese diseno tecnico y no crear otra estructura de dominio incompatible.

## Rutas relevantes del proyecto existente

| Ruta | Proposito |
| --- | --- |
| `../dale-pues/dale-pues/docs` | Documentacion tecnica VitePress. |
| `../dale-pues/dale-pues/docs/guide/arquitectura.md` | Arquitectura general Angular/PocketBase/PWA. |
| `../dale-pues/dale-pues/docs/guide/backend.md` | Backend PocketBase, migraciones y colecciones. |
| `../dale-pues/dale-pues/docs/guide/diccionario-datos.md` | Campos, relaciones y reglas por coleccion. |
| `../dale-pues/dale-pues/docs/guide/servicios-y-datos.md` | Servicios Angular, flujo PocketBase -> modelos -> vistas. |
| `../dale-pues/dale-pues/docs/content-pocketbase.md` | Contenido dinamico, JSON fallback, Swiper y seed. |
| `../dale-pues/dale-pues/docs/ISSUES_TECNICOS_PENDIENTES.md` | Deuda tecnica reconocida. |
| `../dale-pues/dale-pues/src/app` | Frontend Angular existente. Equivalente real a `client-app`. |
| `../dale-pues/dale-pues/src/app/services` | Servicios PocketBase, auth, contenido y UI. |
| `../dale-pues/dale-pues/src/app/models` | Interfaces de autenticacion y contenido. |
| `../dale-pues/dale-pues/src/app/guards` | Guards de auth, perfil completo y rol. |
| `../dale-pues/dale-pues/src/assets/data` | JSON fuente editable para fallback. |
| `../dale-pues/dale-pues/public/assets/data` | JSON publicado en runtime. |
| `../dale-pues/dale-pues/backend/pb_migrations` | Migraciones versionadas PocketBase. |
| `../dale-pues/dale-pues/backend/pb_data` | Datos locales de desarrollo. |

## Rutas Angular existentes

| Ruta | Componente | Guard |
| --- | --- | --- |
| `/` | Redirect a `/home` | N/A |
| `/login` | `LoginPage` | Ninguno |
| `/register` | `RegisterPage` | Ninguno |
| `/complete-profile` | `CompleteProfilePage` | `profileCompletionGuard` |
| `/home` | `HomePage` | `authGuard` |
| `/food` | `FoodHomePage` | `authGuard` |
| `/grocery` | `GroceryHomePage` | `authGuard` |
| `/pharmacy` | `PharmacyHomePage` | `authGuard` |
| `/profile` | `ProfilePage` | `authGuard` |
| `**` | Redirect a `/home` | N/A |

`roleGuard` existe pero no esta aplicado actualmente. Para el nuevo dashboard debe aplicarse a usuarios `admin` y posiblemente `support`, segun el modulo.

## Servicios reutilizables del client-app existente

| Servicio | Ruta | Reutilizacion recomendada |
| --- | --- | --- |
| `PocketbaseService` | `src/app/services/pocketbase.service.ts` | Patron base: una sola instancia `new PocketBase(environment.pocketbaseUrl)`. |
| `AuthPocketbaseService` | `src/app/services/auth-pocketbase.service.ts` | Login, registro, OAuth Google, logout, refresh, completar perfil, roles y usuario actual. |
| `ContentDataService` | `src/app/services/content-data.service.ts` | Consultas y normalizacion para `categories`, `businesses`, `products`, `banners`, `promotions`. |
| `ScriptLoaderService` | `src/app/services/script-loader.service.ts` | Carga secuencial/diferida de scripts externos evitando duplicados. |
| `UiInitService` | `src/app/services/ui-init.service.ts` | Reinicializa Swiper despues de que Angular pinta datos dinamicos. |
| `VisualPluginService` | `src/app/services/visual-plugin.service.ts` | Interacciones heredadas, dark/rtl/range/likes y delegacion a Swiper. |
| `BodyClassService` | `src/app/services/body-class.service.ts` | Gestiona clases visuales de `body`. |

El nuevo dashboard debe implementar servicios analogos dentro de su propio proyecto o extraer/copiar patrones con nombres compatibles. No debe crear un segundo cliente PocketBase por modulo.

## Modelos existentes

### Auth

Ruta: `../dale-pues/dale-pues/src/app/models/auth.models.ts`

```ts
type UserType = 'client' | 'merchant' | 'courier' | 'admin' | 'support';
type UserStatus = 'active' | 'pending' | 'rejected' | 'blocked' | 'inactive';
```

`DalePuesUser` contiene `id`, `email`, `name`, `phone`, `type`, `status`, `avatar`, direccion basica, `roleDescription`, `lastLoginAt`, `profileCompleted`, `termsAccepted`, `businessName`, `businessType`, `identityDocument`, `vehicleType`.

### Content

Ruta: `../dale-pues/dale-pues/src/app/models/content.models.ts`

Interfaces principales:

- `ContentCategory`
- `ContentBanner`
- `ContentOfferStrip`
- `ContentProduct`
- `ContentRestaurant`
- `ContentBrand`
- `HomeContent`
- `FoodContent`
- `GroceryContent`
- `PharmacyContent`
- `ProfileContent`

Para administracion conviene crear modelos de dashboard alineados a los records reales de PocketBase, no a modelos visuales normalizados, porque el dashboard necesita CRUD y campos operativos.

## Colecciones PocketBase

Las migraciones reales estan en:

- `backend/pb_migrations/20260624000100_update_users_auth.js`
- `backend/pb_migrations/20260624000200_content_collections_seed.js`

No hay `backend/pb_hooks`. No hay endpoints custom versionados.

### Reglas generales

| Coleccion | Lectura | Escritura |
| --- | --- | --- |
| `users` | Usuario propio, `admin` o `support`; listado solo `admin` o `support`. | Usuario propio, `admin` o `support`; delete/manage solo `admin`. |
| `categories`, `businesses`, `products`, `banners`, `promotions` | `active = true` para publico; acceso completo para `admin` o `support`. | Solo `admin` o `support`. |

Regla compartida para contenido:

```txt
active = true || @request.auth.type = "admin" || @request.auth.type = "support"
```

Regla de escritura:

```txt
@request.auth.type = "admin" || @request.auth.type = "support"
```

## Campos principales

### `users`

Auth collection existente extendida.

Campos de proyecto:

- `name`: text max 120.
- `phone`: text max 40.
- `type`: select `client`, `merchant`, `courier`, `admin`, `support`.
- `status`: select `active`, `pending`, `rejected`, `blocked`, `inactive`.
- `avatar`: file jpeg/png/webp, max 5 MB, thumbs `100x100`, `300x300`.
- `address`: text max 255.
- `city`, `state`, `country`: text max 80.
- `roleDescription`: text max 255.
- `lastLoginAt`: date.
- `profileCompleted`: bool.
- `termsAccepted`: bool.
- `businessName`, `businessType`: campos temporales para comercios.
- `identityDocument`, `vehicleType`: campos temporales para repartidores.

Reglas relevantes:

- `authRule`: bloquea usuarios `blocked` o `inactive`.
- `listRule`: solo usuarios autenticados con `type = admin/support`.
- `deleteRule` y `manageRule`: solo `admin`.

### `categories`

Campos:

- `name` requerido, max 160.
- `slug` requerido, max 160, unico.
- `type` requerido: `home`, `food`, `grocery`, `pharmacy`.
- `image` file opcional, max 5 MB, jpeg/png/webp/svg.
- `imageUrl` string temporal.
- `icon`, `alt`, `link`.
- `active` bool.
- `order` number.

Indices:

- `idx_categories_slug`
- `idx_categories_type`
- `idx_categories_active`

### `businesses`

Campos:

- `name`, `slug`, `type`.
- `type`: `restaurant`, `grocery`, `pharmacy`, `courier`, `store`.
- `logo`, `cover` file.
- `logoUrl`, `coverUrl` temporales.
- `description`.
- `phone`, `whatsapp`.
- `address`, `city`, `state`, `country`.
- `lat`, `lng`.
- `rating`.
- `deliveryTime`.
- `active`, `featured`.
- `owner`: relation a `users`.

Uso actual:

- Restaurantes: `type = restaurant`.
- Mercado/farmacia: `type = grocery/pharmacy`.
- Conductores potenciales: `type = courier`, pero no hay flujo real implementado.

### `products`

Campos:

- `business`: relation a `businesses`.
- `category`: relation a `categories`.
- `name`, `slug`.
- `description`.
- `image` file.
- `imageUrl` temporal.
- `alt`.
- `type`: `food`, `grocery`, `pharmacy`.
- `price` requerido.
- `oldPrice`.
- `currency`.
- `rating`.
- `stock`.
- `featured`, `active`.
- `deliveryTime`.
- `tags` JSON. Usado por frontend para `unit`, `offerTag`, `section`.
- `ctaText`.

### `banners`

Campos:

- `title` requerido.
- `subtitle`, `highlight`.
- `image` file.
- `imageUrl` temporal.
- `alt`.
- `ctaText`.
- `link`.
- `section`: `home`, `food`, `grocery`, `pharmacy`.
- `position`.
- `active`.
- `startDate`, `endDate`.

### `promotions`

Campos:

- `title` requerido.
- `description`.
- `business`: relation a `businesses`.
- `product`: relation a `products`.
- `section`: `home`, `food`, `grocery`, `pharmacy`.
- `discountType`: `percentage`, `fixed`, `combo`, `text`.
- `discountValue`.
- `badgeText`.
- `image` file.
- `imageUrl` temporal.
- `active`.
- `startDate`, `endDate`.
- `order`.

## Relaciones

| Origen | Campo | Destino | Uso |
| --- | --- | --- | --- |
| `businesses` | `owner` | `users` | Propietario/comercio. |
| `products` | `business` | `businesses` | Producto pertenece a negocio. |
| `products` | `category` | `categories` | Producto pertenece a categoria. |
| `promotions` | `business` | `businesses` | Promo asociada a negocio. |
| `promotions` | `product` | `products` | Promo asociada a producto. |

No existen relaciones de pedidos, carritos, pagos, direcciones multiples ni tracking.

## Flujos existentes

### Autenticacion

1. Login email/password con `users.authWithPassword`.
2. OAuth Google con `authWithOAuth2({ provider: 'google' })`.
3. Registro crea usuario en `users`, asigna `type` y `status`.
4. `merchant` y `courier` nacen en `pending`; `client` nace `active`.
5. `afterAuth` normaliza defaults, bloquea `blocked/inactive`, actualiza `lastLoginAt`.
6. `completeProfile` exige telefono y terminos; para `merchant` exige negocio; para `courier` documento y vehiculo.
7. `authGuard` protege rutas y exige perfil completo.
8. `roleGuard` puede restringir por `route.data.types`.

### Contenido dinamico

1. La pagina pide contenido a `ContentDataService`.
2. El servicio consulta PocketBase.
3. Si PocketBase falla o devuelve todo vacio, usa JSON local.
4. La pagina asigna contenido.
5. Se fuerza render con `ChangeDetectorRef`.
6. `VisualPluginService` reinicializa Swiper/interacciones.

### Gestion de archivos

El servicio existente usa:

```ts
this.pb.files.getURL(record, fileValue)
```

Campos file reales:

- `users.avatar`
- `categories.image`
- `businesses.logo`
- `businesses.cover`
- `products.image`
- `banners.image`
- `promotions.image`

Campos URL temporales:

- `imageUrl`
- `logoUrl`
- `coverUrl`

Regla: el dashboard debe soportar ambos. Para nuevos uploads, usar campos file reales; no depender de `imageUrl` salvo para contenido semilla existente.

## Productos

Los productos existentes viven en `products`. El dashboard debe usar esta coleccion para listar/crear/editar productos. No crear `items`, `menu_items` ni `product_categories`.

Filtros utiles:

- Activos: `active = true`.
- Destacados: `featured = true`.
- Por vertical: `type = "food" | "grocery" | "pharmacy"`.
- Expand: `business,category`.

Orden recomendado:

- `-featured,created` para vistas publicas.
- `-updated` o `name` para administracion.

## Categorias

Usar `categories`. El campo `type` define seccion, no crear colecciones separadas por vertical. El campo `order` controla orden visual.

## Restaurantes y negocios

Usar `businesses`. Restaurantes son `type = "restaurant"`. Supermercados/farmacias son `type = "grocery"` y `type = "pharmacy"`.

El modulo "Restaurantes" del dashboard debe filtrar `businesses` por `type = "restaurant"` y el modulo de negocios generales podria mostrar todos los tipos.

## Usuarios

Usar `users`. Para administracion:

- `admin` puede listar, ver, actualizar, borrar y gestionar.
- `support` puede listar, ver y actualizar segun reglas, pero no borrar ni manage.
- Usuarios normales solo pueden verse/editarse a si mismos.

No crear una coleccion `admins`; los administradores son `users.type = "admin"`.

## Conductores

No existe coleccion dedicada `drivers`, `couriers` ni `courier_profiles`.

Estado real:

- Usuarios repartidores son `users.type = "courier"`.
- Datos temporales: `identityDocument`, `vehicleType`.
- `businesses.type = "courier"` existe como opcion, pero no hay flujo documentado que lo use.

El dashboard debe listar conductores desde `users` filtrando `type = "courier"` por ahora. Crear `courier_profiles` esta identificado como issue pendiente y requiere migracion justificada en Dale Pues.

## Pedidos

No existe coleccion de pedidos en migraciones ni docs. La documentacion indica explicitamente que no hay API de pedidos, pagos, carrito o seguimiento implementada.

El modulo "Pedidos" del dashboard no puede reemplazar datos estaticos por datos reales sin una migracion nueva. Opciones correctas:

1. Mostrar estado vacio documentado: "Pedidos aun no implementados".
2. Bloquear implementacion CRUD hasta definir migracion en Dale Pues.
3. Crear una propuesta de esquema en docs, pero no implementarla sin aprobacion.

No crear `orders` automaticamente en este dashboard.

## Direcciones

No hay coleccion de direcciones multiples.

Estado real:

- `users.address`, `city`, `state`, `country` guardan direccion basica.
- `LocationModal` es visual y no persiste seleccion.
- `ISSUES_TECNICOS_PENDIENTES.md` pide definir modelo/servicio de ubicacion activa.

## Media y reportes

No existe coleccion `media`, `reports` ni analitica. Los archivos viven como campos file en las colecciones existentes. El dashboard debe resolver media por record/campo y no inventar una biblioteca global sin migracion.

## Reglas de negocio detectadas

- `merchant` y `courier` se registran con `status = pending`.
- `client`, `admin`, `support` operan como `active` por defecto si no tienen estado.
- Usuarios `blocked` o `inactive` no pueden autenticarse.
- Perfil completo requiere telefono y terminos.
- Merchant requiere `businessName` y `businessType`.
- Courier requiere `identityDocument` y `vehicleType`.
- Contenido publico solo muestra registros `active`.
- Admin/support pueden ver contenido inactivo y escribir contenido.
- Seed de contenido es idempotente por `slug` o `title + section`.
- JSON fallback es temporal; PocketBase debe ser fuente principal.
- Los campos `imageUrl`, `logoUrl`, `coverUrl` son temporales y deben migrarse a archivos reales a futuro.
- No hay esquema real para pedidos, pagos, carrito, seguimiento ni direcciones multiples.

## Riesgos o dudas detectadas

1. **No existe `client-app/`:** la ruta mencionada no esta en el repo. Se debe usar `src/app`.
2. **Pedidos sin backend:** no hay coleccion real para pedidos; el modulo no puede conectarse a datos reales aun.
3. **Conductores incompletos:** existen como usuarios `courier`, pero no hay `courier_profiles`.
4. **Comercios incompletos:** `businessName/businessType` estan temporalmente en `users`; issue pendiente propone `merchant_profiles`.
5. **Media/reportes sin colecciones:** solo hay campos file por coleccion.
6. **Roles admin/support sin pantallas existentes:** el dashboard sera la primera UI administrativa real.
7. **CORS/produccion:** `environment.pocketbaseUrl` actual es local; dashboard necesita configuracion de entorno propia.
8. **Service worker/cache:** si el dashboard usa JSON fallback o assets locales, considerar cache PWA.
9. **XSS/localStorage:** PocketBase auth usa `localStorage`; no renderizar HTML externo sin sanitizacion.
10. **No duplicar SDK:** usar una sola instancia PocketBase.

## Plan de integracion del nuevo dashboard

El dashboard debe adaptarse a este esquema existente y preservar el template visual ya migrado.

### 1. Configuracion PocketBase

- Agregar dependencia `pocketbase`.
- Crear `src/environments/environment.ts` y, si aplica, `environment.prod.ts`.
- Crear `PocketbaseService` equivalente al existente.
- Crear modelos de records administrativos alineados a colecciones reales.

### 2. Autenticacion/admin

- Crear `AuthPocketbaseService` o adaptar patron existente.
- Login contra `users.authWithPassword`.
- Crear guard para dashboard: usuario autenticado, perfil completo, `type in ["admin", "support"]`, no `blocked/inactive`.
- No crear coleccion admin separada.

### 3. Dashboard principal

- Datos reales posibles:
  - Conteo de categorias.
  - Conteo de productos.
  - Conteo de negocios/restaurantes.
  - Conteo de usuarios por tipo/status.
- No mostrar ingresos/pedidos reales si no hay coleccion.

### 4. Categorias

- CRUD sobre `categories`.
- Soportar `image` file y `imageUrl`.
- Filtros por `type`, `active`.

### 5. Productos

- CRUD sobre `products`.
- Expand `business,category`.
- Upload en `image`.
- Mantener `tags` JSON.

### 6. Restaurantes

- CRUD/listado sobre `businesses` filtrando `type = "restaurant"`.
- Upload en `logo` y `cover`.
- Soportar owner relation a `users`.

### 7. Usuarios

- Listado/edicion sobre `users`.
- Filtros por `type` y `status`.
- Respetar reglas: delete solo admin.

### 8. Conductores

- Listado sobre `users` filtrando `type = "courier"`.
- Campos temporales: `identityDocument`, `vehicleType`, `status`.
- No crear `courier_profiles` sin migracion aprobada.

### 9. Pedidos

- Estado actual: no implementable con datos reales.
- Documentar estado vacio o preparar propuesta de migracion aparte.

### 10. Media/reportes

- Media: resolver archivos por coleccion/campo.
- Reportes: agregaciones client-side sobre colecciones reales disponibles.
- No crear coleccion `reports` sin requerimiento backend.

## Criterios de aceptacion aplicados al analisis

- La integracion no debe modificar Dale Pues salvo justificacion y migracion.
- No crear colecciones nuevas si existe equivalente.
- No renombrar campos.
- Reutilizar reglas y roles `admin/support`.
- Cada modulo conectado debe quedar documentado conforme avance.
