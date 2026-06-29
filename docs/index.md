---
layout: home

hero:
  name: Dale Pues Dashboard
  text: Documentacion tecnica
  tagline: Integracion del dashboard Angular con el ecosistema existente de Dale Pues.
  actions:
    - theme: brand
      text: Analisis de integracion
      link: /DALE_PUES_INTEGRATION_ANALYSIS
    - theme: alt
      text: Modulos del dashboard
      link: /DALE_PUES_DASHBOARD_MODULES

features:
  - title: Arquitectura existente
    details: Resume frontend Angular, PocketBase, migraciones, servicios y decisiones tecnicas ya tomadas en Dale Pues.
  - title: Integracion del dashboard
    details: Documenta como el dashboard se conecta a colecciones reales sin inventar campos ni duplicar logica.
  - title: Estado por modulo
    details: Registra alcance, colecciones usadas, limitaciones y pendientes por cada modulo administrativo.
---

## Resumen del proyecto

Este sitio centraliza la documentacion del nuevo dashboard Angular y su integracion con Dale Pues.

La regla principal del proyecto es que el dashboard debe adaptarse al backend y al frontend existente: reutilizar colecciones, campos, reglas de negocio y patrones de servicios ya documentados. No se deben crear colecciones nuevas ni cambiar nombres de campos sin una migracion justificada en Dale Pues.

## Documentos principales

- [Analisis de integracion Dale Pues](./DALE_PUES_INTEGRATION_ANALYSIS.md)
- [Modulos del dashboard](./DALE_PUES_DASHBOARD_MODULES.md)

## Flujo de integracion

```mermaid
flowchart LR
  Docs[Documentacion existente] --> Analysis[Analisis de integracion]
  Analysis --> Services[Servicios Angular]
  Services --> PB[(PocketBase)]
  PB --> Dashboard[Dashboard admin]
  Dashboard --> Modules[Categorias, productos, usuarios, restaurantes y conductores]
```

## Comandos

```bash
npm install
npm run docs:dev
npm run docs:build
npm run docs:preview
```
