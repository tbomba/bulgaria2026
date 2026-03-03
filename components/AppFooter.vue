<template>
  <footer class="section-dark py-8 sm:py-12 mt-8 sm:mt-12">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <!-- Trip info -->
        <div>
          <h3 class="font-heading font-bold text-lg text-white mb-3">
            🇧🇬 Bulgaria 2026
          </h3>
          <p class="text-neutral-500 text-sm leading-relaxed">
            Prague to Primorsko -- the ultimate road trip across Central and Eastern Europe.
          </p>
        </div>

        <!-- Route highlights -->
        <div>
          <h4 class="font-heading font-semibold text-neutral-300 mb-3">Route Highlights</h4>
          <ul class="space-y-1.5 text-sm text-neutral-500">
            <li>🏰 Prague -- Start</li>
            <li>🎡 Vienna -- Quick stop</li>
            <li>🛁 Budapest -- Ruin bars</li>
            <li>🏔️ Transylvania -- Wild roads</li>
            <li>🌊 Primorsko -- Final destination</li>
          </ul>
        </div>

        <!-- Quick links -->
        <div>
          <h4 class="font-heading font-semibold text-neutral-300 mb-3">Quick Links</h4>
          <ul class="space-y-1.5 text-sm">
            <li><NuxtLink to="/roadmap" class="text-neutral-500 hover:text-neutral-300 transition-colors">🗺️ Roadmap</NuxtLink></li>
            <li><NuxtLink to="/places" class="text-neutral-500 hover:text-neutral-300 transition-colors">📍 Places</NuxtLink></li>
            <li><NuxtLink to="/challenges" class="text-neutral-500 hover:text-neutral-300 transition-colors">🏆 Challenges</NuxtLink></li>
            <li><NuxtLink to="/photos" class="text-neutral-500 hover:text-neutral-300 transition-colors">📸 Photos</NuxtLink></li>
            <li><NuxtLink to="/proposals" class="text-neutral-500 hover:text-neutral-300 transition-colors">💡 Proposals</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-neutral-600 text-sm">
          Made with ❤️ for the Bulgaria 2026 crew
        </p>
        <p class="text-neutral-700 text-xs">
          10 days, 5 countries, 1 epic road trip 🚗💨
        </p>
      </div>
    </div>
  </footer>
</template>
