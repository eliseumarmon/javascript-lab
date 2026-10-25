import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Entry { completed: boolean; notes: string }
const storageKey = 'javascript-lab:progress:v1'

function initial(): Record<string, Entry> {
  try {
    const result = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as unknown
    return result !== null && typeof result === 'object' && !Array.isArray(result)
      ? result as Record<string, Entry>
      : {}
  } catch {
    return {}
  }
}

export const useProgressStore = defineStore('progress', () => {
  const entries = ref<Record<string, Entry>>(initial())
  const isDone = (id: string) => entries.value[id]?.completed === true
  const notesFor = (id: string) => entries.value[id]?.notes ?? ''

  function setNotes(id: string, notes: string) {
    entries.value[id] = { completed: isDone(id), notes }
  }

  function toggle(id: string) {
    entries.value[id] = { completed: !isDone(id), notes: notesFor(id) }
  }

  watch(entries, value => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)) } catch {
      // El curso continúa funcionando aunque el almacenamiento esté desactivado.
    }
  }, { deep: true })

  return { entries, isDone, notesFor, setNotes, toggle }
})
