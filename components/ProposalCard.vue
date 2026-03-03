<script setup lang="ts">
const props = defineProps<{
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
  update: [id: string, updates: { title: string; description: string }]
}>()

const userId = useUserId()
const { isAdmin } = useAuth()

const canEdit = computed(() => userId.value === props.proposal.proposed_by || isAdmin.value)
const editing = ref(false)
const editForm = reactive({ title: '', description: '' })

const startEdit = () => {
  Object.assign(editForm, {
    title: props.proposal.title,
    description: props.proposal.description,
  })
  editing.value = true
}
</script>

<template>
  <div class="card-fun p-5">
    <div class="flex items-start gap-4">
      <!-- Vote controls -->
      <div class="flex flex-col items-center gap-1 shrink-0">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          :class="proposal.user_vote === 1
            ? 'bg-white/15 text-white shadow-sm shadow-white/10 backdrop-blur-sm border border-white/20'
            : 'bg-white/[0.04] backdrop-blur-sm text-neutral-500 border border-white/[0.08] hover:bg-white/[0.08] hover:text-neutral-300'"
          :disabled="loading"
          @click="$emit('upvote', proposal.id)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span class="font-heading font-bold text-lg" :class="{
          'text-white': proposal.vote_total > 0,
          'text-neutral-500': proposal.vote_total < 0,
          'text-neutral-600': proposal.vote_total === 0,
        }">
          {{ proposal.vote_total }}
        </span>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          :class="proposal.user_vote === -1
            ? 'bg-white/15 text-neutral-300 shadow-sm shadow-white/10 backdrop-blur-sm border border-white/20'
            : 'bg-white/[0.04] backdrop-blur-sm text-neutral-500 border border-white/[0.08] hover:bg-white/[0.08] hover:text-neutral-300'"
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
        <!-- Edit mode -->
        <div v-if="editing" class="space-y-2">
          <input v-model="editForm.title" type="text" placeholder="Název návrhu" class="input-glass text-sm" />
          <textarea v-model="editForm.description" placeholder="Popis..." rows="2" class="input-glass text-sm resize-none" />
          <div class="flex gap-2">
            <button class="btn-primary text-xs !py-1.5 !px-4" @click="$emit('update', proposal.id, { ...editForm }); editing = false">
              Uložit
            </button>
            <button class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors" @click="editing = false">
              Zrušit
            </button>
          </div>
        </div>

        <!-- Display mode -->
        <template v-else>
          <h3 class="font-heading font-bold text-lg text-white">{{ proposal.title }}</h3>
          <p class="text-neutral-400 text-sm mt-1">{{ proposal.description }}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs text-neutral-600">
              od {{ proposal.profiles?.name || 'Neznámý' }}
            </span>
            <div class="flex items-center gap-2">
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
                @click="$emit('delete', proposal.id)"
              >
                Smazat
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
