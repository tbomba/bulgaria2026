<script setup lang="ts">
const props = defineProps<{
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
  update: [id: string, updates: { caption: string }]
}>()

const userId = useUserId()
const { isAdmin } = useAuth()

const canEdit = computed(() => userId.value === props.photo.uploaded_by || isAdmin.value)
const editing = ref(false)
const editCaption = ref('')

const startEdit = () => {
  editCaption.value = props.photo.caption || ''
  editing.value = true
}
</script>

<template>
  <!-- Edit mode -->
  <div v-if="editing" class="card-fun p-3 space-y-2">
    <div class="aspect-square bg-white/[0.03] relative overflow-hidden rounded-lg">
      <img :src="photo.url" :alt="photo.caption" class="w-full h-full object-cover" />
    </div>
    <input v-model="editCaption" type="text" placeholder="Popisek..." class="input-glass text-sm" />
    <div class="flex gap-2">
      <button class="btn-primary text-xs !py-1.5 !px-4" @click="$emit('update', photo.id, { caption: editCaption }); editing = false">
        Uložit
      </button>
      <button class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors" @click="editing = false">
        Zrušit
      </button>
    </div>
  </div>

  <!-- Display mode -->
  <div v-else class="card-fun group cursor-pointer" @click="$emit('click')">
    <div class="aspect-square bg-white/[0.03] relative overflow-hidden">
      <img
        :src="photo.url"
        :alt="photo.caption"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <!-- Action buttons -->
      <div
        v-if="canEdit"
        class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
        @click.stop
      >
        <button
          class="w-7 h-7 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs hover:bg-white/30 hover:scale-110 transition-all"
          @click="startEdit"
        >
          ✎
        </button>
        <button
          class="w-7 h-7 bg-red-500/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs hover:bg-red-500 hover:scale-110 transition-all"
          @click="$emit('delete', photo.id)"
        >
          ✕
        </button>
      </div>
    </div>
    <div class="p-3">
      <p v-if="photo.caption" class="text-sm text-neutral-300 line-clamp-2">{{ photo.caption }}</p>
      <p class="text-xs text-neutral-600 mt-1">
        {{ photo.profiles?.name || 'Neznámý' }}
      </p>
    </div>
  </div>
</template>
