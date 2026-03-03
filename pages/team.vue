<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { userTeam } = useAuth();
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">👥 Můj tým</h1>
    <p class="page-subtitle">Tvůj tým a jeho členové</p>

    <div v-if="userTeam" class="max-w-xl">
      <div class="card-dark p-6">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="w-4 h-4 rounded-full shrink-0"
            :style="{ backgroundColor: userTeam.color }"
          ></span>
          <h2 class="font-heading font-bold text-2xl text-white">
            {{ userTeam.name }}
          </h2>
        </div>

        <h3 class="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Členové
        </h3>
        <div class="space-y-2">
          <div
            v-for="member in userTeam.members"
            :key="member.user_id"
            class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
          >
            <span class="text-lg">👤</span>
            <span class="text-neutral-200 font-medium">{{ member.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <span class="text-5xl">🤷</span>
      <p class="text-neutral-500 mt-3">Nejsi v žádném týmu.</p>
    </div>
  </div>
</template>
