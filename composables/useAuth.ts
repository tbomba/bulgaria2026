export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = useState<{ id: string; name: string; avatar_url: string | null } | null>('profile', () => null)

  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    profile.value = data
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await fetchProfile()
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    profile.value = null
    navigateTo('/login')
  }

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    if (!user.value) return
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
    if (error) throw error
    await fetchProfile()
  }

  return {
    user,
    profile,
    fetchProfile,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}
