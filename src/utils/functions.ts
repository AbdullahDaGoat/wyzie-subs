export async function search(request: RequestType, languages?: string[]): Promise<ResponseType[]> {
  try {
    const data = await fetchSubtitles(request);

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }

    console.log('Available languages:', data.map(sub => sub.ISO639));
    console.log('Requested languages:', languages);

    let filteredData = data;
    if (languages && languages.length > 0) {
      filteredData = data.filter((sub) => languages.includes(sub.ISO639));
    }

    if (filteredData.length === 0) {
      return createErrorResponse(
        404,
        'Not found',
        'No subtitles found for the given request.'
      );
    }

    const subtitles: ResponseType[] = filteredData.map((sub): ResponseType => ({
      id: sub.IDSubtitleFile,
      url: sub.SubDownloadLink.replace('.gz', '').replace('download/', 'download/subencoding-utf8/'),
      type: sub.SubFormat,
      language: sub.ISO639,
      hasCorsRestrictions: false,
    }));

    return subtitles;

  } catch (error) {
    console.error('Error in search function:', error);
    return createErrorResponse(
      500,
      'Internal server error',
      'An unexpected error occurred while searching for subtitles. Please try again later.'
    );
  }
}