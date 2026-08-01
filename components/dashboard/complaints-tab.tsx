export function ComplaintsTab() {
  return (
    <div className="p-6">
      <h2 className="mb-1 text-lg font-semibold text-white">Formulario de quejas</h2>
      <p className="mb-5 text-xs text-gray-500">
        Así se ve el formulario que reciben los clientes que dejan una reseña de 1★, para canalizar el reclamo antes
        de que se publique en Google.
      </p>

      <div className="max-w-md rounded-xl border border-white/[0.06] bg-[#0f1628] p-6">
        <p className="mb-4 text-sm text-gray-400">
          Lamentamos tu experiencia. Contanos más para que podamos solucionarlo directamente.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Nombre</label>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-gray-600">
              Tu nombre
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Email</label>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-gray-600">
              tu@email.com
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Contanos qué pasó</label>
            <div className="h-20 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-gray-600">
              Describí tu experiencia...
            </div>
          </div>
          <div className="w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-medium text-white opacity-60">
            Enviar reclamo
          </div>
        </div>
      </div>
    </div>
  )
}
