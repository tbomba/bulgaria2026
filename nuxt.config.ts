// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "@nuxtjs/google-fonts"],

  supabase: {
    redirect: false,
  },

  googleFonts: {
    families: {
      Nunito: [400, 600, 700, 800],
      Inter: [400, 500, 600],
    },
  },

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },

  app: {
    head: {
      title: "Bulharsko 2026 Road Trip",
      meta: [
        {
          name: "description",
          content: "Epic road trip to Bulgaria with the crew!",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY || "",
      tripStartDate: "2026-07-25",
      tripEndDate: "2026-08-07",
    },
  },
});
