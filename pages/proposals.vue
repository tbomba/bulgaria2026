<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { proposals, loading, fetchProposals, addProposal, vote, updateProposal, deleteProposal } = useProposals()

const showForm = ref(false)
const form = reactive({ title: '', description: '' })
const submitting = ref(false)

onMounted(() => fetchProposals())

const handleSubmit = async () => {
  if (!form.title.trim()) return
  submitting.value = true
  try {
    await addProposal({ ...form })
    Object.assign(form, { title: '', description: '' })
    showForm.value = false
  } catch (e: any) {
    alert(e.message)
  } finally {
    submitting.value = false
  }
}

const handleDelete = (id: string) => {
  if (!window.confirm('Opravdu smazat tento návrh?')) return
  deleteProposal(id)
}
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between mb-2">
      <h1 class="page-title">💡 Návrhy</h1>
      <button class="btn-primary text-sm" @click="showForm = !showForm">
        {{ showForm ? 'Zrušit' : '+ Nový návrh' }}
      </button>
    </div>
    <p class="page-subtitle">Navrhuj aktivity, restaurace, zážitky a hlasuj!</p>

    <!-- Add form -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <form v-if="showForm" class="card p-5 mb-8 space-y-3" @submit.prevent="handleSubmit">
        <input
          v-model="form.title"
          type="text"
          placeholder="Jaký máš návrh?"
          required
          class="input-glass"
        />
        <textarea
          v-model="form.description"
          placeholder="Řekni nám o tom víc..."
          rows="3"
          class="input-glass resize-none"
        />
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? 'Přidávám...' : 'Odeslat návrh' }}
        </button>
      </form>
    </Transition>

    <div v-if="loading && !proposals.length" class="text-center py-20 text-neutral-500">
      Načítám návrhy...
    </div>

    <div v-else-if="!proposals.length" class="text-center py-20">
      <span class="text-5xl">🤔</span>
      <p class="text-neutral-500 mt-3">Zatím žádné návrhy. Navrhni něco zábavného!</p>
    </div>

    <div v-else class="max-w-2xl mx-auto space-y-4">
      <ProposalCard
        v-for="proposal in proposals"
        :key="proposal.id"
        :proposal="proposal"
        :loading="loading"
        @upvote="vote($event, 1)"
        @downvote="vote($event, -1)"
        @update="(id, updates) => updateProposal(id, updates)"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
