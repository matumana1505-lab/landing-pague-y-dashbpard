"use client"

import { motion, AnimatePresence, type Variants } from "framer-motion"
import { useEffect, useRef, useState, type ComponentType } from "react"

type Tab = "bandeja" | "stats" | "settings" | "form" | "alerts"
type ReviewStatus = "new" | "responded" | "negative"

const MARIA_ID = 1
const CARLOS_ID = 2
const ANA_ID = 3
const JUAN_ID = 4

interface Review {
  id: number
  name: string
  initials: string
  rating: number
  text: string
  time: string
}

const reviews: Review[] = [
  {
    id: MARIA_ID,
    name: "María García",
    initials: "MG",
    rating: 5,
    text: "Excelente atención y la comida espectacular. Volveremos sin duda.",
    time: "hace 20 min",
  },
  {
    id: CARLOS_ID,
    name: "Carlos López",
    initials: "CL",
    rating: 4,
    text: "Muy buena experiencia. El servicio fue rápido y atento.",
    time: "hace 45 min",
  },
  {
    id: ANA_ID,
    name: "Ana Rodríguez",
    initials: "AR",
    rating: 1,
    text: "La espera fue muy larga y el pedido llegó frío. Muy decepcionante.",
    time: "hace 1 h",
  },
  {
    id: JUAN_ID,
    name: "Juan Martínez",
    initials: "JM",
    rating: 5,
    text: "El mejor lugar del barrio. La pizza increíble.",
    time: "hace 3 h",
  },
]

const mariaResponseText =
  "¡Muchas gracias María! Nos alegra mucho que hayas disfrutado. Los esperamos pronto."
const carlosResponseText =
  "¡Gracias Carlos! Nos alegra que hayas tenido una buena experiencia, te esperamos pronto."
const juanResponseText =
  "¡Gracias Juan! Nos encanta saber que disfrutaste la pizza. Te esperamos pronto."

const weeklyData = [
  { day: "Lun", value: 3 },
  { day: "Mar", value: 5 },
  { day: "Mié", value: 2 },
  { day: "Jue", value: 6 },
  { day: "Vie", value: 8 },
  { day: "Sáb", value: 9 },
  { day: "Dom", value: 4 },
]

const tones = [
  { id: "Cercano", icon: "😊", desc: "Cálido y cercano" },
  { id: "Profesional", icon: "💼", desc: "Claro y directo" },
  { id: "Formal", icon: "🎩", desc: "Serio y protocolar" },
] as const

const alerts = [
  {
    icon: "⚠️",
    iconStyle: "bg-red-500/10 border-red-500/20 text-red-400",
    title: "Nueva reseña negativa — Ana Rodríguez 1★",
    time: "hace 1h",
    status: "Pendiente",
    statusStyle: "bg-red-500/10 border-red-500/20 text-red-400",
  },
  {
    icon: "✓",
    iconStyle: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    title: "Respuesta publicada — María García 5★",
    time: "hace 2h",
    status: "Completado",
    statusStyle: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    icon: "📊",
    iconStyle: "bg-white/5 border-white/10 text-gray-400",
    title: "Reporte semanal — 12 reseñas, 4.6★ promedio",
    time: "hace 1 día",
    status: "Info",
    statusStyle: "bg-white/5 border-white/10 text-gray-400",
  },
]

// Cascade reveal used when the dashboard's chrome first populates (entrance sequence only).
const cascadeContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}
const cascadeItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9h4.5l1.5 3h4.5l1.5-3h4.5M3.75 9l1.386 6.243A2.25 2.25 0 007.336 17.25h9.328a2.25 2.25 0 002.2-1.757L20.25 9M3.75 9l1.5-4.5A2.25 2.25 0 017.372 3h9.256a2.25 2.25 0 012.122 1.5L20.25 9"
      />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17V10m5 7V6m5 11v-4" />
    </svg>
  )
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function FormIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 2.25H7.5A2.25 2.25 0 005.25 4.5v15A2.25 2.25 0 007.5 21.75h9a2.25 2.25 0 002.25-2.25v-15A2.25 2.25 0 0016.5 2.25H15M9 2.25v2.25A.75.75 0 009.75 5.25h4.5a.75.75 0 00.75-.75V2.25M9 2.25h6M9.75 12h4.5M9.75 15.75h4.5M9.75 8.25h4.5"
      />
    </svg>
  )
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  )
}

