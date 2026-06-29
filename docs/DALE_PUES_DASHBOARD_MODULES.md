# Dale Pues Dashboard Modules

Fecha: 2026-06-29

## Estado general

El dashboard Angular se esta conectando al esquema real de Dale Pues sin crear colecciones nuevas. Los modulos implementados consumen PocketBase mediante una unica instancia SDK y respetan las colecciones documentadas en `DALE_PUES_INTEGRATION_ANALYSIS.md`.

## Capa de servicios PocketBase

Estado: implementada.

Archivos:

- `dashboard/src/app/core/services/pocketbase.service.ts`
- `dashboard/src/app/core/services/dale-pues-crud.service.ts`
- `dashboard/src/app/core/services/categories.service.ts`
- `dashboard/src/app/core/services/businesses.service.ts`
- `dashboard/src/app/core/services/products.service.ts`
- `dashboard/src/app/core/services/users.service.ts`
- `dashboard/src/app/core/services/banners.service.ts`
- `dashboard/src/app/core/services/promotions.service.ts`
- `dashboard/src/app/core/services/dale-pues-admin-data.service.ts`

Decision:

- `PocketbaseService` mantiene una sola instancia `new PocketBase(environment.pocketbaseUrl)` y expone `getInstance`, igual que Dale Pues.
- `DalePuesCrudService` centraliza `list`, `getFullList`, `getOne`, `create`, `update`, `delete`, `setActive`, `count`, resolucion de archivos PocketBase con `resolveImage` y envio de `FormData`.
- Los servicios por coleccion solo usan colecciones reales: `users`, `categories`, `businesses`, `products`, `banners`, `promotions`.
- `DalePuesAdminDataService` queda como fachada compatible para las paginas actuales y delega en los servicios especificos.
- No se agregan servicios para pedidos, pagos, carrito o tracking porque no existen colecciones reales.
- Las paginas que cargan datos async usan `loading`, `error` y `ChangeDetectorRef.detectChanges()` para evitar render incompleto despues de recibir datos desde PocketBase.

## 1. Configuracion PocketBase

Estado: implementado.

Archivos:

- `dashboard/src/environments/environment.ts`
- `dashboard/src/environments/environment.prod.ts`
- `dashboard/src/app/core/services/pocketbase.service.ts`
- `dashboard/package.json`

Decision:

- Se usa `pocketbaseUrl: 'http://127.0.0.1:8090'` en desarrollo, igual que Dale Pues.
- Produccion queda preparada con `environment.prod.ts`.
- `angular.json` usa `fileReplacements` en production.
- Se agrego dependencia `pocketbase@^0.27.0`, la misma familia usada por Dale Pues.

## 2. Autenticacion/admin

Estado: implementado.

Archivos:

- `dashboard/src/app/core/services/auth-pocketbase.service.ts`
- `dashboard/src/app/core/guards/admin-auth.guard.ts`
- `dashboard/src/app/pages/login/*`
- `dashboard/src/app/app.routes.ts`

Reglas:

- Login contra `users.authWithPassword`.
- Solo entran usuarios con `type = "admin"` o `type = "support"`.
- Usuarios `blocked` o `inactive` se rechazan.
- No se crea coleccion nueva de administradores.
- El logout limpia `pb.authStore`.

## 3. Dashboard principal

Estado: parcialmente implementado con datos reales disponibles.

Archivos:

- `dashboard/src/app/core/services/dale-pues-admin-data.service.ts`
- `dashboard/src/app/pages/dashboard/dashboard.ts`
- `dashboard/src/app/pages/dashboard/dashboard.html`

Datos reales:

- Total de productos desde `products`.
- Total de restaurantes desde `businesses` con `type = "restaurant"`.
- Total de usuarios desde `users`.
- El servicio tambien calcula categorias, conductores y usuarios pendientes para siguientes cards/reportes.

Limitacion:

- Las metricas de ventas/pedidos/ingresos no existen en backend porque no hay coleccion de pedidos ni pagos.

## 4. Categorias

Estado: listado real implementado.

Coleccion:

- `categories`

Campos usados:

- `name`, `type`, `image`, `imageUrl`, `icon`, `alt`, `created`, `active`.

Decision:

- Se mantiene la tabla y clases originales.
- El `tbody` usa `@for` con datos PocketBase.
- La imagen resuelve primero file real y luego URL temporal.

## 5. Productos

Estado: listado real implementado.

Coleccion:

- `products`

Campos usados:

- `name`, `type`, `price`, `currency`, `stock`, `active`, `image`, `imageUrl`, `alt`.

Decision:

