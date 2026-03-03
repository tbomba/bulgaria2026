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

const user = useSupabaseUser()
</script>

<template>
  <div class="card-fun p-5">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-heading font-bold text-lg text-gray-800">{{ challenge.title }}</h3>
          <span class="px-2 py-0.5 rounded-full text-xs font-bold gradient-bg text-white">
            {{ challenge.points }} pts
          </span>
        </div>
        <p class="text-gray-500 text-sm">{{ challenge.description }}</p>
      </div>
      <span v-if="challenge.user_completed" class="text-2xl shrink-0 ml-2">✅</span>
    </div>

    <div class="mt-3 flex flex-wrap gap-1.5">
      <span
        v-for="comp in challenge.completions"
        :key="comp.user_id"
        class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium"
      >
        🏅 {{ comp.profiles?.name || 'Someone' }}
      </span>
    </div>

    <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
      <span class="text-xs text-gray-400">by {{ challenge.profiles?.name || 'Unknown' }}</span>
      <div class="flex items-center gap-2">
        <button
          v-if="user?.id === challenge.created_by"
          class="text-xs text-red-400 hover:text-red-600 transition-colors"
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
