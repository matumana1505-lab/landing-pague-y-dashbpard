"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "¿Resply reemplaza a Google Maps?",
    answer:
      "No. Resply se conecta a tu perfil de Google Business y responde las reseñas automáticamente. Tu negocio sigue apareciendo en Google Maps igual que siempre.",
  },
  {
    question: "¿Cuánto tiempo lleva configurarlo?",
    answer:
      "Menos de 5 minutos. Conectás tu cuenta de Google, elegís el tono de respuesta y listo. Resply empieza a responder solo.",
  },
  {
    question: "¿Funciona para cualquier tipo de negocio?",
    answer:
      "Sí. Restaurantes, odontólogos, gimnasios, estéticas, hoteles — cualquier negocio con perfil de Google Business puede usarlo.",
  },
  {
    question: "¿Tengo que instalar algo?",
    answer:
      "No hace falta instalar ni descargar nada. Resply funciona completamente desde el navegador, sin aplicaciones ni configuraciones adicionales.",
  },
  {
    question: "¿Qué pasa con las reseñas negativas?",
    answer:
      "Las reseñas de 1 o 2 estrellas no se responden automáticamente. En su lugar, el cliente recibe una invitación a completar un formulario de queja donde puede detallar su mala experiencia, dándote la oportunidad de resolver el problema antes de que escale.",
  },
  {
    question: "¿Las respuestas suenan naturales o robóticas?",
    answer:
      "Naturales. Cada respuesta se genera con IA teniendo en cuenta el contenido específico de la reseña y el tono que elegiste para tu negocio.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Preguntas frecuentes
        </h2>
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-b border-slate-200 last:border-b-0`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-slate-800 font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
