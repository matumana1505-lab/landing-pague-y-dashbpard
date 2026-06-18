"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  fetchBusinessAiConfig,
  saveBusinessAiConfig,
  setActiveBusiness,
} from "@/lib/api-client"
import { DEFAULT_AI_CONFIG } from "@/lib/ai-config/defaults"
import type { BusinessAiConfigDto } from "@/lib/types"

type UseBusinessAiConfigOptions = {
  businessId: string | null
  autoSave?: boolean
  debounceMs?: number
}

type UseBusinessAiConfigResult = {
  config: BusinessAiConfigDto
  isLoading: boolean
  isSaving: boolean
  isDefault: boolean
  error: string | null
  updateConfig: (patch: Partial<BusinessAiConfigDto>) => void
  saveConfig: (patch?: Partial<BusinessAiConfigDto>) => Promise<void>
  reload: () => Promise<void>
}

export function useBusinessAiConfig({
  businessId,
  autoSave = true,
  debounceMs = 600,
}: UseBusinessAiConfigOptions): UseBusinessAiConfigResult {
  const [config, setConfig] = useState<BusinessAiConfigDto>(DEFAULT_AI_CONFIG)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDefault, setIsDefault] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pendingPatch = useRef<Partial<BusinessAiConfigDto>>({})
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const configRef = useRef(config)
  configRef.current = config

  const loadConfig = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchBusinessAiConfig(id)
      setConfig(response.config)
      setIsDefault(response.isDefault)
    } catch (err) {
      setConfig(DEFAULT_AI_CONFIG)
      setIsDefault(true)
      setError(err instanceof Error ? err.message : "Error al cargar configuración")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const flushSave = useCallback(
    async (id: string, patch: Partial<BusinessAiConfigDto>) => {
      if (Object.keys(patch).length === 0) return

      setIsSaving(true)
      setError(null)
      try {
        const response = await saveBusinessAiConfig(id, patch)
        setConfig(response.config)
        setIsDefault(false)
        pendingPatch.current = {}
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar configuración")
        throw err
      } finally {
        setIsSaving(false)
      }
    },
    []
  )

  const saveConfig = useCallback(
    async (patch?: Partial<BusinessAiConfigDto>) => {
      if (!businessId) return
      const merged = { ...pendingPatch.current, ...patch }
      await flushSave(businessId, merged)
    },
    [businessId, flushSave]
  )

  const scheduleSave = useCallback(
    (patch: Partial<BusinessAiConfigDto>) => {
      if (!businessId || !autoSave) return

      pendingPatch.current = { ...pendingPatch.current, ...patch }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      debounceTimer.current = setTimeout(() => {
        const toSave = { ...pendingPatch.current }
        void flushSave(businessId, toSave)
      }, debounceMs)
    },
    [autoSave, businessId, debounceMs, flushSave]
  )

  const updateConfig = useCallback(
    (patch: Partial<BusinessAiConfigDto>) => {
      setConfig((prev) => ({ ...prev, ...patch }))
      scheduleSave(patch)
    },
    [scheduleSave]
  )

  const reload = useCallback(async () => {
    if (!businessId) return
    await loadConfig(businessId)
  }, [businessId, loadConfig])

  useEffect(() => {
    if (!businessId) {
      setConfig(DEFAULT_AI_CONFIG)
      setIsDefault(true)
      setError(null)
      return
    }

    void loadConfig(businessId)
    void setActiveBusiness(businessId).catch(() => {
      // No bloquear la UI si falla marcar negocio activo
    })

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [businessId, loadConfig])

  return {
    config,
    isLoading,
    isSaving,
    isDefault,
    error,
    updateConfig,
    saveConfig,
    reload,
  }
}
