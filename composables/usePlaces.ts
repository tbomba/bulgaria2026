export const usePlaces = () => {
  const supabase = useSupabaseClient()
  const userId = useUserId()

  const places = ref<any[]>([])
  const loading = ref(false)

  const fetchPlaces = async () => {
    loading.value = true
    const { data } = await supabase
      .from('places')
      .select('*, profiles!places_added_by_fkey(name), place_votes(user_id)')
      .order('created_at', { ascending: false })

    places.value = (data || []).map((p: any) => ({
      ...p,
      vote_count: p.place_votes?.length || 0,
      user_voted: p.place_votes?.some((v: any) => v.user_id === userId.value) || false,
    }))
    loading.value = false
  }

  const addPlace = async (place: { name: string; description: string; image_url?: string; href?: string; lat?: number; lng?: number }) => {
    if (!userId.value) return
    const { error } = await supabase.from('places').insert({
      ...place,
      added_by: userId.value,
    })
    if (error) throw error
    await fetchPlaces()
  }

  const toggleVote = async (placeId: string) => {
    if (!userId.value) return
    const existing = places.value.find(p => p.id === placeId)
    if (existing?.user_voted) {
      await supabase.from('place_votes').delete().match({ place_id: placeId, user_id: userId.value })
    } else {
      await supabase.from('place_votes').insert({ place_id: placeId, user_id: userId.value })
    }
    await fetchPlaces()
  }

  const updatePlace = async (id: string, updates: { name?: string; description?: string; image_url?: string; href?: string }) => {
    const { error } = await supabase.from('places').update(updates).eq('id', id)
    if (error) throw error
    await fetchPlaces()
  }

  const deletePlace = async (id: string) => {
    await supabase.from('places').delete().eq('id', id)
    await fetchPlaces()
  }

  return { places, loading, fetchPlaces, addPlace, toggleVote, updatePlace, deletePlace }
}
