export interface Lesson {
  id: string
  title: string
  track: string
  minutes: number
  content: string
}

const markdown = import.meta.glob('../content/sessions/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const categories = [
  'Fundamentos', 'Fundamentos', 'Fundamentos',
  'Estructuras', 'Estructuras',
  'Asincronía', 'Asincronía', 'Asincronía',
  'Práctica', 'Práctica', 'Evaluación', 'Evaluación',
]
const durations = [50, 50, 50, 55, 55, 60, 55, 60, 60, 55, 50, 60]

export const lessons: Lesson[] = Array.from({ length: 12 }, (_, index) => {
  const id = String(index + 1).padStart(2, '0')
  const content = markdown[`../content/sessions/${id}.md`] ?? ''
  return {
    id,
    title: content.match(/^# Sesión \d+ · (.+)$/m)?.[1] ?? `Sesión ${id}`,
    track: categories[index],
    minutes: durations[index],
    content,
  }
})

export const tracks = ['Fundamentos', 'Estructuras', 'Asincronía', 'Práctica', 'Evaluación']
