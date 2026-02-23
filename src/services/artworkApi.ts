import type { ArtworkApiResponse } from "@/types/artwork";

const BASE_URL =  "https://api.artic.edu/api/v1/artworks";
const FIELDS =  "id,title,place_of_origin,artist_display,inscriptions,date_start,date_end";

export async function fetchArtworks(page: number): Promise<ArtworkApiResponse> {
  const url = `${BASE_URL}?page=${page}&fields=${FIELDS}`;
  const response = await fetch(url);
  if (!response.ok) { 
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}
