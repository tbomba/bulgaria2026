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
const { isAdmin } = useAuth()
</script>

<template>
  <div class="card-fun group">
    <div class="aspect-video bg-white/[0.03] relative overflow-hidden">
      <img
        v-if="place.image_url"
        :src="place.image_url"
        :alt="place.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div v-else class="flex items-center justify-center h-full text-4xl">📍</div>
      <!-- Gradient overlay -->
      <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
    <div class="p-4">
      <h3 class="font-heading font-bold text-lg text-white">{{ place.name }}</h3>
      <p class="text-neutral-400 text-sm mt-1 line-clamp-2">{{ place.description }}</p>
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
        <span class="text-xs text-neutral-600">
          od {{ place.profiles?.name || 'Neznámý' }}
        </span>
        <div class="flex items-center gap-2">
          <button
            v-if="userId === place.added_by || isAdmin"
            class="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            @click="$emit('delete', place.id)"
          >
            Smazat
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
