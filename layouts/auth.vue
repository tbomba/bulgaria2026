<template>
  <div class="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
    <!-- Dark gradient background -->
    <div class="dark-bg"></div>

    <!-- Blobs for auth -->
    <div class="blob w-[500px] h-[500px] bg-purple-500/[0.08] top-[-10%] right-[-5%] animate-blob"></div>
    <div class="blob w-[400px] h-[400px] bg-blue-500/[0.06] bottom-[-5%] left-[-5%] animate-blob-reverse"></div>

    <!-- Grain -->
    <div class="grain-overlay !opacity-[0.03]"></div>

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
