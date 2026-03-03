<script setup lang="ts">
defineProps<{
  challenge: {
    id: string
    title: string
    description: string
    points: number
    created_by: string
    profiles?: { name: string } | null
    completions: Array<{ user_id: string; proof_url: string | null; profiles?: { name: string } | null }>
    user_completed: boolean
  }
  loading?: boolean
}>()

defineEmits<{
  complete: [id: string]
  delete: [id: string]
}>()

const userId = useUserId()
const { isAdmin } = useAuth()
</script>

<template>
  <div class="card-fun p-5 relative overflow-hidden">
    <!-- Left accent bar -->
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 to-white/5 rounded-l-2xl"></div>

    <div class="flex items-start justify-between pl-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-heading font-bold text-lg text-white">{{ challenge.title }}</h3>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-neutral-300 border border-white/10">
            {{ challenge.points }} pts
          </span>
        </div>
        <p class="text-neutral-400 text-sm">{{ challenge.description }}</p>
      </div>
      <span v-if="challenge.user_completed" class="text-2xl shrink-0 ml-2 animate-bounce-slow">✅</span>
    </div>

    <div class="mt-3 flex flex-wrap gap-1.5 pl-3">
      <span
        v-for="comp in challenge.completions"
        :key="comp.user_id"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/[0.06] text-neutral-300 rounded-full text-xs font-medium
               backdrop-blur-sm border border-white/[0.08]"
      >
        🏅 {{ comp.profiles?.name || 'Someone' }}
      </span>
    </div>

    <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06] pl-3">
      <span class="text-xs text-neutral-600">by {{ challenge.profiles?.name || 'Unknown' }}</span>
      <div class="flex items-center gap-2">
        <button
          v-if="userId === challenge.created_by || isAdmin"
          class="text-xs text-red-400/60 hover:text-red-400 transition-colors"
          @click="$emit('delete', challenge.id)"
        >
          Delete
        </button>
        <button
          v-if="!challenge.user_completed"
          class="btn-primary text-xs !py-1.5 !px-4"
          :disabled="loading"
          @click="$emit('complete', challenge.id)"
        >
          Complete!
        </button>
      </div>
    </div>
  </div>
</template>
