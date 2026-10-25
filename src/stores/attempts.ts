import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Attempt {
  response: string
  submitted: boolean
  revealed: boolean
  tries: number
}

const STORAGE_KEY = 'javascript-lab:attempts:v1'
const empty = (): Attempt => ({ response: '', submitted: false, revealed: false, tries: 0 })

function load(): Record<string, Attempt> {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
    const result: Record<string, Attempt> = {}
    for (const [id, value] of Object.entries(data)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue
      const entry = value as Partial<Attempt>
      result[id] = {
        response: typeof entry.response === 'string' ? entry.response : '',
        submitted: entry.submitted === true,
        revealed: entry.revealed === true,
        tries: typeof entry.tries === 'number' && Number.isFinite(entry.tries) ? Math.max(0, entry.tries) : 0,
      }
    }
    return result
  } catch {
    return {}
  }
}

export const useAttemptsStore = defineStore('attempts', () => {
  const entries = ref<Record<string, Attempt>>(load())
  const get = (id: string): Attempt => entries.value[id] ?? empty()

  function setResponse(id: string, response: string) {
    const current = get(id)
    entries.value[id] = { ...current, response, submitted: false, revealed: false }
  }

  function submit(id: string) {
    const current = get(id)
    if (!current.response.trim()) return
    entries.value[id] = { ...current, submitted: true, tries: current.tries + 1 }
  }

  function toggleSolution(id: string) {
    const current = get(id)
    if (!current.submitted) return
    entries.value[id] = { ...current, revealed: !current.revealed }
  }

  watch(entries, current => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    } catch {
      // El usuario puede practicar aunque su navegador no acepte persistencia.
    }
  }, { deep: true })

  return { entries, get, setResponse, submit, toggleSolution }
})
