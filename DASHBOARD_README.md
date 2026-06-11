# 🎯 Dashboard Resply - Documentación Completa

## ✅ Estado del Proyecto

El dashboard está **100% funcional** con datos simulados. Ahora puedes:
- Ver reseñas de tu negocio
- Generar respuestas automáticas
- Configurar preferencias
- Activar/desactivar automatización

---

## 📁 Estructura de Carpetas

```
project-root/
├── app/
│   └── dashboard/
│       ├── layout.tsx          # Layout del dashboard
│       └── page.tsx            # Página principal
│
├── components/
│   └── dashboard/
│       ├── dashboard-header.tsx
│       ├── google-business-status.tsx
│       ├── metrics-summary.tsx
│       ├── metric-card.tsx
│       ├── alerts-section.tsx
│       ├── review-card.tsx
│       ├── reviews-list.tsx
│       ├── settings-panel.tsx
│       ├── automation-settings.tsx
│       ├── empty-state.tsx
│       ├── review-response-dialog.tsx
│       └── dashboard-content.tsx
│
├── lib/
│   ├── types.ts                # Tipos TypeScript
│   └── mock-data.ts            # Datos de prueba
│
└── DASHBOARD_SETUP.md          # Guía de integración API
```

---

## 🎨 Secciones del Dashboard

### 1️⃣ **Encabezado (Header)**
- Logo de Resply + nombre del negocio
- Estado de conexión (verde = conectado)
- Último tiempo de sincronización
- Botón de reconexión si es necesario

```
[Logo] La Pizzería del Centro    [Conectado] Sync hace 2 horas
```

---

### 2️⃣ **Estado de Google Business**
Tarjeta destacada que muestra:
- ✅ Si está conectado
- 📍 Dirección del negocio
- 📞 Teléfono
- 🕐 Última sincronización

---

### 3️⃣ **Resumen de Métricas** (4 tarjetas)

| Métrica | Valor | Descripción |
|---------|-------|-------------|
| **Total de reseñas** | 8 | Todas las reseñas del negocio |
| **Calificación promedio** | 3.6/5 | Rating promedio actual |
| **Sin responder** | 4 | Reseñas pendientes de respuesta |
| **Negativas pendientes** | 2 | Reseñas de 1-2 estrellas sin responder |

---

### 4️⃣ **Sección de Alertas**
Muestra reseñas negativas (1-2 ⭐) sin responder:
- Cada alerta contiene:
  - Rating visible
  - Nombre del reviewer
  - Texto completo de la reseña
  - **Botón "Generar respuesta"**

---

### 5️⃣ **Pestaña 1: Últimas Reseñas**
Lista completa de todas las reseñas:
- Ordenadas por fecha (más recientes primero)
- Color diferente según rating
- Estado: Respondida ✓ o Pendiente ⏱
- Botón "Ver respuesta" si está respondida

---

### 6️⃣ **Pestaña 2: Configuración**
Selector de tono de respuesta:
- 🎯 **Cercano**: "¡Gracias! Nos alegra que te haya gustado. Volveremos pronto 😊"
- 💼 **Profesional**: "Agradecemos tu comentario. Esperamos poder servirte nuevamente."
- 🤝 **Formal**: "Le agradecemos por su reseña y su preferencia."

Botón para guardar la preferencia.

---

### 7️⃣ **Pestaña 3: Automatización**
Tres toggles independientes:

| Feature | Estado | Descripción |
|---------|--------|-------------|
| 🚀 Respuestas automáticas | OFF | Generar respuestas automáticamente a todas |
| 🔔 Alertas de negativos | ON | Notificación cuando hay reseñas 1-2⭐ |
| 📊 Resumen mensual | ON | Reporte mensual de métricas |

---

### 8️⃣ **Empty State**
Cuando NO está conectado:
- Mensaje explicativo grande
- Botón CTA principal: "Conectar Google Business"
- Instrucción: "Se abrirá una ventana para autorizar"

---

## 🗂️ Tipos TypeScript

### Review
```typescript
interface Review {
  id: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  reviewerName: string
  reviewerImage?: string
  createdAt: Date
  hasResponse: boolean
  response?: string
  responseDate?: Date
}
```

### BusinessProfile
```typescript
interface BusinessProfile {
  id: string
  name: string
  accountId?: string          // Para Google API
  locationId?: string         // Para Google API
  isConnected: boolean
  lastSyncedAt?: Date
  address?: string
  phone?: string
}
```

### DashboardMetrics
```typescript
interface DashboardMetrics {
  totalReviews: number
  averageRating: number
  unansweredReviews: number
  negativeReviewsPending: number
}
```

### UserSettings
```typescript
interface UserSettings {
  tone: "friendly" | "professional" | "formal"
  autoRespond: boolean
  alertNegativeReviews: boolean
  monthlySummary: boolean
}
```

---

## 📊 Mock Data

El archivo `lib/mock-data.ts` contiene:
- **8 reseñas** con diferentes ratings y estados
- **1 perfil de negocio** conectado
- **Métricas calculadas** automáticamente
- **Configuración de usuario** por defecto

