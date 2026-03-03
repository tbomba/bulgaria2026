export const useAdmin = () => {
  const supabase = useSupabaseClient()

  interface Team {
    id: string
    name: string
    color: string
    created_at: string
    members: { user_id: string; name: string }[]
  }

  interface UserWithTeams {
    id: string
    name: string
    avatar_url: string | null
    created_at: string
    teams: { id: string; name: string; color: string }[]
  }

  const users = ref<UserWithTeams[]>([])
  const teams = ref<Team[]>([])
  const loading = ref(false)

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, created_at')
      .order('created_at', { ascending: true })

    const { data: memberships } = await supabase
      .from('team_members')
      .select('team_id, user_id, teams(id, name, color)')

    const memberMap = new Map<string, { id: string; name: string; color: string }[]>()
    for (const m of memberships || []) {
      const team = m.teams as unknown as { id: string; name: string; color: string }
      if (!team) continue
      const arr = memberMap.get(m.user_id) || []
      arr.push(team)
      memberMap.set(m.user_id, arr)
    }

    users.value = (profiles || []).map((p) => ({
      ...p,
      teams: memberMap.get(p.id) || [],
    }))
  }

  const fetchTeams = async () => {
    const { data: teamRows } = await supabase
      .from('teams')
      .select('id, name, color, created_at')
      .order('created_at', { ascending: true })

    const { data: memberships } = await supabase
      .from('team_members')
      .select('team_id, user_id, profiles(name)')

    const memberMap = new Map<string, { user_id: string; name: string }[]>()
    for (const m of memberships || []) {
      const profile = m.profiles as unknown as { name: string }
      const arr = memberMap.get(m.team_id) || []
      arr.push({ user_id: m.user_id, name: profile?.name || 'Unknown' })
      memberMap.set(m.team_id, arr)
    }

    teams.value = (teamRows || []).map((t) => ({
      ...t,
      members: memberMap.get(t.id) || [],
    }))
  }

  const fetchAll = async () => {
    loading.value = true
    await Promise.all([fetchUsers(), fetchTeams()])
    loading.value = false
  }

  const createTeam = async (name: string, color: string) => {
    const { error } = await supabase.from('teams').insert({ name, color })
    if (error) throw error
    await fetchAll()
  }

  const deleteTeam = async (id: string) => {
    const { error } = await supabase.from('teams').delete().eq('id', id)
    if (error) throw error
    await fetchAll()
  }

  const addMember = async (teamId: string, userId: string) => {
    const { error } = await supabase
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId })
    if (error) throw error
    await fetchAll()
  }

  const removeMember = async (teamId: string, userId: string) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId)
    if (error) throw error
    await fetchAll()
  }

  return {
    users,
    teams,
    loading,
    fetchAll,
    createTeam,
    deleteTeam,
    addMember,
    removeMember,
  }
}
