# Arquitectura de respuestas de Resply

## Visión general

Resply separa claramente dos responsabilidades:

- Google Business es la fuente de verdad para las respuestas publicadas.
- Prisma almacena el estado operativo interno de la plataforma para gestionar el flujo de trabajo.

No existe una duplicación de verdad. Google Business representa lo que ya está publicado. Prisma representa cómo la aplicación gestiona una respuesta desde la generación hasta la publicación.

## Capas de la arquitectura

### 1. Fuente de reseñas

La fuente de reseñas puede ser:

- Google Business en producción
- mock-data.ts mientras se desarrolla sin las APIs de Google

El componente de UI consume reseñas desde una fuente abstracta. La lógica de generación y publicación no depende de dónde provienen las reseñas.

### 2. Generación de respuestas

La generación se realiza mediante el endpoint /api/generate-review-response.

Ese endpoint:

- usa el prompt construido por build-review-response-prompt.ts
- toma la configuración actual de BusinessAiConfig desde Prisma
- invoca Gemini
- devuelve la respuesta generada

### 3. Estado operativo en Prisma

Prisma no compite con Google Business. Solo guarda información de control interna para el flujo de trabajo.

Se persisten los campos mínimos necesarios:

- businessId
- googleReviewId (o reviewExternalId)
- generatedText
- publishedText
- status
- version
- lastSyncedAt
- publishedAt
- publishedBy
- editedByUser

### 4. UI y dashboard

El dashboard usa:

- hooks para obtener y actualizar la configuración de IA
- componentes para mostrar reseñas y respuestas
- el estado local para representar la experiencia del usuario

La UI no debe ser la fuente de verdad. Solo refleja el estado operativo que viene de Prisma y el estado público proveniente de Google.

## Flujo completo de una respuesta

1. La app recibe una reseña desde Google Business o desde mock-data.ts.
2. El usuario solicita generar una respuesta con Gemini.
3. El endpoint genera la respuesta usando el prompt y la configuración del negocio.
4. Prisma registra un registro operativo con el estado GENERATED.
5. Si el usuario edita la respuesta, el estado pasa a EDITED.
6. Cuando se publica en Google Business, el estado pasa a PUBLISHED.
7. Prisma se sincroniza con la información de publicación.

## Modelo de estados

El sistema soporta estados operativos del flujo:

- GENERATED
- EDITED
- PUBLISHED
- APPROVED
- FAILED
- SCHEDULED

La arquitectura está preparada para crecer sin romper el modelo porque los estados son flexibles y extensibles.

## Fuente de verdad por entidad

### Reseña
- Fuente de verdad: Google Business cuando exista, o mock-data.ts en desarrollo.

### Respuesta publicada
- Fuente de verdad: Google Business.

### Estado operativo interno
- Fuente de verdad: Prisma.

## Estrategia de sincronización

Google Business siempre tiene prioridad para lo que ya está publicado.

Si existe diferencia entre Google y Prisma:

- el contenido publicado en Google prevalece
- Prisma debe sincronizarse automáticamente para reflejar el estado real de la publicación

La sincronización no debe duplicar la información de Google ni convertir a Prisma en una segunda fuente de verdad.

## Decisiones de diseño

### Por qué Prisma no almacena toda la información de Google

Porque eso duplicaría datos que ya existen en Google Business y haría más complejo el sistema.

Prisma almacena solo lo mínimo necesario para:

- rastrear el flujo de trabajo
- conservar la versión de una respuesta
- distinguir entre generada, editada y publicada
- sincronizar con Google Business

### Por qué el modelo está preparado para crecimiento

Porque el estado y los metadatos operativos están separados del origen de la reseña y del canal de publicación.

Esto facilita agregar después:

- aprobación humana
- fallos de publicación
- programación de respuestas
- historial de versiones
- analítica
