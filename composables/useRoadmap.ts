export const useRoadmap = () => {
  const supabase = useSupabaseClient()

  const stops = ref<any[]>([])
  const loading = ref(false)

  const fetchStops = async () => {
    loading.value = true
    const { data } = await supabase
      .from('roadmap_stops')
      .select('*, places(id, name, image_url, href)')
      .order('sort_order', { ascending: true })

    stops.value = data || []
    loading.value = false
  }

  const addStop = async (stop: { place_id: string; day: number; notes: string; emoji: string; sort_order: number }) => {
    const { error } = await supabase.from('roadmap_stops').insert(stop)
    if (error) throw error
    await fetchStops()
  }

  const updateStop = async (id: string, updates: Partial<{ place_id: string; day: number; notes: string; emoji: string; sort_order: number }>) => {
    const { error } = await supabase.from('roadmap_stops').update(updates).eq('id', id)
    if (error) throw error
    await fetchStops()
  }

  const deleteStop = async (id: string) => {
    const { error } = await supabase.from('roadmap_stops').delete().eq('id', id)
    if (error) throw error
    await fetchStops()
  }

  const swapOrder = async (stopA: any, stopB: any) => {
    const orderA = stopA.sort_order
    const orderB = stopB.sort_order
    await supabase.from('roadmap_stops').update({ sort_order: orderB }).eq('id', stopA.id)
    await supabase.from('roadmap_stops').update({ sort_order: orderA }).eq('id', stopB.id)
    await fetchStops()
  }

  return { stops, loading, fetchStops, addStop, updateStop, deleteStop, swapOrder }
}
