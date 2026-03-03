// Helper: @nuxtjs/supabase stores JWT claims in useSupabaseUser(),
// which has `sub` instead of `id`. This helper gets the user ID reliably.
export const useUserId = () => {
  const user = useSupabaseUser()
  return computed(() => (user.value as any)?.id ?? (user.value as any)?.sub ?? null)
}

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const userId = useUserId()

  const profile = useState<{ id: string; name: string; avatar_url: string | null; is_admin?: boolean } | null>('profile', () => null)
  const isAdmin = computed(() => profile.value?.is_admin === true)
  const userTeam = useState<{ id: string; name: string; color: string; members: Array<{ user_id: string; name: string }> } | null>('userTeam', () => null)

  const fetchProfile = async () => {
    if (!userId.value) {
      profile.value = null
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId.value)
      .single()
    profile.value = data
    await fetchUserTeam()
  }

  const fetchUserTeam = async () => {
    if (!userId.value) {
      userTeam.value = null
      return
    }
    const { data: membership } = await supabase
      .from('team_members')
      .select('team_id, teams(id, name, color)')
      .eq('user_id', userId.value)
      .limit(1)
      .single()

    if (!membership?.teams) {
      userTeam.value = null
      return
    }

    const team = membership.teams as unknown as { id: string; name: string; color: string }
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id, profiles(name)')
      .eq('team_id', team.id)

    userTeam.value = {
      ...team,
      members: (members || []).map((m: any) => ({
        user_id: m.user_id,
        name: (m.profiles as any)?.name || 'Unknown',
      })),
    }
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
    userTeam.value = null
    navigateTo('/login')
  }

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    if (!userId.value) return
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId.value)
    if (error) throw error
    await fetchProfile()
  }

  return {
    user,
    userId,
    isAdmin,
    profile,
    userTeam,
    fetchProfile,
    fetchUserTeam,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}
