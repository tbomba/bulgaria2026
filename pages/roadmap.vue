<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const itinerary = [
  { day: 1, city: 'Praha', notes: 'Sbalit, vyrazit! Jedeme na jih přes Česko', emoji: '🏰' },
  { day: 2, city: 'Vídeň', notes: 'Rychlá zastávka -- Řízek, Dunaj, třeba Prater', emoji: '🎡' },
  { day: 3, city: 'Budapešť', notes: 'Ruin bary, termální lázně, guláš. Přejezd do Rumunska', emoji: '🛁' },
  { day: 4, city: 'Rumunsko', notes: 'Projížďka Transylvánií -- Karpaty, hrady, divoké cesty', emoji: '🏔️' },
  { day: 5, city: 'Bukurešť', notes: 'Rumunská metropole -- Palác parlamentu, noční život ve starém městě', emoji: '🏛️' },
  { day: 6, city: 'Veliko Tarnovo', notes: 'Vstup do Bulharska! Pevnost Carevec, středověká atmosféra', emoji: '🏰' },
  { day: 7, city: 'Plovdiv', notes: 'Staré město, Římský amfiteátr, čtvrť Kapana, skvělé jídlo', emoji: '🎭' },
  { day: 8, city: 'Sozopol', notes: 'Pobřeží Černého moře -- plážové město, čerstvé mořské plody, pohoda', emoji: '🏖️' },
  { day: 9, city: 'Primorsko', notes: 'Cílová destinace! Pláž, relax, oslava celé cesty', emoji: '🌊' },
  { day: 10, city: 'Primorsko', notes: 'Poslední den -- užít si to, sbalit, cesta domů', emoji: '🚗' },
]
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">🗺️ Trasa</h1>
    <p class="page-subtitle">Z Prahy do Primorska -- naše epická trasa přes Evropu</p>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Map -->
      <div class="lg:col-span-3">
        <GoogleMap />
      </div>

      <!-- Timeline -->
      <div class="lg:col-span-2">
        <div class="space-y-0">
          <div
            v-for="(stop, i) in itinerary"
            :key="stop.day"
            class="relative pl-10 pb-6"
            :class="{ 'timeline-line': i < itinerary.length - 1 }"
          >
            <!-- Dot -->
            <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white/10 shadow-lg shadow-white/5 flex items-center justify-center ring-4 ring-white/[0.05] border border-white/20">
              <span class="text-[9px] text-neutral-300 font-bold">{{ stop.day }}</span>
            </div>

            <div class="card-accent p-4 ml-2 group hover:shadow-glass-lg transition-all duration-300">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-neutral-300 border border-white/10">
                  Den {{ stop.day }}
                </span>
                <span class="text-lg">{{ stop.emoji }}</span>
                <h3 class="font-heading font-bold text-white">{{ stop.city }}</h3>
              </div>
              <p class="text-sm text-neutral-500">{{ stop.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
