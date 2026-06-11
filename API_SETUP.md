# Resply Backend - API de Generación de Respuestas a Reseñas

## Descripción

Este backend proporciona una API REST para generar respuestas automáticas a reseñas de clientes utilizando Google Gemini. La API recibe una reseña y devuelve una respuesta profesional y empática.

## Configuración

### 1. Obtener la API Key de Gemini

1. Ve a [https://ai.google.dev/tutorials/setup](https://ai.google.dev/tutorials/setup)
2. Crea un proyecto en Google AI Studio
3. Genera una API Key gratuita
4. Copia la clave

### 2. Configurar las Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Abre `.env.local` y reemplaza `your_gemini_api_key_here` con tu API Key:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```

### 3. Instalar Dependencias

```bash
npm install @google/generative-ai
```

## Uso

### Desde el Frontend

Puedes usar la función `generateReviewResponse` del cliente:

```typescript
import { generateReviewResponse } from "@/lib/api-client";

const response = await generateReviewResponse("Excelente servicio, muy satisfecho");
console.log(response.response);
```

### Llamada Directa a la API

**Endpoint:** `POST /api/generate-review-response`

**Request:**
```json
{
  "review": "El producto llegó dañado pero el servicio al cliente fue excelente"
}
```

**Response (Éxito):**
```json
{
  "response": "Agradecemos sinceramente sus comentarios sobre nuestra experiencia de servicio al cliente. Lamentamos que el producto llegara dañado. Nos gustaría hacer las cosas bien...",
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "El campo 'review' es requerido y debe ser una cadena de texto"
}
```

## Estructura de Archivos

```
app/api/generate-review-response/
└── route.ts           # Endpoint principal de la API

lib/
├── types.ts          # Definiciones de tipos TypeScript
├── api-client.ts     # Cliente para llamar la API desde el frontend
└── utils.ts          # Utilidades generales (ya existente)

.env.example          # Plantilla de variables de entorno
.env.local            # Variables de entorno (no commitar)
```

## Códigos de Respuesta HTTP

- **200 OK**: Respuesta generada exitosamente
- **400 Bad Request**: Solicitud inválida (reseña vacía o faltante)
- **405 Method Not Allowed**: Se usó un método HTTP no permitido
- **500 Internal Server Error**: Error del servidor

## Características

✅ Integración con Google Gemini
✅ Validación de entrada
✅ Manejo robusto de errores
✅ Tipos TypeScript completos
✅ Cliente API preconstruido
✅ Código extensible y mantenible
✅ Prompt profesional y contextual

## Próximos Pasos

- [ ] Agregar autenticación
- [ ] Implementar rate limiting
- [ ] Agregar logging
- [ ] Crear endpoint para historial de respuestas
- [ ] Permitir personalización del prompt
