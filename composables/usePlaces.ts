export const usePlaces = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const places = ref<any[]>([])
  const loading = ref(false)

  const fetchPlaces = async () => {
    loading.value = true
    const { data } = await supabase
      .from('places')
      .select('*, profiles(name), place_votes(user_id)')
      .order('created_at', { ascending: false })

    places.value = (data || []).map((p: any) => ({
      ...p,
      vote_count: p.place_votes?.length || 0,
      user_voted: p.place_votes?.some((v: any) => v.user_id === user.value?.id) || false,
    }))
    loading.value = false
  }

  const addPlace = async (place: { name: string; description: string; image_url?: string; lat?: number; lng?: number }) => {
    if (!user.value) return
    const { error } = await supabase.from('places').insert({
      ...place,
      added_by: user.value.id,
    })
    if (error) throw error
    await fetchPlaces()
  }

  const toggleVote = async (placeId: string) => {
    if (!user.value) return
    const existing = places.value.find(p => p.id === placeId)
    if (existing?.user_voted) {
      await supabase.from('place_votes').delete().match({ place_id: placeId, user_id: user.value.id })
    } else {
      await supabase.from('place_votes').insert({ place_id: placeId, user_id: user.value.id })
    }
    await fetchPlaces()
  }

  const deletePlace = async (id: string) => {
    await supabase.from('places').delete().eq('id', id)
    await fetchPlaces()
  }

  return { places, loading, fetchPlaces, addPlace, toggleVote, deletePlace }
}
