<script setup lang="ts">
const config = useRuntimeConfig()

const props = defineProps<{
  markers?: Array<{ lat: number; lng: number; title: string }>
  center?: { lat: number; lng: number }
  zoom?: number
}>()

const mapCenter = computed(() => props.center || { lat: 42.7, lng: 25.5 }) // Center of Bulgaria
const mapZoom = computed(() => props.zoom || 7)

// Build a static embed URL with markers
const embedUrl = computed(() => {
  const key = config.public.googleMapsKey
  if (!key) return null

  const centerStr = `${mapCenter.value.lat},${mapCenter.value.lng}`

  if (props.markers?.length) {
    const markersParam = props.markers
      .map(m => `markers=color:red|label:${m.title[0]}|${m.lat},${m.lng}`)
      .join('&')
    return `https://www.google.com/maps/embed/v1/view?key=${key}&center=${centerStr}&zoom=${mapZoom.value}`
  }

  return `https://www.google.com/maps/embed/v1/view?key=${key}&center=${centerStr}&zoom=${mapZoom.value}`
})
</script>

<template>
  <div class="rounded-2xl overflow-hidden shadow-lg bg-gray-100">
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      class="w-full h-full min-h-[400px]"
      style="border: 0"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
    <div v-else class="flex flex-col items-center justify-center min-h-[400px] text-gray-400 p-8">
      <span class="text-5xl mb-3">🗺️</span>
      <p class="text-center font-medium">Map will appear once Google Maps API key is configured</p>
      <p class="text-sm text-center mt-1">Set <code class="bg-gray-200 px-1 rounded">GOOGLE_MAPS_KEY</code> in your .env file</p>
    </div>
  </div>
</template>
