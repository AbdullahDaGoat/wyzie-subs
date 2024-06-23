import { RequestType, ResponseType } from "./types";
import { fetchSubtitles } from "./utils";

export async function search(request: RequestType): Promise<ResponseType[]> {
  const data = await fetchSubtitles(request);

  const subtitles: ResponseType[] = data.map((sub): ResponseType => ({
      id: sub.IDSubtitleFile,
      url: sub.SubDownloadLink.replace('.gz', '').replace('download/', 'download/subencoding-utf8/'),
      type: sub.SubFormat,
      language: sub.ISO639,
      hasCorsRestrictions: false,
  }));

  return subtitles;
}

export async function searchByLanguage(request: RequestType, language: string): Promise<ResponseType[]> {
  const data = await fetchSubtitles(request);

  const subtitles: ResponseType[] = data
    .filter((sub) => sub.ISO639 === language)
    .map((sub): ResponseType => ({
        id: sub.IDSubtitleFile,
        url: sub.SubDownloadLink.replace('.gz', '').replace('download/', 'download/subencoding-utf8/'),
        type: sub.SubFormat,
        language: sub.ISO639,
        hasCorsRestrictions: false,
    }));

  return subtitles;
}