<script setup lang="ts">
const props = defineProps<{
  challenge: {
    id: string
    title: string
    description: string
    points: number
    type: 'solo' | 'team'
    created_by: string
    profiles?: { name: string } | null
    completions: Array<{ user_id: string; proof_url: string | null; profiles?: { name: string } | null }>
    user_completed: boolean
    winner_team?: { id: string; name: string; color: string } | null
  }
  loading?: boolean
  teams?: Array<{ id: string; name: string; color: string }>
  userTeamColor?: string | null
}>()

defineEmits<{
  complete: [id: string]
  uncomplete: [id: string]
  delete: [id: string]
  'set-winner': [challengeId: string, teamId: string | null]
}>()

const userId = useUserId()
const { isAdmin } = useAuth()

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

const teamCompleted = computed(() =>
  props.challenge.type === 'team' && props.challenge.user_completed && !!props.userTeamColor
)

const glowColor = computed(() => {
  if (props.challenge.winner_team) return hexToRgb(props.challenge.winner_team.color)
  if (teamCompleted.value) return hexToRgb(props.userTeamColor!)
  return null
})
</script>

<template>
  <div
    class="card-fun p-5 relative overflow-hidden"
    :class="{ 'winner-glow': glowColor }"
    :style="glowColor ? `--glow: ${glowColor}` : undefined"
  >
    <!-- Left accent bar — solo: thin white, team: thick in team color -->
    <div
      v-if="challenge.type === 'team' && userTeamColor"
      class="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
      :style="`background: linear-gradient(to bottom, ${userTeamColor}99, ${userTeamColor}33)`"
    ></div>
    <div
      v-else
      class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 to-white/5 rounded-l-2xl"
    ></div>

    <div class="flex items-start justify-between pl-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-heading font-bold text-lg text-white">{{ challenge.title }}</h3>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-neutral-300 border border-white/10">
            {{ challenge.points }} b.
          </span>
          <span class="text-xs text-neutral-500">
            {{ challenge.type === 'team' ? '👥 Tým' : '👤 Solo' }}
          </span>
        </div>
        <p class="text-neutral-400 text-sm">{{ challenge.description }}</p>
      </div>
      <span v-if="challenge.user_completed" class="text-2xl shrink-0 ml-2 animate-bounce-slow">✅</span>
    </div>

    <!-- Winner badge -->
    <div v-if="challenge.winner_team" class="flex items-center gap-2 mt-2 pl-3">
      <span
        class="w-3 h-3 rounded-full shrink-0"
        :style="{ backgroundColor: challenge.winner_team.color }"
      ></span>
      <span class="text-xs font-semibold text-neutral-300">
        Vítěz: {{ challenge.winner_team.name }}
      </span>
    </div>

    <div class="mt-3 flex flex-wrap gap-1.5 pl-3">
      <span
        v-for="comp in challenge.completions"
        :key="comp.user_id"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/[0.06] text-neutral-300 rounded-full text-xs font-medium
               backdrop-blur-sm border border-white/[0.08]"
      >
        🏅 {{ comp.profiles?.name || 'Někdo' }}
      </span>
    </div>

    <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06] pl-3">
      <div class="flex items-center gap-3">
        <span class="text-xs text-neutral-600">od {{ challenge.profiles?.name || 'Neznámý' }}</span>
        <!-- Admin winner dropdown -->
        <select
          v-if="isAdmin && teams?.length"
          class="text-xs bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1 text-neutral-300 outline-none cursor-pointer"
          :value="challenge.winner_team?.id || ''"
          @change="$emit('set-winner', challenge.id, ($event.target as HTMLSelectElement).value || null)"
        >
          <option value="">Bez vítěze</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="userId === challenge.created_by || isAdmin"
          class="text-xs text-red-400/60 hover:text-red-400 transition-colors"
          @click="$emit('delete', challenge.id)"
        >
          Smazat
        </button>
        <button
          v-if="challenge.user_completed"
          class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors border border-white/10 rounded-full py-1.5 px-4"
          :disabled="loading"
          @click="$emit('uncomplete', challenge.id)"
        >
          Zrušit ✅
        </button>
        <button
          v-else
          class="btn-primary text-xs !py-1.5 !px-4"
          :disabled="loading"
          @click="$emit('complete', challenge.id)"
        >
          Splněno!
        </button>
      </div>
    </div>
  </div>
</template>
