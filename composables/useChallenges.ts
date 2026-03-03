export const useChallenges = () => {
  const supabase = useSupabaseClient()
  const userId = useUserId()

  const challenges = ref<any[]>([])
  const leaderboard = ref<Array<{ user_id: string; name: string; points: number }>>([])
  const loading = ref(false)

  const fetchChallenges = async () => {
    loading.value = true
    const { data } = await supabase
      .from('challenges')
      .select('*, profiles!challenges_created_by_fkey(name), challenge_completions(user_id, proof_url, profiles!challenge_completions_user_id_fkey(name)), winner_team:teams!winner_team_id(id, name, color)')
      .order('created_at', { ascending: false })

    challenges.value = (data || []).map((c: any) => ({
      ...c,
      completions: c.challenge_completions || [],
      user_completed: c.challenge_completions?.some((comp: any) => comp.user_id === userId.value) || false,
      winner_team: c.winner_team || null,
    }))

    // Build leaderboard
    const pointsMap = new Map<string, { name: string; points: number }>()
    for (const challenge of challenges.value) {
      for (const comp of challenge.completions) {
        const existing = pointsMap.get(comp.user_id) || { name: comp.profiles?.name || 'Unknown', points: 0 }
        existing.points += challenge.points
        pointsMap.set(comp.user_id, existing)
      }
    }
    leaderboard.value = Array.from(pointsMap.entries())
      .map(([user_id, data]) => ({ user_id, ...data }))
      .sort((a, b) => b.points - a.points)

    loading.value = false
  }

  const addChallenge = async (challenge: { title: string; description: string; points: number; type: 'solo' | 'team' }) => {
    if (!userId.value) return
    const { error } = await supabase.from('challenges').insert({
      ...challenge,
      created_by: userId.value,
    })
    if (error) throw error
    await fetchChallenges()
  }

  const completeChallenge = async (challengeId: string) => {
    if (!userId.value) return
    const challenge = challenges.value.find((c: any) => c.id === challengeId)
    if (challenge?.type === 'team') {
      const { error } = await supabase.rpc('complete_challenge_for_team', { p_challenge_id: challengeId })
      if (error) throw error
    } else {
      const { error } = await supabase.from('challenge_completions').insert({
        challenge_id: challengeId,
        user_id: userId.value,
      })
      if (error) throw error
    }
    await fetchChallenges()
  }

  const uncompleteChallenge = async (challengeId: string) => {
    if (!userId.value) return
    const challenge = challenges.value.find((c: any) => c.id === challengeId)
    if (challenge?.type === 'team') {
      const { error } = await supabase.rpc('uncomplete_challenge_for_team', { p_challenge_id: challengeId })
      if (error) throw error
    } else {
      const { error } = await supabase.from('challenge_completions')
        .delete()
        .eq('challenge_id', challengeId)
        .eq('user_id', userId.value)
      if (error) throw error
    }
    await fetchChallenges()
  }

  const updateChallenge = async (id: string, updates: { title?: string; description?: string; points?: number; type?: 'solo' | 'team' }) => {
    const { error } = await supabase.from('challenges').update(updates).eq('id', id)
    if (error) throw error
    await fetchChallenges()
  }

  const deleteChallenge = async (id: string) => {
    await supabase.from('challenges').delete().eq('id', id)
    await fetchChallenges()
  }

  const setWinner = async (challengeId: string, teamId: string | null) => {
    const { error } = await supabase
      .from('challenges')
      .update({ winner_team_id: teamId })
      .eq('id', challengeId)
    if (error) throw error
    await fetchChallenges()
  }

  return { challenges, leaderboard, loading, fetchChallenges, addChallenge, completeChallenge, uncompleteChallenge, updateChallenge, deleteChallenge, setWinner }
}