- Se mantiene la tabla y clases originales.
- No se crea coleccion nueva para inventario.
- `stock` viene del campo real `products.stock`.
- La pagina usa una consulta progresiva: primero `getList(1, 200, { sort: '-updated' })`; si la instancia PocketBase rechaza ese sort, cae a `getList(1, 200)` sin `sort`.
- No usa `expand=business,category` en el listado principal porque algunas instancias reales pueden tener esquema desalineado con la migracion documentada. Los nombres de negocio y categoria se resuelven despues con consultas tolerantes por id.

## 6. Restaurantes

Estado: listado real implementado.

Coleccion a usar:

- `businesses`

Filtro:

- `type = "restaurant"`

Campos relevantes:

- `name`, `slug`, `cover`, `coverUrl`, `logo`, `logoUrl`, `description`, `phone`, `whatsapp`, `address`, `rating`, `deliveryTime`, `active`, `featured`, `owner`.

Archivos:

- `dashboard/src/app/pages/restaurants/*`
- `dashboard/src/app/core/services/dale-pues-admin-data.service.ts`
- `dashboard/src/app/app.routes.ts`

Decision:

- Se consulta `businesses` con `type = "restaurant"`.
- Se conserva estructura visual de tabla de la plantilla.
- Las imagenes resuelven `logo`, luego `cover`, y luego fallback visual de la plantilla.

## 6.1. Negocios

Estado: listado real implementado.

Coleccion:

- `businesses`

Campos usados:

- `name`, `slug`, `type`, `logo`, `cover`, `phone`, `whatsapp`, `city`, `address`, `rating`, `featured`, `active`, `owner`.

Decision:

- Esta pagina cubre la coleccion completa `businesses`.
- `restaurants` queda como vista filtrada por `type = "restaurant"`.

## 7. Usuarios

Estado: listado real implementado.

Coleccion:

- `users`

Campos usados:

- `name`, `email`, `phone`, `type`, `status`, `avatar`.

Reglas:

- Listado depende de permisos `admin/support` definidos en PocketBase.
- No se duplica la logica de roles fuera de `users.type`.

## 8. Conductores

Estado: listado real implementado con campos disponibles.

Fuente real:

- `users` filtrado por `type = "courier"`.

Campos disponibles:

- `identityDocument`, `vehicleType`, `status`, `phone`, `address`.

Limitacion:

- No existe `courier_profiles`. Esta migracion figura como issue pendiente en Dale Pues.

Archivos:

- `dashboard/src/app/pages/drivers/*`
- `dashboard/src/app/core/services/dale-pues-admin-data.service.ts`
- `dashboard/src/app/app.routes.ts`

Decision:

- Se consulta `users` con `type = "courier"`.
- No se crea `courier_profiles`; el dashboard muestra `identityDocument`, `vehicleType`, `status`, `phone` y datos de usuario disponibles.

## 9. Pedidos

Estado: bloqueado por backend.

No existe coleccion de pedidos, pagos, carrito o tracking en migraciones ni docs. El dashboard no debe crear `orders` sin migracion aprobada en Dale Pues.

## 10. Media/reportes

Estado: pendiente.

Media:

- Debe resolverse desde campos file existentes por coleccion: `avatar`, `image`, `logo`, `cover`.

Reportes:

- Solo pueden construirse con agregaciones de colecciones existentes hasta que exista esquema transaccional.

## 11. Banners

Estado: listado real implementado.

Coleccion:

- `banners`

Campos usados:

- `title`, `subtitle`, `highlight`, `image`, `imageUrl`, `alt`, `ctaText`, `link`, `section`, `position`, `active`, `startDate`, `endDate`.

## 12. Promociones

Estado: listado real implementado.

Coleccion:

- `promotions`

Campos usados:

- `title`, `description`, `business`, `product`, `section`, `discountType`, `discountValue`, `badgeText`, `image`, `imageUrl`, `active`, `startDate`, `endDate`, `order`.

Relaciones:

- `business` se expande contra `businesses`.
- `product` se expande contra `products`.

## Cobertura de colecciones

| Coleccion | Estado en dashboard | Nota |
| --- | --- | --- |
| `users` | Cubierta | Lista completa y vista filtrada de conductores. |
| `categories` | Cubierta | Lista con seccion, orden, estado e imagen. |
| `businesses` | Cubierta | Lista completa y restaurantes filtrados. |
| `products` | Cubierta | Muestra relaciones, stock, rating, featured, delivery y estado. |
| `banners` | Cubierta | Lista por seccion, posicion, CTA y fechas. |
| `promotions` | Cubierta | Lista con relaciones a negocio/producto. |
| Pedidos/pagos/carrito/tracking | No aplica | No existen colecciones ni migraciones reales. |
