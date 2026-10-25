<script setup lang="ts">
import { computed } from 'vue'
import { evaluate } from '../lib/evaluation'
import type { Exercise } from '../lib/evaluation'
import { useAttemptsStore } from '../stores/attempts'

const props = defineProps<{ exercise: Exercise }>()
const store = useAttemptsStore()
const attempt = computed(() => store.get(props.exercise.id))
const result = computed(() =>
  attempt.value.submitted ? evaluate(props.exercise, attempt.value.response) : null
)

function handleInput(event: Event) {
  store.setResponse(props.exercise.id, (event.target as HTMLTextAreaElement).value)
}

const kindLabel = computed(() => ({
  prediction: 'Predice la salida',
  explanation: 'Explicación razonada',
  coding: 'Código · revisión guiada',
})[props.exercise.type])
</script>

<template>
  <section class="exercise-card" :aria-labelledby="'exercise-title-' + exercise.id">
    <div class="exercise-top">
      <span class="exercise-number">EJERCICIO {{ exercise.id }}</span>
      <span class="exercise-kind">{{ kindLabel }}</span>
    </div>

    <h3 :id="'exercise-title-' + exercise.id">{{ exercise.prompt }}</h3>
    <pre v-if="exercise.code" class="exercise-code"><code>{{ exercise.code }}</code></pre>

    <form class="exercise-form" @submit.prevent="store.submit(exercise.id)">
      <label :for="'exercise-input-' + exercise.id">
        {{ exercise.type === 'prediction' ? 'Tu predicción' : exercise.type === 'coding' ? 'Tu solución' : 'Tu explicación' }}
      </label>
      <textarea
        :id="'exercise-input-' + exercise.id"
        :value="attempt.response"
        :rows="exercise.type === 'prediction' ? 2 : exercise.type === 'coding' ? 8 : 5"
        :placeholder="exercise.type === 'prediction' ? 'Salida o tipo de error...' : exercise.type === 'coding' ? 'Escribe aquí tu implementación...' : 'Explica con tus propias palabras...'"
        :spellcheck="exercise.type !== 'coding'"
        required
        @input="handleInput"
      ></textarea>
      <div class="exercise-actions">
        <button class="exercise-submit" type="submit" :disabled="!attempt.response.trim()">
          {{ attempt.tries ? 'Volver a comprobar' : 'Comprobar respuesta' }} →
        </button>
        <span v-if="attempt.tries" class="attempt-counter">{{ attempt.tries }} intento{{ attempt.tries === 1 ? '' : 's' }}</span>
      </div>
    </form>

    <div v-if="result" class="exercise-feedback" aria-live="polite">
      <template v-if="result.kind === 'prediction'">
        <p class="feedback-heading" :class="{ 'feedback-success': result.correct, 'feedback-warning': !result.correct }">
          {{ result.correct ? '✓ Predicción correcta' : '↻ No coincide con la salida esperada' }}
        </p>
        <p v-if="!result.correct">Revisa el ámbito y el orden de ejecución. Puedes corregir tu respuesta y volver a intentarlo.</p>
        <p v-else>Has identificado correctamente la salida o el tipo de error. Comprueba ahora la explicación.</p>
      </template>

      <template v-else-if="result.kind === 'explanation' && exercise.type === 'explanation'">
        <p class="feedback-heading">Cobertura conceptual estimada: {{ Math.round(result.coverage * 100) }}%</p>
        <div class="coverage-track" aria-hidden="true"><div :style="{ width: Math.round(result.coverage * 100) + '%' }"></div></div>
        <ul class="rubric-items">
          <li v-for="criterion in exercise.criteria" :key="criterion.id">
            <span :class="{ 'rule-matched': result.matched.includes(criterion.id) }">
              {{ result.matched.includes(criterion.id) ? '✓' : '○' }}
            </span>
            {{ criterion.label }}
          </li>
        </ul>
        <p v-for="warning in result.warnings" :key="warning" class="rubric-warning">⚠ {{ warning }}</p>
        <p class="feedback-hint">Esta puntuación comprueba expresiones reconocibles; no verifica si todo el razonamiento es correcto.</p>
      </template>

      <template v-else>
        <p class="feedback-heading">Solución registrada</p>
        <p>Este ejercicio de programación se revisa comparando tu implementación con el ejemplo y sus criterios; todavía no ejecuta pruebas automáticas.</p>
      </template>

      <button class="solution-toggle" type="button" :aria-expanded="attempt.revealed" @click="store.toggleSolution(exercise.id)">
        {{ attempt.revealed ? 'Ocultar solución modelo ↑' : 'Mostrar solución modelo ↓' }}
      </button>

      <div v-if="attempt.revealed" class="solution-panel">
        <template v-if="exercise.type === 'prediction'">
          <strong>Salida o tipo de error esperado</strong>
          <pre class="solution-output">{{ exercise.expected.join('\n') }}</pre>
          <strong>Explicación</strong>
          <p>{{ exercise.explanation }}</p>
        </template>
        <template v-else-if="exercise.type === 'explanation'">
          <strong>Respuesta modelo</strong>
          <p>{{ exercise.modelAnswer }}</p>
        </template>
        <template v-else>
          <strong>Implementación de referencia</strong>
          <pre class="exercise-code"><code>{{ exercise.modelAnswer }}</code></pre>
          <strong>Comprueba tu solución</strong>
          <ul class="model-checklist">
            <li v-for="item in exercise.checklist" :key="item">{{ item }}</li>
          </ul>
          <p class="feedback-hint">Usa el entorno de desarrollo local para ejecutar y contrastar tu código. La aplicación no lo ejecuta por seguridad.</p>
        </template>
      </div>
    </div>
  </section>
</template>
