import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { Movie } from '../types';
import { MovieList } from './MovieList';
import { MovieListModes } from './MovieList.types'
import { mapDBMoviesToAppMovies } from '../movie-helpers';

import {
  API_V3_BASE_URL,
  MIN_TITLE_SEARCH_LENGTH,
  MAX_TITLE_SEARCH_LENGTH,
  URL_SEARCH_PARAM,
} from '../consts';

function searchedTermsAreValid(query: string) {
  return (
    query.length >= MIN_TITLE_SEARCH_LENGTH &&
    query.length <= MAX_TITLE_SEARCH_LENGTH
  );
}

function reflectSearchOnURL(query: string) {
  // TODO TS error
  const url = new URL(window.location);

  if (!searchedTermsAreValid(query)) {
    history.pushState({}, '', window.location.href.split('?')[0]);
    return;
  }

  url.searchParams.set(URL_SEARCH_PARAM, query);
  history.pushState({}, '', url);
}

export const MasterSearch: FC = () => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const [searchedTerm, setSearchedTerm] = useState<string>('');
  // TODO Debounce
  const updateSearchedTerm = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setSearchedTerm(value);
    },
    [],
  );

  const fetchMoviesForQuery = useCallback((query: string) => {
    if (!searchedTermsAreValid(query)) {
      return;
    }

    fetch(
      `${API_V3_BASE_URL}/search/movie?api_key=92b418e837b833be308bbfb1fb2aca1e&query=${query}`,
    )
      .then((res) => res.json())
      .then(({ results }) => {
        reflectSearchOnURL(query);
        setSearchResults(mapDBMoviesToAppMovies(results));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const closeResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  useEffect(() => {
    // Run previous search from query string,
    // ONCE, on page load
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get(URL_SEARCH_PARAM) || '';
      if (!searchedTermsAreValid(query)) {
        reflectSearchOnURL('');
        return;
      }
      fetchMoviesForQuery(query);
      setSearchedTerm(query);
    }
  }, [fetchMoviesForQuery]);

  // TODO Prevent concurrent calls (incl. on page load)
  useEffect(() => {
    // Perform new search when search terms have changed
    fetchMoviesForQuery(searchedTerm);
  }, [fetchMoviesForQuery, searchedTerm]);

  return (
    <div className="master-search">
      <input
        type="text"
        className="field jumbo-search"
        value={searchedTerm}
        onChange={updateSearchedTerm}
      />
      {Boolean(searchResults.length) && (
        <div className="results-overlay">
          <button className="close-button" onClick={closeResults}>
            x
          </button>
          <MovieList mode={MovieListModes.LIST} movies={searchResults} />
        </div>
      )}
    </div>
  );
};
