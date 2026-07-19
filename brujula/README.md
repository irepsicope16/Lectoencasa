# 🧭 Método Brújula

**Encontrá tu norte. Construí tu camino.**

Plataforma profesional de Orientación Vocacional de **Psicope con Ire**.
No es un test vocacional: es el software con el que se conduce un proceso completo de
orientación — evaluación, acompañamiento, seguimiento, proyecto de vida, informes e IA —
alrededor de un método propio de 12 módulos.

## Desarrollo

```bash
npm install
npm run dev        # entorno local
npm run build      # build de producción (dist/)
npm run typecheck  # verificación de tipos
```

## Cuentas demo

| Rol | Email | Clave |
|---|---|---|
| Profesional | `ire@psicopeconire.com` | `brujula` |
| Consultante | `valen@demo.com` | `brujula` |

Los datos demo se siembran automáticamente la primera vez (LocalStorage).
Podés restablecerlos desde **Ajustes → Datos**.

## Arquitectura

Ver [ARCHITECTURE.md](./ARCHITECTURE.md): estructura de carpetas, modelo de dominio,
capa de persistencia migrable a Supabase, Motor Brújula, capa IA e informes PDF.
