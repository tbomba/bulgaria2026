<script setup lang="ts">
defineProps<{
  count: number
  voted: boolean
  loading?: boolean
}>()

defineEmits<{
  vote: []
}>()
</script>

<template>
  <button
    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
    :class="voted
      ? 'bg-pink-100 text-pink-600 shadow-sm'
      : 'bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-500'"
    :disabled="loading"
    @click="$emit('vote')"
  >
    <svg class="w-4 h-4" :class="{ 'animate-bounce-slow': voted }" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    <span>{{ count }}</span>
  </button>
</template>
