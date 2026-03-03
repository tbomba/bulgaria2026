<script setup lang="ts">
defineProps<{
  photo: {
    id: string
    url: string
    caption: string
    uploaded_by: string
    created_at: string
    profiles?: { name: string } | null
  }
}>()

defineEmits<{
  click: []
  delete: [id: string]
}>()

const userId = useUserId()
</script>

<template>
  <div class="card-fun group cursor-pointer" @click="$emit('click')">
    <div class="aspect-square bg-gray-100 relative overflow-hidden">
      <img
        :src="photo.url"
        :alt="photo.caption"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <button
        v-if="userId === photo.uploaded_by"
        class="absolute top-2 right-2 w-7 h-7 bg-red-500/80 text-white rounded-full flex items-center justify-center
               opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
        @click.stop="$emit('delete', photo.id)"
      >
        ✕
      </button>
    </div>
    <div class="p-3">
      <p v-if="photo.caption" class="text-sm text-gray-700 line-clamp-2">{{ photo.caption }}</p>
      <p class="text-xs text-gray-400 mt-1">
        {{ photo.profiles?.name || 'Unknown' }}
      </p>
    </div>
  </div>
</template>
