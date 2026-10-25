import { describe, expect, it } from 'vitest'
import { evaluate, normalizeOutput } from './evaluation'
import type { Exercise } from './evaluation'
import { session01Exercises } from '../content/exercises/01'

const get = (id: string): Exercise => {
  const exercise = session01Exercises.find(item => item.id === id)
  if (!exercise) throw new Error('Missing exercise: ' + id)
  return exercise
}

describe('automatic predictions', () => {
  it('normalizes CRLF and whitespace without ignoring case', () => {
    expect(normalizeOutput(' 8  \r\n 2 \r\n')).toEqual(['8', '2'])
    expect(evaluate(get('1.5'), ' 8 \n 2 ')).toMatchObject({ kind: 'prediction', correct: true })
    expect(evaluate(get('1.7'), 'b')).toMatchObject({ kind: 'prediction', correct: false })
  })

  it('accepts exact console output or explicitly allowed variants', () => {
    expect(evaluate(get('1.1'), 'undefined')).toMatchObject({ correct: true })
    expect(evaluate(get('1.3'), '4')).toMatchObject({ correct: true })
    expect(evaluate(get('1.5'), '8,2')).toMatchObject({ correct: true })
    expect(evaluate(get('1.6'), '0')).toMatchObject({ correct: false })
  })

  it('accepts the exception type with an optional native error message', () => {
    expect(evaluate(get('1.2'), 'ReferenceError')).toMatchObject({ correct: true })
    expect(evaluate(get('1.2'), "ReferenceError: Cannot access 'score' before initialization"))
      .toMatchObject({ correct: true })
    expect(evaluate(get('1.2'), 'TypeError')).toMatchObject({ correct: false })
    expect(evaluate(get('1.8'), 'outside')).toMatchObject({ correct: false })
  })
})

describe('explanations', () => {
  it('scores coverage of recognized criteria, not semantic correctness', () => {
    const result = evaluate(get('1.10'), 'Es SyntaxError: const necesita inicializarse en la declaración. const port = 3000;')
    expect(result).toMatchObject({ kind: 'explanation', coverage: 1 })
  })

  it('warns when a known contradiction appears and caps coverage', () => {
    const result = evaluate(get('1.10'), 'SyntaxError. const se puede reasignar después. const port = 3000;')
    expect(result.kind).toBe('explanation')
    if (result.kind === 'explanation') {
      expect(result.warnings).toHaveLength(1)
      expect(result.coverage).toBeLessThanOrEqual(0.49)
    }
  })

  it('does not pretend to grade free-form code automatically', () => {
    expect(evaluate(get('1.9'), 'for (let i = 0; i < 3; i++) {}'))
      .toEqual({ kind: 'coding', reviewedManually: true })
  })
})