const navItems: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "bandeja", label: "Bandeja", icon: InboxIcon },
  { id: "stats", label: "Estadísticas", icon: ChartIcon },
  { id: "settings", label: "Configuración IA", icon: GearIcon },
  { id: "form", label: "Formulario de quejas", icon: FormIcon },
  { id: "alerts", label: "Alertas", icon: BellIcon },
]

const statusStyles: Record<ReviewStatus, { border: string; badge: string; label: string }> = {
  new: { border: "border-l-blue-500", badge: "bg-blue-500/15 text-blue-400 border-blue-500/30", label: "NUEVA" },
  responded: {
    border: "border-l-emerald-700",
    badge: "bg-emerald-700/20 text-emerald-400 border-emerald-700/40",
    label: "✓",
  },
  negative: { border: "border-l-red-500", badge: "bg-red-500/15 text-red-400 border-red-500/30", label: "⚠" },
}

function getReviewStatus(id: number, mariaResponded: boolean): ReviewStatus {
  if (id === ANA_ID) return "negative"
  if (id === MARIA_ID) return mariaResponded ? "responded" : "new"
  return "responded"
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-xs ${star <= rating ? "text-yellow-400" : "text-gray-700"}`}>
          ★
        </span>
      ))}
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </span>
  )
}

export function Counter({
  to,
  duration = 900,
  decimals = 0,
  suffix = "",
}: {
  to: number
  duration?: number
  decimals?: number
  suffix?: string
}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start: number | null = null
    let raf = 0
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(to * progress)
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])

  return (
    <>
      {value.toFixed(decimals)}
      {suffix}
    </>
  )
}

function ToggleRow({
  label,
  description,
  defaultOn,
  delayMs = 0,
}: {
  label: string
  description: string
  defaultOn: boolean
  delayMs?: number
}) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setOn(defaultOn), delayMs)
    return () => clearTimeout(t)
  }, [defaultOn, delayMs])

  return (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <div>
        <p className="text-gray-300 text-xs font-medium">{label}</p>
        <p className="text-gray-500 text-[11px] mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${
          on ? "bg-blue-600" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  )
}

function MetricCard({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="bg-[#0f1628] border border-white/[0.06] rounded-xl px-3 py-3">
      <p className="text-gray-500 text-[11px] leading-tight">{label}</p>
      <p className="text-white text-base font-semibold mt-1">{children}</p>
    </div>
  )
}

function StatsTab({ mountKey }: { mountKey: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(false)
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [mountKey])

  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="resply-mock-scroll flex-1 overflow-y-auto p-5"
    >
      <div className="bg-[#0f1628] border border-white/[0.06] rounded-xl p-4 mb-4 flex items-center justify-between">
        <p className="text-white text-2xl font-semibold">
          4.6★ <span className="text-gray-500 text-xs font-normal align-middle">calificación promedio</span>
        </p>
        <span className="text-blue-400 text-xs font-medium bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
          +0.4 vs mes anterior
        </span>
      </div>

      <div className="bg-[#0f1628] border border-white/[0.06] rounded-xl p-4 mb-4">
        <p className="text-gray-400 text-xs font-medium mb-4">Reseñas por día</p>
        <svg viewBox="0 0 280 140" className="w-full h-36">
          {weeklyData.map((d, i) => {
            const barWidth = 24
            const gap = (280 - weeklyData.length * barWidth) / (weeklyData.length + 1)
            const x = gap + i * (barWidth + gap)
            const maxH = 100
            const targetH = (d.value / 9) * maxH
            const h = mounted ? targetH : 0
            const y = 118 - h
            return (
              <g key={d.day}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx={4}
                  fill="#3b82f6"
                  fillOpacity={0.85}
                  style={{
                    transition: `height 0.6s ease-out ${i * 0.08}s, y 0.6s ease-out ${i * 0.08}s`,
                  }}
                />
                <text x={x + barWidth / 2} y={134} textAnchor="middle" fontSize="9" fill="#6b7280">
                  {d.day}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Reseñas">
          <Counter to={28} suffix=" reseñas" />
        </MetricCard>
        <MetricCard label="Respondidas">
          <Counter to={100} suffix="%" />
        </MetricCard>
        <MetricCard label="Tiempo de respuesta">&lt; 2min</MetricCard>
      </div>
    </motion.div>
  )
}

function SettingsTab() {
  const [tone, setTone] = useState<(typeof tones)[number]["id"]>("Profesional")

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="resply-mock-scroll flex-1 overflow-y-auto p-5 space-y-5"
    >
      <div>
        <p className="text-gray-400 text-xs font-medium mb-2">Tono de respuesta</p>
        <div className="grid grid-cols-3 gap-2">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors ${
                tone === t.id
                  ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-xs font-medium">{t.id}</span>
              <span className="text-[10px] text-gray-500">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-xs font-medium mb-2">Instrucciones personalizadas</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-gray-300 text-xs leading-relaxed">
            Responder siempre en voseo, mencionar el nombre del cliente y agradecer la visita.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <ToggleRow
          label="Respuestas automáticas"
          description="Publicar respuestas sin revisión manual"
          defaultOn
          delayMs={400}
        />
        <ToggleRow
          label="Alertas reseñas negativas"
          description="Avisarme apenas llega una reseña negativa"
          defaultOn
          delayMs={900}
        />
      </div>

      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] px-2.5 py-1 rounded-full w-fit">
        Guardado automáticamente ✓
      </div>
    </motion.div>
  )
}

function FormTab() {
  const [contact, setContact] = useState(true)

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="resply-mock-scroll flex-1 overflow-y-auto p-5 space-y-5"
    >
      <div>
        <h3 className="text-white text-sm font-semibold mb-1">Formulario automático para reseñas negativas</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Cuando alguien deja 1 o 2 estrellas, Resply envía automáticamente este formulario para entender qué pasó
          antes de que la situación escale.
        </p>
      </div>

      <div className="bg-[#0f1628] border border-white/[0.06] rounded-xl p-4 space-y-3">
        <div>
          <label className="text-gray-400 text-xs font-medium block mb-1">¿Qué salió mal en tu visita?</label>
          <textarea
            readOnly
            rows={2}
            placeholder="Cuéntanos qué pasó..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-500 resize-none focus:outline-none"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs font-medium block mb-1">¿Cómo podemos mejorar?</label>
          <textarea
            readOnly
            rows={2}
            placeholder="Tu opinión nos ayuda a mejorar..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-500 resize-none focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs font-medium">¿Te gustaría que te contactemos?</span>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-full p-0.5">
            <button
              onClick={() => setContact(true)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                contact ? "bg-blue-600 text-white" : "text-gray-500"
              }`}
            >
              SI
            </button>
            <button
              onClick={() => setContact(false)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                !contact ? "bg-blue-600 text-white" : "text-gray-500"
              }`}
            >
              NO
            </button>
          </div>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white text-xs font-medium py-2 rounded-lg">
          Enviar formulario
        </button>
      </div>

      <div>
        <p className="text-gray-400 text-xs font-medium mb-2">Formularios enviados recientemente</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-[#0f1628] border border-white/[0.06] rounded-xl px-4 py-3">
            <div>
              <p className="text-white text-xs font-medium">Ana Rodríguez</p>
              <p className="text-gray-500 text-[11px]">enviado hace 1h</p>
            </div>
            <span className="text-amber-400 text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
              Pendiente respuesta
            </span>
          </div>
          <div className="flex items-center justify-between bg-[#0f1628] border border-white/[0.06] rounded-xl px-4 py-3">
            <div>
              <p className="text-white text-xs font-medium">Pedro Sánchez</p>
              <p className="text-gray-500 text-[11px]">enviado hace 3 días</p>
            </div>
            <span className="text-emerald-400 text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
              Respondido ✓
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AlertsTab() {
  return (
    <motion.div
      key="alerts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="resply-mock-scroll flex-1 overflow-y-auto p-5 space-y-2"
    >
      {alerts.map((a) => (
        <div
          key={a.title}
          className="flex items-start gap-3 bg-[#0f1628] border border-white/[0.06] rounded-xl px-4 py-3"
        >
          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm flex-shrink-0 ${a.iconStyle}`}
          >
            {a.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium">{a.title}</p>
            <p className="text-gray-500 text-[11px] mt-0.5">{a.time}</p>
          </div>
          <span
            className={`text-[10px] font-medium px-2 py-1 rounded-full border flex-shrink-0 ${a.statusStyle}`}
          >
            {a.status}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export function DashboardMock({ entered = true }: { entered?: boolean }) {
  const [tab, setTab] = useState<Tab>("bandeja")
  const [selectedId, setSelectedId] = useState<number>(CARLOS_ID)
  const [notifVisible, setNotifVisible] = useState(false)
  const [mariaGenerating, setMariaGenerating] = useState(false)
  const [mariaTyping, setMariaTyping] = useState(false)
  const [mariaPublished, setMariaPublished] = useState(false)
  const [mariaResponded, setMariaResponded] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [statsMountKey, setStatsMountKey] = useState(0)

  // Entrance cinematic phases (run once, gated by `entered`)
  const [scanning, setScanning] = useState(false)
  const [populated, setPopulated] = useState(false)
  const [chromeReady, setChromeReady] = useState(false)
  const hasPopulatedOnceRef = useRef(false)

  const activeReview = reviews.find((r) => r.id === selectedId) ?? reviews[0]

  // Phase 1-3: materialize -> scan -> populate, timed off the viewport-enter trigger.
  useEffect(() => {
    if (!entered) return
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const schedule = (fn: () => void, ms: number) => timeouts.push(setTimeout(fn, ms))

    schedule(() => setScanning(true), 900)
    schedule(() => {
      setScanning(false)
      setPopulated(true)
    }, 1400)
    schedule(() => setChromeReady(true), 2200)

    return () => timeouts.forEach(clearTimeout)
  }, [entered])

  useEffect(() => {
    if (populated) hasPopulatedOnceRef.current = true
  }, [populated])

  // Phase 5+: the scripted content loop only starts once the entrance has fully settled.
  useEffect(() => {
    if (!chromeReady) return

    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let typingInterval: ReturnType<typeof setInterval> | null = null

    const schedule = (fn: () => void, ms: number) => {
      timeouts.push(
        setTimeout(() => {
          if (!cancelled) fn()
        }, ms),
      )
    }

    const clearScheduled = () => {
      timeouts.forEach(clearTimeout)
      timeouts.length = 0
      if (typingInterval) {
        clearInterval(typingInterval)
        typingInterval = null
      }
    }

    const runCycle = () => {
      setTab("bandeja")
      setSelectedId(CARLOS_ID)
      setNotifVisible(false)
      setMariaGenerating(false)
      setMariaTyping(false)
      setMariaPublished(false)
      setMariaResponded(false)
      setTypedText("")

      schedule(() => setNotifVisible(true), 1500)
      schedule(() => setSelectedId(ANA_ID), 2000)
      schedule(() => setNotifVisible(false), 3500)
      schedule(() => {
        setSelectedId(MARIA_ID)
        setMariaGenerating(true)
      }, 4500)
      schedule(() => {
        setMariaGenerating(false)
        setMariaTyping(true)
        let i = 0
        const total = mariaResponseText.length
        const stepMs = Math.max(2300 / total, 12)
        typingInterval = setInterval(() => {
          i++
          setTypedText(mariaResponseText.slice(0, i))
          if (i >= total && typingInterval) {
            clearInterval(typingInterval)
            typingInterval = null
          }
        }, stepMs)
      }, 5500)
      schedule(() => {
        setMariaTyping(false)
        setMariaPublished(true)
        setMariaResponded(true)
      }, 7800)
      schedule(() => {
        setTab("stats")
        setStatsMountKey((k) => k + 1)
      }, 9000)
      schedule(() => setTab("bandeja"), 11500)
      schedule(() => {
        clearScheduled()
        runCycle()
      }, 14000)
    }

    runCycle()

    return () => {
      cancelled = true
      clearScheduled()
    }
  }, [chromeReady])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotateX: 8, filter: "blur(8px)" }}
      animate={
        entered
          ? { opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.85, rotateX: 8, filter: "blur(8px)" }
      }
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200 }}
      className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/15 border border-blue-500/20 bg-[#0a0e1a]"
    >
      <style>{`
        .resply-mock-scroll::-webkit-scrollbar { width: 6px; }
        .resply-mock-scroll::-webkit-scrollbar-track { background: transparent; }
        .resply-mock-scroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 9999px; }
        @keyframes dashboardTopShine {
          0% { transform: translateX(-20%); opacity: 0; }
          8% { opacity: 0.5; }
          20% { opacity: 0; }
          100% { transform: translateX(420%); opacity: 0; }
        }
        .dashboard-top-shine { animation: dashboardTopShine 6s ease-in-out infinite; }
      `}</style>

      {/* Scan line — phase 2, sweeps once as the dashboard materializes */}
      {scanning && (
        <motion.div
          initial={{ top: "-10%", opacity: 0 }}
          animate={{ top: "110%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[2px] blur-[2px] pointer-events-none z-30"
          style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }}
        />
      )}

      {/* Top-edge shine — subtle ambient sweep every 6s once settled */}
      {chromeReady && (
        <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden pointer-events-none z-30">
          <div className="dashboard-top-shine absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[20deg]" />
        </div>
      )}

      {/* Floating notification */}
      <AnimatePresence>
        {notifVisible && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="absolute top-2 right-2 z-20 flex items-center gap-2 bg-[#0f1628] border border-red-500/40 shadow-lg shadow-red-500/10 text-xs text-gray-200 px-3 py-2 rounded-xl"
          >
            <span>🔔</span>
            <span>
              Nueva reseña — <span className="font-medium text-white">Ana Rodríguez</span> ·{" "}
              <span className="text-red-400">★</span>
              <span className="text-gray-600">☆☆☆☆</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ filter: scanning ? ["brightness(1)", "brightness(1.18)", "brightness(1)"] : "brightness(1)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0f1628] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-[#0a0e1a] rounded-md px-3 py-1 text-xs text-gray-500 text-center">
              app.resply.io/dashboard
            </div>
          </div>
        </div>

        {/* Business header */}
        <div className="bg-white/[0.02]">
          <motion.div
            variants={cascadeItem}
            initial="hidden"
            animate={populated ? "visible" : "hidden"}
            className="flex items-center justify-between px-5 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                LP
              </div>
              <span className="text-white text-sm font-medium">La Pizzería del Centro</span>
              <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full">
                Google Business ✓ Conectado
              </div>
            </div>
            <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                animate={chromeReady ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
                transition={{ duration: 2, repeat: chromeReady ? Infinity : 0, ease: "easeInOut" }}
              />
              Activo
            </div>
          </motion.div>
          <div className="h-0.5 w-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: mariaGenerating ? "100%" : "0%",
                transition: mariaGenerating ? "width 0.8s ease-out" : "width 0.2s ease-in",
              }}
            />
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex h-[500px] border-t border-white/[0.06]">
          {/* Sidebar */}
          <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate={populated ? "visible" : "hidden"}
            className="w-56 border-r border-white/[0.06] bg-[#080c18] flex flex-col"
          >
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                  R
                </div>
                <span className="text-white text-sm font-medium">Resply</span>
              </div>
            </div>
            <nav className="p-3 space-y-1 flex-1">
              {navItems.map((item) => {
                const isActive = tab === item.id
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.id}
                    variants={cascadeItem}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors border-l-2 ${
                      isActive
                        ? "bg-blue-500/10 border-l-blue-500 text-blue-400"
                        : "border-l-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </motion.div>
                )
              })}
            </nav>
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                  M
                </div>
                <span className="text-xs text-gray-400">Mi negocio</span>
              </div>
            </div>
          </motion.div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <motion.div
              variants={cascadeItem}
              initial="hidden"
              animate={populated ? "visible" : "hidden"}
              className="px-5 py-3 border-b border-white/[0.06]"
            >
              {tab === "bandeja" && (
                <>
                  <h2 className="text-white text-sm font-semibold">Bandeja de reseñas</h2>
                  <p className="text-gray-500 text-xs">
                    Esta semana: +12 reseñas · Promedio: 4.6★ · Respondidas: 11/12
                  </p>
                </>
              )}
              {tab === "stats" && (
                <>
                  <h2 className="text-white text-sm font-semibold">Estadísticas</h2>
                  <p className="text-gray-500 text-xs">Resumen semanal</p>
                </>
              )}
              {tab === "settings" && (
                <>
                  <h2 className="text-white text-sm font-semibold">Configuración IA</h2>
                  <p className="text-gray-500 text-xs">Personalizá cómo responde Resply</p>
                </>
              )}
              {tab === "form" && (
                <>
                  <h2 className="text-white text-sm font-semibold">Formulario de quejas</h2>
                  <p className="text-gray-500 text-xs">Seguimiento de reseñas negativas</p>
                </>
              )}
              {tab === "alerts" && (
                <>
                  <h2 className="text-white text-sm font-semibold">Alertas</h2>
                  <p className="text-gray-500 text-xs">Actividad reciente</p>
                </>
              )}
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {tab === "bandeja" && (
                <motion.div
                  key="bandeja"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-1 overflow-hidden"
                >
                  {/* Reviews list */}
                  <motion.div
                    variants={cascadeContainer}
                    initial={hasPopulatedOnceRef.current ? false : "hidden"}
                    animate={populated ? "visible" : "hidden"}
                    className="resply-mock-scroll w-72 border-r border-white/[0.06] overflow-y-auto"
                  >
                    {reviews.map((review) => {
                      const status = getReviewStatus(review.id, mariaResponded)
                      const style = statusStyles[status]
                      return (
                        <motion.div
                          key={review.id}
                          variants={cascadeItem}
                          onClick={() => setSelectedId(review.id)}
                          className={`px-4 py-3 border-b border-white/[0.06] border-l-2 cursor-pointer transition-colors ${
                            style.border
                          } ${selectedId === review.id ? "bg-blue-600/10" : "hover:bg-white/5"}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-gray-300 font-medium flex-shrink-0">
                                {review.initials}
                              </div>
                              <span className="text-white text-xs font-medium truncate">{review.name}</span>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full border flex-shrink-0 font-medium ${style.badge}`}
                            >
                              {style.label}
                            </span>
                          </div>
                          <StarRating rating={review.rating} />
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{review.text}</p>
                          <span className="text-gray-600 text-[10px] mt-1 block">{review.time}</span>
                        </motion.div>
                      )
                    })}
                  </motion.div>

                  {/* Review detail */}
                  <div className="resply-mock-scroll flex-1 p-5 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeReview.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-300 font-medium">
                            {activeReview.initials}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{activeReview.name}</p>
                            <StarRating rating={activeReview.rating} />
                          </div>
                          <span className="ml-auto text-gray-600 text-xs">{activeReview.time}</span>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                          <p className="text-gray-300 text-sm leading-relaxed">{activeReview.text}</p>
                        </div>

                        {selectedId === ANA_ID && (
                          <div className="space-y-2">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.05 }}
                              className="flex items-center gap-2 bg-[#0f1628] border border-white/[0.06] rounded-xl px-4 py-3"
                            >
                              <span className="text-emerald-400">✓</span>
                              <span className="text-gray-300 text-xs font-medium">Formulario enviado</span>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              className="flex items-center gap-2 bg-[#0f1628] border border-amber-500/20 rounded-xl px-4 py-3"
                            >
                              <span className="text-amber-400">⚠️</span>
                              <span className="text-gray-300 text-xs font-medium">Alerta WhatsApp enviada</span>
                            </motion.div>
                          </div>
                        )}

                        {selectedId === MARIA_ID && (
                          <div>
                            {!mariaGenerating && !mariaTyping && !mariaPublished && (
                              <p className="text-gray-500 text-xs">
                                Sin respuesta aún, Resply está por generar una respuesta.
                              </p>
                            )}

                            {mariaGenerating && (
                              <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
                                Generando respuesta con IA
                                <LoadingDots />
                              </div>
                            )}

                            {(mariaTyping || mariaPublished) && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full">
                                    ✨ Generada por IA
                                  </span>
                                </div>
                                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 mb-3 min-h-[3.5rem]">
                                  <p className="text-gray-300 text-sm leading-relaxed">
                                    {typedText}
                                    {mariaTyping && (
                                      <span className="inline-block w-1 h-3.5 bg-blue-400 ml-0.5 align-middle animate-pulse" />
                                    )}
                                  </p>
                                </div>
                                <AnimatePresence>
                                  {mariaPublished && (
                                    <motion.span
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: [0, 1.1, 1], opacity: 1 }}
                                      transition={{ duration: 0.4 }}
                                      className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium"
                                    >
                                      Publicada automáticamente ✓
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        )}

                        {(selectedId === CARLOS_ID || selectedId === JUAN_ID) && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full">
                                ✨ Generada por IA
                              </span>
                            </div>
                            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 mb-3">
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {selectedId === CARLOS_ID ? carlosResponseText : juanResponseText}
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                              Publicada ✓
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {tab === "stats" && <StatsTab key="stats" mountKey={statsMountKey} />}
              {tab === "settings" && <SettingsTab key="settings" />}
              {tab === "form" && <FormTab key="form" />}
              {tab === "alerts" && <AlertsTab key="alerts" />}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
