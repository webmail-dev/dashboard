# Dale Pues Settings / Branding

## Estado

Se implementa un módulo de ajustes visuales y generales para que el dashboard admin gestione la identidad de la app desde PocketBase.

Ruta del dashboard:

- `/settings/profile`

## Colección PocketBase

Se revisó el proyecto base en `../dale-pues/dale-pues`. No existe una colección equivalente a:

- `app_settings`
- `settings`
- `system_settings`
- `app_config`
- `branding`
- `configuration`

Por eso se agrega una migración nueva en el backend real:

- `backend/pb_migrations/20260629000300_app_settings.js`

Colección creada:

- `app_settings`

La colección está pensada para un registro principal único con `key = default`.

## Campos

| Campo | Tipo | Uso |
| --- | --- | --- |
| `key` | text, required, unique | Identificador lógico del registro principal. |
| `appName` | text, required | Nombre visible de la app. |
| `slogan` | text | Frase corta de marca. |
| `logoHorizontal` | file | Logo horizontal para sidebar, reportes, correos y PWA. |
| `logoSquare` | file | Logo compacto para sidebar colapsado, PWA e íconos. |
| `primaryColor` | text | Color principal en formato hex. |
| `secondaryColor` | text | Color secundario en formato hex. |
| `accentColor` | text | Color de acento en formato hex. |
| `supportEmail` | email | Correo de soporte. |
| `supportPhone` | text | Teléfono de soporte. |
| `websiteUrl` | url | Sitio web público. |
| `country` | text | País por defecto. |
| `currency` | text | Moneda por defecto. |
| `timezone` | text | Zona horaria por defecto. |
| `maintenanceMode` | bool | Control futuro para mantenimiento. |
| `active` | bool | Indica si esta configuración está activa. |

## Valores Iniciales

```txt
key: default
appName: Dale Pues
slogan: Delivery rápido y confiable
primaryColor: #FF7A00
secondaryColor: #1B1D2A
accentColor: #FFD700
country: Venezuela
currency: VES
timezone: America/Caracas
maintenanceMode: false
active: true
```

## Reglas

La colección queda restringida a administradores:

```txt
list/view/create/update/delete: @request.auth.type = "admin"
```

No se expone lectura pública porque la configuración puede contener datos operativos de soporte y flags globales.

## Servicios Angular

Se agregan:

- `src/app/core/services/settings.service.ts`
- `src/app/core/services/branding.service.ts`

`SettingsService` incluye:

- `getSettings()`
- `ensureDefaultSettings()`
- `updateSettings(data)`
- `updateSettingsWithFiles(data, files)`
- `getLogoHorizontalUrl(settings)`
- `getLogoSquareUrl(settings)`

Las subidas de logos usan `FormData`. Las URLs de archivos se resuelven con:

```ts
pb.files.getURL(record, filename)
```

`BrandingService` expone:

- `branding$`
- `loadBranding()`
- `refreshBranding()`

También publica variables CSS globales preparadas para uso futuro:

- `--dale-primary-color`
- `--dale-secondary-color`
- `--dale-accent-color`

## Pantalla

La pantalla `Settings / Branding` permite editar:

- Nombre de la app
- Slogan
- Logo horizontal
- Logo cuadrado
- Color primario
- Color secundario
- Color de acento
- Email de soporte
- Teléfono de soporte
- Sitio web
- País
- Moneda
- Zona horaria
- Modo mantenimiento
- Estado activo

Incluye:

- Formulario reactivo
- Validaciones básicas
- Preview de logo horizontal
- Preview de logo cuadrado
- Estados `loading`, `saving`, `error`, `success`
- `ChangeDetectorRef` después de cargas y guardados async

## Aplicación en Layout

El `AdminLayoutComponent` carga el branding al inicializar el layout protegido.

El sidebar consume `BrandingService.branding$` y aplica:

- `logoHorizontal` en el logo principal.
- `logoSquare` en el logo compacto.
- `appName` como texto y atributo `alt`.

Si no hay logos configurados, se mantienen los assets originales de la plantilla:

- `assets/dashboard/images/logo/full-white.svg`
- `assets/dashboard/images/logo/logo.png`

Después de guardar desde `/settings/profile`, el módulo llama `refreshBranding()` para actualizar el sidebar sin recargar la app.

## Pendientes

- Ejecutar la migración en el entorno PocketBase correspondiente.
- Reutilizar estos valores para manifiesto PWA, reportes PDF y plantillas de notificaciones.
- Definir si `maintenanceMode` bloqueará pantallas públicas o solo mostrará aviso.
