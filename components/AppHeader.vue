<script setup lang="ts">
const { profile, signOut } = useAuth()
const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { path: '/places', label: 'Places', icon: '📍' },
  { path: '/challenges', label: 'Challenges', icon: '🏆' },
  { path: '/photos', label: 'Photos', icon: '📸' },
  { path: '/proposals', label: 'Proposals', icon: '💡' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <span class="text-2xl">🇧🇬</span>
          <span class="font-heading font-extrabold text-xl gradient-text hidden sm:inline">
            Bulgaria 2026
          </span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            :class="isActive(link.path)
              ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            <span class="mr-1">{{ link.icon }}</span>
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- User menu -->
        <div class="flex items-center gap-3">
          <span v-if="profile" class="text-sm text-gray-600 hidden lg:inline">
            Hey, <strong>{{ profile.name }}</strong>!
          </span>
          <button
            v-if="profile"
            class="text-sm text-gray-500 hover:text-red-500 transition-colors"
            @click="signOut"
          >
            Logout
          </button>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile nav -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="mobileMenuOpen" class="md:hidden bg-white border-t px-4 pb-4 pt-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(link.path)
            ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white'
            : 'text-gray-600 hover:bg-gray-100'"
          @click="mobileMenuOpen = false"
        >
          <span class="mr-2">{{ link.icon }}</span>
          {{ link.label }}
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>
