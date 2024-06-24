import { ResponseType, RequestType } from "./types";

export async function search(request: RequestType, language?: string): Promise<ResponseType[]> {
  const data = await fetchSubtitles(request);

  let filteredData = data;
  if (language) {
    filteredData = data.filter((sub) => sub.language === language);
  }

  return filteredData;
}