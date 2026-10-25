# JavaScript Lab

Plataforma de aprendizaje de JavaScript basada en **12 sesiones prácticas** de preparación técnica. Material de aprendizaje independiente, centrado en practicar y comprender JavaScript.

## Qué incluye esta primera versión

- Ruta de aprendizaje con las 12 sesiones del cuaderno original.
- Teoría, ejemplos de código, preguntas de predicción y retos.
- Panel de progreso, marcado de sesiones y notas personales guardadas en tu navegador.
- Diseño adaptable a escritorio y móvil.
- Vue 3, TypeScript, Vite y publicación preparada para GitHub Pages.

> **Estado:** MVP educativo. Las notas y la finalización se guardan en `localStorage` en este dispositivo. No hay cuentas, sincronización, ejecución remota de código ni corrección automática de ejercicios. El solucionario está pendiente de integrar.

## Ejecutar en local

Requisitos: Node.js 20.19+ (o 22.12+) y npm.

```bash
npm install
npm run dev
```

Para comprobar el compilado:

```bash
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

- `src/content/sessions/`: cuaderno, una sesión Markdown por archivo.
- `src/lib/course.ts`: metadatos y carga de sesiones.
- `src/App.vue`: navegación, progreso y lectura.
- `src/styles.css`: sistema visual responsive.
- `.github/workflows/deploy.yml`: compilación y publicación.

## Próximas iteraciones

1. Integrar el solucionario separado con revelación opcional y explicaciones.
2. Convertir los ejercicios en desafíos interactivos con validación segura.
3. Añadir simulacros puntuados, métricas por concepto y repaso inteligente.
4. Escribir pruebas unitarias y end-to-end; fijar las dependencias con lockfile.
5. Introducir sincronización opcional entre dispositivos cuando exista una necesidad real.

## Origen

Contenido adaptado del cuaderno privado de 12 sesiones de práctica de JavaScript, creado para preparar una evaluación técnica. El temario es educativo y **no reproduce preguntas oficiales de ningún proveedor**.

## Licencia

Pendiente de definir.
