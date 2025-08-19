import http from './http'

export type DictItem = { text: string; value: string }

type AnyRecord = Record<string, any>

function mapToDictItems(records: AnyRecord[] | undefined | null): DictItem[] {
  if (!Array.isArray(records)) return []
  return records
    .map((item: AnyRecord) => {
      if (item == null || typeof item !== 'object') return null
      if (typeof item.xs === 'string' && (typeof item.z === 'string' || typeof item.z === 'number')) {
        return { text: item.xs, value: String(item.z) }
      }
      if (typeof item.label === 'string' && (typeof item.value === 'string' || typeof item.value === 'number')) {
        return { text: item.label, value: String(item.value) }
      }
      if (typeof item.name === 'string' && (typeof item.id === 'string' || typeof item.id === 'number')) {
        return { text: item.name, value: String(item.id) }
      }
      const entries = Object.entries(item).filter(([, v]) => typeof v === 'string' || typeof v === 'number')
      if (entries.length >= 2) {
        return { text: String(entries[0][1]), value: String(entries[1][1]) }
      }
      return null
    })
    .filter(Boolean) as DictItem[]
}

export async function fetchDict(
  type: string,
  params?: Record<string, any>,
): Promise<DictItem[]> {
  try {
    const { data } = await http.get('/api/project/SjzdService/getDict', {
      params: { type, pageSize: 1000, current: 1, ...(params || {}) },
    })
    if (Array.isArray(data)) return mapToDictItems(data)
    if (Array.isArray((data as any)?.data)) return mapToDictItems((data as any).data)
    return []
  } catch {
    return []
  }
}

export default { fetchDict }

