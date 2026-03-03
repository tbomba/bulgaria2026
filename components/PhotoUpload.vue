<script setup lang="ts">
const emit = defineEmits<{
  uploaded: []
}>()

const supabase = useSupabaseClient()
const user = useSupabaseUser()

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
  if (!selectedFile.value || !user.value) return

  uploading.value = true
  try {
    const file = selectedFile.value
    const ext = file.name.split('.').pop()
    const path = `${user.value.id}/${Date.now()}.${ext}`

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
      uploaded_by: user.value.id,
    })
    if (dbError) throw dbError

    caption.value = ''
    selectedFile.value = null
    preview.value = null
    if (fileInput.value) fileInput.value.value = ''
    emit('uploaded')
  } catch (err: any) {
    alert('Upload failed: ' + err.message)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="card p-5">
    <h3 class="font-heading font-bold text-lg mb-3">📸 Upload a Photo</h3>

    <div
      v-if="preview"
      class="mb-3 rounded-xl overflow-hidden aspect-video bg-gray-100"
    >
      <img :src="preview" alt="Preview" class="w-full h-full object-cover" />
    </div>

    <div class="space-y-3">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0 file:text-sm file:font-semibold
               file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100
               cursor-pointer"
        @change="onFileSelect"
      />

      <input
        v-model="caption"
        type="text"
        placeholder="Add a caption..."
        class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none text-sm"
      />

      <button
        class="btn-primary w-full"
        :disabled="!selectedFile || uploading"
        @click="upload"
      >
        {{ uploading ? 'Uploading...' : 'Upload Photo' }}
      </button>
    </div>
  </div>
</template>
