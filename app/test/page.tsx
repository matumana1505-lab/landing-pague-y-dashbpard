"use client"

import { FormEvent, useState } from "react"

export default function TestPage() {
  const [review, setReview] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch("/api/generate-review-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
  review,
  businessId:"cmqk4aohy0004t9i4kvrhzowr",
  rating: 5,
}),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`HTTP ${response.status}: ${text}`)
      }

      const data = await response.json()
      const generated = typeof data === "string" ? data : data?.response ?? JSON.stringify(data)
      setResult(generated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Página de prueba Gemini
          </h1>
          <p className="mt-2 text-slate-600">
            Escribe una reseña y haz clic en "Generar respuesta" para verificar tu backend.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700" htmlFor="review">
              Reseña
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="Escribe aquí la reseña..."
            />

            <button
              type="submit"
              disabled={loading || review.trim().length === 0}
              className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Generando respuesta..." : "Generar respuesta"}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error: {error}
            </div>
          ) : null}

          {result ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900">
              <h2 className="mb-2 text-base font-semibold text-slate-900">Respuesta generada</h2>
              <pre className="whitespace-pre-wrap break-words text-sm leading-6">{result}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
