export interface DBMovie {
  id: number;
  name: string;
  title?: string;
  poster_path?: string;
  vote_average: number;
}

export interface Movie {
  id: number;
  name: string;
  picture: string;
  score: number;
}
