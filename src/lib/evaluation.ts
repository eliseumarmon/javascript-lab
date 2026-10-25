export interface KeywordCriterion {
  id: string
  label: string
  weight: number
  /** Todas las expresiones deben aparecer para reconocer este concepto. */
  all: RegExp[]
}

export interface Contradiction {
  pattern: RegExp
  feedback: string
}

export interface BaseExercise {
  id: string
  lessonId: string
  prompt: string
  concepts: string[]
}

export interface PredictionExercise extends BaseExercise {
  type: 'prediction'
  code: string
  /** Cada entrada es una línea de salida, o bien el tipo de excepción. */
  expected: string[]
  accepted?: string[][]
  explanation: string
}

export interface ExplanationExercise extends BaseExercise {
  type: 'explanation'
  code?: string
  criteria: KeywordCriterion[]
  contradictions?: Contradiction[]
  modelAnswer: string
}

export interface CodingExercise extends BaseExercise {
  type: 'coding'
  code: string
  modelAnswer: string
  checklist: string[]
}

export type Exercise = PredictionExercise | ExplanationExercise | CodingExercise

export type Evaluation =
  | { kind: 'prediction'; correct: boolean; expected: string[] }
  | { kind: 'explanation'; coverage: number; matched: string[]; missing: string[]; warnings: string[] }
  | { kind: 'coding'; reviewedManually: true }

/**
 * No ejecuta código del alumno ni usa eval/Function.
 * La evaluación de explicaciones mide cobertura léxica, nunca comprensión semántica real.
 */
export function normalizeOutput(value: string): string[] {
  return value.replace(/\r\n/g, '\n').trim().split('\n').map(line => line.trim()).filter(Boolean)
}

function sameLines(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((line, i) => line === b[i])
}

export function evaluate(exercise: Exercise, answer: string): Evaluation {
  if (exercise.type === 'coding') {
    return { kind: 'coding', reviewedManually: true }
  }
  if (exercise.type === 'prediction') {
    const answerLines = normalizeOutput(answer)
    const patterns = [exercise.expected, ...(exercise.accepted ?? [])]
    const matches = patterns.some(expected =>
      sameLines(answerLines, expected) ||
      (expected.length === 1 &&
        /^[A-Za-z]+Error$/.test(expected[0]) &&
        answerLines.length === 1 &&
        (answerLines[0] === expected[0] || answerLines[0].startsWith(expected[0] + ':')))
    )
    return { kind: 'prediction', correct: matches, expected: exercise.expected }
  }

  const matched: string[] = []
  const missing: string[] = []
  let coverage = 0

  for (const criterion of exercise.criteria) {
    if (criterion.all.every(pattern => pattern.test(answer))) {
      matched.push(criterion.id)
      coverage += criterion.weight
    } else {
      missing.push(criterion.id)
    }
  }
  const warnings = (exercise.contradictions ?? [])
    .filter(item => item.pattern.test(answer))
    .map(item => item.feedback)

  // Aunque haya palabras clave, una contradicción reconocida impide una cobertura alta.
  coverage = warnings.length ? Math.min(coverage, 0.49) : coverage

  return {
    kind: 'explanation',
    coverage: Math.round(Math.max(0, Math.min(1, coverage)) * 100) / 100,
    matched,
    missing,
    warnings,
  }
}
