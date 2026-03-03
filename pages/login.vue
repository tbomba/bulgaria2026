<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "auth",
});

const { signIn, signUp } = useAuth();

const mode = ref<"login" | "signup">("login");
const email = ref("");
const password = ref("");
const name = ref("");
const error = ref("");
const loading = ref(false);

const submit = async () => {
  error.value = "";
  loading.value = true;
  try {
    if (mode.value === "login") {
      await signIn(email.value, password.value);
    } else {
      await signUp(email.value, password.value, name.value);
      await signIn(email.value, password.value);
    }
    await navigateTo("/", { replace: true, external: true });
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md px-2">
    <div class="text-center mb-6 sm:mb-8">
      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-2 animate-float tracking-tight"
      >
        🇧🇬 Bulharsko 2026
      </h1>
      <p class="text-neutral-400 text-sm sm:text-lg">Z Prahy do Primorska</p>
    </div>

    <div
      class="bg-white/[0.05] backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-glass-lg border border-white/[0.1] p-5 sm:p-8"
    >
      <h2 class="font-heading font-bold text-2xl text-white text-center mb-6">
        {{ mode === "login" ? "Vítej zpět!" : "Přidej se k partě!" }}
      </h2>

      <form class="space-y-4" @submit.prevent="submit">
        <div v-if="mode === 'signup'">
          <label class="block text-sm font-medium text-neutral-400 mb-1"
            >Tvoje jméno</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="Jak ti máme říkat?"
            required
            class="input-glass !py-3"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-400 mb-1"
            >E-mail</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="tvuj@email.cz"
            required
            class="input-glass !py-3"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-400 mb-1"
            >Heslo</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="input-glass !py-3"
          />
        </div>

        <p
          v-if="error"
          class="text-sm text-center"
          :class="error.includes('Check') ? 'text-green-400' : 'text-red-400'"
        >
          {{ error }}
        </p>

        <button
          type="submit"
          class="btn-primary w-full !py-3 text-lg"
          :disabled="loading"
        >
          {{ loading ? "..." : mode === "login" ? "Jedeme!" : "Registrovat" }}
        </button>
      </form>

      <p class="text-center text-sm text-neutral-500 mt-4">
        <button
          class="text-neutral-300 font-semibold hover:underline"
          @click="
            mode = mode === 'login' ? 'signup' : 'login';
            error = '';
          "
        >
          {{
            mode === "login"
              ? "Nemáš účet? Zaregistruj se"
              : "Už máš účet? Přihlaš se"
          }}
        </button>
      </p>
    </div>
  </div>
</template>
