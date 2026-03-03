<script setup lang="ts">
const emit = defineEmits<{
  uploaded: []
}>()

const supabase = useSupabaseClient()
const userId = useUserId()

const caption = ref('')
const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const preview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const onFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedFile.value = file
  preview.value = URL.createObjectURL(file)
}

const upload = async () => {
  if (!selectedFile.value || !userId.value) return

  uploading.value = true
  try {
    const file = selectedFile.value
    const ext = file.name.split('.').pop()
    const path = `${userId.value}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(path, file)
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(path)

    const { error: dbError } = await supabase.from('photos').insert({
      url: publicUrl,
      caption: caption.value,
      uploaded_by: userId.value,
    })
    if (dbError) throw dbError

    caption.value = ''
    selectedFile.value = null
    preview.value = null
    if (fileInput.value) fileInput.value.value = ''
    emit('uploaded')
  } catch (err: any) {
    alert('Nahrávání selhalo: ' + err.message)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="card p-5">
    <h3 class="font-heading font-bold text-lg mb-4 text-white">📸 Nahrát fotku</h3>

    <div
      v-if="preview"
      class="mb-3 rounded-xl overflow-hidden aspect-video bg-white/[0.03]"
    >
      <img :src="preview" alt="Náhled" class="w-full h-full object-cover" />
    </div>

    <div class="space-y-3">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0 file:text-sm file:font-semibold
               file:bg-white/10 file:text-neutral-300 hover:file:bg-white/15
               file:backdrop-blur-sm cursor-pointer"
        @change="onFileSelect"
      />

      <input
        v-model="caption"
        type="text"
        placeholder="Přidej popisek..."
        class="input-glass"
      />

      <button
        class="btn-primary w-full"
        :disabled="!selectedFile || uploading"
        @click="upload"
      >
        {{ uploading ? 'Nahrávám...' : 'Nahrát fotku' }}
      </button>
    </div>
  </div>
</template>
