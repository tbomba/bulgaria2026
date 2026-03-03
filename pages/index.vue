<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const { profile, isAdmin, fetchProfile } = useAuth()
const supabase = useSupabaseClient()

const stats = ref({ photos: 0, challenges: 0, proposals: 0, places: 0 })

onMounted(async () => {
  await fetchProfile()

  const [photos, challenges, proposals, places] = await Promise.all([
    supabase.from('photos').select('id', { count: 'exact', head: true }),
    supabase.from('challenge_completions').select('challenge_id', { count: 'exact', head: true }),
    supabase.from('proposals').select('id', { count: 'exact', head: true }),
    supabase.from('places').select('id', { count: 'exact', head: true }),
  ])

  stats.value = {
    photos: photos.count || 0,
    challenges: challenges.count || 0,
    proposals: proposals.count || 0,
    places: places.count || 0,
  }
})

const tripStart = config.public.tripStartDate
const tripEnd = config.public.tripEndDate

const formatDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
})

const baseSections = [
  { path: '/roadmap', icon: '🗺️', title: 'Trasa', desc: 'Z Prahy do Primorska -- celá trasa', glow: '59, 130, 246' },
  { path: '/places', icon: '📍', title: 'Místa', desc: 'Kde chceme zastavit?', glow: '239, 68, 68' },
  { path: '/challenges', icon: '🏆', title: 'Výzvy', desc: 'Odvážíš se splnit všechny?', glow: '245, 158, 11' },
  { path: '/photos', icon: '📸', title: 'Fotky', desc: 'Vzpomínky z cesty', glow: '168, 85, 247' },
  { path: '/proposals', icon: '💡', title: 'Návrhy', desc: 'Hlasuj o aktivitách a nápadech', glow: '34, 197, 94' },
]

const sections = computed(() => {
  if (!isAdmin.value) return baseSections
  return [
    ...baseSections,
    { path: '/admin', icon: '🛡️', title: 'Admin', desc: 'Správa uživatelů a týmů', glow: '220, 220, 220' },
  ]
})

const statItems = computed(() => [
  { label: 'Fotky', value: stats.value.photos, icon: '📸' },
  { label: 'Místa', value: stats.value.places, icon: '📍' },
  { label: 'Výzvy', value: stats.value.challenges, icon: '🏆' },
  { label: 'Návrhy', value: stats.value.proposals, icon: '💡' },
])
</script>

<template>
  <div class="page-container">
    <!-- Hero -->
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-3xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-white mb-3 sm:mb-4 animate-float tracking-tight">
        🇧🇬 Bulgaria 2026
      </h1>
      <p class="text-neutral-400 text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 max-w-lg mx-auto">
        Z Prahy do Primorska -- ultimátní road trip!
      </p>
      <p class="text-xs sm:text-sm text-neutral-600">
        {{ formatDate(tripStart) }} — {{ formatDate(tripEnd) }}
      </p>
    </div>

    <!-- Countdown -->
    <div class="card p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 max-w-2xl mx-auto">
      <h2 class="text-center font-heading font-bold text-sm sm:text-lg text-neutral-400 mb-3 sm:mb-5 uppercase tracking-wider">
        Odpočet do odjezdu
      </h2>
      <CountdownTimer />
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div
        v-for="stat in statItems"
        :key="stat.label"
        class="card-accent text-center p-2.5 sm:p-4 flex flex-col items-center justify-center"
      >
        <span class="text-lg sm:text-2xl lg:text-3xl">{{ stat.icon }}</span>
        <p class="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold text-white mt-0.5 sm:mt-1">{{ stat.value }}</p>
        <p class="text-[9px] sm:text-[11px] lg:text-xs text-neutral-500 font-medium uppercase tracking-wider">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Navigation Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <NuxtLink
        v-for="(section, i) in sections"
        :key="section.path"
        :to="section.path"
        class="tile-glow group p-4 sm:p-5 lg:p-6 flex flex-col justify-between relative overflow-hidden
               bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08]
               transition-all duration-500 hover:-translate-y-1.5 min-h-[120px] sm:min-h-[150px]"
        :class="[
          i === 0 ? 'col-span-2 sm:col-span-2 lg:col-span-3' : '',
          i === 1 ? 'col-span-1 sm:col-span-1 lg:col-span-3' : '',
          i === 2 ? 'col-span-1 sm:col-span-1 lg:col-span-2' : '',
          i === 3 ? 'col-span-1 sm:col-span-1 lg:col-span-2' : '',
          i === 4 ? 'col-span-1 sm:col-span-2 lg:col-span-2' : '',
          i === 5 ? 'col-span-2 sm:col-span-3 lg:col-span-6' : '',
        ]"
        :style="`--glow: ${section.glow}`"
      >
        <!-- Colored glow blob -->
        <div
          class="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl"
          :style="`background: rgba(${section.glow}, 0.15)`"
        ></div>

        <div>
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl
                   bg-white/[0.06] border border-white/[0.1] shadow-lg shadow-black/20 mb-2 sm:mb-3
                   group-hover:border-[rgba(var(--glow),0.3)] transition-colors duration-500"
          >
            <span class="group-hover:animate-wiggle">{{ section.icon }}</span>
          </div>
          <h3 class="font-heading font-bold text-base sm:text-lg lg:text-xl text-white">{{ section.title }}</h3>
        </div>
        <p class="text-neutral-500 text-xs sm:text-sm mt-1 line-clamp-2">{{ section.desc }}</p>

        <!-- Arrow indicator -->
        <div class="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-60 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :style="`color: rgba(${section.glow}, 0.8)`">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
