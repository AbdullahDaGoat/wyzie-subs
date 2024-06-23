import { eventHandler, getQuery } from 'h3'
import { search, searchByLanguage } from '../functions'
import { RequestType } from '../types'

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
    if (language) {
      return await searchByLanguage(request, language)
    } else {
      return await search(request)
    }
  } catch (error) {
    console.error(error)
    return { error: 'An error occurred while fetching subtitles' }
  }
})