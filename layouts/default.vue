<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Dark gradient background -->
    <div class="dark-bg"></div>

    <!-- Topographic pattern -->
    <div class="topo-pattern"></div>

    <!-- Animated blurry blobs -->
    <div class="blob w-[600px] h-[600px] bg-purple-500/[0.07] top-[-15%] left-[-10%] animate-blob"></div>
    <div class="blob w-[500px] h-[500px] bg-blue-500/[0.05] top-[30%] right-[-8%] animate-blob-reverse"></div>
    <div class="blob w-[450px] h-[450px] bg-indigo-500/[0.06] bottom-[5%] left-[15%] animate-blob-slow"></div>
    <div class="blob w-[350px] h-[350px] bg-violet-400/[0.04] top-[60%] left-[50%] animate-blob" style="animation-delay: 5s;"></div>

    <!-- Grain texture -->
    <div class="grain-overlay"></div>

    <!-- Content -->
    <div class="relative z-10">
      <AppHeader />
      <main class="pb-20">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>
