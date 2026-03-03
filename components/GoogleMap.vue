<script setup lang="ts">
defineProps<{
  embedUrl?: string
}>()

const defaultUrl = 'https://www.google.com/maps/d/embed?mid=1StU8SpQzZy92Rq7C-D8eYnL6CEiGp9U'
</script>

<template>
  <div class="rounded-2xl overflow-hidden shadow-glass-lg bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
    <iframe
      :src="embedUrl || defaultUrl"
      class="w-full h-full min-h-[400px]"
      style="border: 0"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
  </div>
</template>
