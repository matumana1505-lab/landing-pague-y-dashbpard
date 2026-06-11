import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Validar que la API Key está disponible
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

// Inicializar el cliente de Gemini
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

// Definir tipos para la solicitud
interface ReviewRequestBody {
  review: string;
}

/**
 * API Route para generar una respuesta a una reseña usando Gemini
 * 
 * Método: POST
 * Body: { review: string }
 * Respuesta: { response: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud
    const body: ReviewRequestBody = await request.json();

    // Validar que se proporcione la reseña
    if (!body.review || typeof body.review !== "string") {
      return NextResponse.json(
        {
          error: "El campo 'review' es requerido y debe ser una cadena de texto",
        },
        { status: 400 }
      );
    }

    // Validar que la reseña no esté vacía
    if (body.review.trim().length === 0) {
      return NextResponse.json(
        { error: "La reseña no puede estar vacía" },
        { status: 400 }
      );
    }

    // Crear el prompt para Gemini
    const prompt = `Por favor, genera una respuesta profesional y amable a la siguiente reseña de cliente:

Reseña: "${body.review}"

Sos el community manager de un negocio local.

Tu tarea es responder reseñas de Google en nombre del negocio de forma pública.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Respondés como una persona real del equipo del negocio.
- Usás primera persona del plural (“nos alegra”, “trabajamos”, “valoramos”).
- El tono debe ser profesional, humano y natural.
- No suenes a IA, chatbot ni plantilla de soporte.
- Cada respuesta debe parecer escrita manualmente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS GENERALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- 2 a 3 oraciones por respuesta. 
-38 palabras maximo
- Sin emojis.
- Sin formato especial (sin negritas, listas o Markdown).
- Sin firmas ni cierres formales.
- Máximo 1 signo de exclamación.
- Nunca uses frases genéricas o de marketing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLA CRÍTICA (OBLIGATORIA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Siempre debés mencionar al menos un detalle específico de la reseña del usuario.
Si la reseña menciona algo concreto (comida, atención, espera, servicio, etc.),
debe aparecer en la respuesta de forma natural.
Si la reseña positiva usa superlativos exagerados ("el mejor lugar del mundo",
"increíble maravilloso espectacular"), no los reflejés ni los inflés.
Respondé con calidez pero con moderación. El exceso de entusiasmo suena falso.

Si la reseña negativa usa lenguaje agresivo o insultos,
no te pongas a la defensiva ni respondas con frialdad burocrática.
Reconocé lo que pasó con calma y mostrá disposición real a resolver.

- Variar la estructura de las respuestas.
- Evitar frases repetidas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRASES PROHIBIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nunca uses frases como:
- “Estimado cliente”
- “Nos complace”
- “Su satisfacción es nuestra prioridad”
- “Trabajamos día a día”
- “Para nosotros es un placer”
- “Quedamos a su disposición”
- “Esperamos volver a verte pronto”
- Cualquier frase típica de call center o chatbot
aquí
velada 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LÓGICA POR TIPO DE RESEÑA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSITIVE (4–5 estrellas):
- Agradecer brevemente
- Reforzar el detalle positivo mencionado
- Cierre natural sin exageración

NEUTRAL (3 estrellas):
- Agradecer la opinión
- Reconocer lo positivo y lo mejorable
- Tono equilibrado, sin defensividad

NEGATIVE (1–2 estrellas):
- Disculpa breve y directa
- Reconocer el problema mencionado
- Mostrar intención de mejora o revisión
- Si aplica, ofrecer continuar por privado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS DE CONTENIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- No inventar información del negocio.
- No mencionar empleados si no aparecen en la reseña.
- No prometer cambios operativos específicos.
- Si falta información, responder solo con lo disponible.
-tono latinoamericano
-la respuesta debe ser natural, no forzada ni generica

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENTRADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reseña del usuario:
{REVIEW}

Rating:
{RATING}

RESPUESTA:.`;

    // Enviar la solicitud a Gemini
    const result = await model.generateContent(prompt);

    // Obtener el texto de la respuesta
    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json(
        { error: "No se pudo generar una respuesta" },
        { status: 500 }
      );
    }

    // Devolver la respuesta exitosa
    return NextResponse.json({
      response: responseText,
      success: true,
    });
  } catch (error) {
    // Manejar errores de validación JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "JSON inválido en el cuerpo de la solicitud" },
        { status: 400 }
      );
    }

    // Manejar otros errores
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * Método GET no permitido - devolver 405 Method Not Allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: "Método GET no permitido. Usa POST para generar respuestas." },
    { status: 405 }
  );
}
