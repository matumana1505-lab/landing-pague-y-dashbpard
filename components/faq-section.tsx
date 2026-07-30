"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
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

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const headerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const titleVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const underlineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-20 px-4 bg-[#0a0f1e]"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center"
        >
          <motion.h2 variants={titleVariants} className="text-3xl font-bold text-white">
            Preguntas frecuentes
          </motion.h2>
          <motion.span
            variants={underlineVariants}
            className="block h-[2px] w-16 bg-blue-500 rounded-full mx-auto mt-4 origin-left"
          />
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="border-b border-white/10 last:border-b-0"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-gray-200 font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-4 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
