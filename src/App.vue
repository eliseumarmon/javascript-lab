<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { lessons, tracks } from './lib/course'
import { useProgressStore } from './stores/progress'

const progressStore = useProgressStore()
const selectedId = ref<string | null>(null)
const drawer = ref(false)
const query = ref('')

function fromHash() {
  const match = window.location.hash.match(/^#\/session\/(\d{2})$/)
  return match && lessons.some(lesson => lesson.id === match[1]) ? match[1] : null
}
function syncRoute() { selectedId.value = fromHash() }
function navigate(id: string | null) {
  window.location.hash = id ? `/session/${id}` : '/'
  selectedId.value = id
  drawer.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
onMounted(() => {
  syncRoute()
  window.addEventListener('hashchange', syncRoute)
})
onUnmounted(() => window.removeEventListener('hashchange', syncRoute))

const active = computed(() => lessons.find(lesson => lesson.id === selectedId.value))
const currentIndex = computed(() => lessons.findIndex(lesson => lesson.id === selectedId.value))
const previous = computed(() => currentIndex.value > 0 ? lessons[currentIndex.value - 1] : undefined)
const next = computed(() => currentIndex.value >= 0 ? lessons[currentIndex.value + 1] : undefined)
const completed = computed(() => lessons.filter(lesson => progressStore.isDone(lesson.id)).length)
const percent = computed(() => Math.round(completed.value / lessons.length * 100))
const continueAt = computed(() => lessons.find(lesson => !progressStore.isDone(lesson.id)) ?? lessons[0])
const found = computed(() => lessons.filter(lesson =>
  `${lesson.title} ${lesson.track}`.toLocaleLowerCase('es').includes(query.value.toLocaleLowerCase('es'))
))
const rendered = computed(() => DOMPurify.sanitize(
  marked.parse(active.value?.content ?? '', { async: false, gfm: true }) as string
))
function saveNotes(event: Event) {
  if (active.value) progressStore.setNotes(active.value.id, (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="app-shell">
    <div v-if="drawer" class="overlay" @click="drawer = false"></div>
    <aside class="sidebar" :class="{ open: drawer }">
      <div class="brand-row">
        <button class="brand" @click="navigate(null)" aria-label="Inicio de JavaScript Lab">
          <span class="brand-icon">JS</span>
          <span><strong>JavaScript Lab</strong><small>LEARNING PLATFORM</small></span>
        </button>
        <button class="drawer-close" aria-label="Cerrar menú" @click="drawer = false">×</button>
      </div>

      <div class="side-scroll">
        <div class="sidebar-caption">TU ESPACIO</div>
        <button class="dashboard-link" :class="{ selected: !active }" @click="navigate(null)">
          <span class="side-symbol">▦</span> Mi aprendizaje <span class="chevron">›</span>
        </button>
        <div class="sidebar-caption section-label"><span>PLAN DE ESTUDIO</span><span>12 SESIONES</span></div>
        <nav aria-label="Temario">
          <button v-for="lesson in lessons" :key="lesson.id" class="nav-lesson" :class="{ selected: active?.id === lesson.id }" @click="navigate(lesson.id)">
            <span class="nav-number">{{ lesson.id }}</span><span class="nav-text">{{ lesson.title }}</span>
            <span class="nav-end" :class="{ done: progressStore.isDone(lesson.id) }">{{ progressStore.isDone(lesson.id) ? '✓' : '›' }}</span>
          </button>
        </nav>
      </div>

      <div class="sidebar-progress">
        <div class="progress-row"><span>Tu progreso</span><strong>{{ completed }} / 12</strong></div>
        <div class="progress-bar"><div :style="{ width: percent + '%' }"></div></div>
        <small>{{ percent }}% del recorrido completado</small>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div class="breadcrumbs"><button class="menu-toggle" aria-label="Abrir menú" @click="drawer = true">☰</button>
          <button @click="navigate(null)">Plataforma</button><span class="path-separator">/</span>
          <strong>{{ active ? 'Sesión ' + active.id : 'Dashboard' }}</strong>
        </div>
        <a href="https://github.com/eliseumarmon/javascript-lab" target="_blank" rel="noopener noreferrer" class="github">Ver en GitHub ↗</a>
      </header>

      <div v-if="!active" class="page dashboard-page">
        <div class="overline">━&nbsp; TU ESPACIO DE APRENDIZAJE</div>
        <section class="hero">
          <div class="hero-copy">
            <div class="hero-kicker"><span class="green-dot"></span> CURSO PRÁCTICO · 12 SESIONES</div>
            <h1>Aprende JavaScript.<br /><em>Entiende el porqué.</em></h1>
            <p>De los fundamentos al Event Loop. Un recorrido para predecir, razonar, programar y explicar código de verdad.</p>
            <button class="primary-button" @click="navigate(continueAt.id)">{{ completed ? 'Continuar aprendiendo' : 'Comenzar a aprender' }} <span>→</span></button>
          </div>
          <div class="hero-art" aria-hidden="true">
            <div class="code-card"><span>const learn = async () => {</span><span>&nbsp;&nbsp;await practice();</span><span>&nbsp;&nbsp;return growth;</span><span>}</span></div>
            <div class="js-card"><small>THE JAVASCRIPT LAB</small><strong>JS<span>.</span></strong><small>BUILD YOUR UNDERSTANDING_</small></div>
          </div>
        </section>

        <section class="stats" aria-label="Estadísticas">
          <div class="stat"><span>▤ &nbsp; TOTAL SESIONES</span><strong>12</strong><small>De teoría a evaluación</small></div>
          <div class="stat"><span>◎ &nbsp; COMPLETADAS</span><strong>{{ String(completed).padStart(2, '0') }}<i> / 12</i></strong><small>Trabajo registrado</small></div>
          <div class="stat"><span>◷ &nbsp; TU PROGRESO</span><strong>{{ percent }}<i>%</i></strong><div class="stat-progress"><div :style="{ width: percent + '%' }"></div></div></div>
        </section>

        <div class="heading-row">
          <div><div class="overline">EL RECORRIDO</div><h2>Tu ruta de aprendizaje</h2><p>Selecciona una sesión, practica y registra lo aprendido.</p></div>
          <label class="search"><span>⌕</span><input v-model="query" aria-label="Buscar sesiones" placeholder="Buscar un tema..." /></label>
        </div>
        <section v-for="track in tracks" :key="track" class="module">
          <template v-if="found.some(lesson => lesson.track === track)">
            <div class="module-title"><span class="module-dot"></span><h3>{{ track }}</h3><small>{{ found.filter(lesson => lesson.track === track).length }} sesiones</small></div>
            <div class="cards">
              <button v-for="lesson in found.filter(item => item.track === track)" :key="lesson.id" class="course-card" @click="navigate(lesson.id)">
                <div class="card-top"><span class="number">{{ lesson.id }}</span><span :class="{ done: progressStore.isDone(lesson.id) }">{{ progressStore.isDone(lesson.id) ? '✓' : '○' }}</span></div>
                <h4>{{ lesson.title }}</h4>
                <p>{{ lesson.track === 'Asincronía' ? 'Traza y comprende el comportamiento asíncrono de JavaScript.' : 'Ejercicios de predicción, explicación y aplicación práctica.' }}</p>
                <div class="card-bottom"><span>◷ {{ lesson.minutes }} min</span><span>Ver sesión →</span></div>
              </button>
            </div>
          </template>
        </section>
        <div v-if="found.length === 0" class="empty-state">No hay sesiones que coincidan con la búsqueda.</div>
        <p class="disclaimer">Material de práctica independiente. La plataforma aún no corrige respuestas de forma automática.</p>
      </div>

      <div v-else class="page lesson-page">
        <button class="back" @click="navigate(null)">← Volver al itinerario</button>
        <div class="lesson-heading">
          <div class="overline">SESIÓN {{ active.id }} / 12 &nbsp; · &nbsp; {{ active.track.toUpperCase() }}</div>
          <h1>{{ active.title }}</h1>
          <p>Practica a tu ritmo: predice el resultado, justifica tu respuesta y ejecuta cada bloque por separado.</p>
          <div class="lesson-tags"><span>◷ {{ active.minutes }} min aprox.</span><span>⌘ Ejercicios prácticos</span><span v-if="progressStore.isDone(active.id)" class="complete-tag">✓ Completada</span></div>
        </div>

        <div class="reading-layout">
          <article class="markdown" v-html="rendered"></article>
          <aside class="study-aside">
            <div class="notes">
              <span class="note-illustration">✎</span>
              <h2>Cuaderno de práctica</h2>
              <p>Anota tus predicciones, correcciones y dudas. Este espacio es privado de tu navegador.</p>
              <label :for="'session-note-' + active.id">MIS NOTAS · SESIÓN {{ active.id }}</label>
              <textarea :id="'session-note-' + active.id" rows="8" :value="progressStore.notesFor(active.id)" placeholder="Antes de ejecutar el código, creo que..." @input="saveNotes"></textarea>
              <small>Guardado local automático</small>
              <button class="complete-button" :class="{ completed: progressStore.isDone(active.id) }" @click="progressStore.toggle(active.id)">
                {{ progressStore.isDone(active.id) ? '✓ Marcar como pendiente' : '✓ Marcar sesión completada' }}
              </button>
              <p class="caution">Marcar una sesión no implica que los ejercicios estén corregidos.</p>
            </div>
            <div class="tip"><strong>CONSEJO DE ESTUDIO</strong><p>Primero predice; después ejecuta. Explicar por qué ocurre algo es tan importante como acertar.</p></div>
          </aside>
        </div>

        <nav class="pagination" aria-label="Navegación entre sesiones">
          <button v-if="previous" @click="navigate(previous.id)">← <span><small>ANTERIOR</small><strong>{{ previous.title }}</strong></span></button><span v-else></span>
          <button v-if="next" @click="navigate(next.id)"><span><small>SIGUIENTE</small><strong>{{ next.title }}</strong></span> →</button>
          <button v-else @click="navigate(null)"><span><small>FIN DEL RECORRIDO</small><strong>Volver al panel</strong></span> →</button>
        </nav>
      </div>
      <footer class="footer"><span>JavaScript Lab · 2026</span><span>Aprende construyendo, no memorizando respuestas.</span></footer>
    </main>
  </div>
</template>
