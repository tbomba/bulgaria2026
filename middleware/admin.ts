export default defineNuxtRouteMiddleware(async () => {
  const { profile, fetchProfile } = useAuth()

  if (!profile.value) {
    await fetchProfile()
  }

  if (!profile.value?.is_admin) {
    return navigateTo('/')
  }
})
