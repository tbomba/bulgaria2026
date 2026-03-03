<script setup lang="ts">
defineProps<{
  proposal: {
    id: string
    title: string
    description: string
    proposed_by: string
    created_at: string
    profiles?: { name: string } | null
    vote_total: number
    user_vote: number
  }
  loading?: boolean
}>()

defineEmits<{
  upvote: [id: string]
  downvote: [id: string]
  delete: [id: string]
}>()

const user = useSupabaseUser()
</script>

<template>
  <div class="card-fun p-5">
    <div class="flex items-start gap-4">
      <!-- Vote controls -->
      <div class="flex flex-col items-center gap-1 shrink-0">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          :class="proposal.user_vote === 1
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500'"
          :disabled="loading"
          @click="$emit('upvote', proposal.id)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span class="font-heading font-bold text-lg" :class="{
          'text-green-600': proposal.vote_total > 0,
          'text-red-500': proposal.vote_total < 0,
          'text-gray-400': proposal.vote_total === 0,
        }">
          {{ proposal.vote_total }}
        </span>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          :class="proposal.user_vote === -1
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'"
          :disabled="loading"
          @click="$emit('downvote', proposal.id)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="font-heading font-bold text-lg text-gray-800">{{ proposal.title }}</h3>
        <p class="text-gray-500 text-sm mt-1">{{ proposal.description }}</p>
        <div class="flex items-center justify-between mt-3">
          <span class="text-xs text-gray-400">
            by {{ proposal.profiles?.name || 'Unknown' }}
          </span>
          <button
            v-if="user?.id === proposal.proposed_by"
            class="text-xs text-red-400 hover:text-red-600 transition-colors"
            @click="$emit('delete', proposal.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
