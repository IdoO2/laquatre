/* Helpers related to search rules */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { DBListResponse, Movie } from '../types';
import { API_KEY, API_V3_BASE_URL } from '../consts';
import { sanitiseInput } from '../form-helpers';
import { mapDBMoviesToAppMovies } from '../movie-helpers';

const MIN_TITLE_SEARCH_LENGTH = 4;
const MAX_TITLE_SEARCH_LENGTH = 40;

export const URL_SEARCH_PARAM = 'keyword';

export function useMasterSearch(location: Location) {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchedTerm, setSearchedTerm] = useState<string>('');

  const successCallback = useCallback(
    ({ results }: DBListResponse) => {
      reflectSearchOnURL(location, searchedTerm);
      setSearchResults(mapDBMoviesToAppMovies(results));
    },
    [location, searchedTerm],
  );

  const errorCallback = useCallback((error: string) => {
    // TODO User feedback
    console.error(error);
  }, []);

  useEffect(() => {
    // Run previous search from query string,
    // ONCE, on page load
    const query = getQueryFromURL(location.search);
    if (query) {
      fetchMoviesForQuery(query).then(successCallback).catch(errorCallback);
      setSearchedTerm(query);
    }
    reflectSearchOnURL(location, query);
    // eslint-disable-next-line
  }, []);

  // TODO Prevent concurrent calls (incl. on page load)
  useEffect(() => {
    if (!searchedTermsAreValid(searchedTerm)) return;
    // Perform new search when search terms have changed
    fetchMoviesForQuery(searchedTerm)
      .then(successCallback)
      .catch(errorCallback);
  }, [errorCallback, searchedTerm, successCallback]);

  return useMemo(
    () => ({
      searchResults,
      setSearchResults,
      searchedTerm,
      setSearchedTerm,
    }),
    [searchResults, setSearchResults, searchedTerm, setSearchedTerm],
  );
}

function searchedTermsAreValid(query: string) {
  return (
    query.length >= MIN_TITLE_SEARCH_LENGTH &&
    query.length <= MAX_TITLE_SEARCH_LENGTH
  );
}

function reflectSearchOnURL(location: Location, query: string) {
  const url = new URL(location.href);

  if (!searchedTermsAreValid(query)) {
    history.pushState({}, '', location.href.split('?')[0]);
    return;
  }

  url.searchParams.set(URL_SEARCH_PARAM, query);
  history.pushState({}, '', url);
}

// `search` from `window.location`
function getQueryFromURL(search: string) {
  if (search) {
    const params = new URLSearchParams(search);
    const query = params.get(URL_SEARCH_PARAM) || '';
    if (!searchedTermsAreValid(query)) {
      return '';
    }
    return query;
  }
  return '';
}

function fetchMoviesForQuery(terms: string) {
  const query = sanitiseInput(terms);

  if (!searchedTermsAreValid(query)) {
    return Promise.reject('Searched terms invalid.');
  }

  return fetch(
    `${API_V3_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`,
  ).then((res) => res.json());
}
