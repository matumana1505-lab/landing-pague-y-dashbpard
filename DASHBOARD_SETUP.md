# Guía de Integración: Dashboard Resply

## Estructura del Proyecto

```
app/
├── dashboard/
│   ├── layout.tsx          # Layout del dashboard
│   └── page.tsx            # Página principal del dashboard
│
components/
├── dashboard/
│   ├── dashboard-content.tsx       # Componente raíz (maneja estado)
│   ├── dashboard-header.tsx        # Encabezado con logo y estado
│   ├── google-business-status.tsx  # Tarjeta de estado de conexión
│   ├── metrics-summary.tsx         # Resumen de métricas (4 tarjetas)
│   ├── alerts-section.tsx          # Reseñas negativas sin responder
│   ├── review-card.tsx             # Card individual de reseña
│   ├── reviews-list.tsx            # Lista de todas las reseñas
│   ├── settings-panel.tsx          # Configuración de tono
│   ├── automation-settings.tsx     # Configuración de automatización
│   ├── empty-state.tsx             # Estado vacío (no conectado)
│   └── review-response-dialog.tsx  # Modal de respuesta
│
lib/
├── types.ts                        # Tipos TypeScript compartidos
└── mock-data.ts                    # Datos simulados
```

## Flujo de Datos

```
DashboardContent (Estado Principal)
├── mockBusinessProfile
├── mockReviews[]
├── userSettings
└── Pasa props a componentes hijos
```

## Secciones del Dashboard

### 1. **DashboardHeader**
- Muestra logo de Resply + nombre del negocio
- Estado de conexión (Conectado/No conectado)
- Fecha de última sincronización
- Botón "Conectar Google Business"

### 2. **GoogleBusinessStatus**
- Tarjeta destacada con estado de conexión
- Si está conectado: muestra dirección, teléfono y fecha de sync
- Si no está conectado: muestra botón CTA principal

### 3. **MetricsSummary**
- Grid de 4 tarjetas con KPIs principales:
  - Total de reseñas
  - Calificación promedio
  - Reseñas sin responder
  - Reseñas negativas pendientes

### 4. **AlertsSection**
- Reseñas de 1-2 estrellas sin responder
- Cada alerta muestra:
  - Rating con estrellas
  - Nombre del reviewer + foto
  - Texto completo
  - Botón "Generar respuesta"
- Estado vacío si no hay alertas

### 5. **Tabs (3 secciones)**
- **Últimas reseñas**: Lista completa ordenada por fecha
- **Configuración**: Selector de tono + vista previa
- **Automatización**: Toggles para auto-responder, alertas, resumen mensual

### 6. **Empty State**
- Se muestra cuando `businessProfile.isConnected === false`
- Botón CTA grande para conectar Google Business
- Reemplaza todo el contenido del dashboard

## Flujo de Integración con Google Business Profile API

### Paso 1: Reemplazar Mock Data
Cuando integres la API real, reemplaza en `dashboard-content.tsx`:

```typescript
// ANTES (mock)
const [businessProfile] = useState(mockBusinessProfile)
const [reviews] = useState<Review[]>(mockReviews)

// DESPUÉS (API)
const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
const [reviews, setReviews] = useState<Review[]>([])

useEffect(() => {
  fetchBusinessProfile() // API call
  fetchReviews()         // API call
}, [userId])
```

### Paso 2: Crear API Routes

Crea los siguientes endpoints en `app/api/`:

```
api/
├── business/
│   ├── profile/
│   │   └── route.ts              # GET: obtener perfil del negocio
│   └── sync/
│       └── route.ts              # POST: sincronizar reseñas
│
├── reviews/
│   ├── route.ts                  # GET: listar reseñas
│   └── [reviewId]/
│       ├── respond/
│       │   └── route.ts          # POST: responder reseña
│       └── route.ts              # GET: obtener reseña específica
│
└── settings/
    └── route.ts                  # GET/POST: guardar preferencias
```

### Paso 3: Implementar Funciones Helper

Crea `lib/api-client.ts` con funciones para:

