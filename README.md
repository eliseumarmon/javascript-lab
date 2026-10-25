# JavaScript Lab

Plataforma de aprendizaje de JavaScript basada en **12 sesiones prácticas** de preparación técnica. Material de aprendizaje independiente, centrado en practicar y comprender JavaScript.

## Funcionalidades

- Ruta de aprendizaje con las 12 sesiones del cuaderno original.
- Sesión 01 interactiva: 8 predicciones con corrección exacta, 2 explicaciones con rúbricas heurísticas y 1 ejercicio de código con revisión guiada.
- Explicaciones y soluciones modelo que aparecen después del primer intento, con posibilidad de reintentar.
- Panel de progreso, marcado de sesiones, notas y respuestas persistidas localmente en tu navegador.
- Diseño adaptable a escritorio y móvil.
- Vue 3, TypeScript, Vite y publicación preparada para GitHub Pages.

> **Estado:** MVP educativo. La sesión 01 dispone de evaluación automática de salidas y revisión orientativa de explicaciones. No hay cuentas, sincronización ni ejecución de código aportado por alumnos. Las sesiones 02–12 se mantienen como cuadernos de práctica. Los criterios de palabras clave no equivalen a una corrección semántica.

## Ejecutar en local

Requisitos: Node.js 20.19+ (o 22.12+) y npm.

```bash
npm install
npm run dev
```

Para comprobar el compilado:

```bash
npm test
npm run build
npm run preview
```

En la primera instalación, npm generará `package-lock.json`. Se incorporará al repositorio para usar `npm ci` en la automatización.

## Publicación en GitHub Pages

El repositorio contiene el workflow `.github/workflows/deploy.yml`. En **Settings → Pages → Build and deployment → Source**, selecciona **GitHub Actions**.

El sitio se publicará, después de un despliegue correcto, en:

https://eliseumarmon.github.io/javascript-lab/

La ruta base de Vite está configurada para `/javascript-lab/`. La activación de Pages es una operación manual en la configuración del repositorio.

## Organización

- `src/content/sessions/`: material de lectura de cada sesión.
- `src/content/exercises/01.ts`: ejercicios estructurados, respuestas y rúbricas de la sesión 01.
- `src/lib/evaluation.ts`: estrategias de evaluación sin ejecución de código.
- `src/components/ExerciseRunner.vue` y `ExerciseCard.vue`: interfaz reutilizable de práctica.
- `src/stores/attempts.ts`: intentos persistentes por ejercicio.
- `src/lib/course.ts`: metadatos y carga de sesiones.
- `src/App.vue`: navegación, progreso y lectura.
- `src/styles.css`: sistema visual responsive.
- `.github/workflows/deploy.yml`: compilación y publicación.

## Próximas iteraciones

1. Convertir progresivamente las sesiones 02–12 usando los componentes de la sesión 01.
2. Incorporar ejecución aislada del código para tests automáticos de programación, sin usar `eval` en el hilo principal.
3. Añadir estadísticas por concepto, repaso espaciado y simulacros.
4. Añadir pruebas end-to-end y fijar dependencias mediante lockfile.
5. Introducir sincronización opcional si surge una necesidad real.

## Origen

Contenido adaptado del cuaderno privado de 12 sesiones de práctica de JavaScript, creado para preparar una evaluación técnica. El temario es educativo y **no reproduce preguntas oficiales de ningún proveedor**.

## Licencia

Pendiente de definir.
