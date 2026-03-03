<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const { profile, fetchProfile } = useAuth()
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
  month: 'long', day: 'numeric', year: 'numeric',
})

const sections = [
  { path: '/roadmap', icon: '🗺️', title: 'Roadmap', desc: 'Our epic route through Bulgaria', color: 'from-blue-400 to-blue-600' },
  { path: '/places', icon: '📍', title: 'Places', desc: 'Where do we wanna go?', color: 'from-green-400 to-green-600' },
  { path: '/challenges', icon: '🏆', title: 'Challenges', desc: 'Dare to complete them all!', color: 'from-yellow-400 to-orange-500' },
  { path: '/photos', icon: '📸', title: 'Photos', desc: 'Memories from the trip', color: 'from-pink-400 to-pink-600' },
  { path: '/proposals', icon: '💡', title: 'Proposals', desc: 'Vote on activities & ideas', color: 'from-purple-400 to-purple-600' },
]

const statItems = computed(() => [
  { label: 'Photos', value: stats.value.photos, icon: '📸' },
  { label: 'Places', value: stats.value.places, icon: '📍' },
  { label: 'Challenges Done', value: stats.value.challenges, icon: '🏆' },
  { label: 'Proposals', value: stats.value.proposals, icon: '💡' },
])
</script>

<template>
  <div class="page-container">
    <!-- Hero -->
    <div class="text-center mb-10">
      <h1 class="text-4xl sm:text-6xl font-heading font-extrabold gradient-text mb-3 animate-float">
        🇧🇬 Bulgaria 2026
      </h1>
      <p class="text-gray-500 text-lg sm:text-xl mb-2">
        The ultimate road trip adventure!
      </p>
      <p class="text-sm text-gray-400">
        {{ formatDate(tripStart) }} — {{ formatDate(tripEnd) }}
      </p>
    </div>

    <!-- Countdown -->
    <div class="mb-12">
      <h2 class="text-center font-heading font-bold text-xl text-gray-600 mb-4">Countdown to Departure</h2>
      <CountdownTimer />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
      <div
        v-for="stat in statItems"
        :key="stat.label"
        class="card text-center p-4"
      >
        <span class="text-2xl">{{ stat.icon }}</span>
        <p class="text-2xl font-heading font-extrabold text-gray-800 mt-1">{{ stat.value }}</p>
        <p class="text-xs text-gray-400">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Navigation Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <NuxtLink
        v-for="section in sections"
        :key="section.path"
        :to="section.path"
        class="card-fun group p-6"
      >
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-lg mb-3"
          :class="section.color"
        >
          <span class="group-hover:animate-wiggle">{{ section.icon }}</span>
        </div>
        <h3 class="font-heading font-bold text-xl text-gray-800">{{ section.title }}</h3>
        <p class="text-gray-500 text-sm mt-1">{{ section.desc }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
