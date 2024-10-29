export default function deepClone<T>(data: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(data)
    } catch (error) {
      console.warn('structuredClone falló, usando el método to JSON:', error)
      return JSON.parse(JSON.stringify(data === undefined ? '' : data))
    }
  }

  return JSON.parse(JSON.stringify(data === undefined ? '' : data))
}
