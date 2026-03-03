export const useProposals = () => {
  const supabase = useSupabaseClient()
  const userId = useUserId()

  const proposals = ref<any[]>([])
  const loading = ref(false)

  const fetchProposals = async () => {
    loading.value = true
    const { data } = await supabase
      .from('proposals')
      .select('*, profiles!proposals_proposed_by_fkey(name), proposal_votes(user_id, vote)')
      .order('created_at', { ascending: false })

    proposals.value = (data || []).map((p: any) => {
      const votes = p.proposal_votes || []
      const userVote = votes.find((v: any) => v.user_id === userId.value)
      return {
        ...p,
        vote_total: votes.reduce((sum: number, v: any) => sum + v.vote, 0),
        user_vote: userVote?.vote || 0,
      }
    }).sort((a: any, b: any) => b.vote_total - a.vote_total)

    loading.value = false
  }

  const addProposal = async (proposal: { title: string; description: string }) => {
    if (!userId.value) return
    const { error } = await supabase.from('proposals').insert({
      ...proposal,
      proposed_by: userId.value,
    })
    if (error) throw error
    await fetchProposals()
  }

  const vote = async (proposalId: string, voteValue: 1 | -1) => {
    if (!userId.value) return

    const proposal = proposals.value.find(p => p.id === proposalId)
    if (proposal?.user_vote === voteValue) {
      // Remove vote
      await supabase.from('proposal_votes').delete().match({
        proposal_id: proposalId,
        user_id: userId.value,
      })
    } else {
      // Upsert vote
      await supabase.from('proposal_votes').upsert({
        proposal_id: proposalId,
        user_id: userId.value,
        vote: voteValue,
      })
    }
    await fetchProposals()
  }

  const updateProposal = async (id: string, updates: { title?: string; description?: string }) => {
    const { error } = await supabase.from('proposals').update(updates).eq('id', id)
    if (error) throw error
    await fetchProposals()
  }

  const deleteProposal = async (id: string) => {
    await supabase.from('proposals').delete().eq('id', id)
    await fetchProposals()
  }

  return { proposals, loading, fetchProposals, addProposal, vote, updateProposal, deleteProposal }
}
