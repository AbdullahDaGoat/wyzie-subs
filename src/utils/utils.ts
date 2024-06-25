/* eslint-disable @typescript-eslint/no-unused-vars */
const PROXY_URL = 'https://torn-unicorn.fly.dev/';
const CONTACT_EMAIL = 'dev@sudo-flix.lol';

export async function proxyFetch(url: string, options?: RequestInit): Promise<Response> {
  console.log('Original URL:', url);

  try {
    const directResponse = await fetch(url, options);
    
    if (!directResponse.ok) {
      throw new Error(`HTTP error! status: ${directResponse.status}`);
    }

    const clonedResponse = directResponse.clone();

    const responseBody = await clonedResponse.text();

    const encodedUrl = encodeURIComponent(url);
    const encodedData = encodeURIComponent(responseBody);

    const proxyUrl = `${PROXY_URL}?url=${encodedUrl}&data=${encodedData}`;

    // console.log('Proxy URL:', proxyUrl);

    const proxyResponse = new Response(responseBody, {
      status: directResponse.status,
      statusText: directResponse.statusText,
      headers: new Headers({
        'Content-Type': directResponse.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*', // Enable CORS for all origins
        'X-Proxied-URL': url,
      }),
    });

    return proxyResponse;

  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Failed to fetch. Please try again later.');
  }
}

export async function fetchSubtitles(request: RequestType) {
  const { imdbId, season, episode } = request;
  const url = `https://rest.opensubtitles.org/search/${season && episode ? `episode-${episode}/` : ''}imdbid-${imdbId}${season ? `/season-${season}` : ''}`;
  const headers = { 'X-User-Agent': 'VLSub 0.10.2' };

  console.log('Fetching subtitles from:', url);
  try {
    const res = await proxyFetch(url, { headers });
    return await res.json();
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    throw new Error('Failed to fetch subtitles. Please try again later.');
  }
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
});