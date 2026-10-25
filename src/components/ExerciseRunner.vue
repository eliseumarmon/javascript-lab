<script setup lang="ts">
import { computed } from 'vue'
import type { Exercise } from '../lib/evaluation'
import { evaluate } from '../lib/evaluation'
import { useAttemptsStore } from '../stores/attempts'
import ExerciseCard from './ExerciseCard.vue'

const props = defineProps<{ exercises: Exercise[] }>()
const store = useAttemptsStore()
const completed = computed(() => props.exercises.filter(exercise => store.get(exercise.id).submitted).length)
const predictionTotal = computed(() => props.exercises.filter(exercise => exercise.type === 'prediction').length)
const predictionCorrect = computed(() => props.exercises.filter(exercise => {
  const record = store.get(exercise.id)
  if (!record.submitted || exercise.type !== 'prediction') return false
  const result = evaluate(exercise, record.response)
  return result.kind === 'prediction' && result.correct
}).length)
</script>

<template>
  <div class="exercise-runner">
    <div class="practice-heading">
      <span>LABORATORIO INTERACTIVO</span>
      <h2>Ahora te toca a ti.</h2>
      <p>Primero razona tu respuesta. Comprueba después el resultado y revela la solución cuando estés preparado.</p>
      <div class="practice-stats">
        <span>{{ completed }} / {{ exercises.length }} ejercicios respondidos</span>
        <span>{{ predictionCorrect }} / {{ predictionTotal }} predicciones correctas (último intento)</span>
      </div>
    </div>
    <ExerciseCard v-for="exercise in exercises" :key="exercise.id" :exercise="exercise" />
  </div>
</template>
