// Simplified for convenience here
export interface DBMovie {
  id: number;
  name: string;
  title?: string;
  poster_path?: string;
  vote_average: number;
}

export interface DBListResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: DBMovie[];
}

export interface Movie {
  id: number;
  name: string;
  picture: string;
  score: number;
}
