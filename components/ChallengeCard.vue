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
    href?: string | null
    user_completed: boolean
    winner_teams: Array<{ id: string; name: string; color: string }>
  }
  loading?: boolean
  teams?: Array<{ id: string; name: string; color: string }>
  userTeamId?: string | null
  userTeamColor?: string | null
}>()

defineEmits<{
  complete: [id: string]
  uncomplete: [id: string]
  delete: [id: string]
  'toggle-winner': [challengeId: string, teamId: string]
  update: [id: string, updates: { title: string; description: string; points: number; type: 'solo' | 'team'; href: string }]
}>()

const userId = useUserId()
const { isAdmin } = useAuth()

const canEdit = computed(() => userId.value === props.challenge.created_by || isAdmin.value)
const editing = ref(false)
const editForm = reactive({ title: '', description: '', points: 10, type: 'solo' as 'solo' | 'team', href: '' })

const startEdit = () => {
  Object.assign(editForm, {
    title: props.challenge.title,
    description: props.challenge.description,
    points: props.challenge.points,
    type: props.challenge.type,
    href: props.challenge.href || '',
  })
  editing.value = true
}

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

// --- Team challenge helpers ---
const isTeam = computed(() => props.challenge.type === 'team')
const anyTeamWon = computed(() => props.challenge.winner_teams.length > 0)
const myTeamWon = computed(() =>
  isTeam.value && !!props.userTeamId && props.challenge.winner_teams.some(t => t.id === props.userTeamId),
)

// Show ✅ — solo: user completed; team: user's team won
const showCheck = computed(() => {
  if (isTeam.value) return myTeamWon.value
  return props.challenge.user_completed
})

// Can click "Splněno!" — solo: not yet completed; team: no winner yet & user is in a team
const canComplete = computed(() => {
  if (isTeam.value) return !anyTeamWon.value && !!props.userTeamId
  return !props.challenge.user_completed
})

// Can click "Zrušit" — solo: user completed; team: user's team won OR admin
const canUncomplete = computed(() => {
  if (isTeam.value) return myTeamWon.value || (isAdmin.value && anyTeamWon.value)
  return props.challenge.user_completed
})

// --- Glow style (winner team colors) ---
const glowStyle = computed(() => {
  const colors = props.challenge.winner_teams.map(t => t.color)
  if (!colors.length) return null

  if (colors.length === 1) {
    const rgb = hexToRgb(colors[0])
    return {
      borderColor: `rgba(${rgb}, 0.2)`,
      boxShadow: `0 0 25px rgba(${rgb}, 0.1), 0 0 50px rgba(${rgb}, 0.05)`,
      background: `rgba(${rgb}, 0.03)`,
    }
  }

  const stops = colors.map((c, i) => {
    const pct1 = (i / colors.length) * 100
    const pct2 = ((i + 1) / colors.length) * 100
    return `${c}18 ${pct1}%, ${c}18 ${pct2}%`
  }).join(', ')
  const rgb = hexToRgb(colors[0])
  return {
    borderColor: `rgba(${rgb}, 0.2)`,
    boxShadow: colors.map(c => `0 0 25px ${c}1a`).join(', '),
    background: `linear-gradient(135deg, ${stops})`,
  }
})

const glowHoverStyle = computed(() => {
  const colors = props.challenge.winner_teams.map(t => t.color)
  if (!colors.length) return null

  if (colors.length === 1) {
    const rgb = hexToRgb(colors[0])
    return {
      borderColor: `rgba(${rgb}, 0.35)`,
      boxShadow: `0 0 35px rgba(${rgb}, 0.15), 0 0 70px rgba(${rgb}, 0.08)`,
      background: `rgba(${rgb}, 0.06)`,
    }
  }

  const stops = colors.map((c, i) => {
    const pct1 = (i / colors.length) * 100
    const pct2 = ((i + 1) / colors.length) * 100
    return `${c}28 ${pct1}%, ${c}28 ${pct2}%`
  }).join(', ')
  const rgb = hexToRgb(colors[0])
  return {
    borderColor: `rgba(${rgb}, 0.35)`,
    boxShadow: colors.map(c => `0 0 35px ${c}26`).join(', '),
    background: `linear-gradient(135deg, ${stops})`,
  }
})

const isHovered = ref(false)
</script>

