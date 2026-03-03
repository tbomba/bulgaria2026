<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { isAdmin } = useAuth();
const {
  stops,
  loading,
  fetchStops,
  addStop,
  updateStop,
  deleteStop,
  swapOrder,
} = useRoadmap();
const { places, fetchPlaces } = usePlaces();

const showAddForm = ref(false);
const addForm = reactive({ place_id: "", day: 1, notes: "", emoji: "📍" });
const submitting = ref(false);

const editingId = ref<string | null>(null);
const editForm = reactive({ day: 1, notes: "", emoji: "" });

onMounted(async () => {
  await fetchStops();
  if (isAdmin.value) await fetchPlaces();
});

const handleAdd = async () => {
  if (!addForm.place_id) return;
  submitting.value = true;
  try {
    const maxOrder = stops.value.length
      ? Math.max(...stops.value.map((s: any) => s.sort_order))
      : -1;
    await addStop({
      place_id: addForm.place_id,
      day: addForm.day,
      notes: addForm.notes,
      emoji: addForm.emoji,
      sort_order: maxOrder + 1,
    });
    Object.assign(addForm, { place_id: "", day: 1, notes: "", emoji: "📍" });
    showAddForm.value = false;
  } catch (e: any) {
    alert(e.message);
  } finally {
    submitting.value = false;
  }
};

const startEdit = (stop: any) => {
  editingId.value = stop.id;
  Object.assign(editForm, {
    day: stop.day,
    notes: stop.notes,
    emoji: stop.emoji,
  });
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = async (id: string) => {
  try {
    await updateStop(id, {
      day: editForm.day,
      notes: editForm.notes,
      emoji: editForm.emoji,
    });
    editingId.value = null;
  } catch (e: any) {
    alert(e.message);
  }
};

const moveUp = async (index: number) => {
  if (index <= 0) return;
  await swapOrder(stops.value[index], stops.value[index - 1]);
};

const moveDown = async (index: number) => {
  if (index >= stops.value.length - 1) return;
  await swapOrder(stops.value[index], stops.value[index + 1]);
};

const handleDelete = async (id: string) => {
  if (!confirm("Opravdu smazat tuto zastávku?")) return;
  await deleteStop(id);
};
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between mb-2">
      <h1 class="page-title">🗺️ Trasa</h1>
      <button
        v-if="isAdmin"
        class="btn-primary text-sm"
        @click="showAddForm = !showAddForm"
      >
        {{ showAddForm ? "Zrušit" : "+ Přidat zastávku" }}
      </button>
    </div>
    <p class="page-subtitle">Z Prahy do Primorska</p>

    <!-- Add stop form (admin) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <form
        v-if="showAddForm"
        class="card p-5 mb-8 space-y-3"
        @submit.prevent="handleAdd"
      >
        <select v-model="addForm.place_id" class="input-glass" required>
          <option value="" disabled>Vyber místo...</option>
          <option v-for="p in places" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model.number="addForm.day"
            type="number"
            min="1"
            placeholder="Den"
            class="input-glass"
            required
          />
          <input
            v-model="addForm.emoji"
            type="text"
            placeholder="Emoji"
            class="input-glass"
          />
        </div>
        <input
          v-model="addForm.notes"
          type="text"
          placeholder="Poznámky k zastávce"
          class="input-glass"
        />
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? "Přidávám..." : "Přidat zastávku" }}
        </button>
      </form>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Map -->
      <div class="lg:col-span-3">
        <GoogleMap />
      </div>

      <!-- Timeline -->
      <div class="lg:col-span-2">
        <!-- Loading -->
        <div
          v-if="loading && !stops.length"
          class="text-center py-20 text-neutral-500"
        >
          Načítám trasu...
        </div>

        <!-- Empty -->
        <div v-else-if="!stops.length" class="text-center py-20">
          <span class="text-5xl">🗺️</span>
          <p class="text-neutral-500 mt-3">Zatím žádné zastávky v trase.</p>
        </div>

        <!-- Stops -->
        <div v-else class="space-y-0">
          <div
            v-for="(stop, i) in stops"
            :key="stop.id"
            class="relative pl-7 sm:pl-10 pb-6"
            :class="{ 'timeline-line': i < stops.length - 1 }"
          >
            <!-- Dot -->
            <div
              class="absolute -left-1 sm:-left-3 top-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 shadow-lg shadow-white/5 flex items-center justify-center ring-2 sm:ring-4 ring-white/[0.05] border border-white/20"
            >
              <span class="text-[9px] text-neutral-300 font-bold">{{
                stop.day
              }}</span>
            </div>

            <!-- Editing mode -->
            <div v-if="editingId === stop.id" class="card p-4 ml-2 space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model.number="editForm.day"
                  type="number"
                  min="1"
                  placeholder="Den"
                  class="input-glass text-sm"
                />
                <input
                  v-model="editForm.emoji"
                  type="text"
                  placeholder="Emoji"
                  class="input-glass text-sm"
                />
              </div>
              <input
                v-model="editForm.notes"
                type="text"
                placeholder="Poznámky"
                class="input-glass text-sm"
              />
              <div class="flex gap-2">
                <button
                  class="btn-primary text-xs py-1.5 px-4"
                  @click="saveEdit(stop.id)"
                >
                  Uložit
                </button>
                <button
                  class="btn-secondary text-xs py-1.5 px-4"
                  @click="cancelEdit"
                >
                  Zrušit
                </button>
              </div>
            </div>

            <!-- Display mode -->
            <component
              :is="stop.places?.href ? 'a' : 'div'"
              v-else
              v-bind="stop.places?.href ? { href: stop.places.href, target: '_blank', rel: 'noopener noreferrer' } : {}"
              class="card-accent p-4 ml-2 group hover:shadow-glass-lg transition-all duration-300 relative block no-underline"
              :class="{ 'cursor-pointer': stop.places?.href }"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-neutral-300 border border-white/10"
                >
                  Den {{ stop.day }}
                </span>
                <span class="text-lg">{{ stop.emoji }}</span>
                <span class="font-heading font-bold text-white inline-flex items-center gap-1">
                  {{ stop.places?.name }}
                  <svg
                    v-if="stop.places?.href"
                    class="w-3 h-3 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
              </div>
              <p class="text-sm text-neutral-500">{{ stop.notes }}</p>

              <!-- Admin controls -->
              <div
                v-if="isAdmin"
                class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <button
                  v-if="i > 0"
                  class="w-6 h-6 rounded bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 flex items-center justify-center text-xs transition-all"
                  title="Posunout nahoru"
                  @click.prevent="moveUp(i)"
                >
                  ↑
                </button>
                <button
                  v-if="i < stops.length - 1"
                  class="w-6 h-6 rounded bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 flex items-center justify-center text-xs transition-all"
                  title="Posunout dolů"
                  @click.prevent="moveDown(i)"
                >
                  ↓
                </button>
                <button
                  class="w-6 h-6 rounded bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 flex items-center justify-center text-xs transition-all"
                  title="Upravit"
                  @click.prevent="startEdit(stop)"
                >
                  ✎
                </button>
                <button
                  class="w-6 h-6 rounded bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 flex items-center justify-center text-xs transition-all"
                  title="Smazat"
                  @click.prevent="handleDelete(stop.id)"
                >
                  ✕
                </button>
              </div>
            </component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
