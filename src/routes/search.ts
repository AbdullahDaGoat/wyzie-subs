import { eventHandler, getQuery } from 'h3'
import { search } from '../utils/functions'
import { createErrorResponse } from '../utils/utils'
import { verifyApiKey, createSecretKey, getEnvironmentVariable } from '../utils/auth'
import { RequestType } from '../utils/types'


export default eventHandler(async (event) => {
  const query = getQuery(event)
  const imdbId = query.imdbId as string
  const season = query.season ? parseInt(query.season as string) : undefined
  const episode = query.episode ? parseInt(query.episode as string) : undefined
  const language = query.language as string | undefined

  // Input validation
  try {
    verifyApiKey(event, query.token as string);
  } catch (error) {
    if (error instanceof Error && error.message === 'API key missing or invalid') {
      return createErrorResponse(
        401,
        '[Authentication Error] - Unauthorized',
        'API key missing or invalid. Please provide a valid API key in the \'API-Token\' header.',
      );
    }
  }

  if (!imdbId) {
    return createErrorResponse(
      400,
      'Missing required parameter',
      'Please provide an IMDB ID.',
      '/search?imdbId=tt0111161'
    )
  }

  if (!/^tt\d{7,8}$/.test(imdbId)) {
    return createErrorResponse(
      400,
      'Invalid IMDB ID format',
      'IMDB ID must start with "tt" followed by 7 or 8 digits.',
      '/search?imdbId=tt0111161'
    )
  }

  if (season !== undefined) {
    if (isNaN(season) || season < 1) {
      return createErrorResponse(
        400,
        'Invalid season number',
        'Season must be a positive integer.',
        '/search?imdbId=tt0111161&season=1'
      )
    }
  }

  if (episode !== undefined) {
    if (isNaN(episode) || episode < 1) {
      return createErrorResponse(
        400,
        'Invalid episode number',
        'Episode must be a positive integer.',
        '/search?imdbId=tt0111161&season=1&episode=1'
      )
    }
  }

  if (episode !== undefined && season === undefined) {
    return createErrorResponse(
      400,
      'Missing season parameter',
      'When specifying an episode, season must also be provided.',
      '/search?imdbId=tt0111161&season=1&episode=1'
    )
  }

  if (language && !/^[a-z]{2,3}(-[A-Z]{2})?$/.test(language)) {
    return createErrorResponse(
      400,
      'Invalid language format',
      'Language must be in ISO 639-1 or ISO 639-2 format, optionally followed by a region code.',
      '/search?imdbId=tt0111161&language=en or /search?imdbId=tt0111161&language=en-US'
    )
  }

  const request: RequestType = { imdbId, season, episode }

  try {
    // Directly passing language, whether it's undefined or a string
    return await search(request, language)
  } catch (error) {
    console.error(error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return createErrorResponse(
          404,
          'Subtitles not found',
          'No subtitles were found for the given parameters. Please check your input and try again.'
        )
      }
      if (error.message.includes('rate limit')) {
        return createErrorResponse(
          429,
          'Rate limit exceeded',
          'You have exceeded the allowed number of requests. Please try again later.'
        )
      }
    }
    
    return createErrorResponse(
      500,
      'Internal server error',
      'An unexpected error occurred while processing your request. Our team has been notified.'
    )
  }
})