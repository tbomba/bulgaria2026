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
const { isAdmin } = useAuth()
</script>

<template>
  <div class="card-fun group cursor-pointer" @click="$emit('click')">
    <div class="aspect-square bg-white/[0.03] relative overflow-hidden">
      <img
        :src="photo.url"
        :alt="photo.caption"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <button
        v-if="userId === photo.uploaded_by || isAdmin"
        class="absolute top-2 right-2 w-7 h-7 bg-red-500/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center
               opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs hover:bg-red-500 hover:scale-110"
        @click.stop="$emit('delete', photo.id)"
      >
        ✕
      </button>
    </div>
    <div class="p-3">
      <p v-if="photo.caption" class="text-sm text-neutral-300 line-clamp-2">{{ photo.caption }}</p>
      <p class="text-xs text-neutral-600 mt-1">
        {{ photo.profiles?.name || 'Unknown' }}
      </p>
    </div>
  </div>
</template>
