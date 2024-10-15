import { API_KEY, API_V3_BASE_URL } from './consts';
import { mapDBMoviesToAppMovies } from './movie-helpers';
import type { DBListResponse, ListResponse } from './types';

// TODO Proper URL building
const API_DISCOVER_URL = `${API_V3_BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=1&timezone=America/New_York&include_null_first_air_dates=false`;

export function fetchSuggestedMovies() {
  return fetchMovies(API_DISCOVER_URL);
}

export function fetchMoviesByKeyword(keyword: string) {
  return fetchMovies(
    `${API_V3_BASE_URL}/search/movie?api_key=${API_KEY}&query=${keyword}`,
  );
}

function fetchMovies(url: string): Promise<Pick<ListResponse, 'results'>> {
  return (
    fetch(url)
      .then((res) => {
        return res.json();
      })
      // TODO Better `fetch` typing
      .then(({ results }: DBListResponse) => {
        return { results: mapDBMoviesToAppMovies(results) };
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      })
  );
}
