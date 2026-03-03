<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'admin'] })

const { users, teams, loading, fetchAll, createTeam, deleteTeam, addMember, removeMember } = useAdmin()

const newTeamName = ref('')
const newTeamColor = ref('#6366f1')
const submitting = ref(false)

onMounted(() => fetchAll())

const handleCreateTeam = async () => {
  if (!newTeamName.value.trim()) return
  submitting.value = true
  try {
    await createTeam(newTeamName.value.trim(), newTeamColor.value)
    newTeamName.value = ''
    newTeamColor.value = '#6366f1'
  } finally {
    submitting.value = false
  }
}

const handleDeleteTeam = async (id: string) => {
  await deleteTeam(id)
}

const handleAssign = async (userId: string, teamId: string) => {
  if (!teamId) return
  await addMember(teamId, userId)
}

const handleRemoveMember = async (teamId: string, userId: string) => {
  await removeMember(teamId, userId)
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const availableTeamsFor = (user: { teams: { id: string }[] }) =>
  teams.value.filter((t) => !user.teams.some((ut) => ut.id === t.id))
</script>

<template>
  <div class="page-container">
    <h1 class="page-title font-heading">Admin Panel</h1>
    <p class="page-subtitle">Manage users and teams</p>

    <div v-if="loading" class="text-center py-20 text-neutral-500">Loading...</div>

    <div v-else class="grid lg:grid-cols-5 gap-4 sm:gap-6">
      <!-- People section (wider) -->
      <div class="lg:col-span-3 space-y-4">
        <h2 class="font-heading font-bold text-lg sm:text-xl text-white flex items-center gap-2">
          <span class="text-xl">👥</span> People
          <span class="text-sm font-normal text-neutral-500">({{ users.length }})</span>
        </h2>

        <div class="space-y-2">
          <div
            v-for="user in users"
            :key="user.id"
            class="card-dark p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <!-- User info -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-white truncate">{{ user.name }}</p>
              <p class="text-xs text-neutral-500">Joined {{ formatDate(user.created_at) }}</p>
            </div>

            <!-- Team badges -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="team in user.teams"
                :key="team.id"
                class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
                       bg-white/[0.06] border border-white/[0.1] cursor-default group/badge"
              >
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :style="{ backgroundColor: team.color }"
                ></span>
                {{ team.name }}
                <button
                  class="ml-0.5 text-neutral-600 hover:text-red-400 transition-colors opacity-0 group-hover/badge:opacity-100"
                  title="Remove from team"
                  @click="handleRemoveMember(team.id, user.id)"
                >
                  &times;
                </button>
              </span>
            </div>

            <!-- Assign dropdown -->
            <select
              v-if="availableTeamsFor(user).length"
              class="input-glass text-sm !py-1.5 !px-3 !w-auto !rounded-lg min-w-[130px] shrink-0"
              @change="(e) => { handleAssign(user.id, (e.target as HTMLSelectElement).value); (e.target as HTMLSelectElement).value = '' }"
            >
              <option value="" disabled selected>+ Add team</option>
              <option v-for="t in availableTeamsFor(user)" :key="t.id" :value="t.id">
                {{ t.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Teams section -->
      <div class="lg:col-span-2 space-y-4">
        <h2 class="font-heading font-bold text-lg sm:text-xl text-white flex items-center gap-2">
          <span class="text-xl">🏷️</span> Teams
          <span class="text-sm font-normal text-neutral-500">({{ teams.length }})</span>
        </h2>

        <!-- Create team form -->
        <form class="card p-4 space-y-3" @submit.prevent="handleCreateTeam">
          <p class="text-sm font-semibold text-neutral-300">Create Team</p>
          <div class="flex gap-2">
            <input
              v-model="newTeamName"
              type="text"
              placeholder="Team name"
              class="input-glass text-sm flex-1"
              required
            />
            <label class="relative shrink-0">
              <input
                v-model="newTeamColor"
                type="color"
                class="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/[0.1]"
              />
            </label>
          </div>
          <button
            type="submit"
            class="btn-primary w-full text-sm"
            :disabled="submitting || !newTeamName.trim()"
          >
            {{ submitting ? 'Creating...' : 'Create Team' }}
          </button>
        </form>

        <!-- Team list -->
        <div class="space-y-2">
          <div
            v-for="team in teams"
            :key="team.id"
            class="card-dark p-3 sm:p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 rounded-full shrink-0"
                  :style="{ backgroundColor: team.color }"
                ></span>
                <span class="font-semibold text-white">{{ team.name }}</span>
              </div>
              <button
                class="text-neutral-600 hover:text-red-400 transition-colors text-sm"
                title="Delete team"
                @click="handleDeleteTeam(team.id)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="member in team.members"
                :key="member.user_id"
                class="text-xs text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded-full"
              >
                {{ member.name }}
              </span>
              <span v-if="!team.members.length" class="text-xs text-neutral-600 italic">
                No members yet
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
