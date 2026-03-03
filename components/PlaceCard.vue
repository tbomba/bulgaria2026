<script setup lang="ts">
defineProps<{
  place: {
    id: string
    name: string
    description: string
    image_url: string | null
    added_by: string
    created_at: string
    profiles?: { name: string } | null
    vote_count: number
    user_voted: boolean
  }
  loading?: boolean
}>()

defineEmits<{
  vote: [id: string]
  delete: [id: string]
}>()

const userId = useUserId()
</script>

<template>
  <div class="card-fun">
    <div class="aspect-video bg-gradient-to-br from-pink-200 to-orange-200 relative overflow-hidden">
      <img
        v-if="place.image_url"
        :src="place.image_url"
        :alt="place.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="flex items-center justify-center h-full text-4xl">📍</div>
    </div>
    <div class="p-4">
      <h3 class="font-heading font-bold text-lg text-gray-800">{{ place.name }}</h3>
      <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ place.description }}</p>
      <div class="flex items-center justify-between mt-3">
        <span class="text-xs text-gray-400">
          by {{ place.profiles?.name || 'Unknown' }}
        </span>
        <div class="flex items-center gap-2">
          <button
            v-if="userId === place.added_by"
            class="text-xs text-red-400 hover:text-red-600 transition-colors"
            @click="$emit('delete', place.id)"
          >
            Delete
          </button>
          <VoteButton
            :count="place.vote_count"
            :voted="place.user_voted"
            :loading="loading"
            @vote="$emit('vote', place.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
