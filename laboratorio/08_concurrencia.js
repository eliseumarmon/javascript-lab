// Laboratorio de práctica, sesión 08. Ejecuta con Node.js.
const latencies = new Map([[1, 300], [2, 150], [3, 200]])
export function fakeRequest(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 3) reject(new Error('Usuario no disponible: ' + id))
      else resolve({ id, name: 'User ' + id })
    }, latencies.get(id) ?? 100)
  })
}
export async function loadSequential(ids) {
  // TODO: completar ejercicio 8.3
  throw new Error('Implementa loadSequential')
}
export async function loadConcurrent(ids) {
  // TODO: completar ejercicio 8.4
  throw new Error('Implementa loadConcurrent')
}
export async function loadSettled(ids) {
  // TODO: completar ejercicio 8.5
  throw new Error('Implementa loadSettled')
}
export async function getUser(id, fetchImpl = fetch) {
  // TODO: completar ejercicio 8.8, validando response.ok
  throw new Error('Implementa getUser')
}
console.log('Laboratorio preparado. Completa y prueba las funciones exportadas.')
