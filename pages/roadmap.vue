<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

// Example itinerary — you can make this dynamic from Supabase later
const itinerary = [
  { day: 1, city: 'Sofia', notes: 'Arrive, explore the capital, Vitosha Boulevard', lat: 42.6977, lng: 23.3219 },
  { day: 2, city: 'Plovdiv', notes: 'Old Town, Roman Theatre, Kapana district', lat: 42.1354, lng: 24.7453 },
  { day: 3, city: 'Veliko Tarnovo', notes: 'Tsarevets Fortress, medieval vibes', lat: 43.0757, lng: 25.6172 },
  { day: 4, city: 'Varna', notes: 'Beach day! Sea Garden, nightlife', lat: 43.2141, lng: 27.9147 },
  { day: 5, city: 'Nessebar', notes: 'UNESCO old town, coastal beauty', lat: 42.6592, lng: 27.7356 },
  { day: 6, city: 'Sozopol', notes: 'Chill beach town, seafood', lat: 42.4175, lng: 27.6953 },
  { day: 7, city: 'Bansko', notes: 'Mountain town, hot springs, hiking', lat: 41.8381, lng: 23.4879 },
  { day: 8, city: 'Rila Monastery', notes: 'Stunning UNESCO monastery, then back to Sofia', lat: 42.1337, lng: 23.3406 },
]

const markers = itinerary.map(stop => ({
  lat: stop.lat,
  lng: stop.lng,
  title: stop.city,
}))
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">🗺️ Roadmap</h1>
    <p class="page-subtitle">Our epic route through Bulgaria</p>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Map -->
      <div class="lg:col-span-3">
        <GoogleMap :markers="markers" :zoom="7" />
      </div>

      <!-- Timeline -->
      <div class="lg:col-span-2">
        <div class="space-y-0">
          <div
            v-for="(stop, i) in itinerary"
            :key="stop.day"
            class="relative pl-8 pb-6"
            :class="{ 'border-l-2 border-pink-200': i < itinerary.length - 1 }"
          >
            <!-- Dot -->
            <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full gradient-bg shadow-md flex items-center justify-center">
              <span class="text-[8px] text-white font-bold">{{ stop.day }}</span>
            </div>

            <div class="card p-4 ml-2">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold gradient-bg text-white">
                  Day {{ stop.day }}
                </span>
                <h3 class="font-heading font-bold text-gray-800">{{ stop.city }}</h3>
              </div>
              <p class="text-sm text-gray-500">{{ stop.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
