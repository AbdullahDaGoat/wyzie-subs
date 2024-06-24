const CONTACT_EMAIL = 'dev@sudo-flix.lol'
export async function fetchSubtitles(request: RequestType) {
  const { imdbId, season, episode } = request;
  const url = `https://rest.opensubtitles.org/search/${season && episode ? `episode-${episode}/` : ''}imdbid-${imdbId}${season ? `/season-${season}` : ''}`;
  const headers = { 'X-User-Agent': 'VLSub 0.10.2' };

  console.log(url)
  const res = await fetch(url, { headers });

  return await res.json();
}

export const createErrorResponse = (
  code: number,
  message: string,
  details: string,
  example?: string
) => ({
  status: 'error',
  code,
  message,
  details,
  example,
  fyi: `For more information, please visit our landing page or contact us at ${CONTACT_EMAIL}.`
})
