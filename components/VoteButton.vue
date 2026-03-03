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
    class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
    :class="voted
      ? 'bg-white/15 text-white shadow-sm shadow-white/10 backdrop-blur-sm border border-white/20'
      : 'bg-white/[0.04] backdrop-blur-sm text-neutral-500 border border-white/[0.08] hover:bg-white/[0.08] hover:text-neutral-300 hover:shadow-sm'"
    :disabled="loading"
    @click="$emit('vote')"
  >
    <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'animate-bounce-slow scale-110': voted }" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    <span>{{ count }}</span>
  </button>
</template>
