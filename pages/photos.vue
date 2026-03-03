<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { photos, loading, fetchPhotos, deletePhoto } = usePhotos()
const supabase = useSupabaseClient()

const lightbox = ref<{ url: string; caption: string } | null>(null)
const profiles = ref<Array<{ id: string; name: string }>>([])
const filterBy = ref('')

onMounted(async () => {
  await fetchPhotos()
  const { data } = await supabase.from('profiles').select('id, name')
  profiles.value = data || []
})

watch(filterBy, async (val) => {
  if (val) {
    await fetchPhotos({ uploadedBy: val })
  } else {
    await fetchPhotos()
  }
})

const handleDelete = async (id: string) => {
  const photo = photos.value.find(p => p.id === id)
  if (!photo) return
  if (!confirm('Delete this photo?')) return
  await deletePhoto(id, photo.url)
}
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">📸 Photo Album</h1>
    <p class="page-subtitle">Memories from the trip</p>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Upload + filter sidebar -->
      <div class="lg:col-span-1 space-y-5">
        <PhotoUpload @uploaded="fetchPhotos()" />

        <div class="card p-4">
          <h3 class="font-heading font-bold text-sm mb-2 text-neutral-400">Filter by person</h3>
          <select
            v-model="filterBy"
            class="input-glass"
          >
            <option value="">Everyone</option>
            <option v-for="p in profiles" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
      </div>

      <!-- Photo grid -->
      <div class="lg:col-span-3">
        <div v-if="loading && !photos.length" class="text-center py-20 text-neutral-500">
          Loading photos...
        </div>

        <div v-else-if="!photos.length" class="text-center py-20">
          <span class="text-5xl">🖼️</span>
          <p class="text-neutral-500 mt-3">No photos yet. Upload the first one!</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <PhotoCard
            v-for="photo in photos"
            :key="photo.id"
            :photo="photo"
            @click="lightbox = { url: photo.url, caption: photo.caption }"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightbox"
          class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          @click="lightbox = null"
        >
          <button class="absolute top-4 right-4 text-white/60 text-3xl hover:text-white hover:scale-110 transition-all duration-300">&times;</button>
          <div class="max-w-4xl max-h-[90vh] relative animate-fade-in" @click.stop>
            <img :src="lightbox.url" :alt="lightbox.caption" class="max-w-full max-h-[85vh] rounded-xl object-contain" />
            <p v-if="lightbox.caption" class="text-neutral-300 text-center mt-3">{{ lightbox.caption }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
