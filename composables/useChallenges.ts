export const useChallenges = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const challenges = ref<any[]>([])
  const leaderboard = ref<Array<{ user_id: string; name: string; points: number }>>([])
  const loading = ref(false)

  const fetchChallenges = async () => {
    loading.value = true
    const { data } = await supabase
      .from('challenges')
      .select('*, profiles(name), challenge_completions(user_id, proof_url, profiles(name))')
      .order('created_at', { ascending: false })

    challenges.value = (data || []).map((c: any) => ({
      ...c,
      completions: c.challenge_completions || [],
      user_completed: c.challenge_completions?.some((comp: any) => comp.user_id === user.value?.id) || false,
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

  const addChallenge = async (challenge: { title: string; description: string; points: number }) => {
    if (!user.value) return
    const { error } = await supabase.from('challenges').insert({
      ...challenge,
      created_by: user.value.id,
    })
    if (error) throw error
    await fetchChallenges()
  }

  const completeChallenge = async (challengeId: string, proofUrl?: string) => {
    if (!user.value) return
    const { error } = await supabase.from('challenge_completions').insert({
      challenge_id: challengeId,
      user_id: user.value.id,
      proof_url: proofUrl || null,
    })
    if (error) throw error
    await fetchChallenges()
  }

  const deleteChallenge = async (id: string) => {
    await supabase.from('challenges').delete().eq('id', id)
    await fetchChallenges()
  }

  return { challenges, leaderboard, loading, fetchChallenges, addChallenge, completeChallenge, deleteChallenge }
}
