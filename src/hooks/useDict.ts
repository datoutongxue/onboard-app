import { ref, onMounted, watchEffect } from 'vue'
import type { DictItem } from '@/api/dict'
import { fetchDict } from '@/api/dict'

export function useDict(type: string, params?: Record<string, any>) {
  const items = ref<DictItem[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      items.value = await fetchDict(type, params)
    } finally {
      loading.value = false
    }
  }

  onMounted(load)
  watchEffect(() => {
    void (async () => {
      await load()
    })()
  })

  return { items, loading, reload: load }
}

export default useDict