```typescript
// Funciones helper disponibles:
getUnansweredReviews()      // Reseñas sin responder
getNegativeReviews()        // Reseñas 1-2 estrellas
getReviewsSortedByDate()    // Ordenadas por fecha
getReviewsSortedByRating()  // Ordenadas por rating
```

---

## 🎬 Flujo de Datos

```
DashboardContent (componente principal)
    ├─ businessProfile (estado)
    ├─ reviews[] (estado)
    ├─ userSettings (estado)
    └─ selectedReview (para modal)
        │
        ├─→ DashboardHeader
        ├─→ GoogleBusinessStatus
        ├─→ MetricsSummary
        ├─→ AlertsSection
        └─→ Tabs
            ├─ ReviewsList
            ├─ SettingsPanel
            └─ AutomationSettings
```

---

## 🚀 Cómo Usar Ahora

### 1. Ver el Dashboard
```bash
npm run dev
# Abre http://localhost:3000/dashboard
```

### 2. Explorar Funcionalidades
- ✅ Desplázate por las reseñas
- ✅ Haz clic en "Ver respuesta" en reseñas respondidas
- ✅ Cambia el tono en la pestaña "Configuración"
- ✅ Activa/desactiva automatización

### 3. Datos de Prueba
Hay 8 reseñas simuladas:
- 3 de 5 estrellas (2 respondidas)
- 1 de 4 estrellas (sin responder)
- 1 de 3 estrellas (sin responder)
- 2 de 1-2 estrellas (sin responder) ← **Alertas**

---

## 🔄 Integración con Google Business Profile API

### Próximos Pasos (Cuando Estés Listo)

**Fase 1: Autenticación**
- Implementar flujo OAuth con Google
- Guardar `accessToken` y `refreshToken`
- Crear función para refrescar tokens

**Fase 2: API Routes**
- `GET /api/business/profile` - Obtener perfil
- `GET /api/reviews` - Listar reseñas
- `POST /api/reviews/[id]/respond` - Responder reseña
- `POST /api/business/sync` - Sincronizar

**Fase 3: Datos Reales**
- Reemplazar `mockReviews` con API calls
- Actualizar `businessProfile` desde API
- Implementar caché local

**Fase 4: Features Avanzadas**
- Sincronización periódica (polling)
- Notificaciones en tiempo real
- Base de datos para historial
- Generación IA de respuestas

Ver `DASHBOARD_SETUP.md` para detalles técnicos completos.

---

## 🎨 Diseño y Estilo

- **Color scheme**: Coherente con landing page
- **Componentes UI**: shadcn/ui (ya instalado)
- **Tailwind CSS**: Utility-first styling
- **Responsive**: Mobile-first, funciona en todo
- **Dark mode**: Soportado automáticamente
- **Formato de fechas**: `date-fns` con locale español

---

## 📱 Responsive Design

- ✅ **Desktop** (1920px+): 4 columnas de métricas
- ✅ **Tablet** (768px-1024px): 2 columnas de métricas
- ✅ **Mobile** (<768px): 1 columna, ajustado automáticamente

---

## 🧪 Casos de Uso Testeados

✅ Negocio conectado con reseñas
✅ Reseñas con y sin responder
✅ Navegación entre pestañas
✅ Modal de respuesta
✅ Cambio de configuración
✅ Toggles de automatización
✅ Empty state (no conectado)

---

## 📝 Archivos Nuevos Creados

1. `lib/types.ts` - Tipos ampliados
2. `lib/mock-data.ts` - Datos de prueba
3. `components/dashboard/dashboard-*.tsx` - 12 componentes
4. `app/dashboard/layout.tsx` - Layout
5. `app/dashboard/page.tsx` - Página
6. `DASHBOARD_SETUP.md` - Guía técnica

---

## 🔗 URLs Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/dashboard` | Dashboard (con datos simulados) |
| `/test` | Página de prueba |

---

## 💡 Próximas Acciones Recomendadas

1. **Revisa el dashboard** en http://localhost:3000/dashboard
2. **Lee `DASHBOARD_SETUP.md`** para entender la arquitectura de API
3. **Cuando estés listo**, integramos Google Business Profile API
4. **Implementamos** autenticación OAuth
5. **Conectamos** datos reales desde Google

---

## ❓ Preguntas Frecuentes

**P: ¿Dónde están los datos reales?**
R: Actualmente usando mock data en `lib/mock-data.ts`. Los datos reales vendrán de Google Business Profile API.

**P: ¿Cómo cambio el tono?**
R: Pestaña "Configuración" → Selector de tono → Guardar

**P: ¿Cómo veo las alertas?**
R: Las reseñas de 1-2 estrellas sin responder aparecen automáticamente en "Atención requerida"

**P: ¿Se guarda la configuración?**
R: Actualmente en estado local. Se guardará en BD cuando integres la API.

**P: ¿Cómo deshabilito las respuestas automáticas?**
R: Pestaña "Automatización" → Desactiva el toggle

---

## 📞 Soporte

Si tienes preguntas sobre:
- **Estructura de componentes** → Mira `components/dashboard/`
- **Tipos de datos** → Revisa `lib/types.ts`
- **Integración API** → Lee `DASHBOARD_SETUP.md`
- **Mock data** → Edita `lib/mock-data.ts`

---

**¡Dashboard completado y listo para usar! 🎉**
