<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { places, loading, fetchPlaces, addPlace, toggleVote, updatePlace, deletePlace } =
  usePlaces();

const showForm = ref(false);
const form = reactive({ name: "", description: "", image_url: "", href: "", category: "main" });
const submitting = ref(false);
const activeFilter = ref("all");

const categories = [
  { value: "all", label: "Všechno" },
  { value: "main", label: "Hlavní místečka" },
  { value: "side", label: "Side questy" },
  { value: "sleep", label: "Spaní" },
];

const filteredPlaces = computed(() => {
  if (activeFilter.value === "all") return places.value;
  return places.value.filter((p) => p.category === activeFilter.value);
});

onMounted(() => fetchPlaces());

const handleSubmit = async () => {
  if (!form.name.trim()) return;
  submitting.value = true;
  try {
    await addPlace({
      name: form.name,
      description: form.description,
      image_url: form.image_url || undefined,
      href: form.href || undefined,
      category: form.category,
    });
    Object.assign(form, { name: "", description: "", image_url: "", href: "", category: "main" });
    showForm.value = false;
  } catch (e: any) {
    alert(e.message);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between mb-2">
      <h1 class="page-title">📍 Místa k návštěvě</h1>
      <button class="btn-primary text-sm" @click="showForm = !showForm">
        {{ showForm ? "Zrušit" : "+ Přidat místo" }}
      </button>
    </div>
    <p class="page-subtitle">Hlasuj pro místa, která chceš navštívit</p>

    <!-- Add form -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <form
        v-if="showForm"
        class="card p-5 mb-8 space-y-3"
        @submit.prevent="handleSubmit"
      >
        <input
          v-model="form.name"
          type="text"
          placeholder="Název místa"
          required
          class="input-glass"
        />
        <textarea
          v-model="form.description"
          placeholder="Proč bychom tam měli zajet?"
          rows="2"
          class="input-glass resize-none"
        />
        <input
          v-model="form.image_url"
          type="url"
          placeholder="URL obrázku (nepovinné)"
          class="input-glass"
        />
        <input
          v-model="form.href"
          type="url"
          placeholder="Odkaz / URL (nepovinné)"
          class="input-glass"
        />
        <div class="flex items-center gap-2">
          <label class="text-sm text-neutral-400 font-medium">Kategorie:</label>
          <button
            v-for="cat in categories.slice(1)"
            :key="cat.value"
            type="button"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            :class="form.category === cat.value
              ? 'bg-white/15 text-white border-white/20'
              : 'bg-white/[0.04] text-neutral-500 border-white/[0.08] hover:bg-white/[0.08]'"
            @click="form.category = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? "Přidávám..." : "Přidat místo" }}
        </button>
      </form>
    </Transition>

    <!-- Category filter -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
        :class="activeFilter === cat.value
          ? 'bg-white/15 text-white border-white/20'
          : 'bg-white/[0.04] text-neutral-500 border-white/[0.08] hover:bg-white/[0.08] hover:text-neutral-300'"
        @click="activeFilter = cat.value"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !places.length"
      class="text-center py-20 text-neutral-500"
    >
      Načítám místa...
    </div>

    <!-- Empty -->
    <div v-else-if="!filteredPlaces.length" class="text-center py-20">
      <span class="text-5xl">🏖️</span>
      <p class="text-neutral-500 mt-3">Zatím žádná místa v této kategorii.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <PlaceCard
        v-for="place in filteredPlaces"
        :key="place.id"
        :place="place"
        @vote="toggleVote"
        @update="(id, updates) => updatePlace(id, updates)"
        @delete="(id) => { if (confirm('Opravdu smazat toto místo?')) deletePlace(id) }"
      />
    </div>
  </div>
</template>
