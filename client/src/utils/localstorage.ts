export const getItem = <T>(key: string): T | undefined => {
  const item = localStorage.getItem(key)
  if (!item) return
  return JSON.parse(item)
}
