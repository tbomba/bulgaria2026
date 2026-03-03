<script setup lang="ts">
const props = defineProps<{
  place: {
    id: string
    name: string
    description: string
    image_url: string | null
    href: string | null
    category: string
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
  update: [id: string, updates: { name: string; description: string; image_url: string; href: string; category: string }]
}>()

const userId = useUserId()
const { isAdmin } = useAuth()

const canEdit = computed(() => userId.value === props.place.added_by || isAdmin.value)
const editing = ref(false)
const editForm = reactive({ name: '', description: '', image_url: '', href: '', category: 'main' })

const categories = [
  { value: 'main', label: 'Hlavní místečka' },
  { value: 'side', label: 'Side questy' },
  { value: 'sleep', label: 'Spaní' },
]

const categoryLabel = computed(() => categories.find(c => c.value === props.place.category)?.label || '')

const startEdit = () => {
  Object.assign(editForm, {
    name: props.place.name,
    description: props.place.description,
    image_url: props.place.image_url || '',
    href: props.place.href || '',
    category: props.place.category || 'main',
  })
  editing.value = true
}
</script>

<template>
  <!-- Edit mode -->
  <div v-if="editing" class="card-fun p-5 space-y-2">
    <input v-model="editForm.name" type="text" placeholder="Název místa" class="input-glass text-sm" />
    <textarea v-model="editForm.description" placeholder="Popis..." rows="2" class="input-glass text-sm resize-none" />
    <input v-model="editForm.image_url" type="url" placeholder="URL obrázku (nepovinné)" class="input-glass text-sm" />
    <input v-model="editForm.href" type="url" placeholder="Odkaz (nepovinné)" class="input-glass text-sm" />
    <div class="flex items-center gap-1.5">
      <button
        v-for="cat in categories"
        :key="cat.value"
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
        :class="editForm.category === cat.value
          ? 'bg-white/15 text-white border-white/20'
          : 'bg-white/[0.04] text-neutral-500 border-white/[0.08] hover:bg-white/[0.08]'"
        @click="editForm.category = cat.value"
      >
        {{ cat.label }}
      </button>
    </div>
    <div class="flex gap-2 pt-1">
      <button class="btn-primary text-xs !py-1.5 !px-4" @click="$emit('update', place.id, { ...editForm }); editing = false">
        Uložit
      </button>
      <button class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors" @click="editing = false">
        Zrušit
      </button>
    </div>
  </div>

  <!-- Display mode -->
  <component
    v-else
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
      <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
      <!-- Category badge -->
      <span
        v-if="categoryLabel"
        class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-neutral-300 border border-white/10"
      >
        {{ categoryLabel }}
      </span>
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
            v-if="canEdit"
            class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            @click="startEdit"
          >
            Upravit
          </button>
          <button
            v-if="canEdit"
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
