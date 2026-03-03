<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { places, loading, fetchPlaces, addPlace, toggleVote, deletePlace } = usePlaces()

const showForm = ref(false)
const form = reactive({ name: '', description: '', image_url: '' })
const submitting = ref(false)

onMounted(() => fetchPlaces())

const handleSubmit = async () => {
  if (!form.name.trim()) return
  submitting.value = true
  try {
    await addPlace({
      name: form.name,
      description: form.description,
      image_url: form.image_url || undefined,
    })
    Object.assign(form, { name: '', description: '', image_url: '' })
    showForm.value = false
  } catch (e: any) {
    alert(e.message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between mb-2">
      <h1 class="page-title">📍 Places to Visit</h1>
      <button class="btn-primary text-sm" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : '+ Add Place' }}
      </button>
    </div>
    <p class="page-subtitle">Vote on places you want to visit!</p>

    <!-- Add form -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <form v-if="showForm" class="card p-5 mb-8 space-y-3" @submit.prevent="handleSubmit">
        <input
          v-model="form.name"
          type="text"
          placeholder="Place name"
          required
          class="input-glass"
        />
        <textarea
          v-model="form.description"
          placeholder="Why should we visit?"
          rows="2"
          class="input-glass resize-none"
        />
        <input
          v-model="form.image_url"
          type="url"
          placeholder="Image URL (optional)"
          class="input-glass"
        />
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? 'Adding...' : 'Add Place' }}
        </button>
      </form>
    </Transition>

    <!-- Loading -->
    <div v-if="loading && !places.length" class="text-center py-20 text-neutral-500">
      Loading places...
    </div>

    <!-- Empty -->
    <div v-else-if="!places.length" class="text-center py-20">
      <span class="text-5xl">🏖️</span>
      <p class="text-neutral-500 mt-3">No places yet. Be the first to add one!</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <PlaceCard
        v-for="place in places"
        :key="place.id"
        :place="place"
        @vote="toggleVote"
        @delete="deletePlace"
      />
    </div>
  </div>
</template>
