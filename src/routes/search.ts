import { eventHandler, getQuery } from 'h3'
import { search } from '../utils/functions' // Note: Only importing the combined search function
import { RequestType } from '../utils/types'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const imdbId = query.imdbId as string
  const season = query.season ? parseInt(query.season as string) : undefined
  const episode = query.episode ? parseInt(query.episode as string) : undefined
  const language = query.language as string | undefined

  if (!imdbId) {
    return { error: 'IMDB ID is required' }
  }

  const request: RequestType = { imdbId, season, episode }

  try {
    // Directly passing language, whether it's undefined or a string
    return await search(request, language)
  } catch (error) {
    console.error(error)
    return { error: 'An error occurred while fetching subtitles' }
  }
})