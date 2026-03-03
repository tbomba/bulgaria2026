export const usePhotos = () => {
  const supabase = useSupabaseClient()

  const photos = ref<any[]>([])
  const loading = ref(false)

  const fetchPhotos = async (filters?: { uploadedBy?: string }) => {
    loading.value = true
    let query = supabase
      .from('photos')
      .select('*, profiles!photos_uploaded_by_fkey(name)')
      .order('created_at', { ascending: false })

    if (filters?.uploadedBy) {
      query = query.eq('uploaded_by', filters.uploadedBy)
    }

    const { data } = await query
    photos.value = data || []
    loading.value = false
  }

  const updatePhoto = async (id: string, updates: { caption?: string }) => {
    const { error } = await supabase.from('photos').update(updates).eq('id', id)
    if (error) throw error
    await fetchPhotos()
  }

  const deletePhoto = async (id: string, url: string) => {
    // Delete from storage
    const path = url.split('/storage/v1/object/public/photos/')[1]
    if (path) {
      await supabase.storage.from('photos').remove([path])
    }
    // Delete from DB
    await supabase.from('photos').delete().eq('id', id)
    await fetchPhotos()
  }

  return { photos, loading, fetchPhotos, updatePhoto, deletePhoto }
}
