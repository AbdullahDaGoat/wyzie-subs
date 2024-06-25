import { fetchSubtitles, createErrorResponse } from './utils';

export async function search(request: RequestType, language?: string): Promise<ResponseType[] | ReturnType<typeof createErrorResponse>> {
  try {
    const data = await fetchSubtitles(request);

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }

    let filteredData = data;
    if (language) {
      filteredData = data.filter((sub) => sub.language === language);
    }

    return filteredData;
  } catch (error) {
    console.error('Error in search function:', error);
    return createErrorResponse(
      500,
      'Internal server error',
      'An unexpected error occurred while searching for subtitles. Please try again later.'
    );
  }
}