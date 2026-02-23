/** Shape of a single artwork record from the API */
export interface Artwork { 
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

/** Pagination metadata returned by the API */
export interface ArtworkPagination { 
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

/** Full API response shape */
export interface ArtworkApiResponse { 
  pagination: ArtworkPagination;
  data: Artwork[];
}
