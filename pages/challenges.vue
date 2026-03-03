<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const {
  challenges,
  leaderboard,
  loading,
  fetchChallenges,
  addChallenge,
  completeChallenge,
  deleteChallenge,
  setWinner,
} = useChallenges();

const { isAdmin } = useAuth();
const { teams, fetchTeams } = useTeams();

const showForm = ref(false);
const form = reactive({ title: "", description: "", points: 10 });
const submitting = ref(false);

onMounted(async () => {
  await fetchChallenges();
  if (isAdmin.value) await fetchTeams();
});

const handleSubmit = async () => {
  if (!form.title.trim()) return;
  submitting.value = true;
  try {
    await addChallenge({ ...form });
    Object.assign(form, { title: "", description: "", points: 10 });
    showForm.value = false;
  } catch (e: any) {
    alert(e.message);
  } finally {
    submitting.value = false;
  }
};

const handleComplete = async (id: string) => {
  await completeChallenge(id);
};

const medals = ["🥇", "🥈", "🥉"];
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between mb-2">
      <h1 class="page-title">🏆 Výzvy</h1>
      <button class="btn-primary text-sm" @click="showForm = !showForm">
        {{ showForm ? "Zrušit" : "+ Nová výzva" }}
      </button>
    </div>
    <p class="page-subtitle">Nejhorší tým hraje mokrej piškot</p>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Challenges list -->
      <div class="lg:col-span-2 space-y-4">
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
            class="card p-5 space-y-3"
            @submit.prevent="handleSubmit"
          >
            <input
              v-model="form.title"
              type="text"
              placeholder="Název výzvy"
              required
              class="input-glass"
            />
            <textarea
              v-model="form.description"
              placeholder="Popis výzvy..."
              rows="2"
              class="input-glass resize-none"
            />
            <div class="flex items-center gap-3">
              <label class="text-sm text-neutral-400 font-medium">Body:</label>
              <input
                v-model.number="form.points"
                type="number"
                min="1"
                max="100"
                class="input-glass !w-24"
              />
            </div>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? "Přidávám..." : "Přidat výzvu" }}
            </button>
          </form>
        </Transition>

        <div
          v-if="loading && !challenges.length"
          class="text-center py-20 text-neutral-500"
        >
          Načítám výzvy...
        </div>

        <div v-else-if="!challenges.length" class="text-center py-20">
          <span class="text-5xl">🎯</span>
          <p class="text-neutral-500 mt-3">Zatím žádné výzvy. Vytvoř první!</p>
        </div>

        <ChallengeCard
          v-for="challenge in challenges"
          v-else
          :key="challenge.id"
          :challenge="challenge"
          :loading="loading"
          :teams="teams"
          @complete="handleComplete"
          @delete="deleteChallenge"
          @set-winner="(cId, tId) => setWinner(cId, tId)"
        />
      </div>

      <!-- Leaderboard -->
      <div>
        <div class="card-dark p-5 sticky top-20">
          <h2 class="font-heading font-bold text-xl text-white mb-4">
            🏅 Žebříček
          </h2>

          <div
            v-if="!leaderboard.length"
            class="text-center py-8 text-neutral-500 text-sm"
          >
            Splň výzvy a objevíš se zde!
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(entry, i) in leaderboard"
              :key="entry.user_id"
              class="flex items-center gap-3 p-3 rounded-xl"
              :class="
                i === 0
                  ? 'bg-white/[0.06]'
                  : i === 1
                    ? 'bg-white/[0.04]'
                    : i === 2
                      ? 'bg-white/[0.03]'
                      : 'bg-white/[0.02]'
              "
            >
              <span class="text-xl w-8 text-center">{{
                medals[i] || `#${i + 1}`
              }}</span>
              <span class="font-medium text-neutral-200 flex-1">{{
                entry.name
              }}</span>
              <span class="font-heading font-bold text-white"
                >{{ entry.points }} b.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