```typescript
// Autenticación
- getAccessToken()
- refreshAccessToken()
- authorizeBusinessProfile()

// Lectura
- fetchBusinessProfile(accountId, locationId)
- fetchReviews(accountId, locationId, pageSize, pageToken)
- fetchReview(accountId, locationId, reviewId)

// Escritura
- respondToReview(accountId, locationId, reviewId, response)

// Sincronización
- syncAllReviews(accountId, locationId)
```

### Paso 4: Manejar Estados de Carga

```typescript
type DashboardState = 
  | "idle"           // Esperando conexión
  | "loading"        // Cargando datos
  | "connected"      // Conectado y con datos
  | "error"          // Error de conexión/API
  | "syncing"        // Sincronizando reseñas

// En DashboardHeader, mostrar estado de sync
// En MetricsSummary, mostrar skeleton mientras carga
```

### Paso 5: Implementar Real-Time Updates

Opciones:
1. **Polling**: `setInterval(() => syncReviews(), 5*60*1000)` (cada 5 min)
2. **Webhooks**: Google envía eventos cuando hay nuevas reseñas
3. **WebSockets**: Para actualizaciones instantáneas

### Paso 6: Cachear Datos Localmente

Usa localStorage o sesión para:
- Último estado del negocio
- Caché de reseñas (30 min)
- Configuración del usuario

## Manejo de Errores

Casos a considerar:

```typescript
// Token expirado
if (error.code === 401) {
  // Refrescar token
  // Reintentar request
}

// Permiso denegado
if (error.code === 403) {
  // Pedir reautenticación
  // Mostrar modal de reconexión
}

// Rate limit
if (error.code === 429) {
  // Esperar y reintentar (exponential backoff)
  // Mostrar mensaje al usuario
}

// Negocio no encontrado
if (error.code === 404) {
  // Mostrar estado vacío
}
```

## Seguridad

### Credenciales OAuth
- Guardar `refresh_token` en base de datos encriptada
- NO guardar nunca en localStorage
- Validar permisos en cada request

### Validación
- Validar estructura de datos con Zod
- Sanitizar texto de respuestas
- Rate-limit requests por usuario

### CORS y CSRF
- Las API routes de Next.js manejan CORS automáticamente
- Implementar CSRF tokens para POSTs

## Optimizaciones

### Performance
- Paginación: cargar 10 reseñas por página
- Lazy loading: cargar más al scroll
- Caché: no refrescar hasta que el usuario lo pida
- Debouncing: en búsquedas/filtros

### UX
- Skeleton loaders mientras se cargan datos
- Toast notifications para confirmaciones
- Estados de error claros
- Botón "Reintentar" en caso de fallo

## Testing

Casos de prueba recomendados:

```typescript
// Mock API responses
- Test conexión exitosa
- Test fallo de autenticación
- Test reseña sin responder
- Test generación de respuesta

// UI
- Test empty state
- Test carga de reseñas
- Test clickeo en "Generar respuesta"
- Test guardado de settings

// E2E
- Flujo completo: login → conectar → ver reseñas
```

## Próximos Pasos

1. ✅ Dashboard UI completado (HECHO)
2. ⚠️ Implementar autenticación OAuth de Google
3. ⚠️ Crear API routes para sincronizar reseñas
4. ⚠️ Integrar generación de respuestas con IA
5. ⚠️ Implementar base de datos para persistencia
6. ⚠️ Agregar notificaciones en tiempo real
7. ⚠️ Testing y QA completa
8. ⚠️ Deploy a producción

---

## Notas Importantes

- **Mock data**: Actualmente usando `lib/mock-data.ts`. Este archivo simula 8 reseñas con diferentes ratings
- **Componentes UI**: Usando shadcn/ui (ya instalado en el proyecto)
- **Styling**: Tailwind CSS con las variables de color del proyecto
- **Date formatting**: `date-fns` con locale español
- **TypeScript**: Tipos compartidos en `lib/types.ts`

---

Para empezar la integración con Google Business Profile API, avísame y te guiaré paso a paso.