<template>
  <div
    class="card-fun p-5 relative overflow-hidden"
    :style="isHovered && glowHoverStyle ? glowHoverStyle : glowStyle || undefined"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
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

    <!-- Edit mode -->
    <div v-if="editing" class="pl-3 space-y-2">
      <input v-model="editForm.title" type="text" placeholder="Název výzvy" class="input-glass text-sm" />
      <textarea v-model="editForm.description" placeholder="Popis výzvy..." rows="2" class="input-glass text-sm resize-none" />
      <input v-model="editForm.href" type="url" placeholder="Odkaz (volitelné)" class="input-glass text-sm" />
      <div class="flex items-center gap-3">
        <label class="text-xs text-neutral-400 font-medium">Body:</label>
        <input v-model.number="editForm.points" type="number" min="1" max="100" class="input-glass text-sm !w-20" />
        <div class="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            class="px-2.5 py-1 rounded-full text-xs font-medium transition-all border"
            :class="editForm.type === 'solo' ? 'bg-white/15 text-white border-white/20' : 'bg-white/[0.04] text-neutral-500 border-white/[0.08]'"
            @click="editForm.type = 'solo'"
          >
            👤 Solo
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-full text-xs font-medium transition-all border"
            :class="editForm.type === 'team' ? 'bg-white/15 text-white border-white/20' : 'bg-white/[0.04] text-neutral-500 border-white/[0.08]'"
            @click="editForm.type = 'team'"
          >
            👥 Tým
          </button>
        </div>
      </div>
      <div class="flex gap-2 pt-1">
        <button class="btn-primary text-xs !py-1.5 !px-4" @click="$emit('update', challenge.id, { ...editForm }); editing = false">
          Uložit
        </button>
        <button class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors" @click="editing = false">
          Zrušit
        </button>
      </div>
    </div>

    <!-- Display mode -->
    <template v-else>
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
          <a
            v-if="challenge.href"
            :href="challenge.href"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 text-xs text-blue-400/80 hover:text-blue-400 transition-colors mt-1"
            @click.stop
          >
            🔗 {{ challenge.href.replace(/^https?:\/\//, '').slice(0, 40) }}{{ challenge.href.replace(/^https?:\/\//, '').length > 40 ? '...' : '' }}
          </a>
        </div>
        <span v-if="showCheck" class="text-2xl shrink-0 ml-2 animate-bounce-slow">✅</span>
      </div>

      <!-- Winner badges (team challenges) -->
      <div v-if="challenge.winner_teams.length" class="flex flex-wrap items-center gap-2 mt-2 pl-3">
        <span class="text-xs font-semibold text-neutral-400">Vítěz:</span>
        <span
          v-for="wt in challenge.winner_teams"
          :key="wt.id"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300"
        >
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: wt.color }"></span>
          {{ wt.name }}
        </span>
      </div>

      <!-- Completion badges -->
      <div class="mt-3 flex flex-wrap gap-1.5 pl-3">
        <span
          v-for="comp in challenge.completions"
          :key="comp.user_id"
          class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/[0.06] text-neutral-300 rounded-full text-xs font-medium backdrop-blur-sm border border-white/[0.08]"
        >
          🏅 {{ comp.profiles?.name || 'Někdo' }}
        </span>
      </div>

      <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06] pl-3">
        <div class="flex items-center gap-3">
          <span class="text-xs text-neutral-600">od {{ challenge.profiles?.name || 'Neznámý' }}</span>
          <!-- Admin winner toggles (team challenges only) -->
          <div v-if="isAdmin && isTeam && teams?.length" class="flex items-center gap-1">
            <button
              v-for="team in teams"
              :key="team.id"
              type="button"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all border cursor-pointer"
              :class="challenge.winner_teams.some(wt => wt.id === team.id)
                ? 'bg-white/15 text-white border-white/20'
                : 'bg-white/[0.04] text-neutral-500 border-white/[0.08] hover:bg-white/[0.08]'"
              @click="$emit('toggle-winner', challenge.id, team.id)"
            >
              <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: team.color }"></span>
              {{ team.name }}
            </button>
          </div>
        </div>
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
            @click="$emit('delete', challenge.id)"
          >
            Smazat
          </button>
          <!-- Uncomplete -->
          <button
            v-if="canUncomplete"
            class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors border border-white/10 rounded-full py-1.5 px-4"
            :disabled="loading"
            @click="$emit('uncomplete', challenge.id)"
          >
            Zrušit ✅
          </button>
          <!-- Complete -->
          <button
            v-else-if="canComplete"
            class="btn-primary text-xs !py-1.5 !px-4"
            :disabled="loading"
            @click="$emit('complete', challenge.id)"
          >
            Splněno!
          </button>
          <!-- Team challenge already won by another team -->
          <span v-else-if="isTeam && anyTeamWon && !myTeamWon" class="text-xs text-neutral-600 italic">
            Splněno
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
