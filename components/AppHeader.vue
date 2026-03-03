<script setup lang="ts">
const { profile, isAdmin, signOut } = useAuth()
const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { path: '/', label: 'Domů', icon: '🏠' },
  { path: '/roadmap', label: 'Trasa', icon: '🗺️' },
  { path: '/places', label: 'Místa', icon: '📍' },
  { path: '/challenges', label: 'Výzvy', icon: '🏆' },
  { path: '/photos', label: 'Fotky', icon: '📸' },
  { path: '/proposals', label: 'Návrhy', icon: '💡' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <header class="bg-white/[0.03] backdrop-blur-xl shadow-glass sticky top-0 z-50 border-b border-white/[0.06]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-12 sm:h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <span class="text-2xl">🇧🇬</span>
          <span class="font-heading font-extrabold text-xl text-white hidden sm:inline tracking-tight">
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
              ? 'bg-white/10 text-white shadow-lg shadow-white/5 border border-white/15'
              : 'text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200'"
          >
            <span class="mr-1">{{ link.icon }}</span>
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            :class="isActive('/admin')
              ? 'bg-white/10 text-white shadow-lg shadow-white/5 border border-white/15'
              : 'text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200'"
          >
            <svg class="w-4 h-4 inline -mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin
          </NuxtLink>
        </nav>

        <!-- User menu -->
        <div class="flex items-center gap-2 sm:gap-3">
          <span v-if="profile" class="text-sm text-neutral-400 hidden lg:inline">
            Ahoj, <strong class="text-neutral-200">{{ profile.name }}</strong>!
          </span>
          <button
            v-if="profile"
            class="text-sm text-neutral-500 hover:text-neutral-300 transition-colors hidden sm:inline"
            @click="signOut"
          >
            Odhlásit
          </button>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-lg hover:bg-white/[0.05] text-neutral-400"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <nav v-if="mobileMenuOpen" class="md:hidden bg-black/60 backdrop-blur-xl border-t border-white/[0.06] px-4 pb-4 pt-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(link.path)
            ? 'bg-white/10 text-white'
            : 'text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200'"
          @click="mobileMenuOpen = false"
        >
          <span class="mr-2">{{ link.icon }}</span>
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          v-if="isAdmin"
          to="/admin"
          class="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive('/admin')
            ? 'bg-white/10 text-white'
            : 'text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200'"
          @click="mobileMenuOpen = false"
        >
          <svg class="w-4 h-4 inline -mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Admin
        </NuxtLink>
        <button
          v-if="profile"
          class="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:bg-white/[0.05] mt-2 border-t border-white/[0.06] pt-4"
          @click="signOut(); mobileMenuOpen = false"
        >
          👋 Odhlásit
        </button>
      </nav>
    </Transition>
  </header>
</template>
