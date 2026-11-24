// Короткий уникальный id. crypto.randomUUID есть во всех современных браузерах и в Node 19+
export function createId(): string {
  return crypto.randomUUID().slice(0, 8)
}
