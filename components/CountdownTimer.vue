<script setup lang="ts">
const config = useRuntimeConfig()
const targetDate = new Date(config.public.tripStartDate + 'T00:00:00')

const now = ref(new Date())

let interval: ReturnType<typeof setInterval>
onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})
onUnmounted(() => clearInterval(interval))

const timeLeft = computed(() => {
  const diff = targetDate.getTime() - now.value.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
})

const isTrip = computed(() => {
  const start = targetDate.getTime()
  const end = new Date(config.public.tripEndDate + 'T23:59:59').getTime()
  const current = now.value.getTime()
  return current >= start && current <= end
})
</script>

<template>
  <div class="text-center">
    <div v-if="isTrip" class="text-2xl font-heading font-extrabold text-fun-green animate-bounce-slow">
      🎉 THE TRIP IS HAPPENING NOW! 🎉
    </div>
    <div v-else-if="timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0" class="text-xl font-heading font-bold text-gray-400">
      Trip has ended! What a ride 🚗💨
    </div>
    <div v-else class="flex justify-center gap-3 sm:gap-6">
      <div v-for="(value, key) in timeLeft" :key="key" class="flex flex-col items-center">
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
          <span class="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            {{ String(value).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium capitalize">{{ key }}</span>
      </div>
    </div>
  </div>
</template>
