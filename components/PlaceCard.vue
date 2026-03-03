<script setup lang="ts">
defineProps<{
  place: {
    id: string
    name: string
    description: string
    image_url: string | null
    href: string | null
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
  <component
    :is="place.href ? 'a' : 'div'"
    v-bind="place.href ? { href: place.href, target: '_blank', rel: 'noopener noreferrer' } : {}"
    class="card-fun group block no-underline"
    :class="{ 'cursor-pointer': place.href }"
  >
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
      <span class="font-heading font-bold text-lg text-white inline-flex items-center gap-1">
        {{ place.name }}
        <svg v-if="place.href" class="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </span>
      <p class="text-neutral-400 text-sm mt-1 line-clamp-2">{{ place.description }}</p>
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
        <span class="text-xs text-neutral-600">
          od {{ place.profiles?.name || 'Neznámý' }}
        </span>
        <div class="flex items-center gap-2" @click.prevent.stop>
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
  </component>
</template>
