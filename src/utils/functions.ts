// Isn't needed but Typescript wont stfu
import { ResponseType } from "./types";

export async function search(request: RequestType, language?: string): Promise<ResponseType[]> {
  const data = await fetchSubtitles(request);

  let filteredData = data;
  if (language) {
    filteredData = data.filter((sub) => sub.ISO639 === language);
  }

  const subtitles: ResponseType[] = filteredData.map((sub): ResponseType => ({
    id: sub.IDSubtitleFile,
    url: sub.SubDownloadLink.replace('.gz', '').replace('download/', 'download/subencoding-utf8/'),
    type: sub.SubFormat,
    language: sub.ISO639,
    hasCorsRestrictions: false,
  }));

  return subtitles;
}
