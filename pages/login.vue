<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'auth',
})

const { signIn, signUp } = useAuth()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await signIn(email.value, password.value)
    } else {
      await signUp(email.value, password.value, name.value)
      error.value = 'Check your email to confirm your account!'
      loading.value = false
      return
    }
    navigateTo('/')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-5xl font-heading font-extrabold text-white mb-2 animate-float">
        🇧🇬 Bulgaria 2026
      </h1>
      <p class="text-white/80 text-lg">The ultimate road trip adventure!</p>
    </div>

    <div class="bg-white rounded-3xl shadow-2xl p-8">
      <h2 class="font-heading font-bold text-2xl text-gray-800 text-center mb-6">
        {{ mode === 'login' ? 'Welcome Back!' : 'Join the Crew!' }}
      </h2>

      <form class="space-y-4" @submit.prevent="submit">
        <div v-if="mode === 'signup'">
          <label class="block text-sm font-medium text-gray-600 mb-1">Your Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="What should we call you?"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
          />
        </div>

        <p v-if="error" class="text-sm text-center" :class="error.includes('Check') ? 'text-green-600' : 'text-red-500'">
          {{ error }}
        </p>

        <button
          type="submit"
          class="btn-primary w-full !py-3 text-lg"
          :disabled="loading"
        >
          {{ loading ? '...' : mode === 'login' ? 'Let\'s Go!' : 'Sign Up' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        <button
          class="text-pink-500 font-semibold hover:underline"
          @click="mode = mode === 'login' ? 'signup' : 'login'; error = ''"
        >
          {{ mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in' }}
        </button>
      </p>
    </div>
  </div>
</template>
