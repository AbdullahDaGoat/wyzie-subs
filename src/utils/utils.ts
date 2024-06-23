import { RequestType } from './types';

export async function fetchSubtitles(request: RequestType) {
  const { imdbId, season, episode } = request;
  const url = `https://rest.opensubtitles.org/search/${season && episode ? `episode-${episode}/` : ''}imdbid-${imdbId}${season ? `/season-${season}` : ''}`;
  const headers = { 'X-User-Agent': 'VLSub 0.10.2' };

  console.log(url)
  const res = await fetch(url, { headers });

  return await res.json();
}
