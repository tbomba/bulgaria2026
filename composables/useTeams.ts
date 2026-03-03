export const useTeams = () => {
  const supabase = useSupabaseClient()
  const teams = useState<Array<{ id: string; name: string; color: string }>>('teams', () => [])

  const fetchTeams = async () => {
    const { data } = await supabase
      .from('teams')
      .select('id, name, color')
      .order('name')
    teams.value = data || []
  }

  return { teams, fetchTeams }
}
